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
    <main className="max-w-[1000px] mx-auto w-full p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-normal">Add a Product</h1>
          <p className="text-sm text-gray-600">
            Create a new listing for your gadget product.
          </p>
        </div>
        <Link
          href="/products/manage-list"
          className="text-amazon-blue hover:underline text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manage List
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Product Identity */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
              Step 1: Product Identity
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Apple MacBook Pro M2 - 16GB RAM"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue "
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  name="brand"
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Dell">Dell</option>
                  <option value="HP">HP</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Sony">Sony</option>
                  <option value="Razer">Razer</option>
                  <option value="Logitech">Logitech</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                >
                  <option value="new">New</option>
                  <option value="renewed">Renewed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Describe your product features, specifications, and benefits..."
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Step 2: Pricing & Inventory */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
              Step 2: Pricing & Inventory
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  required
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  name="sku"
                  placeholder="e.g., MBP-M2-16-1TB"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Availability <span className="text-red-500">*</span>
                </label>
                <select
                  name="availability"
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Pre-Order">Pre-Order</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Warranty Period
                </label>
                <select
                  name="warrantyPeriod"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                >
                  <option value="No Warranty">No Warranty</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Product Images */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
              Step 3: Product Images
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">
                Main Product Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-amazon-blue transition-colors">
                {mainImagePreview ? (
                  <div className="relative">
                    <img
                      src={mainImagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImagePreview(null);
                        setMainImageFile(null);
                      }}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <i
                      data-lucide="upload"
                      className="w-12 h-12 mx-auto text-gray-400 mb-2"
                    ></i>
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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
            <div>
              <label className="block text-sm font-bold mb-1">
                Additional Images (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Note: Additional image upload will be available after
                implementing image storage
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {additionalImagesPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative border-2 border-gray-300 rounded-md aspect-square"
                  >
                    <img
                      src={preview}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {additionalImagesPreviews.length < 4 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-amazon-blue transition-colors cursor-pointer aspect-square flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
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

        {/* Step 4: Specifications */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
              Step 4: Technical Specifications (Optional)
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Processor/Chipset
                </label>
                <input
                  type="text"
                  name="processor"
                  placeholder="e.g., Apple M2 Max"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  RAM/Memory
                </label>
                <input
                  type="text"
                  name="ram"
                  placeholder="e.g., 32GB"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-1">Storage</label>
                <input
                  type="text"
                  name="storage"
                  placeholder="e.g., 1TB SSD"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Display Size
                </label>
                <input
                  type="text"
                  name="displaySize"
                  placeholder="e.g., 16 inch"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                Other Specifications
              </label>
              <textarea
                name="otherSpecs"
                rows="3"
                placeholder="Add any other technical details (Battery life, Connectivity, Ports, etc.)"
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
          <Link
            href="/products/manage-list"
            className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </form>
    </main>
  );
}
