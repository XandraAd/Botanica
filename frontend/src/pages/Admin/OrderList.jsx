import React,{ useState, useEffect } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../slices/orderSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
 

  // Initialize filtered orders when orders data is available
  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  // Apply filters, search, and sorting
  useEffect(() => {
    if (!orders) return;

    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && order.user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.totalPrice.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "paid") {
        result = result.filter(order => order.isPaid);
      } else if (statusFilter === "unpaid") {
        result = result.filter(order => !order.isPaid);
      } else if (statusFilter === "delivered") {
        result = result.filter(order => order.isDelivered);
      } else if (statusFilter === "undelivered") {
        result = result.filter(order => !order.isDelivered);
      }
    }

    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.totalPrice - b.totalPrice);
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchTerm, statusFilter, sortBy]);

  // Get current orders for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-gray-50 min-h-screen flex">
   
      
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <input
              type="text"
              placeholder="Search by ID, user, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">All Orders</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="delivered">Delivered</option>
              <option value="undelivered">Not Delivered</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters to find what you're looking for." 
              : "There are no orders in the system yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 border-b">ITEMS</th>
                    <th className="text-left p-3 border-b">ID</th>
                    <th className="text-left p-3 border-b">USER</th>
                    <th className="text-left p-3 border-b">DATE</th>
                    <th className="text-left p-3 border-b">TOTAL</th>
                    <th className="text-left p-3 border-b">PAID</th>
                    <th className="text-left p-3 border-b">DELIVERED</th>
                    <th className="text-left p-3 border-b">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">
                        {order.orderItems && order.orderItems.length > 0 ? (
                          <img
                            src={order.orderItems[0].image}
                            alt={order._id}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">No items</span>
                        )}
                      </td>
                      <td className="p-3 border-b font-mono text-sm">{order._id.substring(0, 8)}...</td>
                      <td className="p-3 border-b">
                        {order.user ? order.user.username : "N/A"}
                      </td>
                      <td className="p-3 border-b">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-3 border-b font-medium">${order.totalPrice}</td>
                      <td className="p-3 border-b">
                        {order.isPaid ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 border-b">
                        {order.isDelivered ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Delivered
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 border-b">
                        <Link to={`/order/${order._id}`}>
                          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors">
                            Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &laquo;
                </button>
                
                {pageNumbers.map(number => {
                  // Show limited page numbers with ellipsis
                  if (
                    number === 1 || 
                    number === totalPages || 
                    (number >= currentPage - 1 && number <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded border ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
                      >
                        {number}
                      </button>
                    );
                  } else if (number === currentPage - 2 || number === currentPage + 2) {
                    return <span key={number} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}

          {/* Results summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;