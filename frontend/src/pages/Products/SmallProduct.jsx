import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { useCurrency } from "../../hooks/useCurrency";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import ProductVideo from "../../components/ProductVideo";
import AdminProductControls from "../../components/AdminProductControls";

const SmallProduct = ({ product }) => {
  const { formatPrice, currentCurrency } = useCurrency();
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
    <div className="p-3 relative bg-white dark:bg-[#121212] rounded-sm transition-all duration-300 group">
      <div className="relative">
        <AdminProductControls product={product} />
        {product.video ? (
          <ProductVideo
            videoUrl={product.video}
            isCover={true}
            className="w-full h-48 object-cover rounded-none"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-48 object-cover rounded-none"
          />
        )}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product?.availableIn && (
            <span className="bg-white/60 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-white/40 dark:border-gray-700/50 text-[9px] font-bold px-1.5 py-1 shadow-none flex items-center gap-1.5 w-fit uppercase tracking-wider rounded-full">
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
            <span className="bg-white/60 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-white/40 dark:border-gray-700/50 text-[8px] font-bold px-1.5 py-0.5 shadow-none w-fit uppercase tracking-widest rounded-full">
              {product.condition}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-3">
        <Link to={`/product/${product.slug || product._id}`}>
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold truncate text-gray-800 dark:text-gray-200 text-center hover:text-orange-500 transition-colors">
              {product.name}
            </div>
            
            <div className="flex justify-between items-center gap-2 mt-1">
              <span className="text-[#25D366] text-sm font-bold tracking-wide">
                {formatPrice(product)}
              </span>
              
              <div className="flex gap-2">
                <button
                  className="p-1.5 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[#25D366] transition-colors flex items-center justify-center border border-[#25D366]/30 hover:border-[#25D366]"
                  onClick={handleWhatsAppOrder}
                  title="Order via WhatsApp"
                >
                  <MessageCircle className="w-[14px] h-[14px]" />
                </button>
                <button
                  className="p-1.5 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-900 dark:text-white transition-colors flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
                  onClick={addToCartHandler}
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
