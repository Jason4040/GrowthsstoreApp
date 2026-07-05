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
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaTag,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
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
                            className="w-full h-[30rem] lg:h-[40rem] object-contain rounded-none cursor-grab active:cursor-grabbing"
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
                        className="w-full h-auto max-h-[40rem] object-contain rounded-none"
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
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 block">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8">
                  {product.description}
                </p>

                <div className="bg-gray-50 dark:bg-[#101010] p-6 rounded-none border border-gray-200 dark:border-gray-800 mb-8">
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-semibold text-orange-500">{formatPrice(product)}</div>
                      {product?.negotiable && (
                        <span className="bg-yellow-500/20 text-yellow-500 text-sm font-bold px-3 py-1 rounded-sm uppercase tracking-wide border border-yellow-500/30">
                          Negotiable
                        </span>
                      )}
                    </div>
                    {product?.discountQtyThreshold > 0 && (
                      <div className="inline-block self-start bg-green-600/10 text-green-500 border border-green-500/30 text-sm font-bold px-3 py-2 rounded-md animate-pulse">
                        🔥 Bulk Discount: Buy {product.discountQtyThreshold}+ items and get {formatPrice(getDiscountValue(product))} OFF {product.discountType === 'per_item' ? 'each item' : 'your total order'}!
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaStore className="mr-3 text-orange-500" />
                        <span className="font-semibold mr-2">Brand:</span> {product.brand}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaTag className="mr-3 text-orange-500" />
                        <span className="font-semibold mr-2">Category:</span> {product?.category?.name || "N/A"}
                      </div>
                      {product?.condition && (
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <FaTag className="mr-3 text-purple-500" />
                          <span className="font-semibold mr-2">Condition:</span> {product.condition}
                        </div>
                      )}
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaClock className="mr-3 text-orange-500" />
                        <span className="font-semibold mr-2">Added:</span> {moment(product.createAt).fromNow()}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaStar className="mr-3 text-orange-500" />
                        <span className="font-semibold mr-2">Reviews:</span> {product.numReviews}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaStar className="mr-3 text-orange-500" />
                        <span className="font-semibold mr-2">Rating:</span> {product.rating}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaShoppingCart className="mr-3 text-orange-500" />
                        <span className="font-semibold mr-2">Quantity:</span> {product.quantity}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <FaBox className="mr-3 text-orange-500" />
                        <span className="font-semibold mr-2">Status:</span> 
                        {product.stockStatus === 'requires_shipping' 
                          ? 'Available to Request' 
                          : `${product.countInStock} In Stock`}
                      </div>
                      {product.availabilityStartDate && product.availabilityEndDate && (
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <FaClock className="mr-3 text-orange-500" />
                          <span className="font-semibold mr-2">Available:</span> 
                          {new Date(product.availabilityStartDate).toLocaleDateString()} - {new Date(product.availabilityEndDate).toLocaleDateString()}
                        </div>
                      )}
                      {product.availableIn && (
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <FaMapMarkerAlt className="mr-3 text-orange-500" />
                          <span className="font-semibold mr-2">Region:</span> 
                          {product.availableIn === "Both" ? "Uganda & Rwanda" : `${product.availableIn} Only`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />

                  {product.stockStatus === 'requires_shipping' ? (
                    <div className="w-full sm:w-auto">
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="w-full sm:w-28 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-white p-3 rounded-none focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        {[...Array(100).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : product.countInStock > 0 ? (
                    <div className="w-full sm:w-auto">
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="w-full sm:w-28 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-white p-3 rounded-none focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="flex flex-col w-full gap-4">
                    <div className="flex w-full gap-4">
                      <button
                        onClick={addToCartHandler}
                        disabled={product.stockStatus !== 'requires_shipping' && product.countInStock === 0}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-none transition-all shadow-none disabled:bg-gray-700 transform active:scale-[0.98]"
                      >
                        {product.stockStatus === 'requires_shipping' 
                          ? "Request Item" 
                          : product.countInStock > 0 
                            ? "Add To Cart" 
                            : "Out of Stock"}
                      </button>

                      <button
                        onClick={() => {
                          toast.success("Used the heart icon overlaid on the image to save!", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 3000,
                          });
                        }}
                        className="flex items-center justify-center bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-orange-500 hover:bg-gray-800 text-orange-500 font-medium px-6 py-3 rounded-none transition-all shadow-none transform active:scale-[0.98]"
                      >
                        Hover Photo To Save
                      </button>
                    </div>
                    <button
                      onClick={handleWhatsAppOrder}
                      className="flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3 rounded-none transition-all shadow-none transform active:scale-[0.98] w-full"
                    >
                      <FaWhatsapp className="mr-2 text-xl" />
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
    </>
  );
};

export default ProductDetails;
