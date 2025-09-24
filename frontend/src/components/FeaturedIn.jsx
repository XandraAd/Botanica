import React, { useState } from 'react';
import { FaLeaf, FaTruck, FaShieldAlt } from 'react-icons/fa';
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
      src: `${BASE_URL}assets/featuredImages/gardenersWorld.png`,
      alt: "Gardeners World",
      name:"Gardeners World"
    }
  ];

  const [loadedImages, setLoadedImages] = useState({});
  const [errorImages, setErrorImages] = useState({});

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    setErrorImages(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-lime-50 py-20 px-4 lg:px-8 relative z-20 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-green-600 font-semibold uppercase tracking-wider text-sm mb-4 block">
            Trusted By The Best
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            As Featured In
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recognized by leading publications and platforms in the gardening and lifestyle space.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 mb-24">
          {featuredPublications.map((pub, index) => (
            <div
              key={index}
              className="group relative w-full h-32 md:h-40 
                         bg-white/70 backdrop-blur-md 
                         rounded-2xl flex items-center justify-center 
                         p-6 transition-all duration-500 
                         hover:shadow-xl hover:scale-105 border border-gray-200"
            >
              {errorImages[index] ? (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 shadow-inner">
                    <FaLeaf className="text-green-600 w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{pub.name}</span>
                </div>
              ) : (
                <img 
                  src={pub.src} 
                  alt={pub.alt}
                  className={`max-h-16 md:max-h-20 w-auto object-contain 
                              filter grayscale group-hover:grayscale-0 
                              transition-all duration-500 
                              ${loadedImages[index] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="text-center mb-24">
          <div className="inline-grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/80 backdrop-blur-md rounded-3xl px-8 py-10 shadow-xl border border-gray-100">
            <div className="flex flex-col items-center justify-center p-4 hover:scale-105 transition">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <FaLeaf className="text-green-600 w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">100% Organic</h3>
              <p className="text-sm text-gray-600">Naturally grown plants</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 hover:scale-105 transition">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <FaTruck className="text-green-600 w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 hover:scale-105 transition">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <FaShieldAlt className="text-green-600 w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">30-Day Guarantee</h3>
              <p className="text-sm text-gray-600">Happiness guaranteed</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "500+", label: "Plant Varieties" },
            { value: "15", label: "Years Experience" },
            { value: "98%", label: "Success Rate" }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="text-center p-6 bg-white/80 backdrop-blur-md 
                         rounded-2xl shadow-sm border border-gray-100 
                         hover:shadow-md hover:scale-105 transition"
            >
              <div className="text-3xl font-bold text-green-600 mb-2 animate-fadeIn">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <DisplayedReviews/>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default FeaturedIn;
