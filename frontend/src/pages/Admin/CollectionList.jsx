import React, { useState } from "react";
import {
  useFetchCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} from "../../slices/collectionSlice";
import { toast } from "react-toastify";


const CollectionList = () => {
  const { data: collections, isLoading, error } = useFetchCollectionsQuery();
  const [createCollection] = useCreateCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [newName, setNewName] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Collection name is required");
      return;
    }
    try {
      await createCollection({ name: newName }).unwrap();
      toast.success("Collection created");
      setNewName("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create collection");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;
    try {
      await deleteCollection(id).unwrap();
      toast.success("Collection deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete collection");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
     
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Manage Collections</h1>

        <form onSubmit={handleCreate} className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="New Collection Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded"
          >
            Add
          </button>
        </form>

        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Failed to load collections</p>}

        <ul className="space-y-2">
          {collections?.map((col) => (
            <li
              key={col._id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <span>{col.name}</span>
              <button
                onClick={() => handleDelete(col._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollectionList;
