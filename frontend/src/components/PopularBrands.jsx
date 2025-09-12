import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

const PopularBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/popular");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API response:", data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setBrands(data);
        } else if (data.products && Array.isArray(data.products)) {
          setBrands(data.products);
        } else if (data.data && Array.isArray(data.data)) {
          setBrands(data.data);
        } else {
          console.error("Unexpected API response format:", data);
          setError("Unexpected data format from server");
        }
      } catch (err) {
        console.error("Error fetching popular brands:", err);
        setError("Failed to load popular brands");
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading) return (
    <div className="py-16 flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-800"></div>
      <p className="ml-3 text-gray-600">Loading popular brands...</p>
    </div>
  );
  
  if (error) return (
    <div className="py-16 text-center">
      <p className="text-red-500 font-medium">{error}</p>
    </div>
  );

  // Check if brands is an array and has items
  if (!Array.isArray(brands) || brands.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">No popular brands available.</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">🔥 Popular Brands</h2>
          <p className="mt-2 text-gray-600">Discover our most popular brands</p>
        </div>

        <Swiper
          slidesPerView={1.25}
          spaceBetween={16}
          navigation
          modules={[Navigation]}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3.5, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
            1536: { slidesPerView: 5, spaceBetween: 30 },
            1800: { slidesPerView: 6, spaceBetween: 30 },
          }}
          className="pt-6 pb-12"
        >
          {brands.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <div className="transition-transform hover:scale-105 duration-300 h-full">
                <ProductCard
                  product={product}
                  isBrand={true}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularBrands;