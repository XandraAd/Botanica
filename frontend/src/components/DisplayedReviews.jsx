import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaArrowLeft, FaArrowRight, FaUser } from "react-icons/fa";

const DisplayedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const BACKEND_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BACKEND_URL}/api/products/reviews?limit=10`);
        
        // Handle both response structures
        const reviewsData = Array.isArray(data) ? data : data.reviews || [];
        
        if (isMounted) {
          setReviews(reviewsData);
          console.log("Fetched reviews:", reviewsData); // Debug log
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        if (isMounted) setReviews([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReviews();
    return () => { isMounted = false; };
  }, [BACKEND_URL]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, reviews.length]);

  const nextSlide = () => { 
    setCurrentIndex((prev) => (prev + 1) % reviews.length); 
    setIsAutoPlaying(false); 
  };
  
  const prevSlide = () => { 
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length); 
    setIsAutoPlaying(false); 
  };
  
  const goToSlide = (index) => { 
    setCurrentIndex(index); 
    setIsAutoPlaying(false); 
  };

  // Handle image loading errors
  const handleImageError = (imageType, reviewId, imageUrl) => {
    console.log(`Image error for ${imageType}:`, imageUrl);
    setImageErrors(prev => ({
      ...prev,
      [`${reviewId}-${imageType}`]: true
    }));
  };

  // Build correct image URL
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it starts with /uploads, prepend BACKEND_URL
    if (imagePath.startsWith('/uploads')) {
      return `${BACKEND_URL}${imagePath}`;
    }
    
    // If it's just a filename, assume it's in uploads
    return `${BACKEND_URL}/uploads/${imagePath.replace(/^\/+/, '')}`;
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        size={20}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
        fill={i < rating ? "currentColor" : "none"}
      />
    ));

  // Loading state
  if (loading) {
    return (
      <section className="w-full bg-green-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-green-700 rounded w-48 mx-auto mb-4"></div>
            <div className="h-64 bg-green-800 rounded-lg max-w-4xl mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error or empty state
  if (!reviews.length) {
    return (
      <section className="w-full bg-green-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-green-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
            <p className="text-green-200">
              No reviews available yet. Be the first to leave a review!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-green-900 py-16 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Discover why plant lovers trust us for their green companions
          </p>
        </div>

        <div className="relative group">
          {/* Navigation Arrows */}
          {reviews.length > 1 && (
            <>
              <button 
                onClick={prevSlide} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-110"
                aria-label="Previous review"
              >
                <FaArrowLeft className="text-green-900 text-lg" />
              </button>
              <button 
                onClick={nextSlide} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-110"
                aria-label="Next review"
              >
                <FaArrowRight className="text-green-900 text-lg" />
              </button>
            </>
          )}
          
          {/* Carousel */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => {
                const productImageUrl = buildImageUrl(review.productImage);
                const userAvatarUrl = buildImageUrl(review.userAvatar);
                const hasProductImageError = imageErrors[`${review._id}-product`];
                const hasAvatarError = imageErrors[`${review._id}-avatar`];

                return (
                  <div 
                    key={review._id || index} 
                    className="w-full flex-shrink-0 flex flex-col md:flex-row min-h-96"
                  >
                    {/* Product Image Section */}
                    <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                      {!hasProductImageError && productImageUrl ? (
                        <img
                          src={productImageUrl}
                          alt={review.productName || "Product Image"}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          onError={() => handleImageError('product', review._id, productImageUrl)}
                          onLoad={() => console.log("Product image loaded:", productImageUrl)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                          <div className="text-center">
                            <FaUser className="text-6xl text-green-600 mx-auto mb-2" />
                            <p className="text-green-800 font-medium">{review.productName || "Product Image"}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        {review.productName || "Beautiful Plant"}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        ⭐ {review.rating}/5
                      </div>
                    </div>

                    {/* Review Content Section */}
                    <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                      <div className="flex mb-4 justify-center md:justify-start">
                        {renderStars(review.rating || 5)}
                      </div>
                      
                      <blockquote className="text-gray-800 text-lg md:text-xl leading-relaxed mb-6 text-center md:text-left italic">
                        "{review.comment || "Excellent product and service!"}"
                      </blockquote>
                      
                      <div className="flex items-center justify-center md:justify-start space-x-4">
                        <div className="flex-shrink-0">
                          {!hasAvatarError && userAvatarUrl ? (
                            <img
                              src={userAvatarUrl}
                              alt={review.userName || "User Avatar"}
                              className="w-12 h-12 rounded-full object-cover border-2 border-green-400 shadow-md"
                              onError={() => handleImageError('avatar', review._id, userAvatarUrl)}
                              onLoad={() => console.log("Avatar loaded:", userAvatarUrl)}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white border-2 border-green-400 shadow-md">
                              <FaUser className="text-lg" />
                            </div>
                          )}
                        </div>
                        
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {review.userName || "Happy Plant Lover"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Verified Buyer • {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indicators */}
          {reviews.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? "bg-green-400 w-8 scale-110" 
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Debug info (remove in production) */}
        <div className="text-center mt-4 text-green-200 text-sm">
          Showing {Math.min(currentIndex + 1, reviews.length)} of {reviews.length} reviews
        </div>
      </div>
    </section>
  );
};

export default DisplayedReviews;