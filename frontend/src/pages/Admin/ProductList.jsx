import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productSlice";
import { useFetchCategoriesQuery } from "../../slices/categorySlice";
import { useFetchCollectionsQuery } from "../../slices/collectionSlice";
import { toast } from "react-toastify";

const ProductList = () => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");   
  const [stock, setStock] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [collections, setCollections] = useState([]); 
  const [formErrors, setFormErrors] = useState({});
  const [featured,setFeatured]=useState(false)
  const navigate = useNavigate();

  const [uploadProductImage, { isLoading: uploadingImage }] =
    useUploadProductImageMutation();
  const [createProduct, { isLoading: creatingProduct }] =
    useCreateProductMutation();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useFetchCategoriesQuery();

  const {
    data: collectionsData,
    isLoading: collectionsLoading,
  } = useFetchCollectionsQuery();

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Product name is required";
    if (!price || Number(price) <= 0) errors.price = "Valid price is required";
    if (!category) errors.category = "Category is required";
    if (images.length === 0) errors.image = "Product image is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Options
  const categoryOptions =
    categoriesData?.map((cat) => ({
      value: cat._id,
      label: cat.name,
    })) || [];

  const collectionOptions =
    collectionsData?.map((col) => ({
      value: col._id,
      label: col.name,
    })) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      let finalImages = [];
for (const img of images) {
  if (img instanceof File) {
    const formData = new FormData();
    formData.append("image", img);

    // Cloudinary returns { url, public_id }
    const uploadResponse = await uploadProductImage(formData).unwrap();
    finalImages.push(uploadResponse.url);
  } else {
    finalImages.push(img); // in case editing with existing image URLs
  }
}


      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,   // ✅ single category
        collections, // ✅ single collection
        sizes,
        colors,
        images: finalImages,
        inStock: Number(stock) > 0,
        featured,
      };

      console.log("📦 Final productData:", productData);

      const response = await createProduct(productData).unwrap();
      toast.success(`${response.name} created successfully!`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Product creation failed:", error);
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Product creation failed. Please try again."
      );
    }
  };

  const uploadFileHandler = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const newFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image (JPEG, PNG, WebP)`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }

      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleSizesChange = (e) =>
    setSizes(e.target.value.split(",").map((s) => s.trim()).filter(Boolean));

  const handleColorsChange = (e) =>
    setColors(e.target.value.split(",").map((c) => c.trim()).filter(Boolean));

  if (categoriesLoading || collectionsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <div className="md:w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Create Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Multiple Images */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Images *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={uploadFileHandler}
              className="block w-full border rounded p-2"
            />
            {formErrors.image && (
              <p className="text-red-500 text-sm">{formErrors.image}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-3">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`preview-${idx}`}
                  className="h-24 w-24 object-cover rounded"
                />
              ))}
            </div>
          </div>

          {/* Name + Price */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Name *"
                className="w-full p-3 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Price *"
                className="w-full p-3 border rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {formErrors.price && (
                <p className="text-red-500 text-sm">{formErrors.price}</p>
              )}
            </div>
          </div>

          {/* Stock */}
          <div>
            <input
              type="number"
              placeholder="Count In Stock"
              className="w-full p-3 border rounded"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

         
          {/* Category */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">Category *</label>
  <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className={`w-full p-3 border rounded ${
    !category ? "text-gray-400" : "text-gray-900"
  }`}
>
  <option value="" disabled hidden>
    Select Category *
  </option>
  {categoryOptions.map((c) => (
    <option key={c.value} value={c.value}>
      {c.label}
    </option>
  ))}
</select>

  {formErrors.category && (
    <p className="text-red-500 text-sm">{formErrors.category}</p>
  )}
</div>

{/* Collections */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">Collections</label>
  <div className="flex flex-wrap gap-2">
    {collectionOptions.map((col) => {
      const isSelected = collections.includes(col.value);
      return (
        <button
          key={col.value}
          type="button"
          onClick={() =>
            setCollections((prev) =>
              isSelected
                ? prev.filter((id) => id !== col.value)
                : [...prev, col.value]
            )
          }
          className={`px-4 py-2 rounded-full border transition-colors ${
            isSelected
              ? "bg-pink-600 text-white border-pink-600 shadow-md"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {col.label}
        </button>
      );
    })}
  </div>
</div>

        

          {/* Description */}
          <textarea
            placeholder="Description"
            className="w-full p-3 border rounded min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/*Featured*/}
          <div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={featured}
    onChange={(e) => setFeatured(e.target.checked)}
  />
  <label>Featured Product</label>
</div>


          {/* Sizes + Colors */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Sizes (comma separated)"
              className="flex-1 p-3 border rounded"
              onChange={handleSizesChange}
            />
            <input
              type="text"
              placeholder="Colors (comma separated)"
              className="flex-1 p-3 border rounded"
              onChange={handleColorsChange}
            />
          </div>

          <button
            type="submit"
            disabled={uploadingImage || creatingProduct}
            className="px-6 py-3 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            {uploadingImage || creatingProduct ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductList;
