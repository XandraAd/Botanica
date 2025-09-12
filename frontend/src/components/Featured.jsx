// src/components/Featured.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails"; 

import "swiper/css";
import "swiper/css/navigation";

const Featured = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

 useEffect(() => {
  const fetchPlants = async () => {
    try {
const res = await fetch("/api/products/featured");



      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setError("");
      } else {
        setProducts([]);
        setError("No plants available");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  fetchPlants();
}, []);


  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

  return (
    <section className="w-full bg-lime-50 py-16">
      <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader sectionTitle="Featured Products" />

        {/* Grid for small screens */}
        <div className="grid grid-cols-2 gap-4 sm:hidden">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              variant="featured"
              onView={setSelectedProduct}
            />
          ))}
        </div>

        {/* Swiper for larger screens */}
        <div className="hidden sm:block">
          <Swiper
            slidesPerView={1.25}
            mousewheel={{ forceToAxis: true }}
            spaceBetween={16}
            navigation={true}
            modules={[Mousewheel, Navigation]}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
              1536: { slidesPerView: 5, spaceBetween: 28 },
              1800: { slidesPerView: 6, spaceBetween: 32 },
            }}
            className="pt-6 pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard
                  product={product}
                  variant="featured"
                  onView={setSelectedProduct}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ✅ Modal lives here */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default Featured;
