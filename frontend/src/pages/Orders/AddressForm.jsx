import React from "react";

const AddressForm = ({ formData, onChange, prefix = "" }) => {
  // prefix lets us separate billing and shipping fields: e.g. "shipping"
  const getName = (name) => (prefix ? `${prefix}${name}` : name);

  return (
    <div className="space-y-4">
      {/* First + Last name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First name *
          </label>
          <input
            type="text"
            name={getName("FirstName")}
            value={formData[getName("FirstName")] || ""}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last name *
          </label>
          <input
            type="text"
            name={getName("LastName")}
            value={formData[getName("LastName")] || ""}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company name (optional)
        </label>
        <input
          type="text"
          name={getName("CompanyName")}
          value={formData[getName("CompanyName")] || ""}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country / Region *
        </label>
        <select
          name={getName("Country")}
          value={formData[getName("Country")] || "United States (US)"}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option>United States (US)</option>
          <option>Canada</option>
          <option>United Kingdom</option>
          <option>Australia</option>
        </select>
      </div>

      {/* Street + Apartment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street address *
        </label>
        <input
          type="text"
          name={getName("StreetAddress")}
          value={formData[getName("StreetAddress")] || ""}
          onChange={onChange}
          placeholder="House number and street name"
          required
          className="w-full mb-2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <input
          type="text"
          name={getName("Apartment")}
          value={formData[getName("Apartment")] || ""}
          onChange={onChange}
          placeholder="Apartment, suite, unit, etc. (optional)"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* City + State + Zip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name={getName("City")}
            value={formData[getName("City")] || ""}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            name={getName("State")}
            value={formData[getName("State")] || ""}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            name={getName("ZipCode")}
            value={formData[getName("ZipCode")] || ""}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name={getName("Email")}
            value={formData[getName("Email")] || ""}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name={getName("Phone")}
            value={formData[getName("Phone")] || ""}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Order notes (optional)
  </label>
  <textarea
    name="orderNotes"
    value={formData.orderNotes || ""}
  onChange={onChange}
    placeholder="Notes about your order, e.g. delivery instructions"
    className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
    rows={3}
  ></textarea>
</div>

    </div>
  );
};

export default AddressForm;
