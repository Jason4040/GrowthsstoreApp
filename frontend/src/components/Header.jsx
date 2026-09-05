import { useState, useEffect } from "react";
import { useGetNewProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCurrency } from "../hooks/useCurrency";

const Header = () => {
  const { data, isLoading, error } = useGetNewProductsQuery();
  const { formatPrice } = useCurrency();

  const products = data || [];
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (products.length > 4) {
      const interval = setInterval(() => {
        setStartIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 5000); // Rotate every 5 seconds
      return () => clearInterval(interval);
    }
  }, [products]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  if (products.length === 0) {
    return null;
  }

  // Pick up to 4 distinct products for the grid, rotating through the list without
  // repeating a product when fewer than 4 are available.
  const rotation = startIndex % products.length;
  const rotatedProducts = [...products.slice(rotation), ...products.slice(0, rotation)];
  const [p1, p2 = null, p3 = null, p4 = null] = rotatedProducts;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-4 md:mt-12 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:auto-rows-[450px]">
        
        {/* Left Column (p1) */}
        {p1 && (
          <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#151515] p-6 md:p-10 flex flex-col justify-between relative min-h-[400px] overflow-hidden group">
            {p1.discountQtyThreshold > 0 && (
              <div className="absolute right-6 md:right-10 top-1/3 md:top-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 bg-[#ebd05b] rounded-full flex items-center justify-center text-white font-bold text-xl md:text-3xl z-10 shadow-lg pointer-events-none">
                -20%
              </div>
            )}
            <div className="relative z-20">
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-light text-gray-900 dark:text-white uppercase tracking-widest max-w-[200px] leading-tight">
                {p1.name}
              </h2>
              {p1.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 max-w-[200px] leading-relaxed">
                  {p1.description.substring(0, 80)}...
                </p>
              )}
              <Link to={`/product/${p1._id}`} className="inline-flex items-center gap-3 mt-6 text-[11px] font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors tracking-widest uppercase">
                SHOP NOW 
                <div className="p-1 border border-gray-300 dark:border-gray-700 rounded-full group-hover:border-gray-900 dark:group-hover:border-white transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
            <div className="mt-8 flex justify-start items-end flex-grow w-full relative z-0">
              <Link to={`/product/${p1._id}`} className="block w-full">
                <img src={p1.image} alt={p1.name} className="w-[85%] md:w-[75%] max-w-[350px] object-contain object-bottom drop-shadow-2xl mx-auto md:mx-0 transform transition-transform duration-700 group-hover:scale-105" />
              </Link>
            </div>
          </div>
        )}

        {/* Middle Column (p2 & p3) */}
        <div className="flex flex-col gap-6">
          {/* Top block (p2) */}
          {p2 ? (
            <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#151515] p-6 md:p-8 flex flex-row items-center justify-between h-full min-h-[213px] overflow-hidden group">
              <div className="flex flex-col max-w-[150px] z-10">
                <h2 className="text-lg md:text-xl font-light text-gray-900 dark:text-white uppercase tracking-widest leading-snug mb-1">
                  {p2.name}
                </h2>
                {p2.description && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 max-w-[140px] leading-relaxed">
                    {p2.description.substring(0, 60)}...
                  </p>
                )}
                <div className="text-sm font-light text-gray-500 dark:text-gray-400 mb-4">
                  {formatPrice(p2)}
                </div>
              </div>
              <Link to={`/product/${p2._id}`} className="w-1/2 flex justify-end h-full items-center">
                <img src={p2.image} alt={p2.name} className="max-h-[150px] max-w-[180px] object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-105" />
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#151515] p-8 min-h-[213px] invisible"></div>
          )}

          {/* Bottom block (p3) */}
          {p3 ? (
            <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#151515] p-6 md:p-8 flex flex-row items-center justify-between h-full min-h-[213px] overflow-hidden group">
              <Link to={`/product/${p3._id}`} className="w-1/2 flex justify-start h-full items-center -ml-4 md:-ml-8">
                <img src={p3.image} alt={p3.name} className="max-h-[150px] max-w-[180px] object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-105" />
              </Link>
              <div className="flex flex-col items-end text-right max-w-[160px] z-10">
                <h2 className="text-lg md:text-xl font-light text-gray-900 dark:text-white tracking-widest leading-snug mb-1 uppercase">
                  {p3.name}
                </h2>
                {p3.description && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 max-w-[140px] leading-relaxed text-right">
                    {p3.description.substring(0, 60)}...
                  </p>
                )}
                <Link to={`/product/${p3._id}`} className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors tracking-widest uppercase">
                  SHOP NOW
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#151515] p-8 min-h-[213px] invisible"></div>
          )}
        </div>

        {/* Right Column (p4) */}
        {p4 && (
          <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#151515] p-6 md:p-10 flex flex-col relative min-h-[400px] overflow-hidden group">
            <div className="relative z-20">
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-light text-gray-900 dark:text-white uppercase tracking-widest max-w-[200px] leading-snug mb-1">
                {p4.name}
              </h2>
              {p4.description && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 max-w-[200px] leading-relaxed">
                  {p4.description.substring(0, 80)}...
                </p>
              )}
              <div className="text-sm font-light text-gray-500 dark:text-gray-400 mb-8">
                {formatPrice(p4)}
              </div>
              <Link to={`/product/${p4._id}`} className="inline-flex items-center gap-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors tracking-widest uppercase">
                SHOP NOW 
                <div className="p-1 border border-gray-300 dark:border-gray-700 rounded-full group-hover:border-gray-900 dark:group-hover:border-white transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
            <div className="mt-8 flex justify-end items-end flex-grow w-full relative z-0">
              <Link to={`/product/${p4._id}`} className="block w-full flex justify-end">
                <img src={p4.image} alt={p4.name} className="w-[85%] md:w-[75%] max-w-[350px] object-contain object-bottom drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-105 rounded-tl-lg" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Header;
