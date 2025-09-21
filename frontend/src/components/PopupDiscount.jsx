import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import ProductCard from "./ProductCard"; // your existing product card component

const PopupDiscount = ({ products }) => {
  const [show, setShow] = useState(false);

  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setShow(false);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl flex overflow-hidden">
        {/* Left Section */}
        <div
          className="w-1/2 relative bg-cover bg-center p-8 flex flex-col justify-center text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white text-xl"
          >
            <FaTimes />
          </button>
          <h2 className="text-3xl font-bold mb-4">Wait! Before You Leave…</h2>
          <p className="mb-6">Get <span className="font-bold">20% off</span> your first order!</p>
          <div className="bg-white text-green-600 font-bold px-4 py-2 rounded mb-4 inline-block">
            FIRST20
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
            Grab the Discount
          </button>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 gap-4">
            {products.slice(0, 4).map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupDiscount;
