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
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer w-full relative bg-white dark:bg-[#1A1A1A] rounded-none overflow-hidden transition-all group border border-gray-200 dark:border-gray-800 hover:border-orange-500 shadow-none flex flex-col h-full"
    >
      <div className="relative overflow-hidden">
        <AdminProductControls product={product} />
        <Link to={`/product/${product._id}`}>
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
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-none"
            />
          )}
        </Link>
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product?.availableIn && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm flex items-center gap-1 w-fit">
              📍 {product.availableIn === "Both" ? "Uganda & Rwanda" : `${product.availableIn} Only`}
            </span>
          )}
          {product?.condition && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm w-fit">
              {product.condition}
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`} className="flex-grow">
          {product?.category?.name && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
              {product.category.name}
            </span>
          )}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white leading-tight mb-4 line-clamp-2">{product.name}</h2>
        </Link>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col items-start">
            <span className="bg-orange-600 text-white text-sm font-semibold px-3 py-1.5 rounded-none whitespace-nowrap border border-orange-500">
              {formatPrice(product)}
            </span>
            {product?.negotiable && (
              <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1 uppercase tracking-wide border border-yellow-500/30">
                Negotiable
              </span>
            )}
            {product?.discountQtyThreshold > 0 && (
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1 uppercase tracking-wide border border-green-500 animate-pulse">
                Buy {product.discountQtyThreshold}+ Get {formatPrice(getDiscountValue(product))} OFF
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              className="p-2.5 bg-[#25D366] hover:bg-[#20bd5a] rounded-none text-white transition-colors flex items-center justify-center"
              onClick={handleWhatsAppOrder}
              title="Order via WhatsApp"
            >
              <MessageCircle size={20} />
            </button>
            <button
              className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-none text-white transition-colors flex items-center justify-center"
              onClick={addToCartHandler}
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
