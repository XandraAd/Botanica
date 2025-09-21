import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_URL, UPLOAD_URL } from "../../store/constants";

const DecorList = () => {
  const [decorItems, setDecorItems] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Fetch decor items
  useEffect(() => {
    const fetchDecor = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/decor`, { withCredentials: true });
        setDecorItems(data);
      } catch (err) {
        console.error("Failed to fetch decor:", err);
        setError("Failed to load decor items.");
      }
    };
    fetchDecor();
  }, []);

  // Upload image to backend/Cloudinary
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError("");

    try {
      const { data } = await axios.post(UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Cloudinary sends either `url` or `image` depending on backend
      const uploadedImage = data.url || data.image;
      if (!uploadedImage) throw new Error("Invalid upload response");

      setImage(uploadedImage);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // Create new decor
  const createDecor = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      setError("Please provide a name and image.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/decor`,
        { name, image },
        { withCredentials: true }
      );
      setDecorItems([...decorItems, { _id: Date.now(), name, image }]); // optimistic update
      setName("");
      setImage("");
      setError("");
    } catch (err) {
      console.error("Failed to create decor:", err);
      setError("Failed to add decor. Try again.");
    }
  };

  // Delete decor
  const deleteDecor = async (id) => {
    try {
      await axios.delete(`${API_URL}/decor/${id}`, { withCredentials: true });
      setDecorItems(decorItems.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Failed to delete decor:", err);
      setError("Failed to delete decor. Try again.");
    }
  };

  // Generate image URL for dev/prod
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/fallback-image.jpg";
    return imgPath.startsWith("http") ? imgPath : `${BASE_URL}${imgPath}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Decor Inspirations</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Add new decor */}
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

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Decor
        </button>
      </form>

      {/* Decor list */}
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
