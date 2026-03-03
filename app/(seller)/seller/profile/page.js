import { auth } from "@/auth";
import ShopProfileClient from "@/components/shop/ShopProfileClient";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import User from "@/models/User";
import { redirect } from "next/navigation";

export default async function ShopProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.userType !== "shopOwner") {
    redirect("/");
  }

  // Fetch fresh data from database
  await dbConnect();
  const user = await User.findById(session.user.id).lean();

  if (!user) return null;

  // Fetch seller's products and their reviews
  const sellerProducts = await Product.find({ sellerId: user._id })
    .select("_id")
    .lean();
  const productIds = sellerProducts.map((p) => p._id);

  const reviewStats = await Review.aggregate([
    { $match: { productId: { $in: productIds } } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const userData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    userType: user.userType,
    avatar: user.avatar || session.user.image,
    shopName: user.shopName || "",
    mobile: user.mobile || "",
    shopProfile: user.shopProfile || {},
    shopRating: reviewStats[0]?.averageRating
      ? Math.round(reviewStats[0].averageRating * 10) / 10
      : 0,
    totalReviews: reviewStats[0]?.totalReviews || 0,
  };
  return <ShopProfileClient user={userData} />;
}
