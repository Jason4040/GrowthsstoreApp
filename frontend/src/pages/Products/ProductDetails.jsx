import { useState, useRef, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Share2,
  Repeat,
  Heart,
} from "lucide-react";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import ImagePreviewModal from "../../components/ImagePreviewModal";
import SEO from "../../components/SEO";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useCurrency } from "../../hooks/useCurrency";
import ProductVideo from "../../components/ProductVideo";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white dark:bg-black/50 hover:bg-orange-500 text-white p-2 md:p-3 flex items-center justify-center transition-colors shadow-lg"
      onClick={onClick}
    >
      <ChevronRight className="w-6 h-6" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white dark:bg-black/50 hover:bg-orange-500 text-white p-2 md:p-3 flex items-center justify-center transition-colors shadow-lg"
      onClick={onClick}
    >
      <ChevronLeft className="w-6 h-6" />
    </div>
  );
};

const ImageMagnifier = ({ src, alt, onClick, className }) => {
  const [position, setPosition] = useState({ x: '50%', y: '50%' });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div
      className={`relative overflow-hidden cursor-crosshair flex justify-center items-center ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-contain pointer-events-none transition-transform ${isZoomed ? 'scale-[2.5] duration-700 ease-out' : 'scale-100 duration-300'}`}
        style={{ transformOrigin: `${position.x} ${position.y}` }}
      />
    </div>
  );
};

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatPrice, currentCurrency, getDiscountValue } = useCurrency();

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewInitialIndex, setPreviewInitialIndex] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const sliderRef = useRef(null);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  useEffect(() => {
    setSelectedVariant(null);
    setQty(1);
  }, [productId]);

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

  const hasVariants = product?.variants?.length > 0;
  const displayProduct = selectedVariant
    ? {
        ...product,
        price: selectedVariant.price ?? product.price,
        priceUGX: selectedVariant.priceUGX ?? product.priceUGX,
        priceRWF: selectedVariant.priceRWF ?? product.priceRWF,
      }
    : product;
  const maxQty = selectedVariant
    ? selectedVariant.countInStock
    : product?.stockStatus === 'requires_shipping' ? 100 : product?.countInStock;

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        ...displayProduct,
        qty,
        variant: selectedVariant
          ? {
              _id: selectedVariant._id,
              value: selectedVariant.value,
              sku: selectedVariant.sku,
              countInStock: selectedVariant.countInStock,
            }
          : undefined,
      })
    );
    navigate("/cart");
  };

  const getWhatsAppNumber = () => {
    if (currentCurrency === "RWF") return "250793392762";
    return "256771204748"; // Default to UGX
  };

  const handleWhatsAppOrder = () => {
    const number = getWhatsAppNumber();
    const variantLine = selectedVariant ? `\n${product.variantLabel || "Option"}: ${selectedVariant.value}` : "";
    const message = `Hello, I would like to order:\n\n*${product.name}*${variantLine}\nQuantity: ${qty}\nPrice: ${formatPrice(displayProduct)}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current) => setActiveMediaIndex(current),
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
      {product && (
        <SEO 
          title={`${product.name} | GrowthsStore`} 
          description={product.description?.substring(0, 160) || "Buy premium products at GrowthsStore."} 
        />
      )}
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
              <div className="w-full lg:w-1/2 relative bg-transparent overflow-hidden px-2 pt-6">
                {mediaList.length > 1 ? (
                  <>
                    <Slider ref={sliderRef} {...sliderSettings} className="w-full bg-transparent">
                      {mediaList.map((media, index) => (
                        <div key={index} className="w-full outline-none flex justify-center">
                          {media.type === 'video' ? (
                            <ProductVideo
                              videoUrl={media.url}
                              isCover={false}
                              className="w-full h-[30rem] lg:h-[40rem] object-contain"
                            />
                          ) : (
                            <ImageMagnifier
                              src={media.url}
                              alt={`${product.name} - ${index}`}
                              onClick={() => { setPreviewInitialIndex(index); setIsPreviewModalOpen(true); }}
                              className="w-full h-[30rem] lg:h-[40rem]"
                            />
                          )}
                        </div>
                      ))}
                    </Slider>
                    <div className="flex gap-4 overflow-x-auto mt-6 pb-2 px-2 scrollbar-hide snap-x justify-center">
                      {mediaList.map((media, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveMediaIndex(idx);
                            sliderRef.current?.slickGoTo(idx);
                          }}
                          className={`relative shrink-0 w-20 h-20 bg-transparent overflow-hidden transition-all snap-center cursor-pointer ${
                            activeMediaIndex === idx 
                              ? 'border border-gray-900 dark:border-white opacity-100' 
                              : 'border border-transparent opacity-50 hover:opacity-100'
                          }`}
                        >
                          {media.type === 'video' ? (
                            <video src={media.url} className="w-full h-full object-contain p-2" />
                          ) : (
                            <img src={media.url} className="w-full h-full object-contain p-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {mediaList[0]?.type === 'video' ? (
                      <ProductVideo
                        videoUrl={mediaList[0].url}
                        isCover={false}
                        className="w-full h-auto max-h-[40rem] object-contain bg-transparent"
                      />
                    ) : (
                      <div className="bg-transparent flex justify-center w-full">
                        <ImageMagnifier
                          src={mediaList[0]?.url || product.image}
                          alt={product.name}
                          onClick={() => { setPreviewInitialIndex(0); setIsPreviewModalOpen(true); }}
                          className="w-full h-auto max-h-[40rem]"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2 flex flex-col pt-8 lg:pl-8">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 tracking-wide font-medium">
                  <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{product?.category?.name || "Category"}</Link>
                  <span className="mx-2">&gt;</span>
                  <span className="text-gray-900 dark:text-white">Products</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-2 leading-tight uppercase tracking-widest">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                  <Ratings value={product.rating} color="#F59E0B" />
                  <span className="text-gray-400 dark:text-gray-500 text-sm">Reviews ({product.numReviews})</span>
                </div>

                <div className="flex items-center gap-6 mb-8 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer relative">
                     <img src="/icons/savedProducts.png" className="w-[16px] h-[16px] object-contain dark:invert" alt="Saved" />
                     <div className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer">
                        <HeartIcon product={product} />
                     </div>
                     <span className="pointer-events-none">ADD TO WISHLIST</span>
                  </div>
                </div>

                <div className="text-gray-500 dark:text-gray-400 leading-relaxed text-[13px] md:text-[14px] mb-8 space-y-4 max-w-2xl font-light">
                  <p>{product.description}</p>
                </div>

                <div className="flex flex-col gap-2 mb-8 text-[13px] font-light text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <span className="w-24 text-gray-900 dark:text-white font-medium">Brand:</span>
                    <span>{product.brand || 'N/A'}</span>
                  </div>
                  {product?.condition && (
                    <div className="flex items-center">
                      <span className="w-24 text-gray-900 dark:text-white font-medium">Condition:</span>
                      <span>{product.condition}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="w-24 text-gray-900 dark:text-white font-medium">Status:</span>
                    <span>
                      {product.stockStatus === 'requires_shipping' ? 'Available to Request' : `${product.countInStock} In Stock`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-gray-900 dark:text-white font-medium">Added:</span>
                    <span>{moment(product.createdAt || product.createAt).fromNow()}</span>
                  </div>
                  {product.availableIn && (
                    <div className="flex items-center">
                      <span className="w-24 text-gray-900 dark:text-white font-medium">Region:</span>
                      <span>
                        {product.availableIn === "Both" ? "Uganda & Rwanda" : `${product.availableIn} Only`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-3 mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
                  <div className="text-2xl font-light text-gray-900 dark:text-white tracking-wide">{formatPrice(displayProduct)}</div>
                  {product?.negotiable && (
                    <div className="text-sm font-light text-gray-400 dark:text-gray-500 tracking-wide mb-1">
                      (Negotiable)
                    </div>
                  )}
                </div>

                {product?.discountQtyThreshold > 0 && (
                  <div className="bg-green-600/10 text-green-600 dark:text-green-400 border border-green-500/30 text-sm font-medium px-4 py-3 rounded-md mb-8 animate-pulse w-fit">
                    🔥 Buy {product.discountQtyThreshold}+ items and get {formatPrice(getDiscountValue(product))} OFF!
                  </div>
                )}

                {/* Action Area */}
                <div className="flex flex-col gap-4 max-w-md">
                  {hasVariants && (
                    <div className="mb-2">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-widest block mb-3">
                        {product.variantLabel || "Options"} <span className="text-red-500">*</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => (
                          <button
                            key={v._id}
                            type="button"
                            onClick={() => { setSelectedVariant(v); setQty(1); }}
                            disabled={v.countInStock <= 0}
                            className={`px-4 py-2 text-sm border rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                              selectedVariant?._id === v._id
                                ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-500"
                            }`}
                          >
                            {v.value}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-6">
                    {(hasVariants ? selectedVariant : true) && (product.stockStatus === 'requires_shipping' || maxQty > 0) && (
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">QTY</span>
                        <div className="relative border border-gray-200 dark:border-gray-800 py-2 px-4 rounded-full w-20 flex justify-center">
                          <select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="w-full bg-transparent text-gray-900 dark:text-white outline-none text-sm appearance-none cursor-pointer text-center"
                          >
                            {[...Array(maxQty).keys()].map((x) => (
                              <option key={x + 1} value={x + 1} className="bg-white dark:bg-black text-gray-900 dark:text-white">
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={addToCartHandler}
                      disabled={
                        (hasVariants && !selectedVariant) ||
                        (product.stockStatus !== 'requires_shipping' && (maxQty ?? 0) === 0)
                      }
                      className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold text-[11px] uppercase tracking-widest py-3 px-8 rounded-full transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      {hasVariants && !selectedVariant
                        ? `SELECT ${(product.variantLabel || "AN OPTION").toUpperCase()}`
                        : product.stockStatus === 'requires_shipping'
                          ? "REQUEST ITEM"
                          : maxQty > 0
                            ? "ADD TO CART"
                            : "OUT OF STOCK"}
                    </button>
                  </div>

                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={hasVariants && !selectedVariant}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[11px] uppercase tracking-widest py-3 px-8 rounded-full transition-all mt-4 max-w-[300px] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <img src="/icons/whatsapp.png" className="w-[16px] h-[16px] object-contain" alt="WhatsApp" />
                    ORDER VIA WHATSAPP
                  </button>
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
        images={mediaList.filter(m => m.type === 'image').map(m => m.url)}
        initialIndex={previewInitialIndex}
      />
    </>
  );
};

export default ProductDetails;
