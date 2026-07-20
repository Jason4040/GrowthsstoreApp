import Chart from "react-apexcharts";
import { useGetUsersQuery, useGetActiveUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: activeCustomers, isLoading: loadingActive } = useGetActiveUsersQuery(undefined, { pollingInterval: 30000 });
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

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
          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-orange-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                $
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Total Sales</p>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10">
              $ {isLoading ? <Loader /> : sales?.totalSales.toFixed(2)}
            </h1>
          </div>

          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Customers</p>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10">
              {loading ? <Loader /> : customers?.length}
            </h1>
          </div>

          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">All Orders</p>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>

          <div className="rounded-2xl bg-gray-100 dark:bg-[#151515] p-6 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
    </div>
  );
};

export default AdminDashboard;
