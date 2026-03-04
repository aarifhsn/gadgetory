"use client";

import { Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function WriteReviewModal({
  isOpen,
  onClose,
  product,
  orderId,
  editingReview,
  onSuccess,
  redirectAfterSuccess = false,
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Update state when editingReview changes
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setTitle(editingReview.title);
      setComment(editingReview.comment);
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      const url = editingReview ? "/api/reviews/update" : "/api/reviews/create";

      const body = editingReview
        ? { reviewId: editingReview._id, rating, title, comment }
        : { productId: product._id, rating, title, comment, orderId };

      const response = await fetch(url, {
        method: editingReview ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to submit review");
        setLoading(false);
        return;
      }

      // Close modal first
      onClose();

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");

      // Then call success callback (which refreshes reviews)
      onSuccess();

      // Show success toast last
      toast.success(
        editingReview
          ? "Review updated successfully!"
          : "Review submitted successfully!",
      );

      // Redirect to product page if redirectAfterSuccess is true
      if (redirectAfterSuccess && product.slug) {
        router.push(`/products/${product.slug}#reviews`); // Scroll to reviews
      } else {
        onSuccess(data.review);
      }
    } catch (error) {
      console.error("Review error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a2e]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl shadow-[#1a1a2e]/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E8E4DD]">
        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DD]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
            <h2 className="text-base font-black text-[#1a1a2e] tracking-tight">
              {editingReview ? "Edit Review" : "Write a Review"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1a1a2e]/25 hover:text-[#1a1a2e] hover:bg-[#F5F3EF] transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── PRODUCT CONTEXT ───────────────────────────────────────── */}
        <div className="px-6 py-3.5 bg-[#FAF9F6] border-b border-[#E8E4DD]">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/30 mb-0.5">
            Reviewing
          </p>
          <p className="text-xs font-bold text-[#1a1a2e]/70 line-clamp-1">
            {product.name}
          </p>
        </div>

        {/* ── FORM ────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating stars */}
          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40 mb-3">
              Overall Rating <span className="text-[#D4A853]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform duration-100 hover:scale-110"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors duration-150 ${
                        star <= (hoveredRating || rating)
                          ? "fill-[#D4A853] text-[#D4A853]"
                          : "fill-[#E8E4DD] text-[#E8E4DD]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#1a1a2e]/35 ml-1">
                {rating > 0
                  ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                      rating
                    ]
                  : "Select a rating"}
              </span>
            </div>
          </div>

          {/* Review title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40">
                Review Title <span className="text-[#D4A853]">*</span>
              </label>
              <span className="text-[10px] text-[#1a1a2e]/25 font-medium">
                {title.length}/100
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's most important to know?"
              required
              maxLength={100}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200"
            />
          </div>

          {/* Review body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40">
                Your Review <span className="text-[#D4A853]">*</span>
              </label>
              <span className="text-[10px] text-[#1a1a2e]/25 font-medium">
                {comment.length}/1000
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product…"
              required
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200 resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-[#E8E4DD] hover:border-[#1a1a2e]/20 text-xs font-bold text-[#1a1a2e]/50 hover:text-[#1a1a2e] rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-md shadow-[#1a1a2e]/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {editingReview ? "Updating..." : "Submitting..."}
                </span>
              ) : editingReview ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
