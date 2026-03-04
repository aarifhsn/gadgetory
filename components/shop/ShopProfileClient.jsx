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
    <main className="max-w-[1200px] mx-auto w-full p-6">
      .{/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Profile updated successfully!</span>
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
          <h1 className="text-3xl font-normal">Shop Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your shop information and appearance on gadgetory
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="viewModeBtn"
            className={`px-4 py-2 transition-colors ${viewMode ? "bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary text-gray-900 rounded-md text-sm font-medium shadow-sm" : "bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"}`}
            onClick={() => setViewMode(true)}
          >
            <Eye className="    w-4 h-4 inline mr-1" />
            View Mode
          </button>
          <button
            id="editModeBtn"
            className={`px-4 py-2 transition-colors ${!viewMode ? "bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary text-gray-900 rounded-md text-sm font-medium shadow-sm" : "bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"}`}
            onClick={() => setViewMode(false)}
          >
            <Pencil className="w-4 h-4 inline mr-1" />
            Edit Mode
          </button>
        </div>
      </div>
      {/* View Mode */}
      {viewMode && (
        <div id="viewMode" className="space-y-6">
          {/* Shop Preview Card */}
          <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-300 flex justify-between items-center">
              <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                Shop Preview
              </h2>
              {user?.shopProfile?.verified && (
                <span className="flex items-center bg-green-50 px-2 py-1 rounded border border-green-200">
                  <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-[10px] font-bold text-green-700 uppercase">
                    Verified
                  </span>
                </span>
              )}
            </div>
            <div className="p-6">
              {/* Shop Card Preview */}
              <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-sm overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                  <Image
                    id="previewBanner"
                    src={formData.banner || "/placeholder.png"}
                    className="w-full h-full object-cover"
                    alt="Shop Banner"
                    width={600}
                    height={192}
                    priority
                  />
                </div>

                <div className="p-4">
                  <h3
                    id="previewName"
                    className="font-bold text-lg text-amazon-blue mb-1"
                  >
                    {user?.shopName}
                  </h3>
                  <p
                    id="previewLocation"
                    className="text-sm text-gray-500 mb-3"
                  >
                    {user?.shopProfile?.address}
                  </p>

                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-amazon-secondary">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.floor(user?.shopRating || 0)
                              ? "fill-current"
                              : index < (user?.shopRating || 0)
                                ? "fill-current opacity-50"
                                : "opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-amazon-blue">
                      {user?.shopRating > 0
                        ? `${user.shopRating} (${user.totalReviews} ${user.totalReviews === 1 ? "review" : "reviews"})`
                        : "No reviews yet"}
                    </span>
                  </div>

                  <p
                    id="previewDescription"
                    className="text-sm text-gray-700 mb-4"
                  >
                    {user?.shopProfile?.description || "No description yet"}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-gray-500">Specializes in:</span>
                      <span id="previewSpecialization" className="font-bold">
                        {user?.shopProfile?.specialization || "General"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Details */}
          <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
              <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                Shop Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shop Information */}
              <div className="md:col-span-2 flex items-center gap-4 pb-4 border-b border-gray-200">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{user?.shopName}</h3>
                  <p className="text-sm text-gray-600">{user?.name}</p>
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Shop Name
                </label>
                <p className="font-medium">{user?.shopName}</p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Owner Name
                </label>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email
                </label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Phone Number
                </label>
                <p className="font-medium">
                  {user?.mobile?.countryCode} - {user?.mobile?.number}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Location
                </label>
                <p className="font-medium">
                  {user?.shopProfile?.city || "Not set"}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Specialization
                </label>
                <p className="font-medium">
                  {user?.shopProfile?.specialization || "Not set"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Shop Description
                </label>
                <p className="font-medium">
                  {user?.shopProfile?.description || "No description"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Address
                </label>
                <p className="font-medium">
                  {user?.shopProfile?.address || "Not set"}
                </p>
              </div>
              {user?.shopProfile?.yearEstablished && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Year Established
                  </label>
                  <p className="font-medium">
                    {user.shopProfile.yearEstablished}
                  </p>
                </div>
              )}
              {user?.shopProfile?.website && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Website
                  </label>
                  <a
                    href={user.shopProfile.website}
                    target="_blank"
                    className="font-medium text-amazon-blue hover:underline"
                  >
                    {user.shopProfile.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Edit Mode */}
      {!viewMode && (
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Owner Name *
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
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer px-4 py-2 bg-white border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="1712345678"
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Shop Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  />
                </div>
              </div>
            </div>

            {/* Location & Specialization */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                  Location & Specialization
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      City/Location *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
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
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                    >
                      <option>Laptops & PCs</option>
                      <option>Smartphones</option>
                      <option>Gaming Gear</option>
                      <option>Audio & Headphones</option>
                      <option>Cameras & Lenses</option>
                      <option>Wearables</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Full Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  />
                </div>
              </div>
            </div>

            {/* Shop Banner */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                  Shop Banner Image
                </h2>
              </div>
              <div className="p-6">
                {user?.shopProfile?.banner && (
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">
                      Current Banner
                    </label>
                    <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-md border border-gray-300">
                      <Image
                        src={
                          formData.banner ||
                          "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600"
                        }
                        className="w-full h-full object-cover"
                        alt={user?.shopName + " Banner"}
                        width={600}
                        height={192}
                        priority
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Upload New Banner
                  </label>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-amazon-blue transition-colors cursor-pointer"
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 5MB (Recommended: 1200 x 400 pixels)
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
            </div>

            {/* Additional Information */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                  Additional Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Year Established
                    </label>
                    <input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleChange}
                      placeholder="e.g., 2014"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Number of Employees
                    </label>
                    <input
                      type="number"
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleChange}
                      placeholder="e.g., 25"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Official Brand Partnerships (Optional)
                  </label>
                  <input
                    type="text"
                    name="brandPartnerships"
                    value={formData.brandPartnerships}
                    onChange={handleChange}
                    placeholder="e.g., Apple, Dell, HP, Lenovo"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple brands with commas
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.yourshop.com"
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
                disabled={loading}
                className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
