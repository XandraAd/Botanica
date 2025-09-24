import express from "express";
const router = express.Router();

// Use environment variable for base URL
//const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Get all carousel images for plants
router.get("/", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

 const carouselImages = [
  {
    id: 1,
    src: `${baseUrl}/assets/plantCarousel/tropical.jpg`,
    alt: "Tropical Leaf Plants",
    title: "Tropical Collection",
    description: "Bring the jungle to your home",
    buttonText: "Explore Tropicals",
    link: "/category/tropical-plants",
  },
  {
    id: 2,
    src: `${baseUrl}/assets/plantCarousel/succulents.jpg`,
    alt: "Succulent Plants",
    title: "Succulent Variety",
    description: "Low-maintenance beautiful succulents",
    buttonText: "Shop Succulents",
    link: "/category/succulent-plant",
  },
  {
    id: 3,
    src: `${baseUrl}/assets/plantCarousel/flowerPlant.jpg`,
    alt: "Flowering Plants",
    title: "Blooming Beauties",
    description: "Colorful flowering plants for every season",
    buttonText: "Discover Flowers",
    link: "/category/flowery-plant",
  },
  {
    id: 4,
    src: `${baseUrl}/assets/plantCarousel/indoorplant.jpg`,
    alt: "Indoor Plants",
    title: "Statement Plants",
    description: "Make a bold statement with indoor plants",
    buttonText: "View Indoor Plants",
    link: "/category/trees", // match MongoDB slug
  },
  {
    id: 5,
    src: `${baseUrl}/assets/plantCarousel/herb.jpg`,
    alt: "Herb Garden",
    title: "Culinary Herbs",
    description: "Fresh herbs for your kitchen",
    buttonText: "Shop Herbs",
    link: "/category/herb",
  },
  {
    id: 6,
    src: `${baseUrl}/assets/plantCarousel/rarePlant.jpg`,
    alt: "Rare Plants",
    title: "Exclusive Varieties",
    description: "Unique and rare plant collections",
    buttonText: "Explore Rare Plants",
    link: "/category/rare-plants",
  },
];


  res.json(carouselImages);
});

export default router;
