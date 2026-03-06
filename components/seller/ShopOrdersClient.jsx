"use client";

import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShopOrdersClient({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("past 3 months");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    let filtered = [...orders];

    // Time filter
    if (timeFilter === "past 3 months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= threeMonthsAgo,
      );
    } else if (timeFilter !== "all time") {
      filtered = filtered.filter((order) => {
        const orderYear = new Date(order.createdAt).getFullYear();
        return orderYear.toString() === timeFilter;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [timeFilter, statusFilter, orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Something went wrong");
    }
  };

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const getAvailableYears = () => {
    const years = new Set();
    orders.forEach((order) => {
      const year = new Date(order.createdAt).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // ── EMPTY STATE ───────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <main className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-28">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-[#F0F4F3] border border-[#d0dbd9] flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-[#1a2e28]/15" />
          </div>
          <h2 className="text-2xl font-black text-[#1a2e28] tracking-tight mb-2">
            No orders yet
          </h2>
          <p className="text-sm text-[#1a2e28]/40 max-w-xs">
            You haven't received any orders for your products yet.
          </p>
        </div>
      </main>
    );
  }

  // ── MAIN ──────────────────────────────────────────────────────
  return (
    <main className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-10">
      {/* ── BREADCRUMB ────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-8">
        <Link
          href="/seller/profile"
          className="text-xs font-medium text-[#1a2e28]/35 hover:text-[#2D7D6F] transition-colors duration-150"
        >
          Shop Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 text-[#1a2e28]/20" />
        <span className="text-xs font-bold text-[#1a2e28]">Orders</span>
      </div>

      {/* ── PAGE HEADER ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-[#2D7D6F]" />
            <h1 className="text-2xl font-black text-[#1a2e28] tracking-tight">
              Shop Orders
            </h1>
          </div>
          <p className="text-xs text-[#1a2e28]/35 pl-4">
            <span className="font-bold text-[#1a2e28]/55">
              {filteredOrders.length}
            </span>{" "}
            {filteredOrders.length === 1 ? "order" : "orders"} found
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "All Status", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
                { label: "Cancelled", value: "cancelled" },
              ],
            },
            {
              value: timeFilter,
              onChange: setTimeFilter,
              options: [
                { label: "Past 3 months", value: "past 3 months" },
                ...getAvailableYears().map((y) => ({
                  label: String(y),
                  value: String(y),
                })),
                { label: "All time", value: "all time" },
              ],
            },
          ].map((filter, i) => (
            <div key={i} className="relative">
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="appearance-none text-xs font-bold text-[#1a2e28] bg-white border border-[#E8E4DD] rounded-xl px-3.5 py-2.5 pr-8 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all cursor-pointer"
              >
                {filter.options.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <svg
                className="w-3 h-3 text-[#1a2e28]/30 rotate-90 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* ── ORDERS LIST ───────────────────────────────────────── */}
      <div className="space-y-5">
        {visibleOrders.length === 0 ? (
          <div className="bg-white border border-[#E8E4DD] rounded-2xl p-12 text-center">
            <p className="text-sm text-[#1a2e28]/35 font-medium">
              No orders match the selected filters.
            </p>
          </div>
        ) : (
          visibleOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm"
            >
              {/* ── ORDER HEADER BAND ──────────────────────────── */}
              <div className="bg-[#F0F4F3] border-b border-[#E8E4DD] px-5 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-6">
                  {[
                    {
                      label: "Order Date",
                      value: new Date(order.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      ),
                    },
                    { label: "Customer", value: order.userId?.name || "N/A" },
                    { label: "Order #", value: order.orderNumber },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] font-black tracking-[0.25em] uppercase text-[#1a2e28]/30 mb-1">
                        {label}
                      </p>
                      <p className="text-xs font-bold text-[#1a2e28]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-full capitalize tracking-wide ${
                    {
                      pending:
                        "bg-amber-50 border border-amber-100 text-amber-700",
                      confirmed:
                        "bg-blue-50 border border-blue-100 text-blue-700",
                      shipped:
                        "bg-purple-50 border border-purple-100 text-purple-700",
                      delivered:
                        "bg-emerald-50 border border-emerald-100 text-emerald-700",
                      cancelled:
                        "bg-rose-50 border border-rose-100 text-rose-700",
                    }[order.status] ||
                    "bg-[#F0F4F3] border border-[#d0dbd9] text-[#1a2e28]/40"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {order.status}
                </span>
              </div>

              {/* ── ORDER ITEMS ────────────────────────────────── */}
              <div className="divide-y divide-[#F5F3EF]">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 flex gap-4 hover:bg-[#FDFCFA] transition-colors duration-150"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl bg-[#F0F4F3] border border-[#d0dbd9] overflow-hidden relative shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-bold text-[#1a2e28] hover:text-[#2D7D6F] transition-colors duration-150 line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] text-[#1a2e28]/35 mt-1">
                        Qty:{" "}
                        <span className="font-bold text-[#1a2e28]/55">
                          {item.quantity}
                        </span>
                        <span className="mx-2 text-[#E8E4DD]">·</span>
                        <span className="font-bold text-[#1a2e28]/55">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Status update dropdown — only on first item per order */}
                    {idx === 0 && (
                      <div className="shrink-0 self-center">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, e.target.value)
                            }
                            disabled={
                              order.status === "cancelled" ||
                              order.status === "delivered"
                            }
                            className="appearance-none text-xs font-bold text-[#1a2e28] bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl px-3.5 py-2.5 pr-8 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {[
                              "pending",
                              "confirmed",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ].map((s) => (
                              <option key={s} value={s} className="capitalize">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <svg
                            className="w-3 h-3 text-[#1a2e28]/30 rotate-90 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ── SHIPPING ADDRESS ───────────────────────────── */}
              <div className="px-5 py-4 bg-[#F0F4F3] border-t border-[#E8E4DD]">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-[#2D7D6F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-[#2D7D6F]"
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
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a2e28]/30 mb-1">
                      Shipping Address
                    </p>
                    <p className="text-xs font-bold text-[#1a2e28]">
                      {order.shippingAddress?.name}
                    </p>
                    <p className="text-xs text-[#1a2e28]/45 leading-relaxed">
                      {order.shippingAddress?.address} ·{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.postalCode}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-[11px] text-[#1a2e28]/30">
                        📞 {order.shippingAddress?.phone}
                      </p>
                      {order.shippingAddress?.email && (
                        <p className="text-[11px] text-[#1a2e28]/30">
                          ✉ {order.shippingAddress.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── LOAD MORE ─────────────────────────────────────────── */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-8 py-3 bg-white border border-[#E8E4DD] hover:border-[#2D7D6F]/40 text-[#1a2e28]/50 hover:text-[#1a2e28] rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shadow-sm"
          >
            Load More Orders
          </button>
        </div>
      )}
    </main>
  );
}
