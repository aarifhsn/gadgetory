import Product from "@/models/Product";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();
    await dbConnect();

    // 1️⃣ Find the order first
    const order = await Order.findOne({
      _id: orderId,
      userId: session.user.id,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2️⃣ Status guard (ADD HERE ⬇️)
    if (order.status === "shipped" || order.status === "delivered") {
      return NextResponse.json(
        { error: "Order cannot be cancelled" },
        { status: 400 },
      );
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stockQuantity: item.quantity,
          unitsSold: -item.quantity,
        },
      });
    }

    // 3️⃣ Update only if allowed
    order.status = "cancelled";
    await order.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }
}
