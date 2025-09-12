// src/components/ProductImageCard.js
import React from "react";

const ProductImageCard = ({ imgSrc, alt, imgHeight = "20rem", objectFit = "cover" }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 duration-300">
      <div
        className="w-full"
        style={{ height: imgHeight }}
      >
        <img
          src={
            imgSrc
              ? `http://localhost:5000${imgSrc}`
              : "/fallback-image.jpg"
          }
          alt={alt || "Product"}
          className={`w-full h-full object-${objectFit}`}
        />
      </div>
    </div>
  );
};

export default ProductImageCard;
