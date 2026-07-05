import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

import { useCurrency } from "../../hooks/useCurrency";
import ProductVideo from "../../components/ProductVideo";
import AdminProductControls from "../../components/AdminProductControls";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const { formatPrice, currentCurrency, getDiscountValue } = useCurrency();
  const navigate = useNavigate();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const getWhatsAppNumber = () => {
    if (currentCurrency === "RWF") return "250793392762";
    return "256771204748"; // Default to UGX
  };

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const number = getWhatsAppNumber();
    const message = `Hello, I would like to order:\n\n*${p.name}*\nQuantity: 1\nPrice: ${formatPrice(p)}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div 
      onClick={() => navigate(`/product/${p._id}`)}
      className="cursor-pointer w-full bg-gray-100 dark:bg-[#151515] rounded-none shadow-none border border-gray-200 dark:border-gray-800 hover:border-orange-500 transition-all duration-300 relative group overflow-hidden"
    >
      <section className="relative aspect-[4/3] overflow-hidden">
        <AdminProductControls product={p} />
        <Link to={`/product/${p._id}`}>
          <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1 z-10">
            {p?.availableIn && (
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-none shadow-lg group-hover:scale-105 transition-transform flex items-center gap-1">
                📍 {p.availableIn === "Both" ? "Uganda & Rwanda" : `${p.availableIn} Only`}
              </span>
            )}
            {p?.condition && (
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-none shadow-lg group-hover:scale-105 transition-transform">
                {p.condition}
              </span>
            )}
            <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-none shadow-lg group-hover:scale-105 transition-transform">
              {p?.brand}
            </span>
            {p?.discountQtyThreshold > 0 && (
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-none shadow-lg animate-pulse">
                Buy {p.discountQtyThreshold}+ Get {formatPrice(getDiscountValue(p))} OFF
              </span>
            )}
          </div>
          
          {p.video ? (
            <ProductVideo
              videoUrl={p.video}
              isCover={true}
              className="transform transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <img
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              src={p.image}
              alt={p.name}
            />
          )}
        </Link>
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HeartIcon product={p} />
        </div>
      </section>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <h5 className="text-lg font-bold text-gray-900 dark:text-white truncate leading-tight flex-1">
            {p?.name}
          </h5>
          <div className="flex flex-col items-end">
            <p className="font-bold text-orange-500 text-lg whitespace-nowrap">
              {formatPrice(p)}
            </p>
            {p?.negotiable && (
              <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1 uppercase tracking-wide border border-yellow-500/30">
                Negotiable
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          {p?.description?.substring(0, 80)}...
        </p>

        <section className="flex justify-between items-center gap-2">
          <Link
            to={`/product/${p._id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-center bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2.5 rounded-none transition-colors flex items-center justify-center gap-2"
          >
            Details
          </Link>

          <button
            className="p-2.5 bg-[#25D366] hover:bg-[#20bd5a] rounded-none text-white transition-colors"
            onClick={handleWhatsAppOrder}
            title="Order via WhatsApp"
          >
            <MessageCircle size={20} />
          </button>

          <button
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-none text-gray-900 dark:text-white transition-colors"
            onClick={() => addToCartHandler(p, 1)}
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
