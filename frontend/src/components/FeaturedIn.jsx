import React, { useState } from 'react';
import { FaLeaf, FaTruck, FaShieldAlt, FaAward, FaHeart, FaSeedling } from 'react-icons/fa';
import DisplayedReviews from './DisplayedReviews';

const FeaturedIn = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const featuredPublications = [
    {
      src: `${BASE_URL}/assets/featuredImages/bloom.jpg`,
      alt: "Bloom Magazine",
      name: "Bloom Magazine"
    },
    {
      src: `${BASE_URL}/assets/featuredImages/spruce.jpg`, 
      alt: "The Spruce",
      name: "The Spruce"
    },
    {
      src: `${BASE_URL}/assets/featuredImages/bloomscape.png`,
      alt: "Bloomscape",
      name: "Bloomscape"
    },
    {
      src: `${BASE_URL}/assets/featuredImages/gardenersworld.png`,
      alt: "Gardeners World",
      name: "Gardeners World"
    }
  ];

  const [loadedImages, setLoadedImages] = useState({});
  const [errorImages, setErrorImages] = useState({});

 const trustBadges = [
  {
    icon: FaLeaf,
    title: "100% Organic",
    description: "Naturally grown, chemical-free plants",
    color: "from-lime-600 to-green-700",
    bgColor: "bg-gradient-to-br from-lime-50 to-green-100",
    delay: "0"
  },
  {
    icon: FaTruck,
    title: "Free Shipping",
    description: "Free delivery on orders over $50",
    color: "from-emerald-600 to-teal-700",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-100",
    delay: "200"
  },
  {
    icon: FaShieldAlt,
    title: "30-Day Guarantee",
    description: "Plant happiness guaranteed",
    color: "from-olive-600 to-lime-700", // earthy greens
    bgColor: "bg-gradient-to-br from-lime-50 to-emerald-100",
    delay: "400"
  },
  {
    icon: FaAward,
    title: "Premium Quality",
    description: "Expertly curated plant selection",
    color: "from-amber-600 to-yellow-700",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-100",
    delay: "600"
  }
];

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    setErrorImages(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-lime-50 py-16 md:py-20 px-4 lg:px-8 relative z-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-5 w-64 h-64 md:w-72 md:h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute top-20 right-10 w-64 h-64 md:w-72 md:h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/4 w-64 h-64 md:w-72 md:h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      
      <div className="w-full max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-green-600 font-semibold uppercase tracking-wider text-sm mb-3 block">
            Trusted By The Best
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            As Featured In
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Recognized by leading publications and platforms in the gardening and lifestyle space.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {featuredPublications.map((pub, index) => (
            <div
              key={index}
              className="group relative w-full h-28 md:h-32 lg:h-40 
                         bg-white/90 backdrop-blur-md 
                         rounded-2xl flex items-center justify-center 
                         p-4 md:p-6 transition-all duration-500 
                         hover:shadow-2xl hover:scale-105 border border-white
                         hover:border-green-100/50 shadow-sm"
            >
              {errorImages[index] ? (
                <div className="flex flex-col items-center justify-center text-center p-2 md:p-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                    <FaSeedling className="text-green-600 w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700 font-medium">{pub.name}</span>
                </div>
              ) : (
                <img 
                  src={pub.src} 
                  alt={pub.alt}
                  className={`max-h-14 md:max-h-18 lg:max-h-20 w-auto object-contain 
                              filter grayscale group-hover:grayscale-0 
                              transition-all duration-500 
                              ${loadedImages[index] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Trust Badges */}
        <div className="text-center mb-16 md:mb-20">
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best plant experience with quality guarantees and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {trustBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div 
                  key={index}
                  className={`group relative p-6 md:p-8 rounded-3xl ${badge.bgColor} 
                            border border-white/50 shadow-lg hover:shadow-2xl 
                            transition-all duration-500 hover:scale-105
                            backdrop-blur-sm overflow-hidden`}
                  style={{ animationDelay: `${badge.delay}ms` }}
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Animated border effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                    <div className="absolute inset-[2px] rounded-3xl bg-white"></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Icon container */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${badge.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    
                    {/* Content */}
                    <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-3 group-hover:text-gray-800 transition-colors">
                      {badge.title}
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  {/* Hover effect dots */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 delay-100"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 md:mb-20">
          {[
            { value: "10K+", label: "Happy Customers", icon: FaHeart },
            { value: "100+", label: "Plant Varieties", icon: FaLeaf },
            { value: "5", label: "Years Experience", icon: FaAward },
            { value: "98%", label: "Success Rate", icon: FaShieldAlt }
          ].map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={i} 
                className="group text-center p-6 bg-white/90 backdrop-blur-md 
                           rounded-2xl shadow-lg border border-white/50
                           hover:shadow-2xl hover:scale-105 transition-all duration-500
                           relative overflow-hidden"
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 right-2 w-8 h-8 bg-green-200 rounded-full opacity-20"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 bg-blue-200 rounded-full opacity-20"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <DisplayedReviews/>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float {
          animation: float 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Smooth entrance animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default FeaturedIn;