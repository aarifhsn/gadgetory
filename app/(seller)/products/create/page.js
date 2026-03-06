"use client";

import { createProduct } from "@/app/actions/productActions";
import categories from "@/data/categories";
import { uploadToImageKit } from "@/utils/uploadToImageKit";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ProductsCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [additionalImagesFiles, setAdditionalImagesFiles] = useState([]);

  // Handle main image preview
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setMainImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 4 images
    if (additionalImagesPreviews.length + files.length > 4) {
      setError("Maximum 4 additional images allowed");
      return;
    }

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagesPreviews((prev) => [...prev, reader.result]);
        setAdditionalImagesFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImagesPreviews((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagesFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!mainImageFile) {
        setError("Main image is required");
        setLoading(false);
        return;
      }

      // 1️⃣ Upload image FIRST
      const mainImageUrl = await uploadToImageKit(mainImageFile);

      // Upload additional images
      const additionalImageUrls = [];
      for (const file of additionalImagesFiles) {
        const url = await uploadToImageKit(file);
        additionalImageUrls.push(url);
      }

      // 2️⃣ Prepare form data
      const formData = new FormData(e.target);
      formData.set("mainImage", mainImageUrl);
      formData.set("additionalImages", JSON.stringify(additionalImageUrls));

      // 3️⃣ Call server action
      const result = await createProduct(formData);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      toast.success(result.data.message || "Product created!");
      router.push("/products/manage-list");
    } catch (err) {
      console.error(err);
      setError(toast.error(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1000px] mx-auto w-full px-4 md:px-8 py-10">
      {/* ── PAGE HEADER ───────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-[#2D7D6F]" />
            <h1 className="text-2xl font-black text-[#1a2e28] tracking-tight">
              Add a Product
            </h1>
          </div>
          <p className="text-sm text-[#1a2e28]/40 pl-4">
            Create a new listing for your gadget store.
          </p>
        </div>
        <Link
          href="/products/manage-list"
          className="flex items-center gap-1.5 text-xs font-bold text-[#1a2e28]/40 hover:text-[#2D7D6F] transition-colors duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Manage List
        </Link>
      </div>

      {/* ── ERROR ALERT ───────────────────────────────────────────── */}
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── STEP 1: PRODUCT IDENTITY ──────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[10px] font-black text-white">
              1
            </div>
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
              Product Identity
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                  Product Name <span className="text-[#2D7D6F]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Apple MacBook Pro M2 - 16GB RAM"
                  className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                  Category <span className="text-[#2D7D6F]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    required
                    className="appearance-none w-full px-4 py-3 pr-9 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.name}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Brand",
                  name: "brand",
                  options: [
                    "Apple",
                    "Samsung",
                    "Dell",
                    "HP",
                    "Lenovo",
                    "Sony",
                    "Razer",
                    "Logitech",
                    "Other",
                  ],
                },
                {
                  label: "Condition",
                  name: "condition",
                  options: ["new", "renewed"],
                },
              ].map(({ label, name, options }) => (
                <div key={name}>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                    {label} <span className="text-[#2D7D6F]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name={name}
                      required
                      className="appearance-none w-full px-4 py-3 pr-9 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 cursor-pointer capitalize"
                    >
                      {options.map((o) => (
                        <option key={o} value={o} className="capitalize">
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
                Description <span className="text-[#2D7D6F]">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe your product features, specifications, and benefits…"
                className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── STEP 2: PRICING & INVENTORY ───────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[10px] font-black text-white">
              2
            </div>
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
              Pricing & Inventory
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Price (৳)",
                  name: "price",
                  type: "number",
                  placeholder: "0.00",
                  min: "0",
                  step: "0.01",
                  required: true,
                },
                {
                  label: "Stock Quantity",
                  name: "stockQuantity",
                  type: "number",
                  placeholder: "0",
                  min: "0",
                  required: true,
                },
                {
                  label: "SKU (Optional)",
                  name: "sku",
                  type: "text",
                  placeholder: "e.g., MBP-M2-16-1TB",
                },
              ].map(
                ({ label, name, type, placeholder, min, step, required }) => (
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
                      required={required}
                      min={min}
                      step={step}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                    />
                  </div>
                ),
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Availability",
                  name: "availability",
                  options: ["In Stock", "Pre-Order", "Out of Stock"],
                  required: true,
                },
                {
                  label: "Warranty Period",
                  name: "warrantyPeriod",
                  options: [
                    "No Warranty",
                    "6 Months",
                    "1 Year",
                    "2 Years",
                    "3 Years",
                  ],
                },
              ].map(({ label, name, options, required }) => (
                <div key={name}>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                    {label}
                    {required && <span className="text-[#2D7D6F] ml-1">*</span>}
                  </label>
                  <div className="relative">
                    <select
                      name={name}
                      required={required}
                      className="appearance-none w-full px-4 py-3 pr-9 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 cursor-pointer"
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
          </div>
        </div>

        {/* ── STEP 3: PRODUCT IMAGES ────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[10px] font-black text-white">
              3
            </div>
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
              Product Images
            </h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Main image */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-2">
                Main Image <span className="text-[#2D7D6F]">*</span>
              </label>
              <div className="border-2 border-dashed border-[#d0dbd9] hover:border-[#2D7D6F]/50 rounded-2xl p-8 text-center transition-colors duration-200 bg-[#F0F4F3]">
                {mainImagePreview ? (
                  <div>
                    <img
                      src={mainImagePreview}
                      alt="Preview"
                      className="max-h-56 mx-auto object-contain rounded-xl mb-3"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImagePreview(null);
                        setMainImageFile(null);
                      }}
                      className="text-xs font-bold text-rose-500 hover:underline"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="w-12 h-12 rounded-2xl bg-[#2D7D6F]/10 flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6 text-[#2D7D6F]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-[#1a2e28]/50 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-[#1a2e28]/30">
                      PNG, JPG up to 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Additional images */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-2">
                Additional Images{" "}
                <span className="text-[#1a2e28]/25 normal-case tracking-normal font-medium text-[11px]">
                  — up to 4
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {additionalImagesPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#d0dbd9] bg-[#F0F4F3]"
                  >
                    <img
                      src={preview}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {additionalImagesPreviews.length < 4 && (
                  <label className="border-2 border-dashed border-[#d0dbd9] hover:border-[#2D7D6F]/50 rounded-xl aspect-square flex items-center justify-center cursor-pointer transition-colors duration-200 bg-[#F0F4F3]">
                    <Plus className="w-7 h-7 text-[#1a2e28]/20" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 4: SPECIFICATIONS ────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[10px] font-black text-white">
              4
            </div>
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a2e28]">
              Technical Specifications
              <span className="ml-2 text-[#1a2e28]/25 normal-case tracking-normal font-medium text-[11px]">
                Optional
              </span>
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Processor / Chipset",
                  name: "processor",
                  placeholder: "e.g., Apple M2 Max",
                },
                {
                  label: "RAM / Memory",
                  name: "ram",
                  placeholder: "e.g., 32GB",
                },
                {
                  label: "Storage",
                  name: "storage",
                  placeholder: "e.g., 1TB SSD",
                },
                {
                  label: "Display Size",
                  name: "displaySize",
                  placeholder: "e.g., 16 inch",
                },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                Other Specifications
              </label>
              <textarea
                name="otherSpecs"
                rows={3}
                placeholder="Battery life, connectivity, ports, etc."
                className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <Link
            href="/products/manage-list"
            className="px-6 py-3 bg-white border border-[#E8E4DD] hover:border-[#1a2e28]/20 text-xs font-bold text-[#1a2e28]/50 hover:text-[#1a2e28] rounded-xl transition-all duration-200 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#2D7D6F] hover:bg-[#1a2e28] text-white text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-md shadow-[#2D7D6F]/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Publishing...
              </span>
            ) : (
              "Publish Product"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
