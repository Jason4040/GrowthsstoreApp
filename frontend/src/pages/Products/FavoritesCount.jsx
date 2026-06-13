import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute -top-1 -right-1">
      {favoriteCount > 0 && (
        <span className="px-1.5 py-0.5 text-[9px] font-medium text-white bg-orange-600 rounded-none">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
