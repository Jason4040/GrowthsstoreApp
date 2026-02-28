import { Link, useParams } from "react-router-dom";
import { FaRegFrownOpen } from "react-icons/fa";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? (
        <div className="w-full">
          {/* Top Banner */}
          <div
            className="w-full h-[350px] md:h-[450px] relative bg-cover bg-center mb-8 flex items-center justify-start px-6 md:px-16 lg:px-24 border-b border-gray-800 bg-[url('https://www.zilliondesigns.com/blog/wp-content/uploads/Perfect-Ecommerce-Sales-Banner.jpg')] md:bg-[url('/banner.jpg')]"
          >
            {/* Dark overlay only on the left side where text is */}
            <div className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>

            <div className="relative z-10 text-left max-w-lg">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                New Arrivals
              </h2>
              <p className="text-gray-200 text-lg mb-8 hidden md:block">
                Discover the latest premium products designed to elevate your lifestyle.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-10 text-lg transition-all shadow-none transform active:scale-95 border border-pink-500 hover:border-pink-400"
              >
                Start Shopping
              </Link>
            </div>
          </div>

          <Header />
        </div>
      ) : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-[2rem] md:mt-[8rem]">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <h1 className="text-4xl md:text-6xl font-semibold text-white text-center sm:text-left tracking-tight">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-none py-4 px-14 transition-all transform hover:scale-105 border border-pink-500"
              >
                Enter Shop
              </Link>
            </div>

            {data.products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-[#101010] border border-gray-800 rounded-none w-full shadow-none mt-8">
                <FaRegFrownOpen size={80} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-medium text-white mb-2 uppercase tracking-widest">No Products Found</h2>
                <p className="text-gray-500 mb-8 italic">Check back later for new arrivals.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-10 rounded-none transition-all shadow-none border border-gray-700 active:scale-95"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center">
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
