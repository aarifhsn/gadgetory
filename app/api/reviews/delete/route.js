import { updateProductRating } from "@/app/actions/reviewActions";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await request.json();

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

    const productId = review.productId;

    // Delete review
    await Review.deleteOne({ _id: reviewId });

    // Update product rating
    await updateProductRating(productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
