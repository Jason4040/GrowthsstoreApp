import { useGetNewProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  Box,
  Clock,
  ShoppingCart,
  Star,
  Store,
  MessageCircle,
} from "lucide-react";
import HeartIcon from "../Products/HeartIcon";
import { useCurrency } from "../../hooks/useCurrency";
import ProductVideo from "../../components/ProductVideo";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetNewProductsQuery();
  const { formatPrice, currentCurrency } = useCurrency();

  const getWhatsAppNumber = () => {
    if (currentCurrency === "RWF") return "250793392762";
    return "256771204748"; // Default to UGX
  };

  const handleWhatsAppOrder = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const number = getWhatsAppNumber();
    const message = `Hello, I would like to order:\n\n*${product.name}*\nQuantity: 1\nPrice: ${formatPrice(product)}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full lg:w-[45rem] xl:w-[50rem] 2xl:w-[60rem]"
        >
          {products.map((product) => (
            <div key={product._id} className="relative">
              {product.video ? (
                <ProductVideo
                  videoUrl={product.video}
                  isCover={true}
                  className="w-full rounded-none object-cover h-[20rem] md:h-[30rem] 2xl:h-[35rem] shadow-none border border-gray-200 dark:border-gray-800"
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-none object-cover h-[20rem] md:h-[30rem] 2xl:h-[35rem] shadow-none border border-gray-200 dark:border-gray-800"
                />
              )}
              <div className="absolute top-4 right-4 z-10">
                <HeartIcon product={product} />
              </div>

              <div className="mt-8 flex flex-col lg:flex-row justify-between gap-8 px-4">
                <div className="flex-1">
                  <h2 className="text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-orange-500 font-semibold text-xl">{formatPrice(product)}</p>
                    <button
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] rounded-none text-white transition-colors flex items-center justify-center text-sm font-bold shadow-md"
                      onClick={(e) => handleWhatsAppOrder(e, product)}
                      title="Order via WhatsApp"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Order Now
                    </button>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                    {product.description.substring(0, 160)}...
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:w-[20rem] 2xl:w-[25rem] bg-gray-900/50 p-6 rounded-none border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Store className="mr-2 text-orange-500" /> {product.brand}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Clock className="mr-2 text-orange-500" />{" "}
                      {moment(product.createdAt).fromNow()}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Star className="mr-2 text-orange-500" /> {product.numReviews} Reviews
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Star className="mr-2 text-orange-500" /> {Math.round(product.rating)} Ratings
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <ShoppingCart className="mr-2 text-orange-500" /> {product.quantity} Qty
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Box className="mr-2 text-orange-500" /> {product.countInStock} Stock
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
