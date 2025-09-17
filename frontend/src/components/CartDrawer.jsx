import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCartApi,
  updateCartItemQuantityApi,
} from "../slices/cartSlice";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router";

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
const userInfo = useSelector((state) => state.auth.userInfo);


  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );


    // Function to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/fallback-image.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-4">
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div className="h-2 bg-green-600 rounded-full w-full"></div>
          </div>
          <p className="text-sm text-green-700 font-medium">
            Congratulations! You have got free shipping!
          </p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                {/* Image + Info */}
                <div className="flex items-center space-x-3">
                  <img
                      src={getImageUrl(item.images?.[0] || item.image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500 text-sm">${item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartItemQuantityApi({
                          userId: userInfo._id,
                          _id: item._id,
                          size: item.size,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    className={`px-2 border rounded ${
                      item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      dispatch(
                        updateCartItemQuantityApi({
                          userId: userInfo._id,
                          _id: item._id,
                          size: item.size,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() =>
                    dispatch(
                      removeFromCartApi({
                        userId: userInfo._id,
                        _id: item._id,
                        size: item.size,
                      })
                    )
                  }
                  className="text-red-500 text-sm ml-2"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </p>

          <div className="flex gap-2 mt-4">
            <Link
              to="/cart"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded text-center hover:bg-gray-100"
            >
              View cart
            </Link>
            <Link  to="/checkout"> <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Checkout
            </button></Link>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
