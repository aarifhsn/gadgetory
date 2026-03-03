import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.userType !== "shopOwner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await request.json();

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await dbConnect();

    // Verify seller owns products in this order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const productIds = order.items.map((item) => item.productId);
    const sellerProducts = await Product.find({
      _id: { $in: productIds },
      sellerId: session.user.id,
    });

    if (sellerProducts.length === 0) {
      return NextResponse.json(
        { error: "You don't have permission to update this order" },
        { status: 403 },
      );
    }

    // Update order status
    order.status = status;
    await order.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
