import { useEffect } from "react";
import { Heart } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      // add the product to localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="cursor-pointer transition-all hover:scale-115 active:scale-95 p-1 flex items-center justify-center"
      onClick={toggleFavorites}
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    >
      {isFavorite ? (
        <Heart
          className="w-7 h-7 md:w-8 md:h-8 text-red-500 drop-shadow-lg scale-110"
          fill="currentColor"
        />
      ) : (
        <Heart
          className="w-7 h-7 md:w-8 md:h-8 text-gray-900 dark:text-white opacity-60 hover:opacity-100 transition-opacity drop-shadow-md"
          fill="none"
        />
      )}
    </div>
  );
};

export default HeartIcon;
