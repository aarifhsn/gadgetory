"use client";

import { getProductReviews } from "@/app/actions/reviewActions";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import { formatSpecifications } from "@/utils/formatSpecifications";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductTabs({
  product,
  seller,
  reviewsData: initialReviewsData,
  averageRating,
  totalReviews,
  sellerProductsCount,
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsData, setReviewsData] = useState(initialReviewsData);
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [editingReview, setEditingReview] = useState(null);
  const [canWriteReview, setCanWriteReview] = useState(false);

  const tabs = ["description", "reviews", "shop"];
  const tabLabels = {
    description: "Description",
    reviews: "Reviews",
    shop: "Shop Info",
  };

  const specsArray = formatSpecifications(product?.specifications);

  // Check if user can write review (must have delivered order)
  useEffect(() => {
    const checkReviewEligibility = async () => {
      try {
        const response = await fetch(
          `/api/reviews/can-review?productId=${product._id}`,
        );
        const data = await response.json();
        setCanWriteReview(data.canReview);
      } catch (error) {
        console.error("Check review eligibility error:", error);
      }
    };

    checkReviewEligibility();
  }, [product._id]);

  // Scroll to active tab
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    if (["description", "reviews", "shop"].includes(hash)) {
      setActiveTab(hash);

      // wait for React to render the tab content
      setTimeout(() => {
        const el = document.getElementById("product-tabs");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, []);

  const handleReviewSuccess = async () => {
    // Reload reviews from server
    const result = await getProductReviews(product._id, {
      page: 1,
      limit: 10,
      sortBy,
    });

    if (result.success) {
      setReviewsData(result.data);
    }

    setEditingReview(null); // Clear editing state
  };

  const handleSortChange = async (newSort) => {
    setSortBy(newSort);
    setLoading(true);

    const result = await getProductReviews(product._id, {
      page: 1,
      limit: 10,
      sortBy: newSort,
    });

    if (result.success) {
      setReviewsData(result.data);
    }

    setLoading(false);
  };

  const loadMoreReviews = async () => {
    if (!reviewsData.pagination.hasMore) return;

    setLoading(true);
    const nextPage = reviewsData.pagination.currentPage + 1;

    const result = await getProductReviews(product._id, {
      page: nextPage,
      limit: 10,
      sortBy,
    });

    if (result.success) {
      setReviewsData({
        ...result.data,
        reviews: [...reviewsData.reviews, ...result.data.reviews],
      });
    }

    setLoading(false);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch("/api/reviews/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (response.ok) {
        toast.success("Review deleted successfully");
        setReviewsData({
          ...reviewsData,
          reviews: reviewsData.reviews.filter((r) => r._id !== reviewId),
          userReview: null, // Clear user review
          pagination: {
            ...reviewsData.pagination,
            totalReviews: reviewsData.pagination.totalReviews - 1,
          },
        });
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div id="product-tabs" className="mt-12">
      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setEditingReview(null); // Clear editing state
        }}
        product={product}
        editingReview={editingReview} // Pass review being edited
        onSuccess={handleReviewSuccess}
      />

      {/* Tab Buttons */}
      <div className="border-b border-gray-300 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                window.location.hash = tab;
              }}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-amazon-secondary text-amazon-text"
                  : "text-gray-600 hover:text-amazon-orange"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Description Tab */}
      {activeTab === "description" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Product Description</h2>
          <div className="text-sm">
            <p className="mb-4 whitespace-pre-line">{product?.description}</p>
            <h3 className="font-bold mt-6 mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              {specsArray.map((spec, index) => (
                <li key={index}>
                  {spec.label && (
                    <span className="font-semibold">{spec.label}:</span>
                  )}{" "}
                  {spec.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">Customer Reviews</h2>
            <div className="flex gap-4 items-center">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm bg-gray-100 border border-gray-300 rounded px-3 py-2 outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="rating-high">Highest Rating</option>
                <option value="rating-low">Lowest Rating</option>
              </select>

              {/* Write Review Button */}
              {!reviewsData.userReview && canWriteReview && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-amazon-yellow hover:bg-amazon-yellow_hover px-4 py-2 rounded-md text-sm font-medium border border-amazon-secondary whitespace-nowrap"
                >
                  Write a Review
                </button>
              )}
              {/* Show message if can't review */}
              {!reviewsData.userReview && !canWriteReview && (
                <p className="text-sm text-gray-600">
                  You must purchase and receive this product to write a review
                </p>
              )}
            </div>
          </div>

          {/* Rating Summary */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-lg font-bold">{averageRating} out of 5</span>
            <span className="text-sm text-gray-600">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {reviewsData.reviews.length > 0 ? (
              <>
                {reviewsData.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-200 pb-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                        {review.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {review.userId?.name || "Anonymous"}
                        </p>
                        <div className="flex text-amazon-secondary">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <span
                              key={s}
                              className={
                                s < review.rating
                                  ? "text-amazon-secondary"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{review.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">
                      Reviewed on{" "}
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {review.verified && (
                        <span className="ml-2 text-green-600 font-bold">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </p>
                    <p className="text-sm">{review.comment}</p>
                    {/* Add Edit/Delete Buttons */}
                    {reviewsData.userReview?._id === review._id && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50"
                        >
                          Edit Review
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="px-4 py-1.5 border border-red-300 bg-red-50 text-red-700 rounded-md text-xs hover:bg-red-100"
                        >
                          Delete Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Load More Button */}
                {reviewsData.pagination.hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMoreReviews}
                      disabled={loading}
                      className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load More Reviews"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Shop Info Tab */}
      {activeTab === "shop" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Shop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">{seller?.shopName}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {seller?.shopProfile?.description}
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-bold">Rating:</span> {averageRating} (
                  {totalReviews} reviews)
                </p>
                <p>
                  <span className="font-bold">Products:</span>{" "}
                  {sellerProductsCount} items
                </p>
                <p>
                  <span className="font-bold">Joined:</span>{" "}
                  {seller?.shopProfile?.yearEstablished}
                </p>
                <p>
                  <span className="font-bold">Response Time:</span> Within 2
                  hours
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">Policies</h3>
              <div className="space-y-2 text-sm">
                {[
                  "14-day return policy",
                  "1-year official warranty",
                  "Free shipping on orders over ৳50,000",
                  "Secure payment options",
                ].map((policy, i) => (
                  <p key={i}>
                    <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                    {policy}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
