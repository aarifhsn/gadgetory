"use client";

import { ChevronRight, MapPin, Package as PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderDetailsClient({ order }) {
  return (
    <main className="max-w-[1000px] mx-auto w-full p-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link href="/account" className="text-amazon-blue hover:underline">
          Your Account
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href="/orders" className="text-amazon-blue hover:underline">
          Your Orders
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-amazon-orange">Order Details</span>
      </div>

      {/* Order Header */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Order Number</p>
            <p className="font-bold">#{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Order Date</p>
            <p className="font-bold">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Order Total</p>
            <p className="font-bold text-amazon-orange">
              ৳{order.total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Address
        </h2>
        <div className="text-sm text-gray-700">
          <p className="font-bold">{order.shippingAddress?.name}</p>
          <p>{order.shippingAddress?.address}</p>
          <p>
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
          </p>
          <p>{order.shippingAddress?.country}</p>
          <p className="mt-2">Phone: {order.shippingAddress?.phone}</p>
          <p className="mt-2">Email: {order.shippingAddress?.email}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PackageIcon className="w-5 h-5" />
          Items in this order
        </h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
            >
              <div className="w-24 h-24 relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover border border-gray-200 rounded"
                />
              </div>
              <div className="flex-1">
                <Link
                  href={`/products/${item.slug || item.productId}`}
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
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>৳{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            {order.deliveryFee === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              <span>৳{order.deliveryFee.toLocaleString()}</span>
            )}
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span>Service Fee:</span>
            <span>৳{order.serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-amazon-orange pt-2">
            <span>Total:</span>
            <span>৳{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
