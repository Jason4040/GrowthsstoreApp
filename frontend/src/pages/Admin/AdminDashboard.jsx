import Chart from "react-apexcharts";
import { DollarSign, Users, ListOrdered, Activity } from "lucide-react";
import { useGetUsersQuery, useGetActiveUsersQuery, useDeleteAllCustomersMutation } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
  useDeleteAllOrdersMutation,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import { useCurrency } from "../../hooks/useCurrency";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading, refetch: refetchSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading, refetch: refetchUsers } = useGetUsersQuery();
  const { data: activeCustomers, isLoading: loadingActive } = useGetActiveUsersQuery(undefined, { pollingInterval: 30000 });
  const { data: orders, isLoading: loadingTwo, refetch: refetchOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail, refetch: refetchSalesDetail } = useGetTotalSalesByDateQuery();
  const { formatPrice } = useCurrency();

  const [deleteAllOrders] = useDeleteAllOrdersMutation();
  const [deleteAllCustomers] = useDeleteAllCustomersMutation();

  const [isResetOrdersModalOpen, setIsResetOrdersModalOpen] = useState(false);
  const [isResetCustomersModalOpen, setIsResetCustomersModalOpen] = useState(false);

  const handleConfirmResetOrders = async () => {
    try {
      await deleteAllOrders().unwrap();
      toast.success("All orders and total sales reset successfully!");
      setIsResetOrdersModalOpen(false);
      refetchSales();
      refetchOrders();
      refetchSalesDetail();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Reset failed");
    }
  };

  const handleConfirmResetCustomers = async () => {
    try {
      await deleteAllCustomers().unwrap();
      toast.success("All customer accounts deleted successfully!");
      setIsResetCustomersModalOpen(false);
      refetchUsers();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Reset failed");
    }
  };

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* <AdminMenu /> */}

      <section className="w-full">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-orange-500/50 transition-colors flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Total Sales</p>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10 mb-4">
                {isLoading ? <Loader /> : formatPrice(sales?.totalSales ? sales.totalSales.toFixed(2) : 0)}
              </h1>
            </div>
            <button
              onClick={() => setIsResetOrdersModalOpen(true)}
              className="relative z-10 w-full mt-2 py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Reset Sales & Orders
            </button>
          </div>

          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Customers</p>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10 mb-4">
                {loading ? <Loader /> : customers?.length}
              </h1>
            </div>
            <button
              onClick={() => setIsResetCustomersModalOpen(true)}
              className="relative z-10 w-full mt-2 py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Reset Customers
            </button>
          </div>

          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
                  <ListOrdered className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">All Orders</p>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10 mb-4">
                {loadingTwo ? <Loader /> : orders?.totalOrders}
              </h1>
            </div>
            <button
              onClick={() => setIsResetOrdersModalOpen(true)}
              className="relative z-10 w-full mt-2 py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Reset All Orders
            </button>
          </div>

          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Active Now</p>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10">
              {loadingActive ? <Loader /> : activeCustomers?.length}
            </h1>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-[#151515] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl mb-10 w-full overflow-hidden">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="100%"
            height={400}
          />
        </div>

        <div className="mt-10">
          <OrderList />
        </div>
      </section>

      <ConfirmModal
        isOpen={isResetOrdersModalOpen}
        onClose={() => setIsResetOrdersModalOpen(false)}
        onConfirm={handleConfirmResetOrders}
        title="Reset Total Sales & Orders"
        message="Are you sure you want to permanently delete ALL orders and sales history? This action cannot be undone."
      />

      <ConfirmModal
        isOpen={isResetCustomersModalOpen}
        onClose={() => setIsResetCustomersModalOpen(false)}
        onConfirm={handleConfirmResetCustomers}
        title="Reset All Customers"
        message="Are you sure you want to delete ALL non-admin customer accounts? Admin accounts will be preserved. This action cannot be undone."
      />
    </div>
  );
};

export default AdminDashboard;
