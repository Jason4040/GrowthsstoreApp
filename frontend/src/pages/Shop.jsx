import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { Frown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import { setBackendDown } from "../redux/features/system/serverStatusSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (categoriesQuery.isError || filteredProductsQuery.isError) {
      dispatch(setBackendDown(true));
    }
  }, [categoriesQuery.isError, filteredProductsQuery.isError, dispatch]);

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <SEO 
        title="Shop | GrowthsStore" 
        description="Browse our wide selection of premium products. Filter by categories, brands, and prices to find exactly what you need at GrowthsStore." 
      />
      <div className="max-w-[1400px] mx-auto px-4 mt-8 pb-[10rem] md:pb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Mobile Filter Toggle */}
          <div className="w-full lg:hidden mb-[-1rem]">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-gray-50 dark:bg-[#101010] hover:bg-gray-100 dark:hover:bg-[#151515] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium py-4 px-6 flex justify-between items-center transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300 tracking-wide uppercase text-sm">Filters & Sorting</span>
              <span className="text-orange-500">{showFilters ? "✕" : "▼"}</span>
            </button>
          </div>

          {/* Sidebar - Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-gray-50 dark:bg-[#101010] p-6 rounded-none border border-gray-200 dark:border-gray-800 shadow-none lg:sticky lg:top-8`}>
            <h2 className="hidden lg:block text-xl font-semibold text-center py-4 bg-orange-600/10 text-orange-500 rounded-none mb-6 border border-orange-500/20">
              Filters
            </h2>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4 px-2">
                Categories
              </h3>
              <div className="space-y-3 px-2">
                {categories?.map((c) => (
                  <label key={c._id} className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      id={c._id}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-5 h-5 rounded-none border-gray-300 dark:border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500 focus:ring-offset-gray-900 transition-all cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:text-white transition-colors">
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4 px-2">
                Brands
              </h3>
              <div className="space-y-3 px-2">
                {uniqueBrands?.map((brand) => (
                  <label key={brand} className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-5 h-5 border-gray-300 dark:border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500 focus:ring-offset-gray-900 transition-all cursor-pointer rounded-none"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:text-white transition-colors text-sm">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4 px-2">
                Max Price
              </h3>
              <div className="px-2">
                <input
                  type="number"
                  placeholder="Enter Price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-none focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-gray-600"
                />
              </div>
            </div>

            <div className="px-2">
              <button
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 rounded-none transition-all shadow-none active:scale-95"
                onClick={() => window.location.reload()}
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white tracking-tight">
                {products?.length} <span className="text-gray-500 font-medium">Items Found</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 justify-items-center">
              {filteredProductsQuery.isLoading ? (
                <div className="col-span-full py-20 flex justify-center w-full">
                  <Loader />
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full w-full flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none">
                  <Frown size={80} className="text-gray-700 mb-6" />
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">No Matches Found</h2>
                  <p className="text-gray-500 mb-8 italic text-center px-4">Try adjusting your filters or search criteria.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-10 rounded-none transition-all shadow-none active:scale-95"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                products?.map((p) => (
                  <div className="w-full h-full" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
