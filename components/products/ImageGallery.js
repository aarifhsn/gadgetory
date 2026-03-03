"use client";

import { useState } from "react";

export default function ImageGallery({ product }) {
  const allImages = [
    product.mainImage,
    ...(product.additionalImages || []),
  ].filter(Boolean);

  const [selectedImage, setSelectedImage] = useState(
    allImages.length > 0 ? allImages[0] : null,
  );

  if (allImages.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="w-10 h-10 bg-gray-100 rounded border border-gray-300" />
        </div>
        <div className="flex-1 border border-gray-200 rounded p-4 bg-gray-50 flex items-center justify-center h-64">
          <span className="text-gray-400 text-sm">No image available</span>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`w-10 h-10 rounded overflow-hidden hover:shadow-md transition-shadow border ${
              selectedImage === img
                ? "border-amazon-secondary"
                : "border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 border border-gray-200 rounded p-4 bg-gray-50">
        <img
          src={selectedImage}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>
    </>
  );
}
