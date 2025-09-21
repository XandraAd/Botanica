// frontend/src/pages/Products/CollectionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import ProductDetailsModal from "../../components/ProductDetails";
import { API_URL } from "../../store/constants";

export default function CollectionPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/collections/${collectionId}`);
        setCollection(data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch collection:", err);
        setError(err.response?.data?.message || "Failed to load collection");
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [collectionId]);

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-6">{error}</p>;
  if (!collection) return <p className="text-center py-6">Collection not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-800 capitalize mb-6">{collection.name}</h1>

      {collection.products?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collection.products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              variant="collections"
              onView={setSelectedProduct} // opens modal
            />
          ))}
        </div>
      ) : (
        <p className="text-center">No products in this collection yet.</p>
      )}

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
