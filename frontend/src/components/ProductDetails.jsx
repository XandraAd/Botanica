// src/components/ProductDetailsModal.jsx
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCartApi } from "../slices/cartSlice";
//import { createReview } from "../slices/reviewSlice"; // ✅ IMPORT
import { BASE_URL } from "../store/constants";
import { useCreateReviewMutation } from "../slices/productSlice";


const ProductDetailsModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  if (!product) return null;

  const getImageUrl = (product) => {
    if (product.arrivalImage) return `${BASE_URL}${product.arrivalImage}`;
    if (product.collectionImage) return `${BASE_URL}${product.collectionImage}`;
    if (product.images?.length > 0) return `${BASE_URL}${product.images[0]}`;
    return "/fallback-image.jpg";
  };

  const handleAddToCart = () => {
    if (!userInfo?._id) {
      alert("Please log in to add items to your cart");
      return;
    }

    const item = {
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      color: selectedColor,
      size: product.size || "standard",
      quantity,
    };

    dispatch(addToCartApi({ userId: userInfo._id, item }))
      .unwrap()
      .then(() => {
        alert("Added to cart!");
        onClose();
      })
      .catch((err) => {
        console.error("Cart API error:", err);
        alert("Failed to add to cart. Please try again.");
      });
  };


const handleSubmitReview = async (e) => {
  e.preventDefault();
  try {
    await createReview({
      productId: product._id,
      rating,
      comment,
    }).unwrap();

    alert("Review submitted!");
    setRating("");
    setComment("");
  } catch (err) {
    alert(err?.data?.message || err.error || "Failed to submit review");
  }
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
        <div className="p-6 flex flex-col overflow-y-auto max-h-[80vh]">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-green-600 font-semibold mb-1">In stock</p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-green-700">
                ${product.price}
              </span>
            </div>

            {/* ✅ Color Selection */}
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

            {/* Reviews Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="text-sm font-medium">{review.name}</p>
                      <div className="flex text-yellow-500 text-xs mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet</p>
              )}
            </div>

            {/* Review Form (if logged in) */}
            {userInfo?._id && (
              <form onSubmit={handleSubmitReview} className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold">Write a Review</h3>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Write your review..."
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3 mt-6">
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
