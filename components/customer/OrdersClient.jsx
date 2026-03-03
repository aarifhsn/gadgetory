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

  if (isLoading) {
    return (
      <main className="max-w-[1000px] mx-auto w-full p-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </main>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <main className="max-w-[1000px] mx-auto w-full p-4 py-16">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            Start shopping to see your orders here!
          </p>
          <Link
            href="/products"
            className="inline-block bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary px-8 py-2 rounded-md text-sm font-bold"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1000px] mx-auto w-full p-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link href="/account" className="text-amazon-blue hover:underline">
          Your Account
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-amazon-orange">Your Orders</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-normal">Your Orders</h1>
      </div>

      {/* Filter */}
      <div className="text-sm mb-6 flex items-center gap-1">
        <span className="font-bold">
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1 ? "order" : "orders"}
        </span>
        <span>placed in</span>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded shadow-sm px-2 py-1 text-xs outline-none hover:bg-gray-200"
        >
          <option value="past 3 months">past 3 months</option>
          {getAvailableYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
          <option value="all time">all time</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {visibleOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No orders found for the selected period.
          </div>
        ) : (
          visibleOrders.map((order, orderIndex) => (
            <div
              key={orderIndex}
              className="border border-gray-300 rounded-lg overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center text-xs text-gray-600 border-b border-gray-300 gap-4">
                <div className="flex flex-wrap gap-6 md:gap-10">
                  <div>
                    <div className="uppercase tracking-tighter">
                      Order Placed
                    </div>
                    <div className="font-normal text-sm text-gray-900 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-tighter">Total</div>
                    <div className="font-normal text-sm text-gray-900 mt-1">
                      ৳{order.total.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-tighter">Ship to</div>
                    <div className="font-normal text-sm text-amazon-blue mt-1 hover:underline cursor-pointer">
                      {order.shippingAddress?.name || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="uppercase tracking-tighter mb-1">
                    Order # {order.orderNumber}
                  </div>
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="text-amazon-blue hover:underline"
                  >
                    View order details
                  </Link>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 space-y-6">
                {order.items.map((item, itemIndex) => {
                  return (
                    <div
                      key={itemIndex}
                      className={`flex gap-4 ${
                        itemIndex > 0 ? "pt-6 border-t border-gray-200" : ""
                      }`}
                    >
                      <div className="w-32 h-32 flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover border border-gray-200 rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-amazon-blue hover:underline font-bold text-sm"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-600 mt-1">
                          Sold by: {seller.shopName || "Official Store"}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Price: ৳
                          {(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Status Badge */}
                        <div className="mt-2">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full capitalize ${
                              statusStyles[order.status] || statusStyles.pending
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download Invoice
                          </button>

                          {order.status === "delivered" &&
                            (reviewedProducts.has(item.productId) ? (
                              <Link
                                href={`/products/${item.slug}#reviews`}
                                className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 inline-block"
                              >
                                View Your Review
                              </Link>
                            ) : (
                              <button
                                onClick={() =>
                                  handleWriteReview(item, order._id)
                                }
                                className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50"
                              >
                                Write a Review
                              </button>
                            ))}

                          <button
                            onClick={() => handleBuyAgain(item)}
                            className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50"
                          >
                            Buy it again
                          </button>

                          {order.status !== "cancelled" &&
                            order.status !== "delivered" &&
                            order.status !== "shipped" && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-1.5 border border-red-300 bg-red-50 text-red-700 rounded-md text-xs hover:bg-red-100 flex items-center gap-1"
                              >
                                <XCircle className="w-3 h-3" />
                                Cancel Order
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More (if needed) */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Load More Orders
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setReviewingProduct(null);
          setReviewOrderId(null);
        }}
        product={reviewingProduct}
        orderId={reviewOrderId}
        redirectAfterSuccess={true} // Redirect to product page after review
        onSuccess={() => {
          // Just close modal, redirect will happen automatically
          setReviewModalOpen(false);
        }}
      />
    </main>
  );
}
