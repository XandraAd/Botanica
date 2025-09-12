// AdminLayout.jsx
import React from "react";
import AdminMenu from "./AdminMenu";

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <AdminMenu />
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export default AdminLayout;
