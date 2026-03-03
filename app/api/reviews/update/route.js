import { updateProductRating } from "@/app/actions/reviewActions";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId, rating, title, comment } = await request.json();

    // Validate
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    await dbConnect();

    // Find review and verify ownership
    const review = await Review.findOne({
      _id: reviewId,
      userId: session.user.id,
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found or unauthorized" },
        { status: 404 },
      );
    }

    // Update review
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();

    // Update product rating
    await updateProductRating(review.productId);

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}
