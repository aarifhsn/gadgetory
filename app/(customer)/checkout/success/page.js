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
    <main className="max-w-[800px] mx-auto w-full p-8 py-12">
      {/* Success Message Box */}
      <div className="flex items-start gap-4 p-6 border border-gray-300 rounded shadow-sm">
        <div className="bg-white border border-green-600 rounded-full p-1 self-start mt-1">
          <Check className="w-6 h-6 text-green-600 stroke-[3]" />
        </div>
        <div className="space-y-4 flex-1">
          <h1 className="text-xl font-bold text-green-700">
            Order placed, thank you!
          </h1>
          <p className="text-sm">Confirmation will be sent to your email.</p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {/* Shipping Info */}
            <div className="flex-1 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
              <span className="font-bold block mb-1">
                Shipping to {orderData.shippingAddress?.name || "Customer"}
              </span>
              <p className="text-gray-600">
                {orderData.shippingAddress?.address || "N/A"}
                <br />
                {orderData.shippingAddress?.city || "N/A"},{" "}
                {orderData.shippingAddress?.postalCode || "N/A"}
                <br />
                {orderData.shippingAddress?.country || "N/A"}
              </p>
              {orderData.shippingAddress?.phone && (
                <p className="text-xs text-gray-500 mt-2">
                  Phone: {orderData.shippingAddress.phone}
                </p>
              )}
              {orderData.shippingAddress?.email && (
                <p className="text-xs text-gray-500 mt-2">
                  Email: {orderData.shippingAddress.email}
                </p>
              )}
            </div>

            {/* Order Info */}
            <div className="flex-1 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
              <span className="font-bold block mb-1">Order Number</span>
              <p className="text-gray-600 font-mono">
                #{orderData.orderNumber}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Placed on {orderData.date}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => generateInvoicePDF(orderData, { download: true })}
              className="w-full sm:w-auto px-8 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-xs transition-colors text-center flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
            <Link
              href="/orders"
              className="w-full sm:w-auto px-8 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-xs transition-colors text-center"
            >
              View All Orders
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-xs transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-normal border-b border-gray-200 pb-4">
          Order Details
        </h2>

        {/* Product List */}
        {orderData.items.map((item, index) => (
          <div
            key={item.id}
            className={`flex gap-4 items-start ${
              index > 0 ? "pt-4 border-t border-gray-100" : ""
            }`}
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover border border-gray-200 rounded"
              />
            </div>
            <div>
              <Link
                href={`/products/${item.slug}`}
                className="text-amazon-blue hover:underline font-bold text-sm"
              >
                {item.name}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                Quantity: {item.quantity}
              </p>
              <p className="text-xs text-amazon-orange font-bold mt-1">
                BDT {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {/* Order Summary */}
        <div className="pt-4 border-t border-gray-200">
          <div className="max-w-sm ml-auto space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>BDT {orderData.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              {orderData.deliveryFee === 0 ? (
                <span className="text-green-600 font-bold">FREE</span>
              ) : (
                <span>BDT {orderData.deliveryFee.toLocaleString()}</span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Service Fee:</span>
              <span>BDT {orderData.serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-amazon-orange">
              <span>Total:</span>
              <span>BDT {orderData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
