import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { PRODUCT_URL } from "../../store/constants";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(PRODUCT_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="w-[95%] mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Shop All Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} variant="plants" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
