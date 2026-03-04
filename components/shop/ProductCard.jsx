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
      className="group flex gap-5 p-5 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 rounded-2xl hover:shadow-lg hover:shadow-[#D4A853]/8 transition-all duration-300"
    >
      {/* Image */}
      <div className="w-44 h-44 shrink-0 bg-[#F5F3EF] rounded-xl overflow-hidden flex items-center justify-center relative border border-[#E8E4DD]">
        <img
          src={product.mainImage}
          alt={product.name}
          className="h-36 w-36 object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,168,83,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1">
        {/* Category badge */}
        <span className="text-[9px] font-black tracking-[0.25em] uppercase text-[#D4A853] mb-1.5 block">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-base font-black text-[#1a1a2e] group-hover:text-[#D4A853] transition-colors duration-200 leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(reviewData.rating)
                    ? "fill-[#D4A853] text-[#D4A853]"
                    : "text-[#E8E4DD] fill-[#E8E4DD]"
                }`}
              />
            ))}
          </div>
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/products/${product.slug}#reviews`;
            }}
            className="text-[11px] font-bold text-[#1a1a2e]/40 hover:text-[#D4A853] transition-colors cursor-pointer"
          >
            {reviewData.rating.toFixed(1)} ({reviewData.count}{" "}
            {reviewData.count === 1 ? "review" : "reviews"})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-xs font-bold text-[#D4A853]">৳</span>
          <span className="text-2xl font-black text-[#1a1a2e] tracking-tight leading-none">
            {product.price.toLocaleString()}
          </span>
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-1.5 mb-3">
          <svg
            className={`w-3.5 h-3.5 shrink-0 ${product.price >= 5000 ? "text-emerald-500" : "text-[#1a1a2e]/25"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <p
            className={`text-xs font-semibold ${product.price >= 5000 ? "text-emerald-600" : "text-[#1a1a2e]/35"}`}
          >
            {product.price >= 5000 ? "Free Delivery" : "Delivery: ৳100"}
          </p>
        </div>

        {/* Spec pills */}
        {arraySpecs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {arraySpecs.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-[#1a1a2e]/40 bg-[#F5F3EF] border border-[#E8E4DD] px-2.5 py-1 rounded-full"
              >
                {String(spec).slice(0, 30)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right arrow hint */}
      <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          className="w-5 h-5 text-[#D4A853]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
