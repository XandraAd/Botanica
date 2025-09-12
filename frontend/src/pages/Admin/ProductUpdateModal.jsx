import React, { useState, useEffect } from "react";
import { useFetchCategoriesQuery } from "../../slices/categorySlice";
import { useFetchCollectionsQuery } from "../../slices/collectionSlice";
import { useUpdateProductMutation } from "../../slices/productSlice";
import { toast } from "react-toastify";

const ProductUpdateModal = ({ product, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    image: product?.image || "",
    category: product?.category?._id || "",
    collections: product?.collections?.map(c => c._id) || [],
    featured: product?.featured || false,
  });

  const { data: categories } = useFetchCategoriesQuery();
  const { data: collections } = useFetchCollectionsQuery();
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category: formData.category || null,
        collections: formData.collections || [],
        featured: formData.featured,
      };

      const updated = await updateProduct({
        productId: product._id,
        formData: payload,
      }).unwrap();

      toast.success("Product updated successfully!");
      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  const toggleCollection = (collectionId) => {
    setFormData(prev => {
      const currentCollections = prev.collections || [];
      if (currentCollections.includes(collectionId)) {
        return {
          ...prev,
          collections: currentCollections.filter(id => id !== collectionId)
        };
      } else {
        return {
          ...prev,
          collections: [...currentCollections, collectionId]
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Update Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Product Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collections
            </label>
            <p className="text-sm text-gray-500 mb-2">Select one or more collections</p>
            <div className="flex flex-wrap gap-2">
              {collections?.map((col) => {
                const isSelected = formData.collections?.includes(col._id);
                return (
                  <button
                    key={col._id}
                    type="button"
                    onClick={() => toggleCollection(col._id)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      isSelected
                        ? "bg-pink-600 text-white border-pink-600 shadow-md"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {col.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-3 hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-700 text-white rounded-lg py-3 hover:bg-pink-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateModal;