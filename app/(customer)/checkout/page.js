"use client";

import { useCart } from "@/context/CartContext";
import { ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, shippingAddress, getCartTotal, getItemCount, updateQuantity } =
    useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const serviceFee = 0;
  const deliveryFee = getCartTotal() >= 5000 ? 0 : 100;
  const orderTotal = getCartTotal() + serviceFee + deliveryFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!shippingAddress) {
      alert("Please add a shipping address");
      router.push("/checkout/address");
      return;
    }

    // Process order (you'll integrate payment gateway here)
    router.push("/checkout/success");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push("/")}
          className="btn-primary px-6 py-2 rounded-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <main className="checkout-container flex-1 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Side: Steps */}
        <div className="flex-1 space-y-6">
          {/* 1. Shipping Address Summary */}
          <div className="hover:bg-gray-50 border-b border-gray-300 pb-6 flex justify-between items-start transition-colors">
            <div>
              <span className="section-number mr-4">1</span>
              <span className="font-bold text-lg">Shipping address</span>
            </div>
            <div className="text-sm flex-1 ml-10">
              {shippingAddress ? (
                <>
                  <p>{shippingAddress.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                  <p className="mt-1 text-gray-600">
                    Phone: {shippingAddress.phone}
                  </p>
                  <p className="mt-1 text-gray-600">
                    Email: {shippingAddress.email}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No address added</p>
              )}
            </div>
            <button
              onClick={() => router.push("/checkout/address")}
              className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange"
            >
              {shippingAddress ? "Change" : "Add"}
            </button>
          </div>

          {/* 2. Selected Products List */}
          <div className="pb-6 border-b border-gray-300">
            <div className="flex items-center mb-4">
              <span className="section-number mr-4">2</span>
              <span className="font-bold text-lg">Review items</span>
            </div>

            <div className="box p-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                >
                  <div className="w-24 h-24 bg-gray-50 flex items-center justify-center flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      Sold by: {item.shopInfo?.name || "Official Store"}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-amazon-orange">
                        ৳{item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span>Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          className="border border-gray-300 rounded px-2 py-0.5"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="pb-6">
            <div className="flex items-center mb-6">
              <span className="section-number mr-4">3</span>
              <span className="font-bold text-lg text-amazon-orange">
                Choose a payment method
              </span>
            </div>

            <form
              onSubmit={handlePlaceOrder}
              className="box p-6 space-y-6 shadow-sm"
            >
              <div className="space-y-4">
                <label
                  className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-amazon-background transition-colors ${
                    paymentMethod === "card"
                      ? "bg-gray-50 border-amazon-orange ring-1 ring-amazon-orange"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold block text-sm">
                      Credit or Debit Card
                    </span>
                    <div className="flex gap-2 mt-2">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                        width={32}
                        height={20}
                        alt="Visa"
                      />
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        width={32}
                        height={20}
                        alt="Mastercard"
                      />
                    </div>
                  </div>
                </label>

                {paymentMethod === "card" && (
                  <div className="pl-8 space-y-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        Name on card
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full max-w-sm px-2 py-1 border border-gray-400 rounded-sm text-sm outline-none focus:ring-1 focus:ring-amazon-blue"
                      />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold block mb-1">
                          Card number
                        </label>
                        <input
                          type="text"
                          placeholder="#### #### #### ####"
                          required
                          className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm outline-none focus:ring-1 focus:ring-amazon-blue"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-xs font-bold block mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="***"
                          required
                          maxLength={3}
                          className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm outline-none focus:ring-1 focus:ring-amazon-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        Expiration date
                      </label>
                      <div className="flex gap-2">
                        <select
                          required
                          className="bg-gray-100 border border-gray-300 rounded p-1 text-xs"
                        >
                          <option value="">MM</option>
                          {[...Array(12)].map((_, i) => (
                            <option
                              key={i + 1}
                              value={String(i + 1).padStart(2, "0")}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <select
                          required
                          className="bg-gray-100 border border-gray-300 rounded p-1 text-xs"
                        >
                          <option value="">YYYY</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={2025 + i} value={2025 + i}>
                              {2025 + i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <label
                  className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-amazon-background transition-colors ${
                    paymentMethod === "cod"
                      ? "bg-gray-50 border-amazon-orange ring-1 ring-amazon-orange"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold block text-sm">
                      Cash on Delivery
                    </span>
                    <span className="text-xs text-gray-600">
                      Pay when you receive
                    </span>
                  </div>
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[300px]">
          <div className="box p-4 sticky top-10">
            <button
              onClick={handlePlaceOrder}
              className="w-full py-2 mb-4 rounded-md btn-primary text-sm font-normal shadow-sm"
            >
              Place your order
            </button>
            <p className="text-[10px] text-gray-500 text-center mb-4 border-b border-gray-300 pb-4 leading-tight">
              By placing your order, you agree to Gadgets BD's{" "}
              <a href="#" className="text-amazon-blue hover:underline">
                privacy notice
              </a>{" "}
              and{" "}
              <a href="#" className="text-amazon-blue hover:underline">
                conditions of use
              </a>
              .
            </p>

            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items ({getItemCount()}):</span>
                <span>৳{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-bold">FREE</span>
                ) : (
                  <span>৳{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Service Fee:</span>
                <span>৳{serviceFee}</span>
              </div>
              <div className="flex justify-between text-amazon-orange text-lg font-bold pt-2">
                <span>Order Total:</span>
                <span>৳{orderTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs">
              <p className="text-green-600 font-bold mb-2">
                <Truck className="w-4 h-4 inline mr-1" />
                FREE Delivery on orders over ৳50,000
              </p>
              <p className="text-gray-600">
                <ShieldCheck className="w-4 h-4 inline mr-1" />
                Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
