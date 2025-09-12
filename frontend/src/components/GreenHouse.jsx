import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const GreenHouse = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full bg-lime-50 py-16">
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 sm:px-8 lg:px-12">
        
        {/* Left: Video Thumbnail or Video */}
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl shadow-lg">
          {!isPlaying ? (
            <>
              {/* Thumbnail Image */}
              <img
                src="http://localhost:5000/assets/plant-bn-5.webp"
                alt="GreenHouse Video Thumbnail"
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
              >
                <FaPlay className="text-white text-4xl sm:text-5xl" />
              </button>
            </>
          ) : (
            <>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/J4SaSuZuzgU?autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>

              {/* Close Button */}
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
              >
                <IoClose className="text-2xl" />
              </button>
            </>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex flex-col gap-6">
          <span className="uppercase tracking-wide text-sm text-green-700 font-semibold">
            Life gathers around plants
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-snug">
            Straight from the <span className="text-green-600">GreenHouse</span>
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Follow along on a Bird of Paradise’s journey from our greenhouse 
            to your home, and learn how we nurture plants with care every step of the way.
          </p>

          <button className="self-start px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default GreenHouse;
