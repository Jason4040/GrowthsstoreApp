import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Frown, ShoppingCart, Search, Sun, Moon } from "lucide-react";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { useGetAnnouncementsQuery } from "../redux/api/announcementApiSlice";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import ProductCardSkeleton from "./Products/ProductCardSkeleton";
import Skeleton from "../components/Skeleton";
import { useCurrency } from "../hooks/useCurrency";
import { useSelector, useDispatch } from "react-redux";
import { setCurrency } from "../redux/features/currency/currencySlice";
import { setBackendDown } from "../redux/features/system/serverStatusSlice";
import { switchLanguage } from "../Utils/translateService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  // Cap slidesToShow at the number of products so react-slick never has to clone
  // slides to fill the row, which was visually duplicating products (e.g. a single
  // search result repeating itself on laptop-width screens).
  const productCount = data?.products?.length || 0;
  const capSlides = (n) => Math.max(1, Math.min(n, productCount || n));
  const sliderSettings = {
    dots: true,
    infinite: productCount > 5,
    speed: 500,
    slidesToShow: capSlides(5),
    slidesToScroll: 1,
    autoplay: productCount > 5,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: capSlides(4) } },
      { breakpoint: 1280, settings: { slidesToShow: capSlides(4) } },
      { breakpoint: 1024, settings: { slidesToShow: capSlides(3) } },
      { breakpoint: 768, settings: { slidesToShow: capSlides(2) } },
      { breakpoint: 640, settings: { slidesToShow: capSlides(2) } }
    ]
  };

  useEffect(() => {
    if (isError) {
      dispatch(setBackendDown(true));
    }
  }, [isError, dispatch]);

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
            {/* Overlay only on the left side where text is */}
            <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-white/90 via-white/70 to-transparent dark:from-black/90 dark:via-black/70 dark:to-transparent z-0 transition-colors duration-300"></div>

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
                      ? <img src="/icons/them mode.png" className="w-[14px] h-[14px] object-contain dark:invert" alt="Light Mode" />
                      : <img src="/icons/them mode.png" className="w-[14px] h-[14px] object-contain dark:invert" alt="Dark Mode" />}
                  </button>

                  {/* Language Switcher */}
                  <div className="hidden sm:flex items-center gap-1 md:gap-1.5 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-full px-1 md:px-2 py-1">
                    {[['en','/icons/united-kingdom.png','English'],['rw','/icons/rwanda.png','Kinyarwanda'],['lg','/icons/uganda.png','Luganda']].map(([code, iconSrc, title], i) => (
                      <button
                        key={code}
                        onClick={() => handleLangChange(code)}
                        title={title}
                        className={`relative w-4 h-4 md:w-5 md:h-5 rounded-full overflow-hidden transition-all duration-300 border-2 ${
                          activeLang === code
                            ? 'border-orange-500 scale-125 shadow-md z-10'
                            : 'border-transparent hover:border-gray-400 opacity-70 hover:opacity-100 hover:scale-[1.5] hover:z-20'
                        }`}
                      >
                        <img src={iconSrc} className="w-full h-full object-cover" alt={title} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* RIGHT SIDE: Currency + Search + Cart */}
                <div className={`absolute top-0 right-4 md:right-8 flex items-center gap-2 md:gap-4 pointer-events-auto z-50 transition-all duration-300 ${scrolled ? 'h-[35px] md:h-[45px]' : 'h-[45px] md:h-[55px]'}`}>
                  {/* Currency Selector */}
                  <div className="flex items-center gap-1 md:gap-1.5 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-full px-1 md:px-2 py-0.5 md:py-1">
                    {[['USD','/icons/currency-dollar.png','USD'],['UGX','/icons/currency-uganda.png','UGX'],['RWF','/icons/currency-rwanda.png','RWF']].map(([code, iconSrc, title]) => (
                      <button
                        key={code}
                        onClick={() => dispatch(setCurrency(code))}
                        title={title}
                        className={`relative w-4 h-4 md:w-5 md:h-5 rounded-full overflow-hidden transition-all duration-300 border-2 ${
                          currentCurrency === code
                            ? 'border-orange-500 scale-125 shadow-md z-10'
                            : 'border-transparent hover:border-gray-400 opacity-70 hover:opacity-100 hover:scale-[1.5] hover:z-20'
                        }`}
                      >
                        <img src={iconSrc} className={`w-full h-full object-contain ${code !== 'USD' ? 'dark:invert' : ''}`} alt={title} />
                      </button>
                    ))}
                  </div>

                  {/* Mobile Search Icon */}
                  <button
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                    className="md:hidden text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    <img src="/icons/search.png" className="w-[20px] h-[20px] object-contain" alt="Search" />
                  </button>

                  {/* Cart Icon */}
                  <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors group">
                    <img src="/icons/cart.png" className={`object-contain transition-all dark:invert ${scrolled ? 'w-[22px] h-[22px]' : 'w-[26px] h-[26px]'}`} alt="Cart" />
                    {cartItems.length > 0 && (
                      <span className={`absolute bg-orange-600 text-white font-bold rounded-full shadow-lg border border-orange-800 animate-pulse ${scrolled ? '-top-1.5 -right-1.5 text-[9px] px-1 py-0.5' : '-top-1.5 -right-2 text-[11px] px-1.5 py-0.5'}`}>
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Centered Top Tab Logo - Always hanging */}
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-auto bg-white transition-all duration-300 ${scrolled ? 'px-2 py-1.5 md:px-5 md:py-3 rounded-b-xl shadow-md' : 'px-3 py-2 md:px-8 md:py-5 rounded-b-2xl shadow-2xl'}`}>
                <Link to="/">
                  <img src="/logo.png" alt="Logo" className={`object-contain transition-all duration-300 ${scrolled ? 'h-[16px] md:h-[35px]' : 'h-[20px] md:h-[45px]'}`} />
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
                        <img src="/icons/search.png" className="w-[18px] h-[18px] object-contain" alt="Search" />
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
                <h2 className="flex flex-col items-start w-full text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight text-left">
                  <span className="satisfy-regular font-satisfy text-orange-500 normal-case text-6xl md:text-8xl mb-2 text-left">Elevate</span>
                  <span className="uppercase text-left text-gray-900 dark:text-white">Your Style</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-200 text-lg mb-8 hidden md:block text-left">
                  <span className="text-gray-900 dark:text-white">Discover the latest premium products designed to elevate your lifestyle.</span>
                </p>
                <Link
                  to="/shop"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-6 text-sm md:text-base transition-all shadow-none transform active:scale-95 border border-orange-500 hover:border-orange-400"
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
                    className="w-full py-4 md:py-5 pl-8 pr-16 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:bg-white dark:focus:bg-black/80 focus:border-orange-500 transition-all text-lg shadow-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-500 text-white p-3 md:p-4 rounded-full transition-all shadow-md"
                  >
                    <img src="/icons/search.png" className="w-[24px] h-[24px] object-contain" alt="Search" />
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && debouncedKeyword.trim() && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-800 max-h-80 overflow-y-auto">
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
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-[2rem] md:mt-[8rem]">
          <div className="flex flex-col items-center justify-center mb-14 gap-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 px-2 md:px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} imgClassName="h-64" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "An error occurred while fetching products"}
        </Message>
      ) : (
        <>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-[2rem] md:mt-[8rem]">
            <div className="flex flex-col items-center justify-center mb-14 gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center tracking-[0.15em] uppercase">
                {keyword ? "Search Results" : "Special Products"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-2xl satisfy-regular mb-4">
                {keyword ? `Showing results for "${keyword}"` : "Discover our curated selection"}
              </p>

              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-500 hover:text-gray-900 dark:hover:text-white transition-colors border-b-2 border-transparent hover:border-gray-900 dark:hover:border-white pb-1"
              >
                Shop All Products
              </Link>
            </div>

            {data.products.length === 0 ? (
              keyword ? (
                <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none w-full shadow-none mt-8">
                  <Frown size={80} className="text-gray-700 mb-6" />
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">No Results Found</h2>
                  <p className="text-gray-500 mb-8 italic">
                    We couldn&apos;t find any products matching &quot;{keyword}&quot;. Try a different search term.
                  </p>
                  <Link
                    to="/shop"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-10 rounded-none transition-all shadow-none border border-orange-500 active:scale-95"
                  >
                    Browse All Products
                  </Link>
                </div>
              ) : (
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
              )
            ) : productCount <= 5 ? (
              // Few enough results to fit in one row — a static grid so a single
              // (or handful of) result renders at normal card width instead of
              // react-slick stretching it to fill the whole slider track.
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 justify-items-center px-2 md:px-6">
                {data.products.map((product) => (
                  <div key={product._id} className="w-full">
                    <Product product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full px-2 md:px-6 slider-container">
                <Slider {...sliderSettings} className="w-full product-slider">
                  {data.products.map((product) => (
                    <div key={product._id} className="px-2 md:px-3 pb-8 outline-none">
                      <Product product={product} />
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
