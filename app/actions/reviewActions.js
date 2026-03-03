"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";

export async function getProductReviews(productId, options = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "recent", // recent, rating-high, rating-low
    } = options;

    await dbConnect();

    const session = await auth();
    const currentUserId = session?.user?.id;

    let sort = {};

    switch (sortBy) {
      case "recent":
        sort = { createdAt: -1 };
        break;
      case "rating-high":
        sort = { rating: -1, createdAt: -1 };
        break;
      case "rating-low":
        sort = { rating: 1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Get user's own review first (if exists)
    let userReview = null;
    if (currentUserId) {
      userReview = await Review.findOne({
        productId,
        userId: currentUserId,
      })
        .populate("userId", "name")
        .lean();
    }

    // Get other reviews with pagination
    const query = { productId };
    if (currentUserId && userReview) {
      query._id = { $ne: userReview._id }; // Exclude user's own review from list
    }

    const skip = (page - 1) * limit;

    const [reviews, totalReviews] = await Promise.all([
      Review.find(query)
        .populate("userId", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ productId }),
    ]);

    // Combine user review (first) + other reviews
    let allReviews = reviews;
    if (userReview && page === 1) {
      allReviews = [userReview, ...reviews];
    }

    const totalPages = Math.ceil(totalReviews / limit);

    return {
      success: true,
      data: {
        reviews: JSON.parse(JSON.stringify(allReviews)),
        userReview: userReview ? JSON.parse(JSON.stringify(userReview)) : null,
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          hasMore: page < totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Get reviews error:", error);
    return { success: false, error: "Failed to fetch reviews" };
  }
}

export async function updateProductRating(productId) {
  try {
    await dbConnect();

    // Calculate average rating
    const result = await Review.aggregate([
      { $match: { productId: productId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      const { avgRating, totalReviews } = result[0];

      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: totalReviews,
      });

      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error("Update rating error:", error);
    return { success: false, error: "Failed to update rating" };
  }
}
