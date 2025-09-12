// src/components/ProductDetailsModal.jsx
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductDetailsModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  if (!product) return null;

  const getImageUrl = (product) => {
    if (product.arrivalImage) return `http://localhost:5000${product.arrivalImage}`;
    if (product.collectionImage) return `http://localhost:5000${product.collectionImage}`;
    if (product.images?.length > 0) return `http://localhost:5000${product.images[0]}`;
    return "/fallback-image.jpg";
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity, color: selectedColor }));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl overflow-hidden relative grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 shadow"
        >
          <FaTimes size={20} />
        </button>

        {/* LEFT: Product image */}
        <div className="relative h-72 md:h-auto flex items-center justify-center bg-gray-50">
          <img
            src={getImageUrl(product)}
            alt={product.name}
            className="max-h-[500px] w-full object-contain"
          />
        </div>

        {/* RIGHT: Details */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-green-600 font-semibold mb-1">In stock</p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-green-700">
                ${product.price}
              </span>
            </div>

            {/* ✅ Dynamic Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">
                  Color: <span className="capitalize">{selectedColor}</span>
                </p>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-green-600 ring-2 ring-green-200"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="text-sm font-medium mr-4">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700"
            >
              Add to cart – ${(product.price * quantity).toFixed(2)}
            </button>
            <button className="w-full border-2 border-green-600 text-green-600 py-3 rounded-md font-medium hover:bg-green-50">
              BUY IT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;

