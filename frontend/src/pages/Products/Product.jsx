import { Link, useNavigate } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useCurrency } from "../../hooks/useCurrency";
import ProductVideo from "../../components/ProductVideo";
import AdminProductControls from "../../components/AdminProductControls";

const Product = ({ product }) => {
  const { formatPrice, currentCurrency, getDiscountValue } = useCurrency();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, qty: 1 }));
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
    const message = `Hello, I would like to order:\n\n*${product.name}*\nQuantity: 1\nPrice: ${formatPrice(product)}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product.slug || product._id}`)}
      className="cursor-pointer w-full relative bg-white dark:bg-[#121212] overflow-hidden transition-all duration-300 group flex flex-col h-full rounded-sm"
    >
      <div className="relative overflow-hidden">
        <AdminProductControls product={product} />
        <Link to={`/product/${product.slug || product._id}`}>
          {product.video ? (
            <ProductVideo
              videoUrl={product.video}
              isCover={true}
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-none"
            />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-none"
            />
          )}
        </Link>
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product?.availableIn && (
            <span className="bg-white/60 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-white/40 dark:border-gray-700/50 text-[9px] font-bold px-2 py-1 shadow-none flex items-center gap-1.5 w-fit uppercase tracking-wider rounded-full">
              {product.availableIn === "Both" || product.availableIn === "Uganda" ? (
                <img src="/icons/uganda.png" className="w-3.5 h-3.5 object-cover rounded-full shadow-sm" alt="Uganda" />
              ) : null}
              {product.availableIn === "Both" || product.availableIn === "Rwanda" ? (
                <img src="/icons/rwanda.png" className="w-3.5 h-3.5 object-cover rounded-full shadow-sm" alt="Rwanda" />
              ) : null}
              {product.availableIn === "Both" ? "UG & RW" : `${product.availableIn}`}
            </span>
          )}
          {product?.condition && (
            <span className="bg-white/60 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-white/40 dark:border-gray-700/50 text-[8px] font-bold px-2 py-0.5 shadow-none w-fit uppercase tracking-widest rounded-full">
              {product.condition}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow items-start text-left">
        <Link to={`/product/${product.slug || product._id}`} className="flex-grow flex flex-col items-start w-full">
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#25D366] text-base md:text-lg font-bold tracking-tight">
              {formatPrice(product)}
            </span>
            {product?.negotiable && (
              <span className="text-yellow-600 dark:text-yellow-500 text-[10px] font-semibold uppercase tracking-wider">
                (Negotiable)
              </span>
            )}
          </div>

          <h2 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1 line-clamp-2 hover:text-orange-500 transition-colors w-full">
            {product.name}
          </h2>

          <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full flex items-center gap-1">
            {product?.availableIn && (
              <span>{product.availableIn === "Both" ? "Uganda & Rwanda" : product.availableIn}</span>
            )}
            {product?.availableIn && product?.condition && <span>•</span>}
            {product?.condition && <span>{product.condition}</span>}
          </div>
          
          {product?.discountQtyThreshold > 0 && (
            <span className="text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider mt-2 block">
              Buy {product.discountQtyThreshold}+ Get {formatPrice(getDiscountValue(product))} OFF
            </span>
          )}
        </Link>
        
        {/* Actions - appear on hover (desktop) or always (mobile) */}
        <div className="mt-3 flex justify-start gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
          <button
            className="p-1.5 md:p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[#25D366] transition-colors flex items-center justify-center border border-[#25D366]/30 hover:border-[#25D366]"
            onClick={handleWhatsAppOrder}
            title="Order via WhatsApp"
          >
            <MessageCircle className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
          </button>
          <button
            className="p-1.5 md:p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-900 dark:text-white transition-colors flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
            onClick={addToCartHandler}
            title="Add to Cart"
          >
            <ShoppingCart className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
