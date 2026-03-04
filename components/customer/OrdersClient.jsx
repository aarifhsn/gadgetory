"use client";

import { generateInvoicePDF } from "@/utils/invoicePdf";
import { ChevronRight, Download, Package, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WriteReviewModal from "../reviews/WriteReviewModal";

export default function OrdersClient({ orders: initialOrders, seller }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [timeFilter, setTimeFilter] = useState("past 3 months");
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(
    initialOrders === undefined || initialOrders === null,
  );
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    let filtered = [...orders];

    if (timeFilter === "past 3 months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      filtered = orders.filter(
        (order) => new Date(order.createdAt) >= threeMonthsAgo,
      );
    } else if (timeFilter !== "all time") {
      // Filter by year
      filtered = orders.filter((order) => {
        const orderYear = new Date(order.createdAt).getFullYear();
        return orderYear.toString() === timeFilter;
      });
    }

    setFilteredOrders(filtered);
  }, [timeFilter, orders]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch("/api/reviews/user-reviews");
        const data = await response.json();

        if (data.success) {
          // Create a Set of productIds that user has reviewed
          const reviewedIds = new Set(data.reviews.map((r) => r.productId));
          setReviewedProducts(reviewedIds);
        }
      } catch (error) {
        console.error("Fetch reviews error:", error);
      }
    };

    fetchUserReviews();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  // Get visible orders
  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  const handleDownloadInvoice = (order) => {
    generateInvoicePDF(order, { download: true });
  };

  const handleBuyAgain = (item) => {
    router.push(`/products/${item.slug}`);
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "cancelled" } : o,
          ),
        );
      } else {
        alert("Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Something went wrong");
    }
  };

  const getAvailableYears = () => {
    const years = new Set();
    orders.forEach((order) => {
      const year = new Date(order.createdAt).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const handleWriteReview = (item, orderId) => {
    setReviewingProduct({
      _id: item.productId,
      name: item.name,
      slug: item.slug,
    });
    setReviewOrderId(orderId);
    setReviewModalOpen(true);
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <main className="max-w-[1000px] mx-auto w-full px-4 md:px-8 py-10">
      {/* ── LOADING STATE ─────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4A853] border-t-transparent animate-spin mb-4" />
          <p className="text-sm text-[#1a1a2e]/35 font-medium">
            Loading your orders...
          </p>
        </div>
      )}

      {/* ── EMPTY STATE ───────────────────────────────────────────── */}
      {!isLoading && (!orders || orders.length === 0) && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-24 h-24 rounded-3xl bg-[#F5F3EF] border border-[#E8E4DD] flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-[#1a1a2e]/15" />
          </div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight mb-2">
            No orders yet
          </h2>
          <p className="text-sm text-[#1a1a2e]/40 mb-8 max-w-xs">
            Start shopping to see your orders here!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-[#1a1a2e]/10"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      {!isLoading && orders && orders.length > 0 && (
        <>
          {/* ── BREADCRUMB ──────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 mb-8">
            <Link
              href="/account"
              className="text-xs font-medium text-[#1a1a2e]/35 hover:text-[#D4A853] transition-colors duration-150"
            >
              Your Account
            </Link>
            <ChevronRight className="w-3 h-3 text-[#1a1a2e]/20" />
            <span className="text-xs font-bold text-[#1a1a2e]">
              Your Orders
            </span>
          </div>

          {/* ── PAGE HEADER ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
              <div>
                <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
                  Your Orders
                </h1>
                <p className="text-xs text-[#1a1a2e]/35 mt-0.5">
                  <span className="font-bold text-[#1a1a2e]/55">
                    {filteredOrders.length}
                  </span>{" "}
                  {filteredOrders.length === 1 ? "order" : "orders"} found
                </p>
              </div>
            </div>

            {/* Time filter */}
            <div className="flex items-center gap-3 bg-white border border-[#E8E4DD] rounded-xl px-4 py-2.5">
              <span className="text-xs font-bold text-[#1a1a2e]/35 tracking-wide uppercase whitespace-nowrap">
                Show
              </span>
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="appearance-none text-xs font-bold text-[#1a1a2e] bg-transparent pr-5 outline-none cursor-pointer"
                >
                  <option value="past 3 months">Past 3 months</option>
                  {getAvailableYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                  <option value="all time">All time</option>
                </select>
                <ChevronRight className="w-3 h-3 text-[#1a1a2e]/30 rotate-90 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── ORDERS LIST ─────────────────────────────────────────── */}
          <div className="space-y-5">
            {visibleOrders.length === 0 ? (
              <div className="bg-white border border-[#E8E4DD] rounded-2xl p-12 text-center">
                <p className="text-sm text-[#1a1a2e]/35 font-medium">
                  No orders found for the selected period.
                </p>
              </div>
            ) : (
              visibleOrders.map((order, orderIndex) => (
                <div
                  key={orderIndex}
                  className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* ── ORDER HEADER BAND ───────────────────────────── */}
                  <div className="bg-[#FAF9F6] border-b border-[#E8E4DD] px-5 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-6">
                      {[
                        {
                          label: "Order Placed",
                          value: new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          ),
                        },
                        {
                          label: "Total",
                          value: `৳${order.total.toLocaleString()}`,
                        },
                        {
                          label: "Ship To",
                          value: order.shippingAddress?.name || "N/A",
                        },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[9px] font-black tracking-[0.25em] uppercase text-[#1a1a2e]/30 mb-1">
                            {label}
                          </p>
                          <p className="text-xs font-bold text-[#1a1a2e]">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black tracking-[0.25em] uppercase text-[#1a1a2e]/30 mb-1">
                        Order # {order.orderNumber}
                      </p>
                      <Link
                        href={`/orders/${order.orderNumber}`}
                        className="text-[11px] font-bold text-[#D4A853] hover:underline underline-offset-4"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>

                  {/* ── ORDER ITEMS ─────────────────────────────────── */}
                  <div className="divide-y divide-[#F5F3EF]">
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="p-5 flex gap-4 hover:bg-[#FDFCFA] transition-colors duration-150"
                      >
                        {/* Image */}
                        <div className="w-24 h-24 rounded-xl bg-[#F5F3EF] border border-[#E8E4DD] overflow-hidden relative shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="text-sm font-bold text-[#1a1a2e] hover:text-[#D4A853] transition-colors duration-150 line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>

                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <p className="text-[11px] text-[#1a1a2e]/35">
                              Sold by{" "}
                              <span className="font-medium text-[#1a1a2e]/50">
                                {seller.shopName || "Official Store"}
                              </span>
                            </p>
                            <span className="text-[#E8E4DD]">·</span>
                            <p className="text-[11px] text-[#1a1a2e]/35">
                              Qty:{" "}
                              <span className="font-bold text-[#1a1a2e]/55">
                                {item.quantity}
                              </span>
                            </p>
                            <span className="text-[#E8E4DD]">·</span>
                            <p className="text-[11px] font-bold text-[#1a1a2e]/55">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>

                          {/* Status badge */}
                          <div className="mt-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-full capitalize tracking-wide ${statusStyles[order.status] || statusStyles.pending}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                              {order.status}
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button
                              onClick={() => handleDownloadInvoice(order)}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF9F6] border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/55 hover:text-[#1a1a2e] rounded-xl text-[11px] font-bold transition-all duration-200"
                            >
                              <Download className="w-3 h-3" />
                              Invoice
                            </button>

                            <button
                              onClick={() => handleBuyAgain(item)}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF9F6] border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/55 hover:text-[#1a1a2e] rounded-xl text-[11px] font-bold transition-all duration-200"
                            >
                              Buy Again
                            </button>

                            {order.status === "delivered" &&
                              (reviewedProducts.has(item.productId) ? (
                                <Link
                                  href={`/products/${item.slug}#reviews`}
                                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF9F6] border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/55 hover:text-[#1a1a2e] rounded-xl text-[11px] font-bold transition-all duration-200"
                                >
                                  View Review
                                </Link>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleWriteReview(item, order._id)
                                  }
                                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#D4A853]/8 border border-[#D4A853]/30 hover:bg-[#D4A853]/15 text-[#D4A853] rounded-xl text-[11px] font-bold transition-all duration-200"
                                >
                                  ★ Write Review
                                </button>
                              ))}

                            {order.status !== "cancelled" &&
                              order.status !== "delivered" &&
                              order.status !== "shipped" && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-xl text-[11px] font-bold transition-all duration-200"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Cancel
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── LOAD MORE ───────────────────────────────────────────── */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/50 hover:text-[#1a1a2e] rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shadow-sm"
              >
                Load More Orders
              </button>
            </div>
          )}
        </>
      )}

      {/* ── REVIEW MODAL ──────────────────────────────────────────── */}
      <WriteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setReviewingProduct(null);
          setReviewOrderId(null);
        }}
        product={reviewingProduct}
        orderId={reviewOrderId}
        redirectAfterSuccess={true}
        onSuccess={() => setReviewModalOpen(false)}
      />
    </main>
  );
}
