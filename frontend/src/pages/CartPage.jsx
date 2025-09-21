// frontend/src/pages/CartPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartItemQuantityApi,
  removeFromCartApi,
} from "../slices/cartSlice";
import { Link } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);

    if (userInfo) {
      dispatch(
        updateCartItemQuantityApi({
          userId: userInfo._id,
          _id: item._id,
          size: item.size,
          quantity: newQty,
        })
      );
    }
  };

  const handleRemove = (item) => {
    if (userInfo) {
      dispatch(
        removeFromCartApi({
          userId: userInfo._id,
          _id: item._id,
          size: item.size,
        })
      );
    }
  };

  const handleClearCart = () => {
    if (userInfo) {
      cartItems.forEach((item) =>
        dispatch(
          removeFromCartApi({
            userId: userInfo._id,
            _id: item._id,
            size: item.size,
          })
        )
      );
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/fallback-image.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (!cartItems.length)
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Cart items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={`${item._id}-${item.size}`}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={getImageUrl(item.images?.[0] || item.image)}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-sm text-gray-500">${item.price}</p>
                {item.size && (
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                )}

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item, -1)}
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item, 1)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-sm text-red-500 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <button
            onClick={handleClearCart}
            className="text-red-600 text-sm underline mt-4"
          >
            Clear Cart
          </button>
        </div>

        {/* RIGHT: Summary */}
        <div className="border p-6 rounded-lg bg-gray-50 space-y-4">
          <h2 className="text-xl font-bold mb-4">Cart totals</h2>
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>

          {subtotal > 50 ? (
            <p className="text-green-600 text-sm">
              🎉 Congratulations! You have free shipping!
            </p>
          ) : (
            <p className="text-gray-600 text-sm">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping.
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Coupon code"
              className="flex-1 border rounded px-3 py-2"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Apply coupon
            </button>
          </div>

          <Link to="/checkout">
            <button className="w-full bg-green-600 text-white py-3 rounded mt-6 hover:bg-green-700">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
