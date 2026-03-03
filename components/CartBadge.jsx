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
      className="flex items-end hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer relative"
    >
      <ShoppingCart className="w-8 h-8" />
      {cartItemCount > 0 && (
        <span className="font-bold text-amazon-secondary absolute -top-3  px-2 py-1 left-8 -translate-x-1/2 text-sm">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
}
