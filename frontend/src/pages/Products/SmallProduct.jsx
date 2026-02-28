import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="p-3 relative bg-[#1A1A1A] rounded-none border border-gray-800 hover:border-pink-500 transition-all rounded-none shadow-none">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-none"
        />
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center gap-4">
            <div className="text-sm font-semibold truncate text-white">{product.name}</div>
            <span className="bg-pink-900 border border-pink-500 text-pink-300 text-xs font-semibold px-3 py-1.5 rounded-none whitespace-nowrap">
              ${product.price.toLocaleString()}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
