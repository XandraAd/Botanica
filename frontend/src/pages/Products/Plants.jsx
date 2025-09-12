import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gridLayout, setGridLayout] = useState("3"); // default to 3 columns

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data } = await axios.get("/api/products/allproducts");
        setPlants(data.products || []);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError("Failed to load plants.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  // Grid class mapping
  const gridClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  };

  if (loading) return <p>Loading plants...</p>;
  if (error) return <p>{error}</p>;
  if (!plants.length) return <p>No plants found.</p>;

  return (
    <div className="bg-white p-8">
      <div className="flex justify-between items-center mb-8">
       <h2 className="text-3xl font-bold text-green-800">🪴 Shop</h2>
        
        {/* Grid Selector Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setGridLayout("1")}
            className={`p-2 rounded-md border ${
              gridLayout === "1" 
                ? "bg-green-600 text-white border-green-600" 
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            title="1 column"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="3" y="3" width="14" height="14" rx="1" />
            </svg>
          </button>
          
          <button
            onClick={() => setGridLayout("2")}
            className={`p-2 rounded-md border ${
              gridLayout === "2" 
                ? "bg-green-600 text-white border-green-600" 
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            title="2 columns"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="3" y="3" width="6.5" height="14" rx="1" />
              <rect x="12.5" y="3" width="6.5" height="14" rx="1" />
            </svg>
          </button>
          
          <button
            onClick={() => setGridLayout("3")}
            className={`p-2 rounded-md border ${
              gridLayout === "3" 
                ? "bg-green-600 text-white border-green-600" 
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            title="3 columns"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="3" y="3" width="4" height="14" rx="1" />
              <rect x="9" y="3" width="4" height="14" rx="1" />
              <rect x="15" y="3" width="4" height="14" rx="1" />
            </svg>
          </button>
          
          <button
            onClick={() => setGridLayout("4")}
            className={`p-2 rounded-md border ${
              gridLayout === "4" 
                ? "bg-green-600 text-white border-green-600" 
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            title="4 columns"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="2.5" y="3" width="3" height="14" rx="1" />
              <rect x="7.5" y="3" width="3" height="14" rx="1" />
              <rect x="12.5" y="3" width="3" height="14" rx="1" />
              <rect x="17.5" y="3" width="3" height="14" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dynamic Grid */}
      <div className={`grid ${gridClasses[gridLayout]} gap-8`}>
        {plants.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
