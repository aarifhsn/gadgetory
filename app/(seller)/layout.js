import "@/app/globals.css";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import ShopFooter from "@/components/shop/ShopFooter";
import { redirect } from "next/navigation";

export const metadata = {
  title: {
    default: "Seller Dashboard",
    template: "%s | Gadgets BD Seller",
  },

  description:
    "Manage products, orders, inventory, and earnings on Gadgets BD Seller Dashboard.",
};

export default async function SellerLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.userType !== "shopOwner") {
    redirect("/unauthorized");
  }

  return (
    <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
      <Navbar />
      {children}
      <ShopFooter />
    </div>
  );
}
