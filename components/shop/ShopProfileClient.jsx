"use client";

import { uploadToImageKit } from "@/utils/uploadToImageKit";
import { CheckCircle, Eye, Pencil, Star, Upload, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ShopProfileClient({ user }) {
  const { update } = useSession();
  const [viewMode, setViewMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    avatar: user?.avatar || "",
    shopName: user?.shopName || "",
    name: user?.name || "",
    email: user?.email || "",
    mobileNumber: user?.mobile?.number || "",
    description: user?.shopProfile?.description || "",
    city: user?.shopProfile?.city || "Dhaka",
    specialization: user?.shopProfile?.specialization || "Laptops & PCs",
    address: user?.shopProfile?.address || "",
    yearEstablished: user?.shopProfile?.yearEstablished || "",
    numberOfEmployees: user?.shopProfile?.numberOfEmployees || "",
    brandPartnerships: user?.shopProfile?.brandPartnerships?.join(", ") || "",
    website: user?.shopProfile?.website || "",
    banner: user?.shopProfile?.banner || "",
  });

  const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
  const MAX_BANNER_SIZE = 5 * 1024 * 1024;

  // Add image upload handler
  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar size should be less than 2MB");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const avatarUrl = await uploadToImageKit(file, "/shops/avatars");

      setFormData((prev) => ({
        ...prev,
        avatar: avatarUrl,
      }));
      setAvatarPreview(avatarUrl);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBannerUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_BANNER_SIZE) {
      setError("Banner size should be less than 5MB");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bannerUrl = await uploadToImageKit(file, "/shops/banners");

      setFormData((prev) => ({
        ...prev,
        banner: bannerUrl,
      }));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      const updateData = {
        avatar: formData.avatar,
        shopName: formData.shopName,
        name: formData.name,
        email: formData.email,
        mobile: {
          countryCode: "+880",
          number: formData.mobileNumber,
        },
        description: formData.description,
        city: formData.city,
        specialization: formData.specialization,
        address: formData.address,
        yearEstablished: formData.yearEstablished
          ? parseInt(formData.yearEstablished)
          : undefined,
        numberOfEmployees: formData.numberOfEmployees
          ? parseInt(formData.numberOfEmployees)
          : undefined,
        brandPartnerships: formData.brandPartnerships
          ? formData.brandPartnerships
              .split(",")
              .map((b) => b.trim())
              .filter(Boolean)
          : [],
        website: formData.website,
        banner: formData.banner,
      };

      const res = await fetch("/api/shop/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setViewMode(true);

      // ✅ Update the session with new avatar
      try {
        await update({
          avatar: updateData.avatar,
          name: updateData.name,
        });

        console.log("Session updated successfully");

        // Small delay to ensure session is saved
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Refresh to get new data
        router.refresh();
      } catch (error) {
        console.error("Session update failed:", error);
        // Fallback: just reload the page
        window.location.reload();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  {
    loading && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded">Uploading banner…</div>
      </div>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-10">
      {/* ── SUCCESS / ERROR ALERTS ──────────────────────────────── */}
      {success && (
        <div className="mb-6 px-4 py-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 text-sm font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="mb-6 px-4 py-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 text-sm font-medium">
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-[#2D7D6F]" />
            <h1 className="text-2xl font-black text-[#1a2e28] tracking-tight">
              Shop Profile
            </h1>
          </div>
          <p className="text-sm text-[#1a2e28]/35 pl-4">
            Manage your shop information and appearance on gadgetory.
          </p>
        </div>

        {/* View / Edit toggle */}
        <div className="flex gap-1 p-1 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl self-start sm:self-auto">
          {[
            {
              label: "View",
              icon: Eye,
              active: viewMode,
              onClick: () => setViewMode(true),
            },
            {
              label: "Edit",
              icon: Pencil,
              active: !viewMode,
              onClick: () => setViewMode(false),
            },
          ].map(({ label, icon: Icon, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black tracking-wide rounded-lg transition-all duration-200 ${
                active
                  ? "bg-white text-[#1a2e28] shadow-sm border border-[#d0dbd9]"
                  : "text-[#1a2e28]/35 hover:text-[#1a2e28]/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label} Mode
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
        VIEW MODE
    ════════════════════════════════════════════════════════════ */}
      {viewMode && (
        <div className="space-y-5">
          {/* Shop Preview Card */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-[#2D7D6F]" />
                <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
                  Shop Preview
                </h2>
              </div>
              {user?.shopProfile?.verified && (
                <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Verified
                  </span>
                </span>
              )}
            </div>
            <div className="p-6 flex justify-center">
              <div className="w-full max-w-sm bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-md">
                {/* Banner */}
                <div className="h-44 overflow-hidden bg-[#F0F4F3] relative">
                  <Image
                    src={formData.banner || "/placeholder.png"}
                    alt="Shop Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-lg text-[#1a2e28] tracking-tight mb-0.5">
                    {user?.shopName}
                  </h3>
                  <p className="text-xs text-[#1a2e28]/40 mb-3">
                    {user?.shopProfile?.address}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(user?.shopRating || 0) ? "fill-[#D4A853] text-[#D4A853]" : "fill-[#E8E4DD] text-[#E8E4DD]"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#1a2e28]/35 font-medium">
                      {user?.shopRating > 0
                        ? `${user.shopRating} · ${user.totalReviews} ${user.totalReviews === 1 ? "review" : "reviews"}`
                        : "No reviews yet"}
                    </span>
                  </div>

                  <p className="text-xs text-[#1a2e28]/55 leading-relaxed mb-4">
                    {user?.shopProfile?.description || "No description yet"}
                  </p>

                  <div className="pt-3 border-t border-[#F5F3EF] flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/25 mb-0.5">
                        Specializes in
                      </p>
                      <p className="text-xs font-bold text-[#2D7D6F]">
                        {user?.shopProfile?.specialization || "General"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-[#2D7D6F]" />
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
                Shop Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar + name */}
              <div className="flex items-center gap-4 pb-5 border-b border-[#F5F3EF]">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#E8E4DD] bg-[#F0F4F3] shrink-0 flex items-center justify-center">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-[#1a2e28]/15" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1a2e28] tracking-tight">
                    {user?.shopName}
                  </h3>
                  <p className="text-sm text-[#1a2e28]/40">{user?.name}</p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Shop Name", value: user?.shopName },
                  { label: "Owner Name", value: user?.name },
                  { label: "Email", value: user?.email },
                  {
                    label: "Phone",
                    value: `${user?.mobile?.countryCode} ${user?.mobile?.number}`,
                  },
                  {
                    label: "City",
                    value: user?.shopProfile?.city || "Not set",
                  },
                  {
                    label: "Specialization",
                    value: user?.shopProfile?.specialization || "Not set",
                  },
                  ...(user?.shopProfile?.yearEstablished
                    ? [
                        {
                          label: "Year Established",
                          value: user.shopProfile.yearEstablished,
                        },
                      ]
                    : []),
                  ...(user?.shopProfile?.website
                    ? [
                        {
                          label: "Website",
                          value: user.shopProfile.website,
                          href: user.shopProfile.website,
                        },
                      ]
                    : []),
                ].map(({ label, value, href }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-4 bg-[#F0F4F3] rounded-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/30 mb-1">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          className="text-sm font-bold text-[#2D7D6F] hover:underline underline-offset-4 truncate block"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-[#1a2e28] truncate">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="md:col-span-2 p-4 bg-[#F0F4F3] rounded-xl">
                  <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/30 mb-1">
                    Shop Description
                  </p>
                  <p className="text-sm font-medium text-[#1a2e28]/70 leading-relaxed">
                    {user?.shopProfile?.description || "No description"}
                  </p>
                </div>

                <div className="md:col-span-2 p-4 bg-[#F0F4F3] rounded-xl">
                  <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/30 mb-1">
                    Address
                  </p>
                  <p className="text-sm font-medium text-[#1a2e28]/70">
                    {user?.shopProfile?.address || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
        EDIT MODE
    ════════════════════════════════════════════════════════════ */}
      {!viewMode && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── BASIC INFORMATION ─────────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                1
              </div>
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
                Basic Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Shop Name", name: "shopName", required: true },
                  { label: "Owner Name", name: "name", required: true },
                  {
                    label: "Email",
                    name: "email",
                    type: "email",
                    required: true,
                  },
                  {
                    label: "Phone Number",
                    name: "mobileNumber",
                    type: "tel",
                    placeholder: "1712345678",
                    required: true,
                  },
                ].map(
                  ({ label, name, type = "text", placeholder, required }) => (
                    <div key={name}>
                      <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                        {label}
                        {required && (
                          <span className="text-[#2D7D6F] ml-1">*</span>
                        )}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required={required}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                      />
                    </div>
                  ),
                )}
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-[#F0F4F3] border border-[#d0dbd9] overflow-hidden flex items-center justify-center shrink-0">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#1a2e28]/15" />
                    )}
                  </div>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-[#F0F4F3] border border-[#d0dbd9] hover:border-[#2D7D6F]/40 text-xs font-bold text-[#1a2e28]/60 hover:text-[#1a2e28] rounded-xl transition-all duration-200">
                    <Upload className="w-3.5 h-3.5" />
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      disabled={loading}
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                  Shop Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── LOCATION & SPECIALIZATION ─────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                2
              </div>
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
                Location & Specialization
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "City",
                    name: "city",
                    options: [
                      "Dhaka",
                      "Chittagong",
                      "Sylhet",
                      "Rajshahi",
                      "Khulna",
                      "Barisal",
                      "Rangpur",
                      "Mymensingh",
                    ],
                    required: true,
                  },
                  {
                    label: "Specialization",
                    name: "specialization",
                    options: [
                      "Laptops & PCs",
                      "Smartphones",
                      "Gaming Gear",
                      "Audio & Headphones",
                      "Cameras & Lenses",
                      "Wearables",
                      "Accessories",
                    ],
                    required: true,
                  },
                ].map(({ label, name, options, required }) => (
                  <div key={name}>
                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                      {label}
                      {required && (
                        <span className="text-[#2D7D6F] ml-1">*</span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required={required}
                        className="appearance-none w-full px-4 py-3 pr-9 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all cursor-pointer"
                      >
                        {options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-3 h-3 text-[#1a2e28]/30 rotate-90 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── SHOP BANNER ───────────────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                3
              </div>
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
                Shop Banner
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {formData.banner && (
                <div className="h-44 rounded-2xl overflow-hidden border border-[#d0dbd9] relative">
                  <Image
                    src={formData.banner}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-[#d0dbd9] hover:border-[#2D7D6F]/50 rounded-2xl p-8 text-center bg-[#F0F4F3] cursor-pointer transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2D7D6F]/10 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[#2D7D6F]" />
                </div>
                <p className="text-sm font-bold text-[#1a2e28]/40 mb-1">
                  {formData.banner
                    ? "Click to replace banner"
                    : "Click to upload banner"}
                </p>
                <p className="text-xs text-[#1a2e28]/25">
                  PNG, JPG up to 5MB · Recommended: 1200 × 400px
                </p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  disabled={loading}
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* ── ADDITIONAL INFORMATION ────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                4
              </div>
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
                Additional Information
                <span className="ml-2 normal-case tracking-normal font-medium text-[11px] text-[#1a2e28]/25">
                  Optional
                </span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Year Established",
                    name: "yearEstablished",
                    type: "number",
                    placeholder: "e.g., 2014",
                  },
                  {
                    label: "Number of Employees",
                    name: "numberOfEmployees",
                    type: "number",
                    placeholder: "e.g., 25",
                  },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                  Brand Partnerships
                </label>
                <input
                  type="text"
                  name="brandPartnerships"
                  value={formData.brandPartnerships}
                  onChange={handleChange}
                  placeholder="e.g., Apple, Dell, HP, Lenovo"
                  className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                />
                <p className="text-[11px] text-[#1a2e28]/25 mt-1.5 font-medium">
                  Separate multiple brands with commas
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.yourshop.com"
                  className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setViewMode(true)}
              className="px-6 py-3 bg-white border border-[#d0dbd9] hover:border-[#1a2e28]/20 text-xs font-bold text-[#1a2e28]/50 hover:text-[#1a2e28] rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#2D7D6F] hover:bg-[#1a2e28] text-white text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-md shadow-[#2D7D6F]/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
