import React from "react";
import { BASE_URL } from "../store/constants";

const UltimateGuide = () => {


  return (
    <section className="w-full  bg-lime-50 py-16">
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 sm:px-8 lg:px-12">
        {/* Left: Content */}
        <div className="flex flex-col gap-6">
          <span className="uppercase tracking-wide text-sm text-green-700 font-semibold">
            Get the grow-how
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-snug">
            Ultimate Guide to{" "}
            <span className="text-green-600">Summer Plant</span> Care
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Keep your plants healthy and thriving this summer! Get pro tips from
            our expert Grow-How® Team.
          </p>

          <button className="self-start px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition duration-300">
            Summer Care Tips
          </button>
        </div>

        {/* Right: Video Thumbnail or Video */}
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl shadow-lg">
          {/* Thumbnail Image */}
          <img
            src={`${BASE_URL}/assets/plant-bn-5.webp`}
            alt="GreenHouse Video Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default UltimateGuide;
