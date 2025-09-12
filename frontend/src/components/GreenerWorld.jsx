import React from "react";
import { RiPlantLine } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";

const WinkFaceIcon = ({ size = 64, color = "#1F3D2B" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Square with rounded corners */}
    <rect x="4" y="4" width="56" height="56" rx="12" ry="12" />

    {/* Eyes */}
    <line x1="22" y1="28" x2="28" y2="28" /> {/* wink eye */}
    <circle cx="42" cy="28" r="3" /> {/* open eye */}

    {/* Smile */}
    <path d="M24 42c3 4 13 4 16 0" />
  </svg>
);

const GreenerWorld = () => {
  // Array of content with either `icon` (React component) or `imageSrc` (URL)
  const contentItems = [
    {
      id: 1,
      icon: <AiOutlineGlobal size={64} className="text-green-600" />, // ✅ React-icon
      altText: "Free shipping",
      title: "Free Standard Shipping",
      description:
        "Every single order ships for free. No minimums, no tiers, no fine print whatsoever.",
    },
    {
      id: 2,
      icon: <WinkFaceIcon size={64} color="#16a34a" />, // ✅ React component
      altText: "Eco-friendly products",
      title: "Eco-Friendly Products",
      description:
        "All our products are made from sustainable materials with minimal environmental impact.",
    },
    {
      id: 3,
      icon: <RiPlantLine size={64} className="text-green-600" />, // ✅ React-icon
      altText: "Positive impact",
      title: "Positive Impact",
      description:
        "With every purchase, we contribute to environmental conservation efforts worldwide.",
    },
  ];

  return (
    <section className="bg-zinc-50 mx-auto py-16 px-6 sm:px-10 lg:px-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-snug">
          We’re <span className="text-green-600">growing solutions</span> for a
          greener world
        </h2>
        <p className="mt-4 text-gray-600">
          Creating a future where sustainability and growth go hand in hand.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contentItems.map((item) => (
          <div
            key={item.id}
            className=" p-8 rounded-2xl  hover:shadow-md transition text-center"
          >
            {/* Render icon OR image */}
            {item.icon ? (
              <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center">
                {item.icon}
              </div>
            ) : (
              <img
                src={item.imageSrc}
                alt={item.altText}
                className="mx-auto mb-6 h-16 w-16 object-contain"
              />
            )}

            <h4 className="font-semibold text-lg text-gray-800 mb-3">
              {item.title}
            </h4>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GreenerWorld;
