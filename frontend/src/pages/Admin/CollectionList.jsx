import React, { useState } from "react";
import {
  useFetchCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} from "../../slices/collectionSlice";
import { toast } from "react-toastify";

const CollectionList = () => {
  const {
    data: collections,
    isLoading,
    error,
    refetch: refetchCollections,
  } = useFetchCollectionsQuery();

  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();

  const [newName, setNewName] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Handle creating a new collection with better error handling
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      console.log("Creating collection with name:", newName.trim());
      
      const result = await createCollection({ name: newName.trim() }).unwrap();
      console.log("Create collection success:", result);
      
      toast.success("Collection created successfully");
      setNewName("");
      refetchCollections(); // Refresh the list
    } catch (err) {
      console.error("Create collection error details:", err);
      
      // Detailed error logging
      if (err?.data) {
        console.log("Error data:", err.data);
        console.log("Error status:", err.status);
      }
      
      // Better error messages
      let errorMessage = "Failed to create collection";
      
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.status === 400) {
        errorMessage = "Bad request - check collection name";
      } else if (err?.status === 401) {
        errorMessage = "Unauthorized - please login";
      } else if (err?.status === 409) {
        errorMessage = "Collection with this name already exists";
      } else if (err?.status === 500) {
        errorMessage = "Server error - please try again later";
      }
      
      toast.error(errorMessage);
    }
  };

  // Handle deleting a collection
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;

    try {
      setDeletingId(id);
      await deleteCollection(id).unwrap();
      toast.success("Collection deleted successfully");
      refetchCollections();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.data?.message || "Failed to delete collection");
    } finally {
      setDeletingId(null);
    }
  };

  const isLoadingAction = isCreating || isDeleting;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <div className="p-6 flex-1 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Collections</h1>

    

        {/* Create Collection Form */}
        <form onSubmit={handleCreate} className="mb-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Create New Collection</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter collection name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="p-3 border border-gray-300 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isCreating}
              maxLength={50}
              minLength={2}
            />
            <button
              type="submit"
              className={`px-6 py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors ${
                isCreating || !newName.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isCreating || !newName.trim()}
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {newName.length}/50 characters (minimum: 2 characters)
          </p>
        </form>

        {/* Loading/Error states */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading collections...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">Failed to load collections</p>
            <p className="text-red-500 text-sm mt-1">
              {error?.data?.message || "Please try refreshing the page"}
            </p>
          </div>
        )}

        {/* Collections List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Existing Collections ({collections?.length || 0})
            </h2>
          </div>
          
          {collections?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {collections.map((col) => (
                <li key={col._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800">{col.name}</span>
                      {col.slug && (
                        <span className="text-sm text-gray-500 ml-2">({col.slug})</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(col._id)}
                      className={`px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors ${
                        deletingId === col._id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={deletingId === col._id}
                    >
                      {deletingId === col._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !isLoading && (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 text-sm">No collections found. Create your first collection above.</p>
              </div>
            )
          )}
        </div>

     
      </div>
    </div>
  );
};

export default CollectionList;