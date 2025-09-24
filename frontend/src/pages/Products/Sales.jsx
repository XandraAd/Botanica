import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import ProductDetailsModal from "../../components/ProductDetails";
import { API_URL } from "../../store/constants";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(`${API_URL}/api/sales`);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching sales:", err);
        setError("Failed to load sales. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div className="text-center p-10">Loading sales...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 bg-white">
      <h2 className="text-3xl font-bold mb-6 text-red-600">🔥 Sales</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No sale items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((item) => (
            <div key={item._id} onClick={() => setSelectedProduct(item)}>
              <ProductCard
                product={item}
                variant="sale"
                onView={setSelectedProduct}
              />
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
