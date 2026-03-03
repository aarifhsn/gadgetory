"use client";

import { uploadToImageKit } from "@/utils/uploadToImageKit";
import { Camera, Eye, Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomerAccountClient({ user }) {
  const [viewMode, setViewMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { update } = useSession();

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    mobileNumber: user?.mobile?.number || "",
    address: user?.address || "",
    city: user?.city || "Dhaka",
  });

  const [imagePreview, setImagePreview] = useState(user?.avatar || "");

  // Add image upload handler
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Avatar size should be less than 2MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to ImageKit
    setUploadingAvatar(true);
    try {
      const avatarUrl = await uploadToImageKit(file, "/customers/avatars");
      setFormData((prev) => ({ ...prev, avatar: avatarUrl })); // ← real URL
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploadingAvatar(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/customer/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update account");
        setLoading(false);
        return;
      }

      await update({
        avatar: data.user.avatar,
        name: data.user.name,
      });

      router.refresh();
      setSuccess(true);
      setLoading(false);
      setViewMode(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <main className="max-w-[900px] mx-auto w-full p-6">
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded flex items-center gap-2">
          <span>✓ Account updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-normal">My Account</h1>
          <p className="text-sm text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(true)}
            className={`px-4 py-2 transition-colors ${
              viewMode
                ? "bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary text-gray-900 rounded-md text-sm font-medium shadow-sm"
                : "bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
            }`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            View Mode
          </button>
          <button
            onClick={() => setViewMode(false)}
            className={`px-4 py-2 transition-colors ${
              !viewMode
                ? "bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary text-gray-900 rounded-md text-sm font-medium shadow-sm"
                : "bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
            }`}
          >
            <Pencil className="w-4 h-4 inline mr-1" />
            Edit Mode
          </button>
        </div>
      </div>

      {/* View Mode */}
      {viewMode && (
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
              <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                Account Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-amazon-secondary rounded-full flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.name}</h3>
                  <p className="text-sm text-gray-500">Customer Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Email Address
                    </label>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <p className="font-medium">
                      {user?.mobile?.countryCode}{" "}
                      {user?.mobile?.number || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      City
                    </label>
                    <p className="font-medium">{user?.city || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Address
                    </label>
                    <p className="font-medium">{user?.address || "Not set"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          {/* Recent Orders */}
          <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-300 flex justify-between items-center">
              <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                Recent Orders
              </h2>
              <a
                href="/orders"
                className="text-xs text-amazon-blue hover:underline"
              >
                View All
              </a>
            </div>
            <div className="divide-y divide-gray-100">
              {user.recentOrders?.length === 0 ? (
                <p className="p-6 text-sm text-gray-500">No orders yet.</p>
              ) : (
                user.recentOrders?.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-bold">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        ৳{order.total.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-300 rounded shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-amazon-blue">
                {user.recentOrders?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Recent Orders</p>
            </div>
            <div className="bg-white border border-gray-300 rounded shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {user.recentOrders?.filter((o) => o.status === "delivered")
                  .length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Delivered</p>
            </div>
            <div className="bg-white border border-gray-300 rounded shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {user.recentOrders?.filter(
                  (o) => o.status === "pending" || o.status === "shipped",
                ).length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">In Progress</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/orders"
              className="p-4 border border-gray-200 rounded hover:border-amazon-secondary hover:shadow-sm transition"
            >
              <h3 className="font-bold mb-1">Your Orders</h3>
              <p className="text-sm text-gray-600">
                Track, return, or buy things again
              </p>
            </Link>
            <button
              onClick={() => setViewMode(false)}
              className="p-4 border border-gray-200 rounded hover:border-amazon-secondary hover:shadow-sm transition text-left"
            >
              <h3 className="font-bold mb-1">Edit Profile</h3>
              <p className="text-sm text-gray-600">
                Update your personal info and address
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {!viewMode && (
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                  Personal Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-white border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="1712345678"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                  Location
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  >
                    <option>Dhaka</option>
                    <option>Chittagong</option>
                    <option>Sylhet</option>
                    <option>Rajshahi</option>
                    <option>Khulna</option>
                    <option>Barisal</option>
                    <option>Rangpur</option>
                    <option>Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your full address"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => setViewMode(true)}
                className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingAvatar}
                className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {uploadingAvatar
                  ? "Uploading..."
                  : loading
                    ? "Saving..."
                    : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
