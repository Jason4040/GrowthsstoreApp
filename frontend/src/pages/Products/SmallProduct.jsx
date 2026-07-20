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
    <div className="p-3 relative bg-white dark:bg-[#1A1A1A] rounded-none border border-gray-200 dark:border-gray-800 hover:border-orange-500 transition-all shadow-none group">
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
            className="w-full h-48 object-cover rounded-none"
          />
        )}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product?.availableIn && (
            <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm flex items-center gap-1 w-fit">
              📍 {product.availableIn === "Both" ? "Uganda & Rwanda" : `${product.availableIn} Only`}
            </span>
          )}
          {product?.condition && (
            <span className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm w-fit">
              {product.condition}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="flex justify-between items-center gap-2">
            <div className="text-sm font-semibold truncate text-gray-900 dark:text-white flex-1">{product.name}</div>
            <button
              className="p-1.5 bg-[#25D366] hover:bg-[#20bd5a] rounded-none text-white transition-colors flex items-center justify-center"
              onClick={handleWhatsAppOrder}
              title="Order via WhatsApp"
            >
              <MessageCircle size={14} />
            </button>
            <button
              className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-none text-white transition-colors flex items-center justify-center"
              onClick={addToCartHandler}
              title="Add to Cart"
            >
              <ShoppingCart size={14} />
            </button>
            <span className="bg-orange-900 border border-orange-500 text-orange-300 text-xs font-semibold px-2 py-1 rounded-none whitespace-nowrap">
              {formatPrice(product)}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
