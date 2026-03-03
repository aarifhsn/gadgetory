"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// Get customer's own orders
export async function getCustomerOrders(userId) {
  try {
    await dbConnect();

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)),
    };
  } catch (error) {
    console.error("Get customer orders error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

// Get shop owner's received orders
export async function getShopOwnerOrders() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const sellerId = session.user.id;
  try {
    await dbConnect();

    // Find all products by this seller
    const sellerProducts = await Product.find({ sellerId }).select("_id");
    const productIds = sellerProducts.map((p) => p._id.toString());

    const orders = await Order.find({
      "shopInfo.sellerId": session.user.id,
    })
      .populate("userId", "name email mobile")
      .sort({ createdAt: -1 })
      .lean();

    // Filter items to show only seller's products
    const filteredOrders = orders.map((order) => ({
      ...order,
      items: order.items.filter((item) =>
        productIds.includes(item.productId.toString()),
      ),
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(filteredOrders)),
    };
  } catch (error) {
    console.error("Get shop orders error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}
