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

  if (orders.length === 0) {
    return (
      <main className="max-w-[1200px] mx-auto w-full p-4 py-16">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't received any orders for your products.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto w-full p-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link
          href="/seller/profile"
          className="text-amazon-blue hover:underline"
        >
          Shop Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-amazon-orange">Orders</span>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-normal mb-6">Shop Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded shadow-sm px-3 py-1.5 text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Time:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded shadow-sm px-3 py-1.5 text-sm outline-none"
          >
            <option value="past 3 months">Past 3 months</option>
            {getAvailableYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
            <option value="all time">All time</option>
          </select>
        </div>

        <div className="ml-auto text-sm">
          <span className="font-bold">{filteredOrders.length}</span> orders
          found
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {visibleOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No orders found for the selected filters.
          </div>
        ) : (
          visibleOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-300 rounded-lg overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center text-xs border-b border-gray-300 gap-4">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="uppercase text-gray-600">Order Date</div>
                    <div className="font-normal text-sm text-gray-900 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase text-gray-600">Customer</div>
                    <div className="font-normal text-sm text-gray-900 mt-1">
                      {order.userId?.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase text-gray-600">Order #</div>
                    <div className="font-normal text-sm text-gray-900 mt-1">
                      {order.orderNumber}
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      statusColors[order.status] || statusColors.pending
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-4 ${
                      idx > 0 ? "pt-4 border-t border-gray-200 mt-4" : ""
                    }`}
                  >
                    <div className="w-24 h-24 flex-shrink-0 relative">
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
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-xs text-amazon-orange font-bold mt-1">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Status Update Dropdown */}
                    <div className="flex items-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-amazon-blue"
                        disabled={
                          order.status === "cancelled" ||
                          order.status === "delivered"
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}

                {/* Customer Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-bold mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress?.name}
                    <br />
                    {order.shippingAddress?.address}
                    <br />
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.postalCode}
                    <br />
                    Phone: {order.shippingAddress?.phone}
                    <br />
                    {order.shippingAddress?.email && "Email: "}
                    {order.shippingAddress?.email}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Load More Orders
          </button>
        </div>
      )}
    </main>
  );
}
