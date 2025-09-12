// src/components/SectionHeader.js
import React from "react";

const SectionHeader = ({ sectionTitle, subtitle }) => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 relative inline-block">
        {sectionTitle}
        {/* underline accent */}
        <span className="block w-16 h-1 bg-blue-500 rounded-full mx-auto mt-3"></span>
      </h2>
      {subtitle && (
        <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
