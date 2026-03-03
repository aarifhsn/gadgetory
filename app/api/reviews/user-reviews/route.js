import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, reviews: [] });
    }

    await dbConnect();

    const reviews = await Review.find({ userId: session.user.id })
      .select("productId")
      .lean();

    return NextResponse.json({
      success: true,
      reviews: reviews.map((r) => ({ productId: r.productId.toString() })),
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    return NextResponse.json({ success: false, reviews: [] });
  }
}
