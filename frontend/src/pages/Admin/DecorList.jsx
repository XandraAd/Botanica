import React from "react";
import { useGetDecorQuery } from "../../slices/decorSlice";

const DecorList = () => {
  const { data, isLoading, error } = useGetDecorQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading decor: {error.message}</p>;

  const decorItems = Array.isArray(data) ? data : [];

  if (decorItems.length === 0) {
    return <p>No decor items yet. Add one!</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Decor Ideas</h2>
      <ul className="space-y-2">
        {decorItems.map((decor) => (
          <li key={decor._id} className="p-3 bg-gray-100 rounded">
            <p>{decor.name}</p>
            {decor.product ? (
              <p className="text-sm text-gray-600">Linked product: {decor.product.name}</p>
            ) : (
              <p className="text-sm text-red-500">No product linked</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DecorList;
