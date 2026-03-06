"use client";

import { updateProduct } from "@/app/actions/productManagementActions";
import { uploadToImageKit } from "@/utils/uploadToImageKit";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState(
    product?.mainImage || null,
  );
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [additionalImagesFiles, setAdditionalImagesFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    condition: "",
    description: "",
    price: "",
    stockQuantity: "",
    sku: "",
    availability: "",
    warrantyPeriod: "",
    processor: "",
    ram: "",
    storage: "",
    displaySize: "",
    otherSpecs: "",
  });

  // Initialize form data when product changes
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        brand: product.brand || "",
        condition: product.condition || "new",
        description: product.description || "",
        price: product.price || "",
        stockQuantity: product.stockQuantity || "",
        sku: product.sku || "",
        availability: product.availability || "In Stock",
        warrantyPeriod: product.warrantyPeriod || "No Warranty",
        processor: product.specifications?.processor || "",
        ram: product.specifications?.ram || "",
        storage: product.specifications?.storage || "",
        displaySize: product.specifications?.displaySize || "",
        otherSpecs: product.specifications?.otherSpecs || "",
      });
      setMainImagePreview(product.mainImage);

      // ✅ Reset files state
      setAdditionalImagesFiles([]);

      // ✅ Set additional images from product
      if (product.additionalImages && product.additionalImages.length > 0) {
        setAdditionalImagesPreviews(product.additionalImages);
      } else {
        setAdditionalImagesPreviews([]);
      }
    }
  }, [isOpen, product]); //

  // Add new useEffect to cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal closes
      setAdditionalImagesFiles([]);
      setAdditionalImagesPreviews([]);
      setMainImagePreview(null);
      setError("");
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle main image preview
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (additionalImagesPreviews.length + files.length > 4) {
      setError("Maximum 4 additional images allowed");
      return;
    }

    setError("");

    // Store files directly, upload them later
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setAdditionalImagesPreviews((prev) => [...prev, ...newPreviews]);

    // Also store the actual files for upload
    setAdditionalImagesFiles((prev) => [...prev, ...files]);
  };

  const removeAdditionalImage = (index) => {
    const preview = additionalImagesPreviews[index];

    // Remove from previews
    setAdditionalImagesPreviews((prev) => prev.filter((_, i) => i !== index));

    // If it's a blob URL (new upload), also remove from files array
    if (preview.startsWith("blob:")) {
      // Find which file this preview corresponds to
      const blobIndex = additionalImagesPreviews
        .slice(0, index)
        .filter((p) => p.startsWith("blob:")).length;

      setAdditionalImagesFiles((prev) =>
        prev.filter((_, i) => i !== blobIndex),
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload main image if it's base64 (new upload)
      let finalMainImage = mainImagePreview;
      if (mainImagePreview && mainImagePreview.startsWith("data:")) {
        const blob = await fetch(mainImagePreview).then((r) => r.blob());
        const file = new File([blob], "main-image.jpg", { type: blob.type });
        finalMainImage = await uploadToImageKit(file);
      }

      // Process additional images
      const finalAdditionalImages = [];

      // Keep existing images (URLs that start with http OR https)
      const existingImages = additionalImagesPreviews.filter((img) =>
        img.startsWith("http"),
      );
      finalAdditionalImages.push(...existingImages);

      // Upload new images (from files array)
      for (const file of additionalImagesFiles) {
        const url = await uploadToImageKit(file);
        finalAdditionalImages.push(url);
      }

      console.log("Existing images:", existingImages); // DEBUG
      console.log("New files to upload:", additionalImagesFiles); // DEBUG
      console.log("Final images:", finalAdditionalImages); // DEBUG

      const updateData = {
        ...formData,
        mainImage: finalMainImage,
        additionalImages: finalAdditionalImages,
        specifications: {
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
          displaySize: formData.displaySize,
          otherSpecs: formData.otherSpecs,
        },
      };

      const result = await updateProduct(product._id, updateData);

      if (result.success) {
        toast.success("Product updated successfully!");
        onSuccess();
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a2e28]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl shadow-[#1a2e28]/20 w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#E8E4DD] my-8 flex flex-col">
        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#2D7D6F] via-[#3a9688] to-[#5ab5a5] shrink-0" />

        {/* ── STICKY HEADER ───────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#E8E4DD] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-[#2D7D6F]" />
            <h2 className="text-base font-black text-[#1a2e28] tracking-tight">
              Edit Product
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1a2e28]/25 hover:text-[#1a2e28] hover:bg-[#F0F4F3] transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── SCROLLABLE BODY ─────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1">
          {/* Error */}
          {error && (
            <div className="mx-6 mt-5 px-4 py-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 text-sm font-medium">
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

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* ── PRODUCT IDENTITY ────────────────────────────────── */}
            <div className="bg-[#F0F4F3] border border-[#d0dbd9] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#d0dbd9] flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                  1
                </div>
                <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/60">
                  Product Identity
                </h3>
              </div>
              <div className="p-5 space-y-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                      Product Name <span className="text-[#2D7D6F]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
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
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="appearance-none w-full px-4 py-3 pr-9 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all cursor-pointer"
                      >
                        {[
                          "Laptops & Computers",
                          "Smartphones & Tablets",
                          "Audio & Headphones",
                          "Gaming Accessories",
                          "Cameras & Photography",
                          "Wearables & Smartwatches",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
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
                          value={formData[name]}
                          onChange={handleInputChange}
                          required
                          className="appearance-none w-full px-4 py-3 pr-9 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all cursor-pointer capitalize"
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
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] placeholder:text-[#1a2e28]/25 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ── PRICING & INVENTORY ─────────────────────────────── */}
            <div className="bg-[#F0F4F3] border border-[#d0dbd9] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#d0dbd9] flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                  2
                </div>
                <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/60">
                  Pricing & Inventory
                </h3>
              </div>
              <div className="p-5 space-y-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Price (৳)",
                      name: "price",
                      type: "number",
                      min: "0",
                      step: "0.01",
                      required: true,
                    },
                    {
                      label: "Stock Quantity",
                      name: "stockQuantity",
                      type: "number",
                      min: "0",
                      required: true,
                    },
                    { label: "SKU", name: "sku", type: "text" },
                  ].map(({ label, name, type, min, step, required }) => (
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
                        onChange={handleInputChange}
                        required={required}
                        min={min}
                        step={step}
                        className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
                      />
                    </div>
                  ))}
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
                        {required && (
                          <span className="text-[#2D7D6F] ml-1">*</span>
                        )}
                      </label>
                      <div className="relative">
                        <select
                          name={name}
                          value={formData[name]}
                          onChange={handleInputChange}
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
              </div>
            </div>

            {/* ── IMAGES ──────────────────────────────────────────── */}
            <div className="bg-[#F0F4F3] border border-[#d0dbd9] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#d0dbd9] flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                  3
                </div>
                <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/60">
                  Product Images
                </h3>
              </div>
              <div className="p-5 space-y-4 bg-white">
                {/* Main image */}
                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-2">
                    Main Image
                  </label>
                  <div className="border-2 border-dashed border-[#d0dbd9] hover:border-[#2D7D6F]/50 rounded-2xl p-6 text-center transition-colors bg-[#F0F4F3]">
                    {mainImagePreview ? (
                      <div>
                        <img
                          src={mainImagePreview}
                          alt="Preview"
                          className="max-h-44 mx-auto object-contain rounded-xl mb-3"
                        />
                        <label className="cursor-pointer text-xs font-bold text-[#2D7D6F] hover:underline underline-offset-4">
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="w-10 h-10 rounded-2xl bg-[#2D7D6F]/10 flex items-center justify-center mx-auto mb-2">
                          <svg
                            className="w-5 h-5 text-[#2D7D6F]"
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
                        <p className="text-xs font-bold text-[#1a2e28]/40">
                          Click to upload image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Additional images */}
                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-2">
                    Additional Images{" "}
                    <span className="normal-case tracking-normal font-medium text-[11px] text-[#1a2e28]/25">
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
                      <label className="border-2 border-dashed border-[#d0dbd9] hover:border-[#2D7D6F]/50 rounded-xl aspect-square flex items-center justify-center cursor-pointer transition-colors bg-[#F0F4F3]">
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

            {/* ── SPECIFICATIONS ──────────────────────────────────── */}
            <div className="bg-[#F0F4F3] border border-[#d0dbd9] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#d0dbd9] flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2D7D6F] flex items-center justify-center text-[9px] font-black text-white">
                  4
                </div>
                <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/60">
                  Technical Specifications
                </h3>
              </div>
              <div className="p-5 space-y-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Processor / Chipset", name: "processor" },
                    { label: "RAM / Memory", name: "ram" },
                    { label: "Storage", name: "storage" },
                    { label: "Display Size", name: "displaySize" },
                  ].map(({ label, name }) => (
                    <div key={name}>
                      <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/40 mb-1.5">
                        {label}
                      </label>
                      <input
                        type="text"
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200"
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
                    value={formData.otherSpecs}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl text-sm text-[#1a2e28] outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ── FOOTER ACTIONS ──────────────────────────────────── */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
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
                    Updating...
                  </span>
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
