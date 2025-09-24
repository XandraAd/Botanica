import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaShoppingCart } from "react-icons/fa";
import { BASE_URL } from "../../store/constants";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [success, setSuccess] = useState(false);

  // On mount, decide where to load order from
  useEffect(() => {
    const { order: stateOrder, success: stateSuccess = false } =
      location.state || {};

    if (stateOrder) {
      // Case 1: came from checkout page directly
      setOrder(stateOrder);
      setSuccess(stateSuccess);
      localStorage.setItem("lastOrder", JSON.stringify(stateOrder));
      return;
    }

    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      // Case 2: refresh or direct visit after checkout
      setOrder(JSON.parse(savedOrder));
      setSuccess(true);
      return;
    }

    // Case 3: Paystack redirected back with ?reference=xxxx
    const params = new URLSearchParams(location.search);
    const ref = params.get("reference");
    if (ref) {
      fetch(`${BASE_URL}/api/orders/by-reference/${ref}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.order) {
            setOrder(data.order);
            setSuccess(true);
            localStorage.setItem("lastOrder", JSON.stringify(data.order));
          } else {
            setSuccess(false);
          }
        })
        .catch(() => setSuccess(false));
    }
  }, [location]);

  // Clear localStorage after showing
  useEffect(() => {
    if (order) {
      localStorage.removeItem("lastOrder");
    }
  }, [order]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/fallback-image.jpg"; // fallback image
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          {/* Status header */}
          <div className="text-center mb-6">
            {success ? (
              <>
                <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-green-600">
                  Order Confirmed!
                </h1>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-red-600">Order Issue</h1>
              </>
            )}
          </div>

          {/* Order summary */}
          {order && success && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h2 className="font-semibold mb-3 text-lg text-gray-700">
                  Order Summary
                </h2>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize">
                      {order.status || "Processing"}
                    </span>
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.totalPrice?.toFixed(2)}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentMethod}
                  </p>
                  {order.paidAt && (
                    <p className="col-span-2">
                      <strong>Paid At:</strong>{" "}
                      {new Date(order.paidAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Ordered items */}
              {order.orderItems?.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-lg text-gray-700">
                    Items Ordered
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <li key={index} className="flex items-center py-3 gap-3">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-14 h-14 rounded-md object-cover border"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.qty} × ${item.price}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-700">
                          ${(item.qty * item.price).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Continue Shopping
            </button>

            {order ? (
              <button
                onClick={() =>
                  navigate(`/orders/${order._id}`, {
                    state: { fromConfirmation: true },
                  })
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                View Full Order
              </button>
            ) : (
              <button
                onClick={() => navigate("/orders")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Go to My Orders
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
