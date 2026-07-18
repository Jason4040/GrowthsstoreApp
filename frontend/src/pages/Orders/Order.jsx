import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useUploadPaymentProofMutation,
  useUploadPaymentProofFileMutation,
  useAppealPaymentProofMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const getCurrencySymbol = (currency) => {
    if (currency === "UGX") return "USh ";
    if (currency === "RWF") return "FRw ";
    return "$";
  };
  const sym = order ? getCurrencySymbol(order.currency || "USD") : "$";

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [uploadPaymentProofFile, { isLoading: loadingUpload }] =
    useUploadPaymentProofFileMutation();
  const [uploadPaymentProof, { isLoading: loadingSubmitProof }] =
    useUploadPaymentProofMutation();
  const [appealPaymentProof, { isLoading: loadingAppeal }] = useAppealPaymentProofMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState("");
  const [appealText, setAppealText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (order && order.isPaid) {
      if (userInfo && !userInfo.isAdmin) {
        toast.success("Payment approved! Redirecting to chat...");
        navigate("/messages");
      }
    }
  }, [order, userInfo, navigate]);

  const handleAppeal = async () => {
    if (!appealText.trim()) {
      toast.error("Please enter appeal details");
      return;
    }
    try {
      await appealPaymentProof({ orderId, appealText }).unwrap();
      toast.success("Appeal submitted successfully");
      setAppealText("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Appeal failed");
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadPaymentProofFile(formData).unwrap();
      setProofFile(res.image);
      toast.success("Payment proof file uploaded successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Upload failed");
    }
  };

  const handleSubmitProof = async () => {
    if (!proofFile) {
      toast.error("Please upload a file first");
      return;
    }

    try {
      await uploadPaymentProof({ orderId, paymentProof: proofFile }).unwrap();
      toast.success("Payment proof submitted for review");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Submission failed");
    }
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  const isRwanda = order && (
    order.currency === "RWF" || 
    order.shippingAddress?.country?.toLowerCase() === "rwanda" ||
    order.shippingAddress?.country?.toLowerCase() === "rw"
  );

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-8 max-w-[1200px]">
      {/* Order Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Order Details
        </h1>
        <p className="text-gray-600 text-sm mt-1 font-mono">
          #{order._id}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Items + Shipping Info */}
        <div className="flex-1 space-y-6">
          {/* Order Items */}
          <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Order Items ({order.orderItems.length})
              </h2>
            </div>

            {order.orderItems.length === 0 ? (
              <div className="p-6">
                <Messsage>Order is empty</Messsage>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-16 h-16 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover border border-gray-200 dark:border-gray-800"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-orange-500 hover:text-orange-400 font-medium text-sm truncate block transition-colors"
                      >
                        {item.name}
                      </Link>
                      <span className="text-gray-600 text-xs mt-0.5 block">
                        Qty: {item.qty}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-gray-600">
                        {sym}{item.price} × {item.qty}
                      </div>
                      <div className="text-gray-900 dark:text-white font-medium text-sm mt-0.5">
                        {sym}{(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping & Customer Info - on the left to fill space */}
          <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none p-6">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-5">
              Shipping Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <span className="text-xs text-gray-600 uppercase tracking-wide block">
                  Name
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {order.user.username}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-600 uppercase tracking-wide block">
                  Email
                </span>
                <span className="text-sm text-gray-900 dark:text-white break-all">
                  {order.user.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-600 uppercase tracking-wide block">
                  Address
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-600 uppercase tracking-wide block">
                  Payment
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {order.paymentMethod}
                </span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div
                className={`flex-1 p-3 border text-sm font-medium text-center ${order.isPaid
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : order.paymentProofStatus === "pending" || order.paymentProofStatus === "appealed"
                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
              >
                {order.isPaid
                  ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                  : order.paymentProofStatus === "pending"
                  ? "Awaiting Payment Approval"
                  : order.paymentProofStatus === "appealed"
                  ? "Appeal Pending Review"
                  : order.paymentProofStatus === "rejected"
                  ? "Payment Rejected"
                  : "Not Paid"}
              </div>
              <div
                className={`flex-1 p-3 border text-sm font-medium text-center ${order.isDelivered
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                  }`}
              >
                {order.isDelivered
                  ? `Delivered on ${new Date(
                    order.deliveredAt
                  ).toLocaleDateString()}`
                  : "In Transit"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Summary + Actions */}
        <div className="w-full lg:w-[360px] space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-none p-6 lg:sticky lg:top-8">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-5">
              Order Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Items</span>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  {sym}{order.itemsPrice}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Shipping</span>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  {sym}{order.shippingPrice}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Tax</span>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  {sym}{order.taxPrice}
                </span>
              </div>
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-semibold">Total</span>
                  <span className="text-2xl font-semibold text-orange-500">
                    {sym}{order.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Proof Submission / Status */}
            {!order.isPaid && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                {order.paymentProofStatus === "none" && (
                  <button
                    type="button"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 transition-all active:scale-[0.98]"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Pay Now (Mobile Money)
                  </button>
                )}

                {order.paymentProofStatus === "pending" && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 text-center rounded-lg">
                    <span className="font-semibold block mb-1">Awaiting Approval</span>
                    <span className="text-xs">Payment proof has been submitted. Admin is currently reviewing your payment.</span>
                    {order.paymentProof && (
                      <a
                        href={order.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline block mt-2 text-orange-500 hover:text-orange-400"
                      >
                        View Submitted Proof
                      </a>
                    )}
                  </div>
                )}

                {order.paymentProofStatus === "rejected" && (
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-center rounded-lg">
                      <span className="font-semibold block mb-1">Proof Rejected</span>
                      <span className="text-xs">Your submitted payment proof was rejected. Please review payment details and try again.</span>
                    </div>
                    <button
                      type="button"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 transition-all active:scale-[0.98]"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Resubmit Payment Proof
                    </button>

                    <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg bg-gray-900/50 space-y-3 mt-4">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Appeal Payment Rejection</h4>
                      <p className="text-xs text-gray-400">If you have already paid, please write a brief message explaining your payment (e.g. transaction code, mobile number, date) and submit an appeal.</p>
                      <textarea
                        rows="3"
                        placeholder="Write your appeal message here..."
                        value={appealText}
                        onChange={(e) => setAppealText(e.target.value)}
                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                        onClick={handleAppeal}
                        disabled={loadingAppeal || !appealText.trim()}
                      >
                        {loadingAppeal ? "Submitting Appeal..." : "Submit Appeal"}
                      </button>
                    </div>
                  </div>
                )}

                {order.paymentProofStatus === "appealed" && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 text-center rounded-lg">
                    <span className="font-semibold block mb-1">Appeal Submitted</span>
                    <span className="text-xs">Your payment rejection appeal has been submitted. The admin has been notified and is currently reviewing your appeal.</span>
                    {order.paymentAppealText && (
                      <div className="mt-3 text-left p-3 bg-white dark:bg-black/30 rounded border border-gray-200 dark:border-gray-800 text-xs text-gray-300">
                        <strong>Your Appeal:</strong> {order.paymentAppealText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Modal for manual payment instructions and upload */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Mobile Money Payment</h2>
              
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  To complete your order, please send exactly <strong className="text-orange-500">{sym}{order.totalPrice}</strong> to the following number:
                </p>

                <div className="p-4 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-lg">
                  {isRwanda ? (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">MTN / Airtel Mobile Money (Rwanda)</div>
                      <div className="text-lg font-bold text-orange-500">+250793392762</div>
                      <div className="text-xs text-gray-400 mt-1">Registered name: <strong className="text-gray-900 dark:text-white">IRUMVA Jason</strong></div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">MTN / Airtel Mobile Money (Uganda)</div>
                      <div className="text-lg font-bold text-orange-500">+256771204748</div>
                      <div className="text-xs text-gray-400 mt-1">Registered name: <strong className="text-gray-900 dark:text-white">Rukundo Deborah</strong></div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Submit Payment Proof (Image, PDF, Document, etc.)
                  </label>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 transition-colors p-4 rounded-xl cursor-pointer text-center bg-gray-50 dark:bg-[#101010]">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {loadingUpload ? "Uploading..." : proofFile ? "File Selected & Ready" : "Choose File to Upload"}
                      </span>
                      <input
                        type="file"
                        onChange={handleUploadFile}
                        className="hidden"
                        disabled={loadingUpload}
                      />
                    </label>
                  </div>
                  
                  {proofFile && (
                    <div className="mt-2 text-xs text-green-500 font-medium">
                      ✓ Proof file uploaded successfully! Ready to submit.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                <button
                  type="button"
                  onClick={handleSubmitProof}
                  disabled={loadingSubmitProof || loadingUpload || !proofFile}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {loadingSubmitProof ? "Submitting..." : "Submit Proof"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-850 dark:hover:bg-gray-750 text-gray-800 dark:text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </Modal>

            {/* Admin Deliver Button */}
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 mt-6 transition-all active:scale-[0.98]"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
