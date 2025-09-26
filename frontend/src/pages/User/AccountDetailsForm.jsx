import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUser, FaSave, FaTimes, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { setCredentials } from "../../slices/authSlice";
import Message from "../../components/Message";

const AccountDetailsForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(userInfo?.avatar || "");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Initialize form
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setAvatarUrl(userInfo.avatar || "");
    }
  }, [userInfo]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
      if (formData.newPassword && formData.newPassword.length < 6)
        newErrors.newPassword = "New password must be at least 6 characters";
      if (formData.newPassword !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadAvatarToServer = async () => {
    if (!avatarFile) return avatarUrl;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    setUploading(true);
    try {
      const { data } = await axios.post("/api/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setUploading(false);
      return data.url;
    } catch (err) {
      setUploading(false);
      console.error("Avatar upload failed:", err);
      toast.error(err?.response?.data?.message || "Avatar upload failed");
      throw new Error("Avatar upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Upload avatar first if file selected
      const finalAvatarUrl = await uploadAvatarToServer();

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.newPassword || undefined,
        avatar: finalAvatarUrl,
      };

      const { data } = await axios.put("/api/users/profile", payload, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      dispatch(setCredentials(data));
      setMessage("Profile updated successfully");
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
      setAvatarFile(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleReset = () => {
    setFormData({
      name: userInfo.name || "",
      email: userInfo.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setAvatarUrl(userInfo.avatar || "");
    setAvatarFile(null);
    setErrors({});
    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Account Details</h2>
        <p className="text-gray-600">Manage your account information, password, and avatar</p>
      </div>

      {message && (
        <Message variant="success">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2" /> {message}
          </div>
        </Message>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              "No Avatar"
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
        </div>

        {/* Personal Info */}
        <div className="bg-gray-50 p-5 rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Password */}
        <div className="bg-gray-50 p-5 rounded-xl space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          <p className="text-gray-600 text-sm">Leave blank if you don't want to change password.</p>

          {["current", "new", "confirm"].map((field) => (
            <div key={field} className="relative">
              <label className="block text-sm font-medium text-gray-700 capitalize">{field} password</label>
              <input
                type={showPassword[field] ? "text" : "password"}
                name={field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"}
                value={
                  field === "current"
                    ? formData.currentPassword
                    : field === "new"
                    ? formData.newPassword
                    : formData.confirmPassword
                }
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${
                  errors[field + "Password"] ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility(field)}
              >
                {showPassword[field] ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
              </button>
              {errors[field + "Password"] && <p className="text-red-600 text-sm mt-1">{errors[field + "Password"]}</p>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <FaTimes className="mr-2" /> Reset
          </button>
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            disabled={uploading}
          >
            <FaSave className="mr-2" /> {uploading ? "Uploading..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetailsForm;
