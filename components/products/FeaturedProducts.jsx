"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function FeaturedProducts({ products }) {
  const { cart, addToCart, removeFromCart } = useCart();

  if (!products || products.length === 0) return null;

  const isInCart = (product) => {
    return cart.some((item) => item.id === product._id);
  };

  const handleToggleCart = (product, isInCart) => {
    if (isInCart) {
      removeFromCart(product._id);
      toast.success("Removed from cart 🗑️", {
        icon: "❌",
      });
    } else {
      addToCart(
        {
          id: product._id,
          name: product.name,
          slug: product.slug,
          image: product.mainImage,
          price: product.price,
          category: product.category,
          shopInfo: { name: product.seller?.shopName || "Official Store" },
          stock: product.stockQuantity,
        },
        1,
      );
      toast.success("Added to cart 🛒", {
        icon: "✅",
      });
    }
  };

  return (
    <div className="mt-2">
      {/* ── SCROLL TRACK ──────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide -mx-1 px-1">
        {products.slice(0, 12).map((product) => {
          const inStock = product.stockQuantity > 0;
          const inCart = cart.some((item) => item.id === product._id);

          return (
            <div
              key={product._id}
              className="flex-none w-56 group flex flex-col bg-white hover:bg-[#FDFCFA] border border-[#E8E4DD] hover:border-[#D4A853]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#1a1a2e]/8"
            >
              {/* ── IMAGE ZONE ──────────────────────────────────────── */}
              <Link
                href={`/products/${product.slug}`}
                className="block relative overflow-hidden"
              >
                <div className="h-52 flex items-center justify-center p-6 bg-[#F5F3EF] relative overflow-hidden">
                  {/* Subtle radial glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(212,168,83,0.12) 0%, transparent 70%)",
                    }}
                  />

                  <Image
                    alt={product.name}
                    src={product.mainImage}
                    className="h-full w-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.07]"
                    width={220}
                    height={220}
                  />

                  {/* Sold out scrim */}
                  {!inStock && (
                    <div className="absolute inset-0 z-20 bg-[#FAF9F6]/85 flex items-center justify-center">
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#1a1a2e]/30 border border-[#1a1a2e]/15 px-3 py-1.5 rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}

                  {/* In-cart pill */}
                  {inCart && inStock && (
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#D4A853] px-2.5 py-1 rounded-full">
                      <div className="w-1 h-1 rounded-full bg-[#1a1a2e]" />
                      <span className="text-[9px] font-black tracking-widest uppercase text-[#1a1a2e]">
                        In Cart
                      </span>
                    </div>
                  )}

                  {/* Wishlist hover button */}
                  <button className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm hover:bg-white">
                    <svg
                      className="w-3.5 h-3.5 text-[#1a1a2e]/40 hover:text-[#D4A853]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </Link>

              {/* ── PRODUCT INFO ────────────────────────────────────── */}
              <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2">
                {/* Category */}
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#D4A853]">
                  {product.category}
                </span>

                {/* Name */}
                <Link href={`/products/${product.slug}`}>
                  <p className="text-[12px] leading-relaxed text-[#1a1a2e]/70 hover:text-[#1a1a2e] line-clamp-2 transition-colors duration-150 font-medium min-h-[36px]">
                    {product.name}
                  </p>
                </Link>

                {/* Divider */}
                <div className="w-full h-px bg-[#E8E4DD] my-1" />

                {/* Price row */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[11px] text-[#D4A853] font-bold leading-none">
                      ৳
                    </span>
                    <span className="text-xl font-black text-[#1a1a2e] leading-none tracking-tight">
                      {Number(product.price).toLocaleString()}
                    </span>
                  </div>
                  {inStock ? (
                    <span className="text-[9px] font-semibold tracking-wide uppercase text-emerald-600/70">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold tracking-wide uppercase text-rose-400/70">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Cart Button */}
                <button
                  onClick={() => handleToggleCart(product, inCart)}
                  disabled={!inStock}
                  className={`w-full text-[10px] font-black tracking-[0.25em] uppercase py-2.5 mt-1 rounded-xl transition-all duration-200
                ${
                  !inStock
                    ? "bg-[#F5F3EF] text-[#1a1a2e]/20 cursor-not-allowed border border-[#E8E4DD]"
                    : inCart
                      ? "bg-transparent border border-[#1a1a2e]/12 text-[#1a1a2e]/40 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50"
                      : "bg-[#1a1a2e] text-[#FAF9F6] hover:bg-[#D4A853] hover:text-[#1a1a2e] shadow-md shadow-[#1a1a2e]/10"
                }`}
                >
                  {inCart
                    ? "− Remove"
                    : inStock
                      ? "+ Add to Cart"
                      : "Unavailable"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
