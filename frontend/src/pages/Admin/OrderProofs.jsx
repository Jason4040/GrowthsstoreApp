import { useState } from "react";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import {
  useGetOrdersQuery,
  useApprovePaymentProofMutation,
  useRejectPaymentProofMutation,
} from "../../redux/api/orderApiSlice";
import { useGetProductByIdQuery } from "../../redux/api/productApiSlice";
import { toast } from "react-toastify";

const ProductImagePreviewer = ({ productId }) => {
  const { data: product, isLoading } = useGetProductByIdQuery(productId);

  if (isLoading) return <p className="text-xs text-gray-500 animate-pulse">Loading product images...</p>;
  if (!product) return null;

  const allImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="mt-3 bg-gray-50 dark:bg-black/30 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
        Product Images ({allImages.length})
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allImages.map((img, idx) => (
          <a
            href={img}
            target="_blank"
            rel="noopener noreferrer"
            key={idx}
            className="shrink-0"
          >
            <img
              src={img}
              alt={`preview-${idx}`}
              className="w-14 h-14 object-cover rounded-lg border border-gray-300 dark:border-gray-700 hover:border-orange-500 transition-colors"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

const OrderProofs = () => {
  const { data: orders = [], isLoading, error, refetch } = useGetOrdersQuery();
  const [approvePaymentProof, { isLoading: loadingApprove }] = useApprovePaymentProofMutation();
  const [rejectPaymentProof, { isLoading: loadingReject }] = useRejectPaymentProofMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter orders that have payment proof uploaded
  const proofOrders = orders.filter((o) => o.paymentProof && o.paymentProofStatus !== "none");

  const handleReview = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApprove = async (orderId) => {
    try {
      await approvePaymentProof(orderId).unwrap();
      toast.success("Payment proof approved! Order is marked as paid.");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Approval failed");
    }
  };

  const handleReject = async (orderId) => {
    try {
      await rejectPaymentProof(orderId).unwrap();
      toast.warn("Payment proof rejected.");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Rejection failed");
    }
  };

  const getCurrencySymbol = (currency) => {
    if (currency === "UGX") return "USh ";
    if (currency === "RWF") return "FRw ";
    return "$";
  };

  // Helper to determine file type for rendering
  const isImageFile = (url) => {
    return /\.(jpe?g|png|webp|gif)(?:\?|$)/i.test(url) || url.includes("res.cloudinary.com") && !url.includes("/video/upload/");
  };

  const isVideoFile = (url) => {
    return /\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(url) || url.includes("/video/upload/");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Payment Proofs</h1>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : proofOrders.length === 0 ? (
        <div className="bg-gray-100 dark:bg-[#151515] p-10 text-center rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 font-medium">No order payment proofs submitted yet.</p>
        </div>
      ) : (
        <>
        {/* Desktop Table View (hidden on small screens) */}
        <div className="hidden md:block w-full overflow-x-auto bg-gray-100 dark:bg-[#151515] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">PROOF</th>
                <th className="px-6 py-4 font-semibold">ORDER ID</th>
                <th className="px-6 py-4 font-semibold">CUSTOMER</th>
                <th className="px-6 py-4 font-semibold">DATE SUBMITTED</th>
                <th className="px-6 py-4 font-semibold">AMOUNT DUE</th>
                <th className="px-6 py-4 font-semibold">PROOF STATUS</th>
                <th className="px-6 py-4 font-semibold text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {proofOrders.map((order) => {
                const sym = getCurrencySymbol(order.currency || "USD");
                return (
                  <tr key={order._id} className="hover:bg-white dark:hover:bg-gray-50 dark:bg-[#1A1A1A]/50 transition-colors">
                    <td className="px-6 py-4">
                      {isImageFile(order.paymentProof) ? (
                        <img
                          src={order.paymentProof}
                          alt="proof thumb"
                          className="w-12 h-12 object-cover rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer hover:border-orange-500"
                          onClick={() => handleReview(order)}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-350 dark:border-gray-750 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 cursor-pointer hover:border-orange-500"
                          onClick={() => handleReview(order)}
                        >
                          FILE
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {order.user ? order.user.username : "Guest"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-orange-500">
                      {sym}{order.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      {order.paymentProofStatus === "approved" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          Approved
                        </span>
                      ) : order.paymentProofStatus === "rejected" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          Rejected
                        </span>
                      ) : order.paymentProofStatus === "appealed" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20 animate-pulse">
                          Appealed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleReview(order)}
                        className="bg-gray-850 hover:bg-gray-750 text-gray-900 dark:text-white px-4 py-2 rounded-xl transition-all border border-gray-300 dark:border-gray-700 hover:border-gray-500 text-sm font-medium"
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List (visible on small screens) */}
        <div className="block md:hidden space-y-4">
          {proofOrders.map((order) => {
            const sym = getCurrencySymbol(order.currency || "USD");
            return (
              <div key={order._id} className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {isImageFile(order.paymentProof) ? (
                      <img
                        src={order.paymentProof}
                        alt="proof thumb"
                        className="w-12 h-12 object-cover rounded-xl border border-gray-300 dark:border-gray-700 cursor-pointer"
                        onClick={() => handleReview(order)}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleReview(order)}
                      >
                        FILE
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {order.user ? order.user.username : "Guest"}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                        #{order._id.substring(0, 10)}...
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {order.paymentProofStatus === "approved" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Approved
                      </span>
                    ) : order.paymentProofStatus === "rejected" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        Rejected
                      </span>
                    ) : order.paymentProofStatus === "appealed" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20 animate-pulse">
                        Appealed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-800 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Amount Due</span>
                    <span className="font-bold text-orange-500 text-sm">{sym}{order.totalPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase text-right">Submitted</span>
                    <span className="text-gray-700 dark:text-gray-300 text-[11px]">
                      {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleReview(order)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
                >
                  Evaluate Proof
                </button>
              </div>
            );
          })}
        </div>
        </>
      )}

      {/* Evaluate Modal */}
      {selectedOrder && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">
            Evaluate Payment Proof
          </h2>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-sm text-gray-700 dark:text-gray-300">
            {selectedOrder.paymentProofStatus === "appealed" && selectedOrder.paymentAppealText && (
              <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-xl">
                <span className="font-semibold block mb-1">Customer Rejection Appeal</span>
                <p className="text-xs font-mono bg-white dark:bg-black/30 p-2 rounded mt-1 border border-orange-900/30">
                  {selectedOrder.paymentAppealText}
                </p>
              </div>
            )}

            {/* Customer & Order details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-500 block">Customer</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrder.user?.username || "Guest"}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Total Due</span>
                <span className="font-semibold text-orange-500">
                  {getCurrencySymbol(selectedOrder.currency)}{selectedOrder.totalPrice}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-500 block">Order ID</span>
                <span className="font-mono text-xs text-gray-900 dark:text-white">{selectedOrder._id}</span>
              </div>
            </div>

            {/* Paid Product Details */}
            <div className="space-y-3">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Items Purchased
              </span>
              {selectedOrder.orderItems.map((item, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-xl p-3 bg-white dark:bg-[#1A1A1A]">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Qty: {item.qty} × {getCurrencySymbol(selectedOrder.currency)}{item.price}
                      </div>
                    </div>
                  </div>

                  {/* Render Product attached images */}
                  <ProductImagePreviewer productId={item.product} />
                </div>
              ))}
            </div>

            {/* Payment Proof File Previews */}
            <div className="space-y-2 border-t border-gray-200 dark:border-gray-800 pt-4">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Submitted Proof File
              </span>

              {isImageFile(selectedOrder.paymentProof) ? (
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <a href={selectedOrder.paymentProof} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedOrder.paymentProof}
                      alt="payment proof"
                      className="w-full max-h-[300px] object-contain bg-white dark:bg-black"
                    />
                  </a>
                  <div className="text-center p-2 bg-gray-50 dark:bg-black/30 text-xs border-t border-gray-200 dark:border-gray-800">
                    <a
                      href={selectedOrder.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-orange-500 font-medium"
                    >
                      Open full resolution image in new tab
                    </a>
                  </div>
                </div>
              ) : isVideoFile(selectedOrder.paymentProof) ? (
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                  <video src={selectedOrder.paymentProof} controls className="w-full max-h-[300px]" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-black/10">
                  <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-500 mb-3">Submitted document/proof file</p>
                  <a
                    href={selectedOrder.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg text-xs transition-colors"
                  >
                    View / Download File
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex gap-3 mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
            {selectedOrder.paymentProofStatus === "pending" || selectedOrder.paymentProofStatus === "appealed" ? (
              <>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedOrder._id)}
                  disabled={loadingApprove || loadingReject}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {loadingApprove ? "Approving..." : "Approve Payment"}
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(selectedOrder._id)}
                  disabled={loadingApprove || loadingReject}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {loadingReject ? "Rejecting..." : "Reject Payment"}
                </button>
              </>
            ) : (
              <div className="flex-1 text-center py-2 text-sm font-semibold text-gray-500">
                This proof has already been processed (status: {selectedOrder.paymentProofStatus}).
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderProofs;
