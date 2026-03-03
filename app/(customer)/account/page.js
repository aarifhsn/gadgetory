import { auth } from "@/auth";
import CustomerAccountClient from "@/components/customer/CustomerAccountClient";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { redirect } from "next/navigation";

export default async function CustomerAccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.userType === "shopOwner") {
    redirect("/seller/profile");
  }

  // Fetch fresh data from database
  await dbConnect();
  const user = await User.findById(session.user.id).lean();

  // Fetch recent orders
  const [recentOrders, totalOrderCount] = await Promise.all([
    Order.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3).lean(),
    Order.countDocuments({ userId: user._id }),
  ]);

  const userData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar || session.user.image,
    mobile: user.mobile,
    city: user.city,
    address: user.address,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    totalOrderCount,
  };

  return <CustomerAccountClient user={userData} />;
}
