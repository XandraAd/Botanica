import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productSlice";
import { toast } from "react-toastify";
import ProductUpdateModal from "./ProductUpdateModal";
import { BASE_URL } from "../../store/constants";

const AllProducts = () => {
  const { data: apiResponse, isLoading, isError, error } = useAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [localProducts, setLocalProducts] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Update local products when API returns
  useEffect(() => {
    if (apiResponse) {
      // Handle different possible response structures
      let productsArray = [];
      
      if (Array.isArray(apiResponse)) {
        // If the response is directly an array
        productsArray = apiResponse;
      } else if (apiResponse.products && Array.isArray(apiResponse.products)) {
        // If the response has a products property that is an array
        productsArray = apiResponse.products;
      } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
        // If the response has a data property that is an array
        productsArray = apiResponse.data;
      }
      
      setLocalProducts(productsArray);
    }
  }, [apiResponse]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      setLocalProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
    
  if (isError)
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading products: {error?.message || "Unknown error"}
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          All Products ({localProducts.length})
        </h1>

        {localProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {localProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                 <img
  src={
    product.images && product.images.length > 0
      ? product.images[0].startsWith("http")
        ? product.images[0] // full URL from Cloudinary
        : `${BASE_URL}${product.images[0]}` // local server URL
      : "/placeholder.png"
  }
  alt={product.name || "Unnamed Product"}
  className="w-full h-48 object-cover"
  onError={(e) => (e.target.src = "/placeholder.png")}
/>

                  </div>
                  <div className="p-6 md:w-3/4 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {product.name || "Unnamed Product"}
                        </h2>
                        <p className="text-gray-500 text-sm">
                          {product.createdAt
                            ? `${formatDistanceToNow(
                                new Date(product.createdAt)
                              )} ago`
                            : "Unknown"}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.description
                          ? `${product.description.substring(0, 160)}...`
                          : "No description available"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-pink-700">
                        ${product.price || "0"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="inline-flex items-center px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors duration-300"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <ProductUpdateModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onUpdated={(updated) => {
            setLocalProducts((prev) =>
              prev.map((p) => (p._id === updated._id ? updated : p))
            );
          }}
        />
      )}
    </div>
  );
};

export default AllProducts;