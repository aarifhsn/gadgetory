import { updateProductRating } from "@/app/actions/reviewActions";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, title, comment, orderId } = await request.json();

    // Validate
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    if (!title || !comment) {
      return NextResponse.json(
        { error: "Title and comment are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if user already reviewed
    const existing = await Review.findOne({
      productId,
      userId: session.user.id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 400 },
      );
    }

    // Check if user bought this product (optional verification)
    let verified = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        userId: session.user.id,
        "items.productId": productId,
      });
      verified = !!order;
    }

    // Create review
    const review = await Review.create({
      productId,
      userId: session.user.id,
      orderId,
      rating,
      title,
      comment,
      verified,
    });

    // Update product rating
    await updateProductRating(productId);

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
