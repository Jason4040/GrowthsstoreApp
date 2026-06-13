import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
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
      className="cursor-pointer p-2 transition-all hover:scale-110 active:scale-95 bg-white dark:bg-black/20 rounded-none backdrop-blur-sm border border-transparent hover:border-orange-500/30"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart size={26} className="text-orange-500 transition-colors drop-shadow-lg" />
      ) : (
        <FaRegHeart size={26} className="text-orange-500 hover:text-orange-400 transition-colors drop-shadow-lg" />
      )}
    </div>
  );
};

export default HeartIcon;
