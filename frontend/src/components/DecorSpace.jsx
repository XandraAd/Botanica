import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const DecorSpace = ({ collection }) => {
  if (!collection) return null;

  const { name, image, product } = collection;

  return (
    <div className="group w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay with Quick Shop */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          {product?._id && (
            <Link
              to={`/product/${product._id}`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
            >
              <FiShoppingBag className="text-lg" />
              <span>Quick Shop</span>
            </Link>
          )}
        </div>
      </div>

      {/* Decor name + product details */}
      <div className="p-3 text-center bg-white">
        <h3 className="text-gray-800 font-semibold">{name}</h3>
        {product && (
          <p className="text-sm text-gray-500">
            {product.name} – ${product.price}
          </p>
        )}
      </div>
    </div>
  );
};

export default DecorSpace;
