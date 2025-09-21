// frontend/src/pages/Newest/Newest.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import ProductDetailsModal from "../../components/ProductDetails";
import { API_URL } from "../../store/constants";

const Newest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // modal
  const [gridLayout, setGridLayout] = useState("3"); // default 3 columns

  useEffect(() => {
    const fetchNewest = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/products/new`);
        setProducts(data);
        setError("");
      } catch (err) {
        console.error("Fetch newest products error:", err);
        setError(err.response?.data?.message || "Failed to load newest products");
      } finally {
        setLoading(false);
      }
    };

    fetchNewest();
  }, []);

  const gridClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );

  if (error)
    return <p className="text-center py-6 text-red-500">{error}</p>;

  return (
    <section className="w-full py-12">
      <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-800">🌱 Newest Arrivals</h2>

          {/* Grid Selector */}
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
                {/* Dynamic icons */}
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

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No new products found.</p>
        ) : (
          <div className={`grid ${gridClasses[gridLayout]} gap-6`}>
            {products.map((product) => (
              <div key={product._id} onClick={() => setSelectedProduct(product)}>
                <ProductCard product={product} variant="newest" onView={setSelectedProduct} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default Newest;
