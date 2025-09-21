import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDecor, addDecor, deleteDecor } from "../../slices/decorSlice";
import { API_URL, BASE_URL, UPLOAD_URL } from "../../store/constants";
import axios from "axios";

const DecorList = () => {
  const dispatch = useDispatch();
  const { items: decorItemsRaw, loading, error } = useSelector((state) => state.decor);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Always force items to be an array
  const decorItems = Array.isArray(decorItemsRaw) ? decorItemsRaw : [];

  // Fetch all products for dropdown
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`, {
        withCredentials: true,
      });
      console.log("Fetched products:", data); // 👀 log what comes back
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };
  fetchProducts();
}, []);


  // Fetch decor items
  useEffect(() => {
    dispatch(fetchDecor());
  }, [dispatch]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const { data } = await axios.post(UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setImage(data.url || data.image);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };
const createDecor = (e) => {
  e.preventDefault();

  if (!name || !image || !productId) {
    alert("Please fill all fields and select a product.");
    return;
  }

  dispatch(addDecor({ name, image, product: productId }));
  setName(""); 
  setImage(""); 
  setProductId("");
};


  const removeDecor = (id) => dispatch(deleteDecor(id));

  const getImageUrl = (imgPath) =>
    imgPath?.startsWith("http") ? imgPath : `${BASE_URL}${imgPath}`;

  if (loading) return <p className="text-center">Loading decor...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Decor Inspirations</h2>

      <form onSubmit={createDecor} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Decor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />

        <input type="file" onChange={uploadFileHandler} className="border p-2" />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {image && (
          <img
            src={getImageUrl(image)}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}

       <select
  value={productId}
  onChange={(e) => setProductId(e.target.value)}
  className="border p-2 w-full"
>
  <option value="">Select product for decor</option>
  {products.length > 0 ? (
    products.map((p) => (
      <option key={p._id} value={p._id}>
        {p.name}
      </option>
    ))
  ) : (
    <option disabled>No products available</option>
  )}
</select>


        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Decor
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {decorItems.length > 0 ? (
          decorItems.map((decor) => (
            <div key={decor._id} className="border p-2 rounded shadow">
              <img
                src={getImageUrl(decor.image)}
                alt={decor.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{decor.name}</h3>
              {decor.product?.name ? (
                <p className="text-sm text-gray-500">Product: {decor.product.name}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">No linked product</p>
              )}
              <button
                onClick={() => removeDecor(decor._id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No decor items found
          </p>
        )}
      </div>
    </div>
  );
};

export default DecorList;
