import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  Box,
  Clock,
  ShoppingCart,
  Star,
  Store,
  Tag,
  MessageCircle,
  MapPin,
} from "lucide-react";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import ImagePreviewModal from "../../components/ImagePreviewModal";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useCurrency } from "../../hooks/useCurrency";
import ProductVideo from "../../components/ProductVideo";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatPrice, currentCurrency, getDiscountValue } = useCurrency();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
        image: reviewImage,
      }).unwrap();
      refetch();
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      setReviewImage("");
      return true;
    } catch (error) {
      toast.error(error?.data || error.message);
      return false;
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const getWhatsAppNumber = () => {
    if (currentCurrency === "RWF") return "250793392762";
    return "256771204748"; // Default to UGX
  };

  const handleWhatsAppOrder = () => {
    const number = getWhatsAppNumber();
    const message = `Hello, I would like to order:\n\n*${product.name}*\nQuantity: ${qty}\nPrice: ${formatPrice(product)}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  let mediaList = [];
  if (product && product.video) {
    mediaList.push({ type: 'video', url: product.video });
  }
  if (product) {
    const images = product.images?.length > 0 ? product.images : [product.image];
    images.forEach(img => {
      // Avoid duplicate if main image is also in images array but we only want unique
      if (!mediaList.find(m => m.url === img)) {
        mediaList.push({ type: 'image', url: img });
      }
    });
  }

  return (
    <>
      <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-0">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Product Image / Media Slider */}
              <div className="w-full lg:w-1/2 relative bg-white dark:bg-[#1A1A1A] rounded-none overflow-hidden border border-gray-200 dark:border-gray-800 shadow-none pb-8">
                {mediaList.length > 1 ? (
                  <Slider {...sliderSettings} className="w-full">
                    {mediaList.map((media, index) => (
                      <div key={index} className="w-full outline-none">
                        {media.type === 'video' ? (
                          <ProductVideo
                            videoUrl={media.url}
                            isCover={false}
                            className="w-full h-[30rem] lg:h-[40rem] object-contain bg-black rounded-none"
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={`${product.name} - ${index}`}
                            onClick={() => { setPreviewImageUrl(media.url); setIsPreviewModalOpen(true); }}
                            className="w-full h-[30rem] lg:h-[40rem] object-contain rounded-none cursor-pointer"
                          />
                        )}
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <>
                    {mediaList[0]?.type === 'video' ? (
                      <ProductVideo
                        videoUrl={mediaList[0].url}
                        isCover={false}
                        className="w-full h-auto max-h-[40rem] object-contain bg-black rounded-none"
                      />
                    ) : (
                      <img
                        src={mediaList[0]?.url || product.image}
                        alt={product.name}
                        onClick={() => { setPreviewImageUrl(mediaList[0]?.url || product.image); setIsPreviewModalOpen(true); }}
                        className="w-full h-auto max-h-[40rem] object-contain rounded-none cursor-pointer"
                      />
                    )}
                  </>
                )}
                <div className="absolute top-4 right-4 z-10">
                  <HeartIcon product={product} />
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2 flex flex-col">
                {product?.category?.name && (
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2 block">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`} color="orange-500" />
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="text-4xl font-bold text-orange-500">{formatPrice(product)}</div>
                  {product?.negotiable && (
                    <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide border border-yellow-500/30">
                      Negotiable
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg mb-8">
                  {product.description}
                </p>

                {product?.discountQtyThreshold > 0 && (
                  <div className="bg-green-600/10 text-green-500 border border-green-500/30 text-sm font-medium px-4 py-3 rounded-none mb-8 animate-pulse">
                    🔥 Buy {product.discountQtyThreshold}+ items and get {formatPrice(getDiscountValue(product))} OFF {product.discountType === 'per_item' ? 'each item' : 'your total order'}!
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 py-6 border-y border-gray-200 dark:border-gray-800">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Store className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-sm"><strong className="text-gray-900 dark:text-white font-medium mr-1">Brand:</strong> {product.brand}</span>
                  </div>
                  {product?.condition && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Tag className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm"><strong className="text-gray-900 dark:text-white font-medium mr-1">Condition:</strong> {product.condition}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Box className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-sm"><strong className="text-gray-900 dark:text-white font-medium mr-1">Status:</strong> 
                      {product.stockStatus === 'requires_shipping' ? 'Available to Request' : `${product.countInStock} In Stock`}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-sm"><strong className="text-gray-900 dark:text-white font-medium mr-1">Added:</strong> {moment(product.createAt).fromNow()}</span>
                  </div>
                  {product.availableIn && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm"><strong className="text-gray-900 dark:text-white font-medium mr-1">Region:</strong> 
                        {product.availableIn === "Both" ? "Uganda & Rwanda" : `${product.availableIn} Only`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Area */}
                <div className="flex flex-col gap-5">
                  {(product.stockStatus === 'requires_shipping' || product.countInStock > 0) && (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="w-24 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-2.5 rounded-none focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                      >
                        {[...Array(product.stockStatus === 'requires_shipping' ? 100 : product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1} className="bg-[#101010] text-white">
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col xl:flex-row gap-4 mt-2 w-full">
                    <button
                      onClick={addToCartHandler}
                      disabled={product.stockStatus !== 'requires_shipping' && product.countInStock === 0}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 px-6 rounded-none transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.stockStatus === 'requires_shipping' 
                        ? "Request Item" 
                        : product.countInStock > 0 
                          ? "Add To Cart" 
                          : "Out of Stock"}
                    </button>

                    <button
                      onClick={handleWhatsAppOrder}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3.5 px-6 rounded-none transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Order via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-16">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
                reviewImage={reviewImage}
                setReviewImage={setReviewImage}
                refetch={refetch}
              />
            </div>
          </div>
        )}
      </div>

      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        imageUrl={previewImageUrl}
      />
    </>
  );
};

export default ProductDetails;
