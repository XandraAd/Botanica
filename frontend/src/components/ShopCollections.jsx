import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import SectionHeader from "./SectionHeader";
import CollectionCard from "./CollectionCard";
import { BASE_URL } from "../store/constants";

import "swiper/css";
import "swiper/css/navigation";

const ShopCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch collections from backend
  useEffect(() => {
    const fetchCollections = async () => {
      try {
    const res = await fetch("http://localhost:5000/api/collections");
        if (!res.ok) throw new Error("Failed to fetch collections");

        const data = await res.json();

        // Transform if needed
      const transformedCollections = data.map((c) => ({
  _id: c._id,
  name: c.name,
  image: c.collectionImage || (c.images?.[0] ? `${BASE_URL}${c.images[0]}` : null),
  productsCount: c.count || (c.products?.length ?? 0),
}));


        setCollections(transformedCollections);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-lime-50 py-16">
        <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
          <p>Loading collections...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-lime-50 py-16">
        <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-lime-50 py-16">
      <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
    
          <SectionHeader sectionTitle="Shop by Collection" />
     

        {/* Mobile grid */}
        <div className="grid grid-cols-1 gap-6 sm:hidden mt-6">
          {collections.map((collection) => (
            <CollectionCard key={collection._id} collection={collection} />
          ))}
        </div>

        {/* Swiper for larger screens */}
        <div className="hidden sm:block mt-6">
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
            }}
            className="pt-6 pb-12"
          >
            {collections.map((collection) => (
              <SwiperSlide key={collection._id}>
                <CollectionCard collection={collection} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ShopCollections;
