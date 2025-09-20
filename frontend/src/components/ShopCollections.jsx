import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import SectionHeader from "./SectionHeader";
import CollectionCard from "./CollectionCard";
import { useFetchCollectionsQuery } from "../slices/collectionSlice";

import "swiper/css";
import "swiper/css/navigation";

const ShopCollections = () => {
  // ✅ Fetch collections via RTK Query
  const { data: collections = [], isLoading, isError, error } = useFetchCollectionsQuery();

  if (isLoading) {
    return (
      <section className="w-full bg-lime-50 py-16">
        <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
          <p>Loading collections...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-lime-50 py-16">
        <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-red-500">{error?.data?.message || "Failed to load collections"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-lime-50 py-16">
      <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
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
