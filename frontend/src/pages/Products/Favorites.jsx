import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaRegFrownOpen } from "react-icons/fa";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-8 max-w-[1400px]">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Favorite Products
        </h1>
        <div className="text-sm font-medium text-gray-500 uppercase tracking-widest bg-gray-900/50 px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-none">
          Saved Items: {favorites?.length || 0}
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none w-full shadow-none mt-8">
          <FaRegFrownOpen size={80} className="text-gray-700 mb-6" />
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">No Favorites Yet</h2>
          <p className="text-gray-500 mb-8 italic">You haven't added any products to your favorites list.</p>
          <Link
            to="/shop"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-10 rounded-none transition-all shadow-none border border-orange-500 active:scale-95"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8 justify-items-center">
          {favorites.map((product) => (
            <div key={product._id} className="w-full h-full mb-6">
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
