import React, { useState, useEffect } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery,useDeliverOrderMutation } from "../../slices/orderSlice";
import { toast } from "react-toastify";


const OrderList = () => {
  const { data: orders, isLoading, error ,refetch} = useGetOrdersQuery();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

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

  // Handle marking as delivered
  const markAsDelivered = async (id) => {
    if (window.confirm("Mark this order as delivered?")) {
      try {
        await deliverOrder(id).unwrap();
        toast.success("Order marked as delivered");
        refetch(); // Refresh order list
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
         
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Order Management</h1>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} total
              </div>
            </div>
            
            {/* Filters and Search */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter & Search</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by ID, user, or amount..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Orders</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="delivered">Delivered</option>
                    <option value="undelivered">Not Delivered</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-5xl mb-4 text-gray-300">📦</div>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">No orders found</h2>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters to find what you're looking for." 
                    : "There are no orders in the system yet."}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">ITEMS</th>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">ID</th>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">USER</th>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">DATE</th>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">TOTAL</th>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">PAID</th>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">DELIVERED</th>
                          <th className="text-left p-4 font-medium text-gray-500 uppercase tracking-wider text-xs">ACTIONS</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {currentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              {order.orderItems && order.orderItems.length > 0 ? (
                                <div className="flex items-center">
                                  <img
                                    src={order.orderItems[0].image}
                                    alt={order._id}
                                    className="w-10 h-10 object-cover rounded-md"
                                  />
                                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">No items</span>
                              )}
                            </td>
                            <td className="p-4 font-mono text-sm text-gray-600">#{order._id.substring(0, 8)}</td>
                            <td className="p-4">
                              {order.user ? (
                                <div>
                                  <div className="font-medium text-gray-900">{order.user.username}</div>
                                  {order.user.email && (
                                    <div className="text-xs text-gray-500">{order.user.email}</div>
                                  )}
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="p-4">
                              <div className="text-sm text-gray-900">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                              </div>
                            </td>
                            <td className="p-4 font-medium text-gray-900">${order.totalPrice.toFixed(2)}</td>
                            <td className="p-4">
                              {order.isPaid ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx={4} cy={4} r={3} />
                                  </svg>
                                  Paid
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx={4} cy={4} r={3} />
                                  </svg>
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              {order.isDelivered ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx={4} cy={4} r={3} />
                                  </svg>
                                  Delivered
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx={4} cy={4} r={3} />
                                  </svg>
                                  Pending
                                </span>
                              )}
                            </td>
                          <td className="p-4 flex gap-2">
  {/* Details Button */}
  <Link to={`/orders/${order._id}`}>
    <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors flex items-center">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Details
    </button>
  </Link>

  {/* Mark Delivered Button (only if not delivered) */}
  {!order.isDelivered && (
    <button
      onClick={() => markAsDelivered(order._id)}
      disabled={loadingDeliver}
      className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
    >
      {loadingDeliver ? "..." : "Mark Delivered"}
    </button>
  )}
</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of <span className="font-medium">{filteredOrders.length}</span> orders
                    </div>
                    
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
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
                              className={`w-10 h-10 rounded-lg border flex items-center justify-center ${currentPage === number ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-100'}`}
                            >
                              {number}
                            </button>
                          );
                        } else if (number === currentPage - 2 || number === currentPage + 2) {
                          return <span key={number} className="px-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2.5 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;