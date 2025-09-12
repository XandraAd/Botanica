import React, { useState, useEffect } from 'react';

import { FaStar, FaArrowLeft, FaArrowRight} from 'react-icons/fa';

const DisplayedReviews = () => {
  // Sample reviews data with product images
  const reviews = [
    {
      id: 1,
      rating: 5,
      text: "I've ordered from a lot of places, a lot! and I must say that this place here has the best shipping experience ever. Thank you guys so much for this 😊",
      author: "Vincent Palm",
      purchase: "Aglaonema Slam",
      productImage: "/assets/products/aglaonema-slam.jpg",
      authorImage: "/assets/customers/vincent.jpg"
    },
    {
      id: 2,
      rating: 5,
      text: "The plants arrived in perfect condition and were even more beautiful than in the photos. Will definitely order again!",
      author: "Sarah Johnson",
      purchase: "Monstera Deliciosa",
      productImage: "/assets/products/monstera.jpg",
      authorImage: "/assets/customers/sarah.jpg"
    },
    {
      id: 3,
      rating: 5,
      text: "Excellent customer service and the plants are thriving. The packaging was eco-friendly and secure.",
      author: "Michael Chen",
      purchase: "Snake Plant",
      productImage: "/assets/products/snake-plant.jpg",
      authorImage: "/assets/customers/michael.jpg"
    },
    {
      id: 4,
      rating: 5,
      text: "Absolutely love my new plants! They've transformed my living space completely.",
      author: "Emily Rodriguez",
      purchase: "Fiddle Leaf Fig",
      productImage: "/assets/products/fiddle-leaf.jpg",
      authorImage: "/assets/customers/emily.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, reviews.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar
        key={i}
        size={20}
        fill={i < rating ? "#fbbf24" : "none"}
        stroke={i < rating ? "#fbbf24" : "#d1d5db"}
        className="inline-block"
      />
    ));
  };

  return (
    <section className="w-[95%] bg-green-900 mx-auto mt-4 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mt-20 mb-8 ">
          <h2 className="pt-16 text-3xl md:text-4xl font-bold">
            OUR CUSTOMERS RARE REVIEWS
          </h2>
          <div className="w-20 h-1  mx-auto mb-6"></div>
          <p className="text-lg  max-w-2xl mx-auto">
            Discover what our beloved customers are saying about their plant shopping experience
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
         

          {/* Carousel Content */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 flex flex-col md:flex-row"
                >
                  {/* Product Image */}
                  <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <img
                      src={review.productImage}
                      alt={review.purchase}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      Purchased Item
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    {/* Star Rating */}
                    <div className="flex mb-4">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                      "{review.text}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4 overflow-hidden">
                        {review.authorImage ? (
                          <img
                            src={review.authorImage}
                            alt={review.author}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.parentElement.textContent = review.author.charAt(0);
                            }}
                          />
                        ) : (
                          review.author.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.author}</h4>
                        <p className="text-sm text-gray-600">
                          Purchased: <span className="text-green-700 font-medium">{review.purchase}</span>
                        </p>
                      </div>
                       {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-colors"
          >
            <FaArrowLeft size={24} className="text-green-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-colors"
          >
            <FaArrowRight size={24} className="text-green-700" />
          </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-green-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16  pt-12 border-t border-gray-200">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
            <p className="text-sm text-white">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">2K+</div>
            <p className="text-sm text-white">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <p className="text-sm text-white">Recommend Us</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
            <p className="text-sm text-white">Avg. Delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisplayedReviews;