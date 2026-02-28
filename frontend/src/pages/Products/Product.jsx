import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full relative bg-[#1A1A1A] rounded-none overflow-hidden transition-all group border border-gray-800 hover:border-pink-500 shadow-none">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-none"
          />
        </Link>
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-xl font-medium text-white leading-tight truncate flex-1">{product.name}</h2>
            <span className="bg-pink-600 text-white text-sm font-semibold px-4 py-1.5 rounded-none whitespace-nowrap border border-pink-500">
              $ {product.price.toLocaleString()}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;
