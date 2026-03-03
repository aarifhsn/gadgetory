import { auth } from "@/auth";
import OrderDetailsClient from "@/components/customer/OrderDetailsClient";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { redirect } from "next/navigation";

export default async function OrderDetailsPage({ params }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { orderNumber } = await params;

  // Fetch order from database
  await dbConnect();
  const order = await Order.findOne({
    orderNumber,
    userId: session.user.id,
  }).lean();

  if (!order) {
    redirect("/orders");
  }

  // Convert to plain object
  const orderData = JSON.parse(JSON.stringify(order));

  return <OrderDetailsClient order={orderData} />;
}
