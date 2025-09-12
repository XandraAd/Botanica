// src/components/ProductCard.jsx
import React from "react";
import { FaHeart, FaRegEye } from "react-icons/fa";
import { IoMdShuffle } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductCard = ({ product, variant, onView }) => {
  const dispatch = useDispatch();

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const getImageUrl = (product) => {
    if (product.arrivalImage) return `http://localhost:5000${product.arrivalImage}`;
    if (product.collectionImage) return `http://localhost:5000${product.collectionImage}`;
    if (product.images?.length > 0) return `http://localhost:5000${product.images[0]}`;
    return "/fallback-image.jpg";
  };

  return (
    <div
      className={`group rounded-xl overflow-hidden transition-transform duration-300 relative
      ${variant === "newest" ? "hover:shadow-green-200 hover:scale-105" : ""}
      ${variant === "plants" ? "hover:shadow-lg hover:-translate-y-2" : ""}
      ${variant === "collections" ? "hover:border-green-400" : ""}`}
    >
      {/* Image wrapper with overlay */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Cart */}
          <button
            onClick={handleAddToCart}
            className="p-2 bg-green-600 rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100"
          >
            <FiShoppingBag size={18} className="text-white" />
          </button>

          {/* Wishlist */}
          <button className="p-2 bg-white rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200">
            <FaHeart size={18} className="text-gray-700" />
          </button>

          {/* Compare */}
          <button className="p-2 bg-white rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-300">
            <IoMdShuffle size={18} className="text-gray-700" />
          </button>

          {/* Details */}
          <button
            onClick={() => onView(product)}
            className="p-2 bg-white rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-400"
          >
            <FaRegEye size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div onClick={() => onView(product)} className="p-4 flex flex-col gap-2 cursor-pointer">
        <h3 className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.collection}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg">${product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
