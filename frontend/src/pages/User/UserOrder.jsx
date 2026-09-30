import { Link } from "react-router-dom";
import { Frown } from "lucide-react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import SEO from "../../components/SEO";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <>
      <SEO title="My Orders | GrowthsStore" description="View your order history." noindex />
      <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-8 max-w-[1400px]">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">
          My Order History
        </h1>
        <div className="text-sm font-medium text-gray-500 uppercase tracking-widest bg-gray-900/50 px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-none">
          Total Orders: {orders?.length || 0}
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none">
          <Frown size={80} className="text-gray-700 mb-6" />
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">No Orders Found</h2>
          <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-10 rounded-none transition-all transform hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-600/10 border-b border-gray-200 dark:border-gray-800">
                <th className="p-6 text-sm font-semibold text-orange-500 uppercase tracking-widest">Image</th>
                <th className="p-6 text-sm font-semibold text-orange-500 uppercase tracking-widest">Order ID</th>
                <th className="p-6 text-sm font-semibold text-orange-500 uppercase tracking-widest">Date Placed</th>
                <th className="p-6 text-sm font-semibold text-orange-500 uppercase tracking-widest">Total Amount</th>
                <th className="p-6 text-sm font-semibold text-orange-500 uppercase tracking-widest text-center">Payment</th>
                <th className="p-6 text-sm font-semibold text-orange-500 uppercase tracking-widest text-center">Delivery</th>
                <th className="p-6 text-sm font-semibold text-orange-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      loading="lazy"
                      className="w-20 h-20 object-cover border border-gray-200 dark:border-gray-800 rounded-none group-hover:border-orange-500/50 transition-colors"
                    />
                  </td>

                  <td className="p-6 font-mono text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-gray-200">#</span>{order._id}
                  </td>

                  <td className="p-6 text-gray-700 dark:text-gray-300 font-medium">
                    {order.createdAt.substring(0, 10)}
                  </td>

                  <td className="p-6 font-semibold text-gray-900 dark:text-white text-lg">
                    $ {order.totalPrice.toLocaleString()}
                  </td>

                  <td className="p-6 text-center">
                    {order.isPaid ? (
                      <span className="inline-block w-24 px-3 py-1.5 bg-green-900/30 text-green-500 text-[10px] font-semibold uppercase tracking-tighter border border-green-500/30 rounded-none">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-block w-24 px-3 py-1.5 bg-red-900/30 text-red-500 text-[10px] font-semibold uppercase tracking-tighter border border-red-500/30 rounded-none">
                        Unpaid
                      </span>
                    )}
                  </td>

                  <td className="p-6 text-center">
                    {order.isDelivered ? (
                      <span className="inline-block w-24 px-3 py-1.5 bg-green-900/30 text-green-500 text-[10px] font-semibold uppercase tracking-tighter border border-green-500/30 rounded-none">
                        Shipped
                      </span>
                    ) : (
                      <span className="inline-block w-24 px-3 py-1.5 bg-orange-900/30 text-orange-500 text-[10px] font-semibold uppercase tracking-tighter border border-orange-500/30 rounded-none">
                        Processing
                      </span>
                    )}
                  </td>

                  <td className="p-6 text-right">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-none transition-all text-xs uppercase tracking-widest active:scale-95">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default UserOrder;
