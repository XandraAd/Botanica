import React from "react";

const AddressForm = ({ formData, onChange, onSubmit, mode = "profile" }) => {
  return (
<form
  onSubmit={(e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(formData);
    } else {
      console.warn("⚠️ No onSubmit handler provided to AddressForm");
    }
  }}
  className="space-y-4"
>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="FirstName"
          placeholder="First Name"
          value={formData.FirstName}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="text"
          name="LastName"
          placeholder="Last Name"
          value={formData.LastName}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
          <input
          type="text"
          name="Email"
          placeholder="email"
          value={formData.email}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>
      <input
        type="text"
        name="StreetAddress"
        placeholder="Street Address"
        value={formData.StreetAddress}
        onChange={onChange}
        className="border rounded-lg p-2 w-full"
      />
      <input
        type="text"
        name="City"
        placeholder="City"
        value={formData.City}
        onChange={onChange}
        className="border rounded-lg p-2 w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="State"
          placeholder="State"
          value={formData.State}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="text"
          name="ZipCode"
          placeholder="Zip Code"
          value={formData.ZipCode}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="text"
          name="Country"
          placeholder="Country"
          value={formData.Country}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>
      <input
        type="text"
        name="Phone"
        placeholder="Phone Number"
        value={formData.Phone}
        onChange={onChange}
        className="border rounded-lg p-2 w-full"
      />

      {/* Save Button */}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {mode === "profile" ? "Save Address" : "Use this Address"}
      </button>
    </form>
  );
};

export default AddressForm;
