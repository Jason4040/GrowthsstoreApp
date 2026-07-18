import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Frown, ShoppingCart, Search, Sun, Moon } from "lucide-react";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { useGetAnnouncementsQuery } from "../redux/api/announcementApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import { useCurrency } from "../hooks/useCurrency";
import { useSelector, useDispatch } from "react-redux";
import { setCurrency } from "../redux/features/currency/currencySlice";
import { switchLanguage } from "../utils/translateService";

const Home = () => {
  const { keyword } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [activeLang, setActiveLang] = useState(localStorage.getItem('appLang') || 'en');
  const navigate = useNavigate();
  const { formatPrice, currentCurrency } = useCurrency();
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const handleLangChange = (langCode) => {
    setActiveLang(langCode);
    switchLanguage(langCode);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const { data: searchResults, isFetching: isSearching } = useGetProductsQuery(
    { keyword: debouncedKeyword },
    { skip: !debouncedKeyword.trim() }
  );

  const { data: announcements } = useGetAnnouncementsQuery();
  const hasActiveAnnouncement = Array.isArray(announcements) && announcements.some(ann => ann.isActive);

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword}`);
      setShowSuggestions(false);
    } else {
      navigate("/");
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchKeyword("");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <>
      <SEO 
        title="GrowthsStore | Premium Products & Accessories" 
        description="Discover the latest premium products, electronics, art, fashion, and accessories. Experience excellent customer service with fast delivery." 
      />
      {!keyword ? (
        <div className="w-full">
          {/* Top Banner */}
          <div
            className="w-full h-[350px] md:h-[450px] relative bg-cover bg-center mb-8 flex items-center justify-start border-b border-gray-200 dark:border-gray-800 bg-[url('/banner.jpg')]"
          >
            {/* Dark overlay only on the left side where text is */}
            <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-0"></div>

            {/* Top Header Section with Black Bg, Centered Logo, and Cart */}
            <div className={`fixed left-0 right-0 z-[99] pointer-events-none transition-all duration-300 ${hasActiveAnnouncement && !scrolled ? 'top-[50px] md:top-[44px]' : 'top-0'}`}>
              {/* The black bg above logo */}
              <div className={`absolute top-0 left-0 w-full transition-all duration-300 bg-white dark:bg-[#0a0a0a] pointer-events-auto border-b border-gray-200 dark:border-gray-800 shadow-lg ${scrolled ? 'h-[35px] md:h-[45px]' : 'h-[45px] md:h-[55px]'}`}></div>
              
              {/* Aligned Container for Header Elements */}
              <div className="max-w-[1400px] mx-auto w-full relative">

                {/* LEFT SIDE: Language Switcher + Theme Toggle */}
                <div className={`absolute top-0 left-4 md:left-8 flex items-center gap-2 md:gap-3 pointer-events-auto z-50 transition-all duration-300 ${scrolled ? 'h-[35px] md:h-[45px]' : 'h-[45px] md:h-[55px]'}`}>
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-300 dark:border-white/20 transition-all"
                  >
                    {theme === 'dark'
                      ? <Sun size={14} className="text-orange-400" />
                      : <Moon size={14} className="text-indigo-600" />}
                  </button>

                  {/* Language Switcher */}
                  <div className="hidden sm:flex items-center gap-0.5 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-full px-1.5 py-1">
                    {[['en','EN'],['rw','RW'],['lg','LG']].map(([code, label], i, arr) => (
                      <span key={code} className="flex items-center">
                        <button
                          onClick={() => handleLangChange(code)}
                          title={code === 'en' ? 'English' : code === 'rw' ? 'Kinyarwanda' : 'Luganda'}
                          className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full transition-all ${
                            activeLang === code
                              ? 'bg-orange-500 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
                          }`}
                        >
                          {label}
                        </button>
                        {i < arr.length - 1 && <span className="w-px h-3 bg-gray-300 dark:bg-white/20 mx-0.5" />}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RIGHT SIDE: Currency + Search + Cart */}
                <div className={`absolute top-0 right-4 md:right-8 flex items-center gap-2 md:gap-4 pointer-events-auto z-50 transition-all duration-300 ${scrolled ? 'h-[35px] md:h-[45px]' : 'h-[45px] md:h-[55px]'}`}>
                  {/* Currency Selector */}
                  <select
                    value={currentCurrency}
                    onChange={(e) => dispatch(setCurrency(e.target.value))}
                    className="bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-[10px] md:text-sm font-semibold border border-gray-300 dark:border-white/20 rounded-md p-1 px-1 md:px-2 outline-none transition-colors cursor-pointer w-[58px] md:w-auto hover:border-orange-400 focus:border-orange-500"
                  >
                    <option value="USD">USD</option>
                    <option value="UGX">UGX</option>
                    <option value="RWF">RWF</option>
                  </select>

                  {/* Mobile Search Icon */}
                  <button
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                    className="md:hidden text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    <Search size={20} />
                  </button>

                  {/* Cart Icon */}
                  <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors group">
                    <ShoppingCart size={scrolled ? 22 : 26} className="transition-all" />
                    {cartItems.length > 0 && (
                      <span className={`absolute bg-orange-600 text-white font-bold rounded-full shadow-lg border border-orange-800 animate-pulse ${scrolled ? '-top-1.5 -right-1.5 text-[9px] px-1 py-0.5' : '-top-1.5 -right-2 text-[11px] px-1.5 py-0.5'}`}>
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Centered Top Tab Logo - Always hanging */}
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-auto bg-white transition-all duration-300 ${scrolled ? 'px-3 py-2 md:px-5 md:py-3 rounded-b-2xl shadow-md' : 'px-5 py-3 md:px-8 md:py-5 rounded-b-3xl shadow-2xl'}`}>
                <Link to="/">
                  <img src="/logo.png" alt="Logo" className={`object-contain transition-all duration-300 ${scrolled ? 'h-[20px] md:h-[35px]' : 'h-[25px] md:h-[45px]'}`} />
                </Link>
              </div>

              {/* Mobile Search Dropdown */}
              {showMobileSearch && (
                <div className="md:hidden absolute top-[45px] left-0 right-0 w-full z-[100] bg-white dark:bg-[#0a0a0a] p-4 border-b border-gray-200 dark:border-gray-800 shadow-2xl pointer-events-auto transition-all duration-300">
                  <form onSubmit={submitHandler} className="w-full flex flex-col relative">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchKeyword}
                        onChange={(e) => {
                          setSearchKeyword(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full py-3 pl-4 pr-12 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-all text-sm shadow-inner"
                      />
                      <button
                        type="submit"
                        className="absolute right-1 top-1 bottom-1 bg-orange-600 hover:bg-orange-500 text-white px-4 rounded-md transition-all flex items-center justify-center shadow-sm"
                      >
                        <Search size={18} />
                      </button>
                    </div>

                    {/* Mobile Suggestions */}
                    {showSuggestions && debouncedKeyword.trim() && (
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-gray-50 dark:bg-[#1A1A1A] rounded-lg shadow-2xl overflow-hidden z-[101] border border-gray-700 max-h-60 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                        ) : searchResults?.products?.length > 0 ? (
                          <ul>
                            {searchResults.products.slice(0, 4).map((product) => (
                              <li
                                key={product._id}
                                onClick={() => handleSuggestionClick(product._id)}
                                className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-800 last:border-0"
                              >
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded-md border border-gray-700"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                    {product.name}
                                  </h4>
                                </div>
                                <div className="text-orange-500 font-bold text-xs whitespace-nowrap">
                                  {formatPrice(product)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* Aligned Container */}
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
              <div className="text-left max-w-lg mt-12 md:mt-0 flex flex-col items-start">
                <h2 className="flex flex-col items-start w-full text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight text-left">
                  <span className="satisfy-regular font-satisfy text-orange-500 normal-case text-6xl md:text-8xl mb-2 text-left">Elevate</span>
                  <span className="uppercase text-left text-white">Your Style</span>
                </h2>
                <p className="text-gray-200 text-lg mb-8 hidden md:block text-left">
                  <span className="text-white">Discover the latest premium products designed to elevate your lifestyle.</span>
                </p>
                <Link
                  to="/shop"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 text-lg transition-all shadow-none transform active:scale-95 border border-orange-500 hover:border-orange-400"
                >
                  Start Shopping
                </Link>
              </div>
            </div>

            {/* Search Bar - Centered (Desktop) */}
            <div className="hidden md:block absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 z-20">
              <form onSubmit={submitHandler} className="w-full flex flex-col relative shadow-2xl">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full py-4 md:py-5 pl-8 pr-16 rounded-full bg-white/80 dark:bg-white dark:bg-black/40 backdrop-blur-md border border-white/30 text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:bg-white dark:focus:bg-white dark:bg-black/60 focus:border-orange-500 transition-all text-lg shadow-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-500 text-white p-3 md:p-4 rounded-full transition-all shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && debouncedKeyword.trim() && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-800 max-h-80 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
                    ) : searchResults?.products?.length > 0 ? (
                      <ul>
                        {searchResults.products.slice(0, 5).map((product) => (
                          <li
                            key={product._id}
                            onClick={() => handleSuggestionClick(product._id)}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-200 dark:border-gray-800 last:border-0"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">{product.category?.name}</p>
                            </div>
                            <div className="text-orange-500 font-bold text-sm whitespace-nowrap">
                              {formatPrice(product)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No products found</div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

          <Header />
        </div>
      ) : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "An error occurred while fetching products"}
        </Message>
      ) : (
        <>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-[2rem] md:mt-[8rem]">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 dark:text-white text-center sm:text-left tracking-tight">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-none py-4 px-14 transition-all transform hover:scale-105 border border-orange-500"
              >
                Enter Shop
              </Link>
            </div>

            {data.products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none w-full shadow-none mt-8">
                <Frown size={80} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">No Products Found</h2>
                <p className="text-gray-500 mb-8 italic">Check back later for new arrivals.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-10 rounded-none transition-all shadow-none border border-gray-300 dark:border-gray-700 active:scale-95"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-8 justify-items-center">
                {data.products.map((product) => (
                  <div key={product._id} className="w-full">
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
