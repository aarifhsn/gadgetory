"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartBadge() {
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[#F5F3EF] transition-colors duration-150"
    >
      <ShoppingCart className="w-5 h-5 text-[#1a1a2e]" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4A853] text-[#1a1a2e] text-[9px] font-black rounded-full flex items-center justify-center leading-none">
          {cartItemCount > 9 ? "9+" : cartItemCount}
        </span>
      )}
    </Link>
  );
}
