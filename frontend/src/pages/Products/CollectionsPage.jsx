// frontend/src/pages/Products/CollectionsPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFetchCollectionsQuery } from "../../slices/collectionSlice";
import CollectionCard from "../../components/CollectionCard";
import FilterSidebar from "../../components/FilterSidebar";

const CollectionsPage = () => {
  const { data: collections, isLoading, isError } = useFetchCollectionsQuery();
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [gridLayout, setGridLayout] = useState("3");

  // Get query params from URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filter = params.get("filter"); // e.g., "indoor", "outdoor", "accessories", "sale"

  useEffect(() => {
    if (collections) {
      if (filter) {
        // Filter collections by name (case-insensitive)
        const filtered = collections.filter((col) =>
          col.name.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredCollections(filtered);
      } else {
        setFilteredCollections(collections);
      }
    }
  }, [collections, filter]);

  const gridClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading collections...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading collections
      </div>
    );
  }

  return (
    <div className="flex bg-white relative">
      {/* Sidebar (slide-in/out) */}
      <FilterSidebar
        data={collections}
        onFilter={setFilteredCollections}
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(false)}
        filtersConfig={{
          showCategories: false,
          showSizes: false,
          showColors: false,
          showCollections: true,
        }}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-800">
            🌿 {filter ? filter.replace("-", " ") : "All"} Collections
          </h2>

          {/* Actions: Grid Selector */}
          <div className="flex space-x-2">
            {["1", "2", "3", "4"].map((num) => (
              <button
                key={num}
                onClick={() => setGridLayout(num)}
                className={`p-2 rounded-md border ${
                  gridLayout === num
                    ? "bg-green-600 text-white border-green-600"
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

        {/* Grid of collection cards */}
        <div className={`grid ${gridClasses[gridLayout]} gap-8`}>
          {filteredCollections.length > 0 ? (
            filteredCollections.map((collection) => (
              <CollectionCard key={collection._id} collection={collection} />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No collections found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;