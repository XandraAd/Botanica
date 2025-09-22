import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FALLBACKS = [
  {
    id: "f1",
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80",
    alt: "Tropical",
    title: "Tropical Collection",
    description: "Bring the jungle to your home.",
    buttonText: "Explore Tropicals",
    link: "/category/tropical",
  },
  {
    id: "f2",
    src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80",
    alt: "Succulents",
    title: "Succulent Variety",
    description: "Low-maintenance beautiful succulents.",
    buttonText: "Shop Succulents",
    link: "/category/succulent",
  },
  {
    id: "f3",
    src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80",
    alt: "Flowers",
    title: "Blooming Beauties",
    description: "Colorful flowering plants for every season.",
    buttonText: "Discover Flowers",
    link: "/category/flowers",
  },
];

const normalize = (item = {}, idx) => {
  const srcRaw = item.src ?? item.url ?? item.image ?? item.path ?? "";
  const isAbsolute = /^https?:\/\//i.test(srcRaw);
  const src = srcRaw
    ? isAbsolute
      ? srcRaw
      : `${BASE_URL}/${srcRaw.replace(/^\/?/, "")}`
    : "";

  const title = item.title ?? item.name ?? item.caption ?? "";
  const description = item.description ?? item.desc ?? item.subtitle ?? "";
  const buttonText = item.buttonText ?? item.cta ?? item.button ?? "Shop Now";
  const alt = item.alt ?? item.altText ?? title ?? "carousel image";
  const id = item._id ?? item.id ?? idx;

  const link = item.link ?? (item.slug ? `/category/${item.slug}` : "/shop");

  return { id, src, title, description, buttonText, alt, link };
};

export default function HeroSection() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/carousel`);
        const raw = response.data;
        const arr = Array.isArray(raw) ? raw : raw?.images ?? [];
        const normalized = arr.map((it, i) => normalize(it, i));
        setCarouselImages(normalized.length ? normalized : FALLBACKS);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
        setCarouselImages(FALLBACKS);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white relative z-10">
      <div className="text-center py-8">
        <h2 className="text-sm uppercase tracking-widest text-gray-500">
          Plant life made Easy
        </h2>
        <h1 className="text-4xl font-serif mt-2 mb-4 text-green-800">
          Botanical Wonders
        </h1>
      </div>

      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showArrows
        showStatus={false}
        showIndicators
        interval={5000}
        dynamicHeight={false}
        className="h-full"
      >
        {carouselImages.map((image) => (
          <div key={image.id} className="h-full relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-screen object-cover"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80")
              }
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-end md:items-center justify-center px-4 pb-8 md:pb-0">
              <div className="relative z-20 text-center text-white max-w-3xl">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]">
                  {image.title || "Explore our collection"}
                </h3>
                <p className="text-base md:text-xl mb-6 font-medium drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)]">
                  {image.description || "Beautiful plants for your home."}
                </p>
                <Link
                  to={image.link}
                  className="pointer-events-auto inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold text-sm md:text-base shadow-lg transform hover:scale-105"
                >
                  {image.buttonText || "Shop Now"} &gt;
                </Link>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
        ))}
      </Carousel>

      <div className="border-t border-b border-gray-200 py-4 bg-green-50">
        <div className="text-center">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-green-800">Sarah Johnson</span>{" "}
            purchased <span className="font-semibold">Monstera Deliciosa</span> 31
            minutes ago
          </p>
        </div>
      </div>
    </div>
  );
}
