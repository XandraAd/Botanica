import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const DecorSpace = ({ collection }) => {
  if (!collection) {
    return (
      <div className="group w-full max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Loading collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={collection.image || "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500"}
          alt={collection.name || "Decor inspiration"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          {collection.product?._id ? (
            <Link
              to={`/product/${collection.product._id}`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
            >
              <FiShoppingBag className="text-lg" />
              <span>Quick Shop</span>
            </Link>
          ) : (
            <span className="text-white bg-gray-500 px-3 py-1 rounded opacity-70">No Product</span>
          )}
        </div>
      </div>

      <div className="p-3 text-center bg-white">
        <h3 className="text-gray-800 font-semibold">
          {collection.name || "Decor Idea"}
        </h3>
      </div>
    </div>
  );
};

export default DecorSpace;

