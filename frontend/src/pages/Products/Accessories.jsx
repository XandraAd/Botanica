import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import ProductDetailsModal from "../../components/ProductDetails";
import FilterSidebar from "../../components/FilterSidebar";
import { API_URL } from "../../store/constants";

export default function Accessories() {
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gridLayout, setGridLayout] = useState("3");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/products/category/accessories`);
        setAccessories(data.products || []);
        setFilteredAccessories(data.products || []);
        setError("");
      } catch (err) {
        console.error("Error fetching accessories:", err);
        setError(err.response?.data?.message || "Failed to load accessories.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  const gridClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading accessories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (!accessories.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No accessories found.
      </div>
    );
  }

  return (
    <div className="flex bg-white">
      {/* Sidebar Filter */}
      <FilterSidebar
        data={accessories}
        onFilter={setFilteredAccessories}
        filtersConfig={{
          showCategories: true,
          showSubCategories: true, // ✅ Fixed: Changed from showSubcategories to showSubCategories
          showSizes: true,
          showColors: true,
          showCollections: false,
        }}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} // ✅ Added missing onToggle prop
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800">👜 Accessories</h2>

          <div className="flex items-center space-x-4">
            {/* Toggle Sidebar button (mobile only) */}
            <button
              className="md:hidden px-3 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "Close Filters" : "Open Filters"}
            </button>

            {/* Grid Selector */}
            <div className="flex space-x-2">
              {["1", "2", "3", "4"].map((num) => (
                <button
                  key={num}
                  onClick={() => setGridLayout(num)}
                  className={`p-2 rounded-md border ${
                    gridLayout === num
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  title={`${num} column${num !== "1" ? "s" : ""}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    {num === "1" && <rect x="3" y="3" width="14" height="14" rx="1" />}
                    {num === "2" && (
                      <>
                        <rect x="3" y="3" width="6.5" height="14" rx="1" />
                        <rect x="12.5" y="3" width="6.5" height="14" rx="1" />
                      </>
                    )}
                    {num === "3" && (
                      <>
                        <rect x="3" y="3" width="4" height="14" rx="1" />
                        <rect x="9" y="3" width="4" height="14" rx="1" />
                        <rect x="15" y="3" width="4" height="14" rx="1" />
                      </>
                    )}
                    {num === "4" && (
                      <>
                        <rect x="2.5" y="3" width="3" height="14" rx="1" />
                        <rect x="7.5" y="3" width="3" height="14" rx="1" />
                        <rect x="12.5" y="3" width="3" height="14" rx="1" />
                        <rect x="17.5" y="3" width="3" height="14" rx="1" />
                      </>
                    )}
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accessories Grid */}
        <div className={`grid ${gridClasses[gridLayout]} gap-8`}>
          {filteredAccessories.length > 0 ? (
            filteredAccessories.map((item) => (
              <div key={item._id} onClick={() => setSelectedProduct(item)}>
                <ProductCard product={item} variant="accessories" onView={setSelectedProduct} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No accessories match your filters</p>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}