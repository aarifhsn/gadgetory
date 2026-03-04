"use client";

import { useCart } from "@/context/CartContext";
import { CheckCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getItemCount } =
    useCart();
  const router = useRouter();

  const handleProceedToCheckout = () => {
    router.push("/checkout/address");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      removeFromCart(productId);
    }
  };

  // Calculate service fee
  const serviceFee = cart.reduce((fee, item) => {
    if (item.category === "laptops") return fee + 200;
    if (item.category === "mobiles") return fee + 100;
    return fee;
  }, 0);

  const subtotal = getCartTotal();
  const itemCount = getItemCount();
  const isFreeShipping = subtotal >= 50000;

  // Empty cart state
  if (cart.length === 0) {
    return (
      <main className="max-w-[1500px] mx-auto w-full p-4 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add items to your cart to see them here
          </p>
          <Link
            href="/products"
            className="inline-block bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary px-8 py-2 rounded-md text-sm font-bold"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1500px] mx-auto w-full px-4 md:px-16 py-10">
      {/* ── EMPTY STATE ───────────────────────────────────────────── */}
      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-24 h-24 rounded-3xl bg-[#F5F3EF] border border-[#E8E4DD] flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-[#1a1a2e]/20" />
          </div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-[#1a1a2e]/40 mb-8 max-w-xs">
            Looks like you haven't added anything yet. Start exploring our
            products.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-[#1a1a2e]/10"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {/* ── CART CONTENT ──────────────────────────────────────────── */}
      {cart.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT: CART ITEMS ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
                <div>
                  <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
                    Shopping Cart
                  </h1>
                  <p className="text-xs text-[#1a1a2e]/35 mt-0.5">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your
                    cart
                  </p>
                </div>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold text-[#D4A853] hover:underline underline-offset-4 tracking-wide"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Items list */}
            <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#F5F3EF]">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-5 flex gap-5 hover:bg-[#FDFCFA] transition-colors duration-150 group"
                >
                  {/* Product image */}
                  <Link href={`/products/${item.slug}`} className="shrink-0">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#F5F3EF] border border-[#E8E4DD] relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="text-sm font-bold text-[#1a1a2e] hover:text-[#D4A853] transition-colors duration-150 line-clamp-2 leading-snug mb-1">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4A853]">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#1a1a2e]/35 mb-1">
                      Sold by:{" "}
                      <span className="text-[#1a1a2e]/55 font-medium">
                        {item.shopInfo?.name || "Official Store"}
                      </span>
                    </p>

                    {isFreeShipping && (
                      <div className="flex items-center gap-1 mb-3">
                        <Truck className="w-3 h-3 text-emerald-500" />
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                          Free Shipping
                        </p>
                      </div>
                    )}

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 bg-[#F5F3EF] border border-[#E8E4DD] rounded-xl px-3 py-1.5">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-5 h-5 flex items-center justify-center text-[#1a1a2e]/50 hover:text-[#1a1a2e] disabled:opacity-20 font-black text-sm transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-black text-[#1a1a2e] w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= (item.stock || 10)}
                          className="w-5 h-5 flex items-center justify-center text-[#1a1a2e]/50 hover:text-[#1a1a2e] disabled:opacity-20 font-black text-sm transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs font-bold text-[#1a1a2e]/30 hover:text-rose-500 transition-colors duration-200 tracking-wide"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-[#1a1a2e] tracking-tight">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-[#1a1a2e]/30 mt-0.5">
                        ৳{item.price.toLocaleString()} each
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Subtotal row */}
              <div className="px-6 py-4 bg-[#FAF9F6] flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1a1a2e]/40">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="text-xl font-black text-[#1a1a2e] tracking-tight">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ──────────────────────────────── */}
          <div className="lg:w-80 shrink-0 sticky top-20">
            <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
              {/* Summary header */}
              <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
                <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Free shipping progress */}
                {isFreeShipping ? (
                  <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-xs font-bold text-emerald-700">
                      Your order qualifies for FREE shipping!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#1a1a2e]/45 font-medium">
                        Add{" "}
                        <span className="font-black text-[#1a1a2e]">
                          ৳{(50000 - subtotal).toLocaleString()}
                        </span>{" "}
                        for free shipping
                      </p>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5F3EF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4A853] to-[#c9973d] rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((subtotal / 50000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Price breakdown */}
                <div className="space-y-3">
                  {[
                    {
                      label: "Items Total",
                      value: `৳${subtotal.toLocaleString()}`,
                    },
                    {
                      label: "Delivery Fee",
                      value: isFreeShipping ? "FREE" : "৳100",
                      highlight: isFreeShipping,
                    },
                    {
                      label: "Service Fee",
                      value: `৳${serviceFee.toLocaleString()}`,
                    },
                  ].map(({ label, value, highlight }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-[#1a1a2e]/45 font-medium">
                        {label}
                      </span>
                      <span
                        className={`text-xs font-bold ${highlight ? "text-emerald-600" : "text-[#1a1a2e]"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-[#E8E4DD] flex items-center justify-between">
                    <span className="text-sm font-black text-[#1a1a2e] tracking-tight">
                      Estimated Total
                    </span>
                    <span className="text-xl font-black text-[#1a1a2e]">
                      ৳
                      {(
                        subtotal +
                        (isFreeShipping ? 0 : 100) +
                        serviceFee
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Gift option */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="gift"
                    className="w-4 h-4 rounded border-[#E8E4DD] accent-[#D4A853]"
                  />
                  <span className="text-xs text-[#1a1a2e]/50 group-hover:text-[#1a1a2e]/70 transition-colors">
                    This order contains a gift
                  </span>
                </label>

                {/* CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-lg shadow-[#1a1a2e]/10 transition-all duration-300"
                >
                  Proceed to Checkout
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-5 pt-1">
                  {[
                    { icon: ShieldCheck, label: "Secure" },
                    { icon: Truck, label: "Fast Delivery" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-[#1a1a2e]/25" />
                      <span className="text-[10px] font-bold tracking-wide text-[#1a1a2e]/30 uppercase">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
