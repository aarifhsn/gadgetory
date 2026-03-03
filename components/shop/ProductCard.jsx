"use client";

import { getProductReviews } from "@/app/actions/reviewActions";
import { Star } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function ProductCard({ product }) {
  const [reviewData, setReviewData] = useState({ rating: 0, count: 0 });
  useEffect(() => {
    const fetchReviews = async () => {
      const result = await getProductReviews(product._id, {
        page: 1,
        limit: 10,
        sortBy: "recent",
      });

      if (result.success && result.data.reviews.length > 0) {
        const avg =
          result.data.reviews.reduce((sum, r) => sum + r.rating, 0) /
          result.data.reviews.length;
        setReviewData({
          rating: avg,
          count: result.data.pagination.totalReviews,
        });
      }
    };

    fetchReviews();
  }, [product._id]);

  const arraySpecs = Object.values(product.specifications).filter(Boolean);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex gap-4 p-4 border rounded hover:shadow-md transition"
    >
      {/* Image */}
      <div className="w-48 h-48 flex-shrink-0 bg-gray-50 flex items-center justify-center">
        <img
          src={product.mainImage}
          alt={product.name}
          className="h-full object-cover mix-blend-multiply"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-lg text-amazon-blue hover:text-amazon-orange font-normal mb-1">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-amazon-secondary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < reviewData.rating ? "fill-current" : ""}  `}
              />
            ))}
          </div>
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/products/${product.slug}#reviews`;
            }}
            className="text-sm text-amazon-blue hover:text-amazon-orange cursor-pointer"
          >
            {reviewData.rating.toFixed(1)} ({reviewData.count}{" "}
            {reviewData.count > 1 ? "reviews" : "review"})
          </span>
        </div>

        {/* Price */}
        <div className="mb-2">
          <span className="text-2xl font-normal">
            ৳{product.price.toLocaleString()}
          </span>
        </div>

        {/* Delivery */}
        <p className="text-sm text-gray-500 mb-2">
          {product.price >= 5000 ? "Free Delivery" : "Delivery Charge: ৳100"}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-700">
          {arraySpecs.slice(0, 3).join(" | ").slice(0, 200)}
        </p>
      </div>
    </Link>
  );
}
