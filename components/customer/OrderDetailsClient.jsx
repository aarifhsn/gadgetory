"use client";

import { ChevronRight, MapPin, Package as PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderDetailsClient({ order }) {
  return (
    <main className="max-w-[1000px] mx-auto w-full px-4 md:px-8 py-10">
      {/* ── BREADCRUMB ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-8">
        <Link
          href="/account"
          className="text-xs font-medium text-[#1a1a2e]/35 hover:text-[#D4A853] transition-colors duration-150"
        >
          Your Account
        </Link>
        <ChevronRight className="w-3 h-3 text-[#1a1a2e]/20" />
        <Link
          href="/orders"
          className="text-xs font-medium text-[#1a1a2e]/35 hover:text-[#D4A853] transition-colors duration-150"
        >
          Your Orders
        </Link>
        <ChevronRight className="w-3 h-3 text-[#1a1a2e]/20" />
        <span className="text-xs font-bold text-[#1a1a2e]">Order Details</span>
      </div>

      <div className="space-y-5">
        {/* ── ORDER HEADER ──────────────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />
          <div className="px-6 py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
              <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
                Order Details
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Order Number",
                  value: `#${order.orderNumber}`,
                  mono: true,
                },
                {
                  label: "Order Date",
                  value: new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                },
                {
                  label: "Order Total",
                  value: `৳${order.total.toLocaleString()}`,
                  accent: true,
                },
              ].map(({ label, value, mono, accent }) => (
                <div
                  key={label}
                  className="bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl px-5 py-4"
                >
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/35 mb-1.5">
                    {label}
                  </p>
                  <p
                    className={`text-sm font-black ${accent ? "text-[#1a1a2e] text-base" : "text-[#1a1a2e]"} ${mono ? "font-mono tracking-tight" : ""}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SHIPPING ADDRESS ──────────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D4A853]/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#D4A853]" />
            </div>
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
              Shipping Address
            </h2>
          </div>

          <div className="px-6 py-5 flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-black text-[#1a1a2e] mb-1">
                {order.shippingAddress?.name}
              </p>
              <p className="text-xs text-[#1a1a2e]/50 leading-relaxed">
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.postalCode}
                <br />
                {order.shippingAddress?.country}
              </p>
              <div className="flex items-center gap-4 mt-2.5">
                {order.shippingAddress?.phone && (
                  <p className="text-[11px] text-[#1a1a2e]/35">
                    📞 {order.shippingAddress.phone}
                  </p>
                )}
                {order.shippingAddress?.email && (
                  <p className="text-[11px] text-[#1a1a2e]/35">
                    ✉ {order.shippingAddress.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── ORDER ITEMS ───────────────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D4A853]/10 flex items-center justify-center">
              <PackageIcon className="w-4 h-4 text-[#D4A853]" />
            </div>
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
              Items in This Order
            </h2>
          </div>

          <div className="divide-y divide-[#F5F3EF]">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="p-5 flex gap-4 hover:bg-[#FDFCFA] transition-colors duration-150"
              >
                <div className="w-20 h-20 rounded-xl bg-[#F5F3EF] border border-[#E8E4DD] overflow-hidden relative shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug || item.productId}`}
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
        </div>

        {/* ── ORDER SUMMARY ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
              Order Summary
            </h2>
          </div>

          <div className="px-6 py-5 bg-[#FAF9F6]">
            <div className="max-w-xs ml-auto space-y-2.5">
              {[
                {
                  label: "Subtotal",
                  value: `৳${order.subtotal.toLocaleString()}`,
                },
                {
                  label: "Delivery Fee",
                  value:
                    order.deliveryFee === 0
                      ? "FREE"
                      : `৳${order.deliveryFee.toLocaleString()}`,
                  highlight: order.deliveryFee === 0,
                },
                {
                  label: "Service Fee",
                  value: `৳${order.serviceFee.toLocaleString()}`,
                },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between">
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
                <span className="text-sm font-black text-[#1a1a2e]">Total</span>
                <span className="text-xl font-black text-[#1a1a2e]">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
