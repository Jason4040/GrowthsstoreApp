import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* <AdminMenu /> */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              All Products <span className="text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full text-lg ml-2">{products.length}</span>
            </h1>
            <Link to="/admin/productlist" className="bg-gradient-to-r from-orange-600 to-purple-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95">
              + Create Product
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="group bg-gray-100 dark:bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-gray-300 dark:border-gray-700 hover:shadow-xl transition-all flex flex-col sm:flex-row h-full"
              >
                <div className="sm:w-48 shrink-0 overflow-hidden bg-white dark:bg-black/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h5 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-orange-500 transition-colors">
                      {product?.name}
                    </h5>
                    <span className="text-gray-500 text-xs shrink-0 whitespace-nowrap bg-white dark:bg-black/40 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800">
                      {moment(product.createdAt).format("MMM Do YYYY")}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-2">
                    {product?.description?.substring(0, 160)}...
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center text-sm font-medium text-orange-500 group-hover:text-orange-400 transition-colors">
                      Update Product
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 5h12m0 0L9 1m4 4L9 9" />
                      </svg>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">$ {product?.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
