import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ canReview: false });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ canReview: false });
    }

    await dbConnect();

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      productId,
      userId: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json({
        canReview: false,
        reason: "already_reviewed",
      });
    }

    // Check if user has delivered order with this product
    const deliveredOrder = await Order.findOne({
      userId: session.user.id,
      status: "delivered",
      "items.productId": productId,
    });

    return NextResponse.json({
      canReview: !!deliveredOrder,
      reason: deliveredOrder ? null : "no_delivered_order",
    });
  } catch (error) {
    console.error("Check review eligibility error:", error);
    return NextResponse.json({ canReview: false });
  }
}
