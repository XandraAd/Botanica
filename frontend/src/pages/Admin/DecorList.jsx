import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_URL, UPLOAD_URL } from "../../store/constants";

const DecorList = () => {
  const [decorItems, setDecorItems] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch decor items on mount
  useEffect(() => {
    const fetchDecor = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/decor`, { withCredentials: true });
        setDecorItems(data);
      } catch (err) {
        console.error("Failed to fetch decor:", err);
      }
    };
    fetchDecor();
  }, []);

  // Upload image handler
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
      setImage(data.image); // backend returns `/uploads/...` path
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // Create new decor
  const createDecor = async (e) => {
    e.preventDefault();
    if (!name || !image) return;

    try {
      const { data } = await axios.post(
        `${API_URL}/decor`,
        { name, image },
        { withCredentials: true }
      );
      setDecorItems((prev) => [...prev, data]);
      setName("");
      setImage("");
    } catch (err) {
      console.error("Failed to create decor:", err);
    }
  };

  // Delete decor item
  const deleteDecor = async (id) => {
    try {
      await axios.delete(`${API_URL}/decor/${id}`, { withCredentials: true });
      setDecorItems((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Failed to delete decor:", err);
    }
  };

  // Resolve image URLs for dev & prod
  const getImageUrl = (img) => {
    if (!img) return "/fallback-image.jpg";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Decor Inspirations</h2>

      {/* Add Decor Form */}
      <form onSubmit={createDecor} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Decor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input type="file" onChange={uploadFileHandler} className="border p-2 rounded" />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

        {image && (
          <img
            src={getImageUrl(image)}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Decor
        </button>
      </form>

      {/* Decor Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {decorItems.map((decor) => (
          <div key={decor._id} className="border p-2 rounded shadow">
            <img
              src={getImageUrl(decor.image)}
              alt={decor.name}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold">{decor.name}</h3>
            <button
              onClick={() => deleteDecor(decor._id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecorList;
