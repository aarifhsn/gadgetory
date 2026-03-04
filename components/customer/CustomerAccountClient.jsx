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
    <main className="max-w-[960px] mx-auto w-full px-4 py-10">
      {/* ── ALERTS ────────────────────────────────────────────────── */}
      {success && (
        <div className="mb-6 px-5 py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg
              className="w-3 h-3 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          Account updated successfully!
        </div>
      )}
      {error && (
        <div className="mb-6 px-5 py-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <svg
              className="w-3 h-3 text-rose-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          {error}
        </div>
      )}

      {/* ── PAGE HEADER ───────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
            <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
              My Account
            </h1>
          </div>
          <p className="text-sm text-[#1a1a2e]/45 pl-4">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-[#F5F3EF] p-1 rounded-xl border border-[#E8E4DD]">
          <button
            onClick={() => setViewMode(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${
              viewMode
                ? "bg-white text-[#1a1a2e] shadow-sm border border-[#E8E4DD]"
                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/70"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => setViewMode(false)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${
              !viewMode
                ? "bg-white text-[#1a1a2e] shadow-sm border border-[#E8E4DD]"
                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/70"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* VIEW MODE                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      {viewMode && (
        <div className="space-y-5">
          {/* ── PROFILE CARD ──────────────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            {/* Card header band */}
            <div className="h-20 bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4e] relative">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 50%, #D4A853 0%, transparent 60%)",
                }}
              />
            </div>

            <div className="px-6 pb-6">
              {/* Avatar — overlaps the band */}
              <div className="flex items-end justify-between -mt-10 mb-5">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-[#F5F3EF] flex items-center justify-center z-50">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-[#1a1a2e]/30" />
                  )}
                </div>
                <button
                  onClick={() => setViewMode(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1a1a2e]/50 hover:text-[#D4A853] transition-colors duration-200"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              </div>

              <h3 className="text-xl font-black text-[#1a1a2e] tracking-tight">
                {user?.name}
              </h3>
              <p className="text-xs text-[#1a1a2e]/35 font-medium tracking-wide uppercase mt-0.5">
                Customer Account
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  { icon: Mail, label: "Email Address", value: user?.email },
                  {
                    icon: Phone,
                    label: "Phone Number",
                    value:
                      `${user?.mobile?.countryCode || ""} ${user?.mobile?.number || "Not set"}`.trim(),
                  },
                  {
                    icon: MapPin,
                    label: "City",
                    value: user?.city || "Not set",
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    value: user?.address || "Not set",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-4 bg-[#FAF9F6] rounded-xl border border-[#E8E4DD]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#D4A853]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a2e]/35 mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-[#1a1a2e]/80">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── STATS ROW ─────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                value: user.recentOrders?.length || 0,
                label: "Recent Orders",
                color: "text-[#1a1a2e]",
              },
              {
                value:
                  user.recentOrders?.filter((o) => o.status === "delivered")
                    .length || 0,
                label: "Delivered",
                color: "text-emerald-600",
              },
              {
                value:
                  user.recentOrders?.filter(
                    (o) => o.status === "pending" || o.status === "shipped",
                  ).length || 0,
                label: "In Progress",
                color: "text-[#D4A853]",
              },
            ].map(({ value, label, color }) => (
              <div
                key={label}
                className="bg-white border border-[#E8E4DD] rounded-2xl p-5 text-center shadow-sm"
              >
                <p className={`text-3xl font-black tracking-tight ${color}`}>
                  {value}
                </p>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a2e]/35 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* ── RECENT ORDERS ─────────────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
                <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                  Recent Orders
                </h2>
              </div>
              <a
                href="/orders"
                className="text-[11px] font-bold text-[#D4A853] hover:underline underline-offset-4 tracking-wide"
              >
                View All →
              </a>
            </div>

            <div className="divide-y divide-[#F5F3EF]">
              {user.recentOrders?.length === 0 ? (
                <p className="p-8 text-sm text-[#1a1a2e]/35 text-center">
                  No orders yet.
                </p>
              ) : (
                user.recentOrders?.map((order) => (
                  <div
                    key={order._id}
                    className="px-6 py-4 flex justify-between items-center hover:bg-[#FAF9F6] transition-colors duration-150"
                  >
                    <div>
                      <p className="text-sm font-black text-[#1a1a2e]">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-[#1a1a2e]/35 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-[#1a1a2e]/45 mt-0.5">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-sm font-black text-[#1a1a2e]">
                        ৳{order.total.toLocaleString()}
                      </p>
                      <span
                        className={`text-[10px] font-black tracking-[0.15em] uppercase px-3 py-1 rounded-full capitalize ${statusStyles[order.status] || "bg-[#F5F3EF] text-[#1a1a2e]/50"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── QUICK ACTIONS ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/orders"
              className="group p-5 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-[#1a1a2e]">
                  Your Orders
                </h3>
                <svg
                  className="w-4 h-4 text-[#1a1a2e]/25 group-hover:text-[#D4A853] group-hover:translate-x-0.5 transition-all duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-xs text-[#1a1a2e]/45">
                Track, return, or buy things again
              </p>
            </Link>
            <button
              onClick={() => setViewMode(false)}
              className="group text-left p-5 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-[#1a1a2e]">
                  Edit Profile
                </h3>
                <svg
                  className="w-4 h-4 text-[#1a1a2e]/25 group-hover:text-[#D4A853] group-hover:translate-x-0.5 transition-all duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-xs text-[#1a1a2e]/45">
                Update your personal info and address
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* EDIT MODE                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      {!viewMode && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── PERSONAL INFORMATION ──────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                Personal Information
              </h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Avatar upload */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl border-2 border-[#E8E4DD] overflow-hidden bg-[#F5F3EF] flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-[#1a1a2e]/20" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DD] hover:border-[#D4A853]/50 rounded-xl text-xs font-bold text-[#1a1a2e]/60 hover:text-[#1a1a2e] transition-all duration-200">
                    <Camera className="w-3.5 h-3.5" />
                    {uploadingAvatar ? "Uploading..." : "Change Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#1a1a2e]/30 mt-1.5">
                    Max 2MB · JPG, PNG
                  </p>
                </div>
              </div>

              {/* Fields */}
              {[
                {
                  label: "Full Name",
                  name: "name",
                  type: "text",
                  required: true,
                  placeholder: "Your full name",
                },
                {
                  label: "Email Address",
                  name: "email",
                  type: "email",
                  required: true,
                  placeholder: "you@example.com",
                },
                {
                  label: "Phone Number",
                  name: "mobileNumber",
                  type: "tel",
                  required: false,
                  placeholder: "1712345678",
                },
              ].map(({ label, name, type, required, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                    {label}{" "}
                    {required && <span className="text-[#D4A853]">*</span>}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── LOCATION ──────────────────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                Location
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200 appearance-none"
                >
                  {[
                    "Dhaka",
                    "Chittagong",
                    "Sylhet",
                    "Rajshahi",
                    "Khulna",
                    "Barisal",
                    "Rangpur",
                    "Mymensingh",
                  ].map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your full address"
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── FORM ACTIONS ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setViewMode(true)}
              className="px-6 py-3 border border-[#E8E4DD] hover:border-[#1a1a2e]/20 bg-white rounded-xl text-sm font-bold text-[#1a1a2e]/50 hover:text-[#1a1a2e] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingAvatar}
              className="px-8 py-3 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] rounded-xl text-sm font-black tracking-wide shadow-md shadow-[#1a1a2e]/10 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploadingAvatar
                ? "Uploading..."
                : loading
                  ? "Saving..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
