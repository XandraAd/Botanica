import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

export default function CollectionPage() {
  const { collectionId } = useParams();
console.log("📌 useParams collectionId:", collectionId);

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/collections/${collectionId}`
        );
        setCollection(data);
      } catch (err) {
        console.error("Failed to fetch collection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [collectionId]);

  if (loading) return <p>Loading...</p>;
  if (!collection) return <p>Collection not found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{collection.name}</h1>

      {/* Products inside this collection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {collection.products?.length > 0 ? (
          collection.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products in this collection yet.</p>
        )}
      </div>
    </div>
  );
}
