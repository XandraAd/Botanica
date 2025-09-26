import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaBox,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaHistory,
  FaChevronRight,
} from "react-icons/fa";
import OrderDetails from "../Orders/OrderDetails";
import AddressForm from "../Orders/AddressForm";
import AccountDetailsForm from "./AccountDetailsForm";
import { setCredentials } from "../../slices/authSlice";
import {
  useGetAddressesQuery,
  useGetProfileQuery,
  useAddAddressMutation,
} from "../../slices/UsersSlice";
import { useGetMyOrdersQuery } from "../../slices/orderSlice";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { data: profile } = useGetProfileQuery();
  const {
    data: addresses = [],
    isLoading: loadingAddresses,
    error: errorAddresses,
  } = useGetAddressesQuery();
  const {
    data: orders = [],
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetMyOrdersQuery();
  const [addAddress] = useAddAddressMutation();

  const [activeTab, setActiveTab] = useState("dashboard");
  const dispatch = useDispatch();

  // Lifted avatar state
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || "");

  // Address form state
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    StreetAddress: "",
    City: "",
    State: "",
    ZipCode: "",
    Country: "",
    Phone: "",
  });

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatar || "");
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async (formData) => {
    try {
      const payload = {
        fullName: `${formData.FirstName} ${formData.LastName}`,
        phone: formData.Phone,
        street: formData.StreetAddress,
        city: formData.City,
        country: formData.Country,
        postalCode: formData.ZipCode,
      };
      await addAddress(payload).unwrap();
      toast.success("Address saved!");
      setFormData({
        FirstName: "",
        LastName: "",
        StreetAddress: "",
        City: "",
        State: "",
        ZipCode: "",
        Country: "",
        Phone: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save address");
      console.error("❌ Failed to save address:", err);
    }
  };

  const ordersCount = orders?.length || 0;
  const addressesCount = addresses?.length || 0;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "orders", label: "Orders", icon: <FaBox /> },
    { id: "addresses", label: "Addresses", icon: <FaMapMarkerAlt /> },
    { id: "account", label: "Account", icon: <FaHistory /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch(setCredentials(null));
    window.location.href = "/login";
  };

  const getMemberSinceYear = () => {
    if (!profile?.createdAt) return "2023";
    return new Date(profile.createdAt).getFullYear();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Welcome back, {profile?.name}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-900">{profile?.name}</h2>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>
              </div>

              <hr className="my-4 border-gray-200" />

              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      <FaChevronRight className="text-xs text-gray-400" />
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="mr-3">
                      <FaSignOutAlt className="text-lg" />
                    </span>
                    <span className="flex-1 text-left">Log out</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Account Overview */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-medium text-gray-900 mb-4">Account Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-medium">{ordersCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Addresses</span>
                  <span className="font-medium">{addressesCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">{getMemberSinceYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6" id="profile-main">
              {activeTab === "dashboard" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h2>
                  {/* Quick stats and actions omitted for brevity */}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  {orders ? <OrderDetails orders={orders} /> : <p>Loading orders...</p>}
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <AddressForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSaveAddress}
                    mode="profile"
                  />
                </div>
              )}

              {activeTab === "account" && (
                <AccountDetailsForm avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
