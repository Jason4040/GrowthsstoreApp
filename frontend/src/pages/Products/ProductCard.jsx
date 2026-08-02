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
      className="cursor-pointer w-full bg-white dark:bg-[#121212] rounded-sm transition-all duration-300 relative group overflow-hidden flex flex-col h-full"
    >
      <section className="relative aspect-[4/3] overflow-hidden">
        <AdminProductControls product={p} />
        <Link to={`/product/${p._id}`}>
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {p?.availableIn && (
              <span className="bg-white/60 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-white/40 dark:border-gray-700/50 text-[9px] font-bold px-2 py-1 shadow-none flex items-center gap-1.5 w-fit uppercase tracking-wider rounded-full transition-transform group-hover:scale-105">
                {p.availableIn === "Both" || p.availableIn === "Uganda" ? (
                  <img src="/icons/uganda.png" className="w-3.5 h-3.5 object-cover rounded-full shadow-sm" alt="Uganda" />
                ) : null}
                {p.availableIn === "Both" || p.availableIn === "Rwanda" ? (
                  <img src="/icons/rwanda.png" className="w-3.5 h-3.5 object-cover rounded-full shadow-sm" alt="Rwanda" />
                ) : null}
                {p.availableIn === "Both" ? "UG & RW" : `${p.availableIn}`}
              </span>
            )}
            {p?.condition && (
              <span className="bg-white/60 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-white/40 dark:border-gray-700/50 text-[8px] font-bold px-2 py-0.5 shadow-none w-fit uppercase tracking-widest rounded-full transition-transform group-hover:scale-105">
                {p.condition}
              </span>
            )}
            <span className="bg-white/60 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-white/40 dark:border-gray-700/50 text-[8px] font-bold px-2 py-0.5 shadow-none w-fit uppercase tracking-widest rounded-full transition-transform group-hover:scale-105">
              {p?.brand}
            </span>
            {p?.discountQtyThreshold > 0 && (
              <span className="bg-green-600/80 backdrop-blur-md text-white border border-green-500/50 text-[8px] font-bold px-2 py-0.5 shadow-none w-fit uppercase tracking-widest rounded-full animate-pulse">
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
        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
          <HeartIcon product={p} />
        </div>
      </section>

      <div className="p-4 flex flex-col flex-grow items-start text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#25D366] text-base md:text-lg font-bold tracking-tight">
            {formatPrice(p)}
          </span>
          {p?.negotiable && (
            <span className="text-yellow-600 dark:text-yellow-500 text-[10px] font-semibold uppercase tracking-wider">
              (Negotiable)
            </span>
          )}
        </div>

        <h5 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-2 hover:text-orange-500 transition-colors line-clamp-2 w-full">
          {p?.name}
        </h5>

        <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full flex items-center gap-1 mb-4">
          {p?.availableIn && (
            <span>{p.availableIn === "Both" ? "Uganda & Rwanda" : p.availableIn}</span>
          )}
          {p?.availableIn && p?.condition && <span>•</span>}
          {p?.condition && <span>{p.condition}</span>}
        </div>

        {/* Actions */}
        <section className="mt-auto flex justify-start items-center gap-3 w-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="p-1.5 md:p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[#25D366] transition-colors flex items-center justify-center border border-[#25D366]/30 hover:border-[#25D366]"
            onClick={handleWhatsAppOrder}
            title="Order via WhatsApp"
          >
            <img src="/icons/whatsapp.png" className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] object-contain" alt="WhatsApp" />
          </button>
          
          <Link
            to={`/product/${p._id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-center bg-transparent hover:bg-orange-600 text-gray-900 dark:text-white hover:text-white text-[10px] md:text-xs font-bold uppercase tracking-widest py-2 rounded-full transition-colors border border-gray-300 dark:border-gray-700 hover:border-orange-600"
          >
            Details
          </Link>

          <button
            className="p-1.5 md:p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-900 dark:text-white transition-colors flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
            onClick={() => addToCartHandler(p, 1)}
            title="Add to Cart"
          >
            <img src="/icons/cart.png" className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] object-contain dark:invert" alt="Cart" />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
