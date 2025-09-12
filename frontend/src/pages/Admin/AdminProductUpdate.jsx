// frontend/src/pages/Admin/AdminProductUpdate.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../store/constants";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../store/slices/productsApiSlice";
import Loader from "../../components/Loader";

export default function AdminProductUpdate() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]); // ✅ array instead of single image

  // queries & mutations
  const {
    data: productData,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: updating }] =
    useUpdateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();

  // load product data into form
  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setBrand(productData.brand || "");
      setCategory(productData.category || "");
      setQuantity(productData.quantity || "");
      setPrice(productData.price || "");
      setStock(productData.countInStock || "");
      setImages(productData.images || []); // ✅ array
    }
  }, [productData]);

  // handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      // backend returns { image: "/uploads/xxx.jpg" }
      setImages([res.image]); // ✅ replace old image with new
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Image upload failed");
    }
  };

  // handle update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        name,
        description,
        brand,
        category,
        quantity,
        price,
        countInStock: stock,
        images, // ✅ array
      };

      const result = await updateProduct({
        productId,
        payload,
      }).unwrap();

      toast.success(`Product "${result.name}" successfully updated`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.data?.message || "Product update failed. Try again.");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Error loading product</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Update Product</h1>

      {/* image preview */}
      {images.length > 0 && (
        <div className="flex gap-4 justify-center mb-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.startsWith("http") ? img : `${BASE_URL}${img}`}
              alt={`product-${i}`}
              className="max-h-64 object-contain"
              onError={(e) => (e.target.src = "/placeholder.png")}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category ID"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          className="w-full border p-2 rounded"
        />

        {/* file upload */}
        <input
          type="file"
          onChange={handleFileUpload}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
