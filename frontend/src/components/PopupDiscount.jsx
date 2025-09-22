import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import ProductCard from "./ProductCard";

const PopupDiscount = ({ products = [] }) => {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show popup after 5 seconds with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
      // Small delay to trigger CSS animation
      setTimeout(() => setIsVisible(true), 10);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before hiding
    setTimeout(() => setShow(false), 300);
  };

  // Don't render anything if not showing
  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'bg-transparent bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0'}`}>
      <div className={`bg-white w-full max-w-5xl rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        {/* Left Section - Discount Offer */}
        <div
          className="w-full md:w-2/5 relative bg-cover bg-center p-8 flex flex-col justify-center text-white"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white text-xl hover:text-green-300 transition-colors"
            aria-label="Close popup"
          >
            <FaTimes />
          </button>
          
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Special Offer!</h2>
            <p className="text-xl mb-2">Get <span className="font-bold text-green-300">20% OFF</span></p>
            <p className="mb-6 text-gray-200">on your first order with code:</p>
            
            <div className="bg-white text-green-600 font-bold px-6 py-3 rounded mb-6 text-xl inline-block border-2 border-green-300 border-dashed">
              FIRST20
            </div>
            
            <button 
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg w-full md:w-auto"
              onClick={handleClose}
            >
              Claim Discount Now
            </button>
          </div>
        </div>

        {/* Right Section - Recommended Products */}
        <div className="w-full md:w-3/5 p-6 bg-gray-50">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Recommended For You</h3>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
              {products.slice(0, 4).map((prod) => (
                <div key={prod._id} className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                  <ProductCard product={prod} compact={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recommendations available at the moment.</p>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Limited time offer. Terms and conditions apply.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupDiscount;