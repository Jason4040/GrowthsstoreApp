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
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

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
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-0">
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
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
              {/* Product Image */}
              <div className="w-full lg:w-1/2 relative bg-[#1A1A1A] rounded-none overflow-hidden border border-gray-800 shadow-none">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 rounded-none"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                  {product.name}
                </h1>

                <p className="text-gray-400 leading-relaxed text-lg mb-8">
                  {product.description}
                </p>

                <div className="bg-[#101010] p-6 rounded-none border border-gray-800 mb-8">
                  <div className="text-5xl font-semibold text-pink-500 mb-8">$ {product.price}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-300">
                        <FaStore className="mr-3 text-pink-500" />
                        <span className="font-semibold mr-2">Brand:</span> {product.brand}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <FaClock className="mr-3 text-pink-500" />
                        <span className="font-semibold mr-2">Added:</span> {moment(product.createAt).fromNow()}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <FaStar className="mr-3 text-pink-500" />
                        <span className="font-semibold mr-2">Reviews:</span> {product.numReviews}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-300">
                        <FaStar className="mr-3 text-pink-500" />
                        <span className="font-semibold mr-2">Rating:</span> {product.rating}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <FaShoppingCart className="mr-3 text-pink-500" />
                        <span className="font-semibold mr-2">Quantity:</span> {product.quantity}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <FaBox className="mr-3 text-pink-500" />
                        <span className="font-semibold mr-2">In Stock:</span> {product.countInStock}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />

                  {product.countInStock > 0 && (
                    <div className="w-full sm:w-auto">
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="w-full sm:w-28 bg-black border border-gray-700 text-white p-3 rounded-none focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex w-full gap-4">
                    <button
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 rounded-none transition-all shadow-none disabled:bg-gray-700 transform active:scale-[0.98]"
                    >
                      {product.countInStock > 0 ? "Add To Cart" : "Out of Stock"}
                    </button>

                    <button
                      onClick={() => {
                        toast.success("Used the heart icon overlaid on the image to save!", {
                          position: toast.POSITION.BOTTOM_RIGHT,
                          autoClose: 3000,
                        });
                      }}
                      className="flex items-center justify-center bg-gray-900 border border-gray-700 hover:border-pink-500 hover:bg-gray-800 text-pink-500 font-medium px-6 py-3 rounded-none transition-all shadow-none transform active:scale-[0.98]"
                    >
                      Hover Photo To Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 border-t border-gray-800 pt-16">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
