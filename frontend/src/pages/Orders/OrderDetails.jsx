// frontend/src/screens/Orders/UserOrders.jsx
import React from "react";
import { Link } from "react-router-dom";

const OrderDetails = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-gray-600">You have no orders yet.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Order #{order._id}</p>
              <p className="text-sm text-gray-600">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </p>
              <p className="text-sm text-gray-600">
                Total: ${order.totalPrice?.toFixed(2)}
              </p>
              <p
                className={`text-sm font-medium ${
                  order.isPaid ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.isPaid ? "Paid" : "Not Paid"}
              </p>
            </div>
            <Link
              to={`/orders/${order._id}`}
              className="text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
