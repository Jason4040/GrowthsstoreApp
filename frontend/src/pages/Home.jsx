import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaRegFrownOpen } from "react-icons/fa";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword}`);
    } else {
      navigate("/");
    }
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
      {!keyword ? (
        <div className="w-full">
          {/* Top Banner */}
          <div
            className="w-full h-[350px] md:h-[450px] relative bg-cover bg-center mb-8 flex items-center justify-start border-b border-gray-200 dark:border-gray-800 bg-[url('https://www.zilliondesigns.com/blog/wp-content/uploads/Perfect-Ecommerce-Sales-Banner.jpg')] md:bg-[url('/banner.jpg')]"
          >
            {/* Dark overlay only on the left side where text is */}
            <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>

            {/* Centered Top Tab Logo */}
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-[99] pointer-events-auto bg-white transition-all duration-300 ${scrolled ? 'px-4 py-2 rounded-b-xl shadow-md' : 'px-6 py-4 rounded-b-3xl shadow-2xl'}`}>
              <Link to="/">
                <img src="/logo.png" alt="Logo" className={`object-contain transition-all duration-300 ${scrolled ? 'h-[25px] md:h-[35px]' : 'h-[45px] md:h-[55px]'}`} />
              </Link>
            </div>

            {/* Aligned Container */}
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
              <div className="text-left max-w-lg mt-12 md:mt-0 flex flex-col items-start">
                <h2 className="flex flex-col items-start w-full text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight text-left">
                  <span className="satisfy-regular font-satisfy text-orange-500 normal-case text-6xl md:text-8xl mb-2 text-left">Elevate</span>
                  <span className="uppercase text-left">Your Style</span>
                </h2>
                <p className="text-gray-200 text-lg mb-8 hidden md:block text-left">
                  Discover the latest premium products designed to elevate your lifestyle.
                </p>
                <Link
                  to="/shop"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 text-lg transition-all shadow-none transform active:scale-95 border border-orange-500 hover:border-orange-400"
                >
                  Start Shopping
                </Link>
              </div>
            </div>

            {/* Search Bar - Centered */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 z-20">
              <form onSubmit={submitHandler} className="w-full flex relative shadow-2xl">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full py-4 md:py-5 pl-8 pr-16 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:bg-black/60 focus:border-orange-500 transition-all text-lg shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-500 text-white p-3 md:p-4 rounded-full transition-all shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
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
                <FaRegFrownOpen size={80} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">No Products Found</h2>
                <p className="text-gray-500 mb-8 italic">Check back later for new arrivals.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-10 rounded-none transition-all shadow-none border border-gray-300 dark:border-gray-700 active:scale-95"
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
