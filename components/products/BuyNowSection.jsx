"use client";

import { useCart } from "@/context/CartContext";
import { Package, ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function BuyNowSection({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const inStock = product.stockQuantity > 0;

  // check if product is in cart
  const isInCart = cart.some((item) => item.id === product._id);

  const cartProduct = {
    id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.mainImage,
    price: product.price,
    category: product.category,
    shopInfo: { name: product.seller?.shopName || "Official Store" },
    stock: product.stockQuantity,
  };

  const handleToggleCart = (product, isInCart) => {
    if (isInCart) {
      removeFromCart(product._id.toString());
      toast.success("Removed from cart 🗑️", {
        icon: "❌",
      });
    } else {
      addToCart(cartProduct, quantity);
      toast.success(`Added ${quantity} item(s) to cart 🛒`, {
        icon: "✅",
      });
    }
  };

  const handleBuyNow = () => {
    if (!isInCart) {
      addToCart(cartProduct, quantity);
    }
    router.push("/checkout/address");
  };

  const deliveryFee = Number(product.price) >= 5000 ? 0 : 100;

  return (
    <div className="lg:col-span-3">
      <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm sticky top-20">
        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />

        <div className="p-6 space-y-5">
          {/* ── PRICE ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#D4A853]">৳</span>
              <span className="text-4xl font-black text-[#1a1a2e] tracking-tight leading-none">
                {(Number(product.price) * quantity).toLocaleString()}
              </span>
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-1.5 mt-2">
              <Truck
                className={`w-3.5 h-3.5 shrink-0 ${deliveryFee === 0 ? "text-emerald-500" : "text-[#1a1a2e]/25"}`}
              />
              {deliveryFee === 0 ? (
                <p className="text-xs font-bold text-emerald-600">
                  Free Delivery
                </p>
              ) : (
                <p className="text-xs text-[#1a1a2e]/40">
                  Delivery:{" "}
                  <span className="font-bold text-[#1a1a2e]/60">
                    ৳{deliveryFee}
                  </span>
                  <span className="text-[#1a1a2e]/30"> · Free over ৳5,000</span>
                </p>
              )}
            </div>
          </div>

          {/* ── STOCK STATUS ──────────────────────────────────────── */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
              inStock
                ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                : "bg-rose-50 border border-rose-100 text-rose-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`}
            />
            {inStock
              ? `In Stock · ${product.stockQuantity} units`
              : "Out of Stock"}
          </div>

          {/* ── QUANTITY ──────────────────────────────────────────── */}
          {inStock && (
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/35 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#F5F3EF] border border-[#E8E4DD] rounded-xl px-4 py-2.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-4 h-4 flex items-center justify-center text-[#1a1a2e]/40 hover:text-[#1a1a2e] disabled:opacity-20 font-black text-base leading-none"
                  >
                    −
                  </button>
                  <span className="text-sm font-black text-[#1a1a2e] w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(Math.min(product.stockQuantity, 10), q + 1),
                      )
                    }
                    disabled={quantity >= Math.min(product.stockQuantity, 10)}
                    className="w-4 h-4 flex items-center justify-center text-[#1a1a2e]/40 hover:text-[#1a1a2e] disabled:opacity-20 font-black text-base leading-none"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#1a1a2e]/30 font-medium">
                  {Math.min(product.stockQuantity, 10)} available
                </span>
              </div>
            </div>
          )}

          {/* ── DIVIDER ───────────────────────────────────────────── */}
          <div className="w-full h-px bg-[#F5F3EF]" />

          {/* ── ACTION BUTTONS ────────────────────────────────────── */}
          <div className="space-y-2.5">
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="w-full py-3.5 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-md shadow-[#1a1a2e]/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            <button
              onClick={() => handleToggleCart(product, isInCart)}
              disabled={!inStock}
              className={`w-full py-3.5 text-xs font-black tracking-[0.15em] uppercase rounded-xl border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                isInCart
                  ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                  : "bg-white border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/60 hover:text-[#1a1a2e]"
              }`}
            >
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </button>
          </div>

          {/* ── TRUST BADGES ──────────────────────────────────────── */}
          <div className="pt-1 space-y-2">
            {[
              { icon: ShieldCheck, text: "Secure transaction" },
              { icon: Truck, text: "Ships from gadgetory" },
              {
                icon: Package,
                text: `Sold by ${product.seller?.shopName || "Official Store"}`,
              },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <Icon className="w-3.5 h-3.5 text-[#1a1a2e]/20 shrink-0" />
                <span className="text-[11px] text-[#1a1a2e]/35 font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
