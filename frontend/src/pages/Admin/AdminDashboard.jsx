// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import OrderList from "./OrderList";
import { getCurrentUser } from "../../slices/authSlice";
import { useGetUsersQuery } from "../../slices/UsersSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
} from "../../slices/orderSlice";

// Dashboard cards
const DashboardCards = ({
  isLoading,
  sales,
  salesError,
  customers,
  customersError,
  orders,
  ordersError,
}) => {
  const realCustomers = Array.isArray(customers)
    ? customers.filter((user) => !user.isAdmin)
    : customers?.users?.filter((user) => !user.isAdmin) || [];

  return (
    <div className="flex flex-wrap gap-6 justify-start mt-6">
      {/* Sales Card */}
      <div className="flex-1 min-w-[16rem] bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-pink-200 rounded-full mb-4 text-pink-700 text-xl">
          $
        </div>
        <p className="text-gray-600 font-medium">Sales</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          {isLoading ? <Loader /> : salesError ? "Error" : sales?.totalSales ?? 0}
        </h2>
        {salesError && <p className="text-red-400 text-sm mt-1">Failed to load</p>}
      </div>

      {/* Customers Card */}
      <div className="flex-1 min-w-[16rem] bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full mb-4 text-blue-700 text-xl">
          👥
        </div>
        <p className="text-gray-600 font-medium">Customers</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          {isLoading ? <Loader /> : customersError ? "Error" : realCustomers.length}
        </h2>
        <div className="text-sm text-gray-500 mt-1">
          {customers?.length > 0 && `${customers.length} total users`}
        </div>
        {customersError && <p className="text-red-400 text-sm mt-1">Failed to load</p>}
      </div>

      {/* Orders Card */}
      <div className="flex-1 min-w-[16rem] bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-full mb-4 text-green-700 text-xl">
          🛒
        </div>
        <p className="text-gray-600 font-medium">Orders</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          {isLoading ? <Loader /> : ordersError ? "Error" : orders?.totalOrders ?? 0}
        </h2>
        {ordersError && <p className="text-red-400 text-sm mt-1">Failed to load</p>}
      </div>
    </div>
  );
};

// Sales Chart
const SalesChart = ({ isLoading, salesDetailError, chartState }) => (
  <div className="mt-10 bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
    {isLoading ? (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <Loader />
        <p className="mt-2">Loading chart data...</p>
      </div>
    ) : salesDetailError ? (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Chart data not available</p>
      </div>
    ) : (
      <Chart options={chartState.options} series={chartState.series} type="line" height={350} />
    )}
  </div>
);

// Admin Dashboard
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Fetch current user if not already loaded
  useEffect(() => {
    if (!auth.userInfo) {
      dispatch(getCurrentUser());
    }
  }, [auth.userInfo, dispatch]);

  // Conditional fetching: only fetch if token exists
  const { data: sales, isLoading: salesLoading, error: salesError, refetch: refetchSales } =
    useGetTotalSalesQuery(undefined, { skip: !auth.userInfo });
  const { data: customers, isLoading: customersLoading, error: customersError, refetch: refetchCustomers } =
    useGetUsersQuery(undefined, { skip: !auth.userInfo });
  const { data: orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } =
    useGetTotalOrdersQuery(undefined, { skip: !auth.userInfo });
  const { data: salesDetail, isLoading: salesDetailLoading, error: salesDetailError, refetch: refetchSalesDetail } =
    useGetTotalSalesByDateQuery(undefined, { skip: !auth.userInfo });

  const [chartState, setChartState] = useState({
    options: {
      chart: { id: "sales-chart", type: "line", toolbar: { show: false }, zoom: { enabled: false } },
      colors: ["#f472b6"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      grid: {
        borderColor: "#e5e7eb",
        row: { colors: ["#f3f4f6", "transparent"], opacity: 0.5 },
      },
      xaxis: { categories: [], title: { text: "Date" }, labels: { style: { colors: "#6b7280", fontSize: "12px" } } },
      yaxis: {
        title: { text: "Sales ($)" },
        min: 0,
        labels: { formatter: (value) => "$" + value.toFixed(2) },
      },
      tooltip: { theme: "light", y: { formatter: (value) => "$" + value.toFixed(2) } },
    },
    series: [{ name: "Sales", data: [] }],
  });

  // Update chart when salesDetail changes
  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({ x: item._id, y: item.totalSales }));
      setChartState((prevState) => ({
        ...prevState,
        options: { ...prevState.options, xaxis: { ...prevState.options.xaxis, categories: formattedSalesDate.map((item) => item.x) } },
        series: [{ name: "Sales", data: formattedSalesDate.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  const isLoading = salesLoading || customersLoading || ordersLoading || salesDetailLoading;
  const hasError = salesError || customersError || ordersError || salesDetailError;

  const refetchAll = () => {
    refetchSales();
    refetchCustomers();
    refetchOrders();
    refetchSalesDetail();
  };

  // Show loader if user info is not yet loaded
  if (!auth.userInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
        <p className="ml-4">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your store performance</p>
      </div>

      {hasError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">Data Loading Issues</h3>
              <p>Some data may not be loading correctly due to server errors.</p>
            </div>
            <button onClick={refetchAll} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors">
              Retry Loading Data
            </button>
          </div>
        </div>
      )}

      <DashboardCards
        isLoading={isLoading}
        sales={sales}
        salesError={salesError}
        customers={customers}
        customersError={customersError}
        orders={orders}
        ordersError={ordersError}
      />

      <SalesChart isLoading={salesDetailLoading} salesDetailError={salesDetailError} chartState={chartState} />

      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <OrderList />
      </div>
    </div>
  );
};

export default AdminDashboard;
