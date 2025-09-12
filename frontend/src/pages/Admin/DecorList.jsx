import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_URL, UPLOAD_URL } from "../../store/constants";

const DecorList = () => {
  const [decorItems, setDecorItems] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDecor = async () => {
      const { data } = await axios.get(`${API_URL}/decor`);
      setDecorItems(data);
    };
    fetchDecor();
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await axios.post(UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setImage(data.image); // ✅ backend sends `/uploads/...`
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const createDecor = async (e) => {
    e.preventDefault();
    await axios.post(
      `${API_URL}/decor`,
      { name, image },
      { withCredentials: true }
    );
    window.location.reload();
  };

  const deleteDecor = async (id) => {
    await axios.delete(`${API_URL}/decor/${id}`, { withCredentials: true });
    setDecorItems(decorItems.filter((d) => d._id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Decor Inspirations</h2>

      {/* Add new decor form */}
      <form onSubmit={createDecor} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Decor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Upload input */}
        <input type="file" onChange={uploadFileHandler} className="border p-2" />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {image && (
          <img
            src={image.startsWith("http") ? image : `${BASE_URL}${image}`}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Decor
        </button>
      </form>

      {/* List decor items */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {decorItems.map((decor) => (
          <div key={decor._id} className="border p-2 rounded shadow">
            <img
              src={decor.image.startsWith("http") ? decor.image : `${BASE_URL}${decor.image}`}
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
