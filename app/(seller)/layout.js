import "@/app/globals.css";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import ShopFooter from "@/components/shop/ShopFooter";
import { redirect } from "next/navigation";

export const metadata = {
  title: {
    default: "Seller Dashboard",
    template: "%s | gadgetory Seller",
  },

  description:
    "Manage products, orders, inventory, and earnings on gadgetory Seller Dashboard.",
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
    <div className="bg-[#F0F4F3] text-[#1a2e28] flex flex-col min-h-screen font-sans antialiased">
      {/* Seller-specific top accent stripe — teal/sage tone */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#2D7D6F] via-[#3a9688] to-[#5ab5a5]" />
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar hint strip for seller context */}
        <div className="hidden lg:block w-1 bg-gradient-to-b from-[#2D7D6F]/30 via-[#3a9688]/10 to-transparent" />
        <main className="flex-1 bg-[#F0F4F3]">{children}</main>
      </div>
      <ShopFooter />
    </div>
  );
}
