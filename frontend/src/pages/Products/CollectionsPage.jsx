// frontend/src/pages/Products/CollectionsPage.jsx
import React from "react";
import { useFetchCollectionsQuery } from "../../slices/collectionSlice";
import CollectionCard from "../../components/CollectionCard";

const CollectionsPage = () => {
  const { data: collections, isLoading, isError } = useFetchCollectionsQuery();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading collections...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading collections</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-green-800">🌿 All Collections</h2>

      {/* Grid of collection cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {collections?.map((collection) => (
          <CollectionCard key={collection._id} collection={collection} />
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
