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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {editingReview ? "Edit Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b border-gray-200">
          <p className="text-sm font-bold">{product.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-amazon-secondary text-amazon-secondary"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating} out of 5 stars` : "Select rating"}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Review Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's most important to know?"
              required
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product"
              required
              rows={6}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/1000 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-6 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? editingReview
                  ? "Updating..."
                  : "Submitting..."
                : editingReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
