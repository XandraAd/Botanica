import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const CollectionCard = ({ collection }) => {
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
    <Link
      to={`/collections/${collection._id}`}
      className="group w-full max-w-md mx-auto bg-inherit rounded-xl overflow-hidden  hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={
            collection.image ||
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500"
          }
          alt={collection.name || "Collection image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-11"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500";
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-1">
            {collection.name || "Untitled Collection"}
          </h3>
          <p className="text-sm">
            {collection.productsCount ?? 0}{" "}
            {(collection.productsCount ?? 0) === 1 ? "plant" : "plants"}
          </p>
        </div>

        {/* Arrow button */}
        <div className="absolute top-4 right-4 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-100">
          <button className="bg-white rounded-full p-3 shadow-md hover:bg-green-50 transition-colors">
            <FiArrowUpRight className="text-gray-800 text-lg" />
          </button>
        </div>

        {/* View collection text that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-medium bg-black/70 px-4 py-2 rounded-full transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
            View Collection
          </span>
        </div>
      </div>

      {/* Collection Info - Visible without hover */}
      <div className="p-5">
        <h3 className="font-semibold text-lg sm:text-xl truncate mb-1">
          {collection.name || "Untitled Collection"}
        </h3>
        <p className="text-gray-600 text-base">
          {collection.productsCount ?? 0}{" "}
          {(collection.productsCount ?? 0) === 1 ? "plant" : "plants"}
        </p>
      </div>
    </Link>
  );
};

export default CollectionCard;