"use client";

import { useCart } from "@/context/CartContext";
import { generateInvoicePDF } from "@/utils/invoicePdf";
import { Check, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const { cart, shippingAddress, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Just save cart data to state for display, don't create order
    if (cart.length > 0 && !orderData) {
      const serviceFee = 0;
      const deliveryFee = getCartTotal() >= 5000 ? 0 : 100;
      const orderTotal = getCartTotal() + serviceFee + deliveryFee;

      const order = {
        orderNumber: `GB-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 999999),
        ).padStart(6, "0")}`,
        date: new Date().toLocaleDateString(),
        items: [...cart],
        shippingAddress: { ...shippingAddress },
        subtotal: getCartTotal(),
        deliveryFee,
        serviceFee,
        total: orderTotal,
      };

      setOrderData(order);

      // Clear cart after displaying
      setTimeout(() => clearCart(), 100);
    } else if (cart.length === 0 && !orderData) {
      router.push("/");
    }
  }, [cart, orderData, shippingAddress, getCartTotal, clearCart, router]);

  if (!orderData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <main className="max-w-[860px] mx-auto w-full px-4 md:px-8 py-14">
      {/* ── LOADING STATE ─────────────────────────────────────────── */}
      {!orderData && (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4A853] border-t-transparent animate-spin mb-4" />
          <p className="text-sm text-[#1a1a2e]/35 font-medium">
            Loading order details...
          </p>
        </div>
      )}

      {orderData && (
        <>
          {/* ── SUCCESS HERO ──────────────────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm mb-6">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />

            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Check icon */}
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-7 h-7 text-emerald-500 stroke-[2.5]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-1 h-6 rounded-full bg-[#D4A853]" />
                    <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
                      Order Placed!
                    </h1>
                  </div>
                  <p className="text-sm text-[#1a1a2e]/45 mb-6 pl-4">
                    Thank you for your purchase. Confirmation will be sent to
                    your email.
                  </p>

                  {/* Info cards row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                    {/* Shipping info */}
                    <div className="bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg
                          className="w-3.5 h-3.5 text-[#D4A853]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40">
                          Shipping To
                        </span>
                      </div>
                      <p className="text-sm font-black text-[#1a1a2e] mb-1">
                        {orderData.shippingAddress?.name || "Customer"}
                      </p>
                      <p className="text-xs text-[#1a1a2e]/45 leading-relaxed">
                        {orderData.shippingAddress?.address || "N/A"}
                        <br />
                        {orderData.shippingAddress?.city},{" "}
                        {orderData.shippingAddress?.postalCode}
                        <br />
                        {orderData.shippingAddress?.country}
                      </p>
                      <div className="mt-2.5 space-y-0.5">
                        {orderData.shippingAddress?.phone && (
                          <p className="text-[11px] text-[#1a1a2e]/35">
                            📞 {orderData.shippingAddress.phone}
                          </p>
                        )}
                        {orderData.shippingAddress?.email && (
                          <p className="text-[11px] text-[#1a1a2e]/35">
                            ✉ {orderData.shippingAddress.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order info */}
                    <div className="bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg
                          className="w-3.5 h-3.5 text-[#D4A853]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40">
                          Order Number
                        </span>
                      </div>
                      <p className="text-base font-black text-[#1a1a2e] font-mono tracking-tight mb-1">
                        #{orderData.orderNumber}
                      </p>
                      <p className="text-xs text-[#1a1a2e]/35 mb-4">
                        Placed on {orderData.date}
                      </p>

                      {/* Delivery estimate */}
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                        <svg
                          className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span className="text-[11px] font-bold text-emerald-700">
                          Estimated delivery: 2–4 days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        generateInvoicePDF(orderData, { download: true })
                      }
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded-xl text-xs font-bold tracking-wide transition-all duration-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Invoice
                    </button>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#FAF9F6] border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded-xl text-xs font-bold tracking-wide transition-all duration-200"
                    >
                      View All Orders
                    </Link>
                    <Link
                      href="/products"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] rounded-xl text-xs font-black tracking-[0.15em] uppercase shadow-md shadow-[#1a1a2e]/10 transition-all duration-300"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── ORDER DETAILS ─────────────────────────────────────────── */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
              <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                Order Details
              </h2>
            </div>

            {/* Items */}
            <div className="divide-y divide-[#F5F3EF]">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 flex gap-4 hover:bg-[#FDFCFA] transition-colors duration-150"
                >
                  <div className="w-18 h-18 w-[72px] h-[72px] rounded-xl bg-[#F5F3EF] border border-[#E8E4DD] overflow-hidden relative shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-bold text-[#1a1a2e] hover:text-[#D4A853] transition-colors duration-150 line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11px] text-[#1a1a2e]/35 mt-1">
                      Qty:{" "}
                      <span className="font-bold text-[#1a1a2e]/55">
                        {item.quantity}
                      </span>
                      <span className="mx-2 text-[#E8E4DD]">·</span>৳
                      {item.price.toLocaleString()} each
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-[#1a1a2e]">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price summary */}
            <div className="px-6 py-5 bg-[#FAF9F6] border-t border-[#E8E4DD]">
              <div className="max-w-xs ml-auto space-y-2.5">
                {[
                  {
                    label: "Subtotal",
                    value: `৳${orderData.subtotal.toLocaleString()}`,
                  },
                  {
                    label: "Delivery Fee",
                    value:
                      orderData.deliveryFee === 0
                        ? "FREE"
                        : `৳${orderData.deliveryFee.toLocaleString()}`,
                    highlight: orderData.deliveryFee === 0,
                  },
                  {
                    label: "Service Fee",
                    value: `৳${orderData.serviceFee.toLocaleString()}`,
                  },
                ].map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-[#1a1a2e]/40 font-medium">
                      {label}
                    </span>
                    <span
                      className={`text-xs font-bold ${highlight ? "text-emerald-600" : "text-[#1a1a2e]"}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DD]">
                  <span className="text-sm font-black text-[#1a1a2e]">
                    Total Paid
                  </span>
                  <span className="text-xl font-black text-[#1a1a2e]">
                    ৳{orderData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
