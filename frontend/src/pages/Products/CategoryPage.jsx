// frontend/src/pages/Products/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const { data } = await axios.get(`/api/products/category/${slug}`);
        setProducts(data.products || []);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  if (loading) return <p>Loading {slug}...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-green-800 capitalize mb-6">
        {slug} Plants
      </h1>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
