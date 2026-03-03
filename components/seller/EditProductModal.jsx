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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Identity */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
              Product Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                >
                  <option value="Laptops & Computers">
                    Laptops & Computers
                  </option>
                  <option value="Smartphones & Tablets">
                    Smartphones & Tablets
                  </option>
                  <option value="Audio & Headphones">Audio & Headphones</option>
                  <option value="Gaming Accessories">Gaming Accessories</option>
                  <option value="Cameras & Photography">
                    Cameras & Photography
                  </option>
                  <option value="Wearables & Smartwatches">
                    Wearables & Smartwatches
                  </option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
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
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
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
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Availability <span className="text-red-500">*</span>
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
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
                  value={formData.warrantyPeriod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
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

          {/* Product Image */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
              Product Image
            </h3>
            <div>
              <label className="block text-sm font-bold mb-1">
                Main Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                {mainImagePreview ? (
                  <div className="relative">
                    <img
                      src={mainImagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto object-contain"
                    />
                    <label className="mt-2 inline-block cursor-pointer">
                      <span className="text-sm text-amazon-blue hover:underline">
                        Change Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <p className="text-sm text-gray-600">
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
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Additional Images (Optional)
            </label>
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

          {/* Specifications */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Processor/Chipset
                </label>
                <input
                  type="text"
                  name="processor"
                  value={formData.processor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  RAM/Memory
                </label>
                <input
                  type="text"
                  name="ram"
                  value={formData.ram}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Storage</label>
                <input
                  type="text"
                  name="storage"
                  value={formData.storage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Display Size
                </label>
                <input
                  type="text"
                  name="displaySize"
                  value={formData.displaySize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                Other Specifications
              </label>
              <textarea
                name="otherSpecs"
                value={formData.otherSpecs}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
