import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaShoppingCart } from 'react-icons/fa';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, message, success = false } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          {success ? (
            <>
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-4">Order Issue</h1>
            </>
          )}
          
          <p className="text-lg mb-6">{message}</p>
          
          {order && success && (
            <div className="text-left bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="font-semibold mb-3 text-center">Order Details</h2>
              <div className="space-y-2">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</p>
                <p><strong>Status:</strong> <span className="capitalize">{order.status || 'Processing'}</span></p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                {order.paidAt && (
                  <p><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}</p>
                )}
              </div>
              
              {order.orderItems && order.orderItems.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Items Ordered:</h3>
                  <ul className="space-y-1">
                    {order.orderItems.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.quantity} × {item.name} - ${(item.quantity * item.price).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Continue Shopping
            </button>
            
            {order && (
              <button 
                onClick={() => navigate(`/order/${order._id}`)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                View Order Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;