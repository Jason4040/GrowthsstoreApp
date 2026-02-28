import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Tab Navigation */}
      <section className="flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-gray-800 shrink-0">
        {[
          { id: 1, label: "Write Review" },
          { id: 2, label: "All Reviews" },
          { id: 3, label: "Related Products" },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`p-4 md:p-6 cursor-pointer text-sm md:text-lg transition-all whitespace-nowrap ${activeTab === tab.id
              ? "text-pink-500 font-medium border-b-2 lg:border-b-0 lg:border-r-2 border-pink-500 bg-pink-500/5"
              : "text-gray-400 hover:text-white"
              }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </section>

      {/* Tab Content */}
      <section className="flex-1 min-w-0">
        {/* Write Review */}
        {activeTab === 1 && (
          <div className="max-w-2xl animate-fadeIn">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-lg font-semibold text-white mb-3">
                    Your Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white p-4 rounded-none focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  >
                    <option value="">Select a rating...</option>
                    <option value="1">1 - Needs Improvement</option>
                    <option value="2">2 - Decent</option>
                    <option value="3">3 - Great</option>
                    <option value="4">4 - Excellent</option>
                    <option value="5">5 - Exceptional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-lg font-semibold text-white mb-3">
                    Your Experience
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white p-4 rounded-none focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                    placeholder="Tell us what you liked or disliked..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white font-medium py-4 px-12 rounded-none transition-all disabled:bg-gray-700"
                >
                  Post Review
                </button>
              </form>
            ) : (
              <div className="bg-[#1A1A1A] p-8 rounded-none border border-dashed border-gray-700 text-center">
                <p className="text-gray-400">
                  Want to share your thoughts?{" "}
                  <Link to="/login" className="text-pink-500 font-medium hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {product.reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No reviews yet. Be the first!</div>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-[#1A1A1A] p-6 rounded-none border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-medium text-white">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <strong className="text-white text-lg">{review.name}</strong>
                    </div>
                    <span className="text-xs text-gray-500 font-medium bg-gray-900 px-3 py-1 rounded-none border border-gray-800">
                      {moment(review.createdAt).format('MMM DD, YYYY')}
                    </span>
                  </div>
                  <div className="mb-4">
                    <Ratings value={review.rating} />
                  </div>
                  <p className="text-gray-300 leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id} className="w-full">
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
