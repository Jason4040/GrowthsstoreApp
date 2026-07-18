import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import moment from "moment";
import { useGetTopProductsQuery, useUploadProductImageMutation, useDeleteReviewMutation, useHideReviewMutation } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { Upload, X, Camera, Trash2, Eye, EyeOff, Edit } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import ImagePreviewModal from "../../components/ImagePreviewModal";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
  reviewImage,
  setReviewImage,
  refetch,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [hideReview] = useHideReviewMutation();

  const [activeTab, setActiveTab] = useState(2);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const userReview = product?.reviews?.find((r) => r.user.toString() === userInfo?._id?.toString());

  useEffect(() => {
    if (userReview && activeTab === 1) {
      if (!rating && !comment) {
        setRating(userReview.rating);
        setComment(userReview.comment);
        setReviewImage(userReview.image || "");
      }
    }
  }, [userReview, activeTab]);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const uploadFileHandler = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      setReviewImage(res.image);
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const confirmDeleteReview = async () => {
    try {
      await deleteReview({ productId: product._id, reviewId: reviewToDelete }).unwrap();
      toast.success("Review deleted successfully");
      if (refetch) refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleToggleHideReview = async (reviewId) => {
    try {
      await hideReview({ productId: product._id, reviewId }).unwrap();
      toast.success("Review visibility toggled");
      if (refetch) refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Tab Navigation */}
      <section className="flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 shrink-0">
        {[
          { id: 1, label: userReview ? "Edit Review" : "Write Review" },
          { id: 2, label: "All Reviews" },
          { id: 3, label: "Related Products" },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`p-4 md:p-6 cursor-pointer text-sm md:text-lg transition-all whitespace-nowrap ${activeTab === tab.id
              ? "text-orange-500 font-medium border-b-2 lg:border-b-0 lg:border-r-2 border-orange-500 bg-orange-500/5"
              : "text-gray-600 dark:text-gray-400 hover:text-white"
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
              <form onSubmit={async (e) => {
                const success = await submitHandler(e);
                if (success) setActiveTab(2);
              }} className="space-y-8 bg-gray-100 dark:bg-white dark:bg-[#151515] p-8 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl">
                <div>
                  <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                    Your Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-[#101010] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer"
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
                  <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                    Your Experience
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#101010] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                    placeholder="Tell us what you liked or disliked..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                    Proof Image (Optional)
                  </label>
                  <div className="relative">
                    {reviewImage ? (
                      <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 group">
                        <img src={reviewImage} alt="Review Proof" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-white dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setReviewImage("")}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transform transition-transform hover:scale-110 shadow-lg"
                          >
                            <X />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#101010] hover:border-orange-500 hover:bg-white dark:bg-gray-50 dark:bg-[#1A1A1A] transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {loadingUpload ? (
                            <div className="flex flex-col items-center justify-center">
                              <svg className="animate-spin h-8 w-8 text-orange-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <p className="text-sm text-orange-500 font-medium animate-pulse">Uploading...</p>
                            </div>
                          ) : (
                            <>
                              <Camera className="w-8 h-8 text-gray-500 mb-3 group-hover:text-orange-500 transition-colors" />
                              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:text-gray-300">
                                <span className="font-semibold text-orange-500">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or WEBP</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            uploadFileHandler(e);
                            e.target.value = null;
                          }}
                          disabled={loadingUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview || loadingUpload}
                  className="w-full md:w-auto bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-gray-900 dark:text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                  {userReview ? "Update Review" : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="bg-white dark:bg-gray-50 dark:bg-[#1A1A1A] p-8 rounded-none border border-dashed border-gray-300 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Want to share your thoughts?{" "}
                  <Link to="/login" className="text-orange-500 font-medium hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {product.reviews.filter(r => userInfo?.isAdmin || !r.isHidden).length === 0 ? (
              <div className="col-span-full text-center py-16 bg-gray-100 dark:bg-white dark:bg-[#151515] rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="text-gray-500 text-lg mb-2">No reviews yet.</div>
                <div className="text-gray-600">Be the first to share your experience!</div>
              </div>
            ) : (
              product.reviews.filter(r => userInfo?.isAdmin || !r.isHidden).map((review) => (
                <div key={review._id} className={`bg-gray-100 dark:bg-white dark:bg-[#151515] flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:border-gray-700 hover:shadow-xl transition-all group ${review.isHidden ? 'opacity-60 grayscale' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-purple-600 flex items-center justify-center font-bold text-xl text-gray-900 dark:text-white shadow-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white text-lg block">
                          {review.name} {review.isHidden && <span className="text-xs text-red-500 ml-2 px-2 py-0.5 bg-red-500/10 rounded-full border border-red-500/20">Hidden</span>}
                        </strong>
                        <span className="text-sm text-gray-500 font-medium">
                          {moment(review.createdAt).format('MMMM Do, YYYY')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {userInfo?._id === review.user && (
                        <button
                          onClick={() => setActiveTab(1)}
                          className="p-2 bg-orange-900/30 hover:bg-orange-800/50 text-orange-500 rounded-lg transition-colors border border-orange-900/50 hover:border-orange-700"
                          title="Edit Review"
                        >
                          <Edit />
                        </button>
                      )}
                      {userInfo?.isAdmin && (
                        <>
                          <button
                            onClick={() => handleToggleHideReview(review._id)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-300 dark:border-gray-700 hover:border-gray-600"
                            title={review.isHidden ? "Unhide Review" : "Hide Review"}
                          >
                            {review.isHidden ? <Eye /> : <EyeOff />}
                          </button>
                          <button
                            onClick={() => {
                              setReviewToDelete(review._id);
                              setIsConfirmOpen(true);
                            }}
                            className="p-2 bg-red-900/30 hover:bg-red-800/50 text-red-500 rounded-lg transition-colors border border-red-900/50 hover:border-red-700"
                            title="Delete Review"
                          >
                            <Trash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 bg-white dark:bg-black/20 self-start px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                    <Ratings value={review.rating} />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6 flex-grow">"{review.comment}"</p>
                  
                  {review.image && (
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800/50 flex items-center gap-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest shrink-0">Proof Attached:</div>
                      <button 
                        type="button"
                        onClick={() => {
                          setPreviewImageUrl(review.image);
                          setIsPreviewOpen(true);
                        }}
                        className="block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shrink-0 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <img 
                          src={review.image} 
                          alt="Review Proof" 
                          className="w-16 h-16 object-cover transform hover:scale-110 transition-transform duration-300" 
                        />
                      </button>
                    </div>
                  )}
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
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteReview}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
      />
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewImageUrl}
      />
    </div>
  );
};

export default ProductTabs;
