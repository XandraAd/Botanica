import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedIn from "../components/FeaturedIn";
import Featured from "../components/Featured";
import GreenHouse from "../components/GreenHouse";
import GreenerWorld from "../components/GreenerWorld";
import ShopCollections from "../components/ShopCollections";
import UltimateGuide from "../components/UltimateGuide";
import ShowDecorSpace from "../components/ShowDecorSpace";

const HomePage = () => {
  return (
    <div className="relative">
      <HeroSection />
      <div className="relative z-30">
        <FeaturedIn />
      </div>
      <div>
        <Featured />
      </div>
      <GreenHouse />
      <GreenerWorld />

      <ShopCollections />
      <UltimateGuide />
      <ShowDecorSpace />
    </div>
  );
};

export default HomePage;
