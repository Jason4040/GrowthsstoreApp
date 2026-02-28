import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="w-full relative bg-[#1A1A1A] rounded-none overflow-hidden border border-gray-800 hover:border-pink-500 transition-all group">
      <section className="relative overflow-hidden">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-none"
            src={p.image}
            alt={p.name}
          />
          <span className="absolute bottom-3 right-3 bg-pink-600 text-white text-xs font-medium px-3 py-1 rounded-none shadow-lg">
            {p?.brand}
          </span>
        </Link>
        <div className="absolute top-2 right-2">
          <HeartIcon product={p} />
        </div>
      </section>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4 gap-2">
          <h5 className="text-xl font-medium text-white truncate">{p?.name}</h5>
          <p className="text-pink-500 font-medium text-lg whitespace-nowrap">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {p?.description?.substring(0, 80)}...
        </p>

        <section className="flex justify-between items-center gap-4">
          <Link
            to={`/product/${p._id}`}
            className="flex-1 text-center bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium py-2.5 rounded-none transition-colors flex items-center justify-center gap-2"
          >
            Details
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-none text-white transition-colors"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
