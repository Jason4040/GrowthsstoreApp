import { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useDeleteOrderMutation } from "../../redux/api/orderApiSlice";
import { useCurrency } from "../../hooks/useCurrency";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const { formatPrice } = useCurrency();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteOrder(orderToDelete).unwrap();
      toast.success("Order deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* <AdminMenu /> */}
          <div className="w-full overflow-x-auto bg-gray-100 dark:bg-[#151515] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">ITEMS</th>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">USER</th>
                  <th className="px-6 py-4 font-semibold">DATE</th>
                  <th className="px-6 py-4 font-semibold">TOTAL</th>
                  <th className="px-6 py-4 font-semibold">PAID</th>
                  <th className="px-6 py-4 font-semibold">DELIVERED</th>
                  <th className="px-6 py-4 font-semibold text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white dark:bg-[#1A1A1A]/50 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{order._id}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{order.user ? order.user.username : "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-orange-500 font-semibold">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/order/${order._id}`}>
                          <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors border border-gray-700 hover:border-gray-600 text-xs font-medium">
                            Details
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message="Are you sure you want to permanently delete this order? This action cannot be undone."
      />
    </div>
  );
};

export default OrderList;
