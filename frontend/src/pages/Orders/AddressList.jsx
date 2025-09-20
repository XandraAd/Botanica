// frontend/src/screens/Orders/AddressList.jsx
import React from "react";

const AddressList = ({ addresses, onEdit, onDelete }) => {
  if (!addresses || addresses.length === 0) {
    return <p className="text-gray-600">No saved addresses.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Addresses</h2>
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-sm text-gray-600">
                {addr.street}, {addr.city}, {addr.country}{" "}
                {addr.postalCode && `- ${addr.postalCode}`}
              </p>
              <p className="text-sm text-gray-600">📞 {addr.phone}</p>

              {addr.isDefault && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  Default
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(addr)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(addr._id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressList;
