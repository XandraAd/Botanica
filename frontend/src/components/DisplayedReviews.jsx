import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaArrowLeft, FaArrowRight, FaUser } from "react-icons/fa";

const DisplayedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get("/api/products/reviews?limit=10");
        const reviewsData = Array.isArray(data) ? data : data.reviews || data.data || [];
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, reviews]);

  const nextSlide = () => { setCurrentIndex((prev) => (prev + 1) % reviews.length); setIsAutoPlaying(false); };
  const prevSlide = () => { setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length); setIsAutoPlaying(false); };
  const goToSlide = (index) => { setCurrentIndex(index); setIsAutoPlaying(false); };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        size={20}
        fill={i < rating ? "#fbbf24" : "none"}
        stroke={i < rating ? "#fbbf24" : "#d1d5db"}
        className="inline-block"
      />
    ));

  const getProductImage = (review) => {
    const img = review.productImage;
    if (!img) return "https://via.placeholder.com/400x300/4ade80/ffffff?text=Plant+Image";
    if (img.startsWith("http")) return img;
    return img.startsWith("/uploads") ? `${BACKEND_URL}${img}` : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  };

  const getUserAvatar = (review) => {
    // 1️⃣ Use review.userAvatar if available
    let avatar = review.userAvatar;

    // 2️⃣ Fallback to user's account avatar if review.userAvatar missing
    if (!avatar && review.user && review.user.avatar) {
      avatar = review.user.avatar;
    }

    // 3️⃣ Construct full URL if needed
    let avatarUrl = avatar ? (avatar.startsWith("http") ? avatar : `${BACKEND_URL}/${avatar.replace(/^\/+/, "")}`) : null;

    // 4️⃣ Render
    if (avatarUrl) {
      return <img src={avatarUrl} alt={getUserName(review)} className="w-12 h-12 rounded-full object-cover border-2 border-green-400" />;
    }

    // 5️⃣ Default placeholder
    return (
      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white border-2 border-green-400">
        <FaUser className="text-lg" />
      </div>
    );
  };

  const getUserName = (review) => review.userName || review.customerName || "Happy Plant Lover";
  const getProductName = (review) => review.productName || "Beautiful Plant";

  if (loading) return <div>Loading reviews...</div>;
  if (!reviews.length) return <div>No reviews yet.</div>;

  return (
    <section className="w-full bg-green-900 py-16 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Carousel */}
        <div className="relative">
          {reviews.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full z-20">
                <FaArrowLeft className="text-green-900" />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full z-20">
                <FaArrowRight className="text-green-900" />
              </button>
            </>
          )}
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={review._id || index} className="w-full flex-shrink-0 flex flex-col md:flex-row min-h-96">
                  {/* Product Image */}
                  <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                    <img
                      src={getProductImage(review)}
                      alt={getProductName(review)}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x300/4ade80/ffffff?text=Plant+Image"; }}
                    />
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      {getProductName(review)}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                      ⭐ {review.rating}/5
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="w-full md:w-3/5 p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                    <div className="flex mb-6 justify-center md:justify-start">{renderStars(review.rating || 5)}</div>
                    <blockquote className="text-gray-800 text-lg md:text-xl leading-relaxed mb-8 text-center md:text-left italic">
                      "{review.comment || "Excellent product and service!"}"
                    </blockquote>
                    <div className="flex items-center justify-center md:justify-start space-x-4">
                      {getUserAvatar(review)}
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 text-lg">{getUserName(review)}</h4>
                        <p className="text-sm text-gray-600">
                          Verified Buyer • {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          {reviews.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "bg-green-400 w-8 transform scale-110" : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplayedReviews;

