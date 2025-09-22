import React, { useState } from "react";

import { toast } from "react-toastify";
import { useCreateReviewMutation } from "../../slices/productSlice";

const ProductReviewForm = ({ productId, userInfo, onReviewAdded }) => {
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return toast.error("Please write a comment");

    try {
      await createReview({ productId, userId: userInfo._id, rating, comment }).unwrap();
      toast.success("Review added!");
      setComment("");
      setRating(5);
      onReviewAdded?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center mb-2 gap-2">
        <label className="font-medium">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} ⭐</option>
          ))}
        </select>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="2"
        placeholder="Write your review..."
        className="w-full border rounded p-2 mb-2"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};


export default ProductReviewForm;
