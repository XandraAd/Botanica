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
      
{/* Decorative Gradient HR Section */}
<section className=" py-8 bg-zinc-50 flex justify-center">
  <div className="h-1 w-2/3 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full"></div>
</section>

      <ShowDecorSpace />
    </div>
  );
};

export default HomePage;