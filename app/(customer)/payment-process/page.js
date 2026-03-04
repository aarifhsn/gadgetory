"use client";

import EditOrderModal from "@/components/checkout/EditOrderModal";
import { useCart } from "@/context/CartContext";
import { CircleX, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PaymentProcessPage() {
  const {
    cart,
    shippingAddress,
    getCartTotal,
    getItemCount,
    updateQuantity,
    unitsSold,
    setShippingAddress,
    removeFromCart,
  } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showEditModal, setShowEditModal] = useState(false);

  // Calculate service fee
  const serviceFee = cart.reduce((fee, item) => {
    if (item.category === "laptops") return fee + 200;
    if (item.category === "mobiles") return fee + 100;
    return fee;
  }, 0);
  const deliveryFee = getCartTotal() >= 5000 ? 0 : 100;
  const orderTotal = getCartTotal() + serviceFee + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/products");
      return;
    }

    if (!shippingAddress) {
      toast.error("Please add shipping address");
      router.push("/checkout/address");
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        orderNumber: `GB-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 999999),
        ).padStart(6, "0")}`,
        items: cart.map((item) => ({
          productId: item.id,
          slug: item.slug || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress,
        subtotal: getCartTotal(),
        deliveryFee,
        serviceFee,
        total: orderTotal,
        paymentMethod, // from state
      };

      // Call API to create order and update unitsSold
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to place order");
        setLoading(false);
        return;
      }
      setLoading(true);

      toast.success("Order placed successfully!");

      // Refresh server components to update stock
      router.refresh();

      router.push("/checkout/success");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  // Add handlers
  const handleUpdateAddress = (newAddress) => {
    // Update via CartContext
    setShippingAddress(newAddress);
    toast.success("Address updated");
  };

  // remove from cart
  const handleRemoveItem = (productId) => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      removeFromCart(productId);
    }
  };

  return (
    <main className="flex-1 py-10 px-4 md:px-16 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">
        {/* ── EMPTY STATE ───────────────────────────────────────────── */}
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#F5F3EF] border border-[#E8E4DD] flex items-center justify-center mb-5">
              <ShieldCheck className="w-9 h-9 text-[#1a1a2e]/15" />
            </div>
            <h2 className="text-xl font-black text-[#1a1a2e] mb-6">
              Your cart is empty
            </h2>
            <button
              onClick={() => router.push("/")}
              className="bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {cart.length > 0 && (
          <>
            {/* ── CHECKOUT PROGRESS ───────────────────────────────────── */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[
                { step: 1, label: "Cart", done: true },
                { step: 2, label: "Address", done: true },
                { step: 3, label: "Payment", active: true },
              ].map(({ step, label, done, active }, idx) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        done
                          ? "bg-[#D4A853] text-[#1a1a2e]"
                          : active
                            ? "bg-[#1a1a2e] text-white"
                            : "bg-[#E8E4DD] text-[#1a1a2e]/30"
                      }`}
                    >
                      {done ? (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold tracking-wide ${active ? "text-[#1a1a2e]" : done ? "text-[#D4A853]" : "text-[#1a1a2e]/25"}`}
                    >
                      {label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`w-12 h-px ${done ? "bg-[#D4A853]" : "bg-[#E8E4DD]"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* ── LEFT: STEPS ───────────────────────────────────────── */}
              <div className="flex-1 min-w-0 space-y-5">
                {/* Edit order button */}
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 text-xs font-bold text-[#1a1a2e]/50 hover:text-[#D4A853] border border-[#E8E4DD] hover:border-[#D4A853]/40 bg-white px-4 py-2.5 rounded-xl transition-all duration-200"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Order Details
                </button>

                {/* ── STEP 1: SHIPPING ADDRESS ──────────────────────── */}
                <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#D4A853] flex items-center justify-center text-[10px] font-black text-[#1a1a2e]">
                        1
                      </div>
                      <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                        Shipping Address
                      </h2>
                    </div>
                    <button
                      onClick={() => router.push("/checkout/address")}
                      className="text-[11px] font-bold text-[#D4A853] hover:underline underline-offset-4"
                    >
                      {shippingAddress ? "Change" : "Add"} →
                    </button>
                  </div>
                  <div className="px-6 py-5">
                    {shippingAddress ? (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4 text-[#D4A853]"
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
                          <p className="text-sm font-black text-[#1a1a2e]">
                            {shippingAddress.name}
                          </p>
                          <p className="text-xs text-[#1a1a2e]/45 mt-0.5 leading-relaxed">
                            {shippingAddress.address}
                            <br />
                            {shippingAddress.city}, {shippingAddress.postalCode}{" "}
                            · {shippingAddress.country}
                          </p>
                          <div className="flex items-center gap-4 mt-1.5">
                            <p className="text-[11px] text-[#1a1a2e]/35">
                              📞 {shippingAddress.phone}
                            </p>
                            {shippingAddress.email && (
                              <p className="text-[11px] text-[#1a1a2e]/35">
                                ✉ {shippingAddress.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#1a1a2e]/35 italic">
                        No address added yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── STEP 2: REVIEW ITEMS ──────────────────────────── */}
                <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#D4A853] flex items-center justify-center text-[10px] font-black text-[#1a1a2e]">
                      2
                    </div>
                    <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                      Review Items
                    </h2>
                  </div>

                  <div className="divide-y divide-[#F5F3EF]">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 flex gap-4 hover:bg-[#FDFCFA] transition-colors duration-150"
                      >
                        <div className="w-20 h-20 rounded-xl bg-[#F5F3EF] border border-[#E8E4DD] overflow-hidden relative shrink-0">
                          <Image
                            width={100}
                            height={100}
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-[#1a1a2e] line-clamp-2 leading-snug">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[#1a1a2e]/20 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                            >
                              <CircleX className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[11px] text-[#1a1a2e]/35 mt-1">
                            Sold by{" "}
                            <span className="font-medium text-[#1a1a2e]/50">
                              {item.shopInfo?.name || "Official Store"}
                            </span>
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm font-black text-[#1a1a2e]">
                              ৳{item.price.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2 bg-[#F5F3EF] border border-[#E8E4DD] rounded-xl px-3 py-1.5">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="w-4 h-4 flex items-center justify-center text-[#1a1a2e]/40 hover:text-[#1a1a2e] disabled:opacity-20 font-black text-sm"
                              >
                                −
                              </button>
                              <span className="text-xs font-black text-[#1a1a2e] w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-4 h-4 flex items-center justify-center text-[#1a1a2e]/40 hover:text-[#1a1a2e] font-black text-sm"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── STEP 3: PAYMENT METHOD ────────────────────────── */}
                <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[10px] font-black text-white">
                      3
                    </div>
                    <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                      Payment Method
                    </h2>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="p-6 space-y-4">
                    {/* Card option */}
                    <label
                      className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === "card"
                          ? "border-[#D4A853]/50 bg-[#D4A853]/5 ring-2 ring-[#D4A853]/20"
                          : "border-[#E8E4DD] hover:border-[#D4A853]/30 hover:bg-[#FAF9F6]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 accent-[#D4A853]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-black text-[#1a1a2e]">
                            Credit or Debit Card
                          </span>
                          <div className="flex items-center gap-2">
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

                        {paymentMethod === "card" && (
                          <div className="mt-4 space-y-3">
                            <div>
                              <label className="block text-[11px] font-bold text-[#1a1a2e]/50 mb-1.5 tracking-wide">
                                Name on Card
                              </label>
                              <input
                                type="text"
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-2.5 bg-white border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all"
                              />
                            </div>
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="block text-[11px] font-bold text-[#1a1a2e]/50 mb-1.5 tracking-wide">
                                  Card Number
                                </label>
                                <input
                                  type="text"
                                  placeholder="#### #### #### ####"
                                  required
                                  className="w-full px-4 py-2.5 bg-white border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all"
                                />
                              </div>
                              <div className="w-24">
                                <label className="block text-[11px] font-bold text-[#1a1a2e]/50 mb-1.5 tracking-wide">
                                  CVV
                                </label>
                                <input
                                  type="password"
                                  placeholder="•••"
                                  required
                                  maxLength={3}
                                  className="w-full px-4 py-2.5 bg-white border border-[#E8E4DD] rounded-xl text-sm outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-[#1a1a2e]/50 mb-1.5 tracking-wide">
                                Expiration Date
                              </label>
                              <div className="flex gap-3">
                                {[
                                  {
                                    placeholder: "MM",
                                    options: [...Array(12)].map((_, i) =>
                                      String(i + 1).padStart(2, "0"),
                                    ),
                                  },
                                  {
                                    placeholder: "YYYY",
                                    options: [...Array(10)].map((_, i) =>
                                      String(2025 + i),
                                    ),
                                  },
                                ].map(({ placeholder, options }) => (
                                  <div key={placeholder} className="relative">
                                    <select
                                      required
                                      className="appearance-none px-4 py-2.5 pr-8 bg-white border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all cursor-pointer"
                                    >
                                      <option value="">{placeholder}</option>
                                      {options.map((o) => (
                                        <option key={o} value={o}>
                                          {o}
                                        </option>
                                      ))}
                                    </select>
                                    <svg
                                      className="w-3 h-3 text-[#1a1a2e]/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none rotate-90"
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
                          </div>
                        )}
                      </div>
                    </label>

                    {/* COD option */}
                    <label
                      className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === "cod"
                          ? "border-[#D4A853]/50 bg-[#D4A853]/5 ring-2 ring-[#D4A853]/20"
                          : "border-[#E8E4DD] hover:border-[#D4A853]/30 hover:bg-[#FAF9F6]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 accent-[#D4A853]"
                      />
                      <div>
                        <span className="text-sm font-black text-[#1a1a2e] block">
                          Cash on Delivery
                        </span>
                        <span className="text-xs text-[#1a1a2e]/40 mt-0.5 block">
                          Pay when you receive your order
                        </span>
                      </div>
                    </label>
                  </form>
                </div>
              </div>

              {/* ── RIGHT: ORDER SUMMARY ──────────────────────────────── */}
              <div className="w-full lg:w-80 shrink-0 sticky top-20">
                <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
                    <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                      Order Summary
                    </h3>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Price breakdown */}
                    <div className="space-y-2.5">
                      {[
                        {
                          label: `Items (${getItemCount()})`,
                          value: `৳${getCartTotal().toLocaleString()}`,
                        },
                        {
                          label: "Delivery Fee",
                          value: deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`,
                          highlight: deliveryFee === 0,
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
                          Order Total
                        </span>
                        <span className="text-xl font-black text-[#1a1a2e]">
                          ৳{orderTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Trust badges */}
                    <div className="space-y-2">
                      {[
                        {
                          icon: Truck,
                          text: "FREE delivery on orders over ৳50,000",
                          green: true,
                        },
                        {
                          icon: ShieldCheck,
                          text: "Secure & encrypted checkout",
                        },
                      ].map(({ icon: Icon, text, green }) => (
                        <div key={text} className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${green ? "text-emerald-500" : "text-[#1a1a2e]/25"}`}
                          />
                          <span
                            className={`text-[11px] font-medium ${green ? "text-emerald-600" : "text-[#1a1a2e]/35"}`}
                          >
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Place order CTA */}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={cart.length === 0 || loading}
                      className="w-full py-4 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-lg shadow-[#1a1a2e]/10 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Placing Order...
                        </span>
                      ) : (
                        "Place Your Order"
                      )}
                    </button>

                    {/* Legal */}
                    <p className="text-[10px] text-[#1a1a2e]/25 text-center leading-relaxed">
                      By placing your order, you agree to gadgetory's{" "}
                      <a href="#" className="text-[#D4A853] hover:underline">
                        privacy notice
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#D4A853] hover:underline">
                        conditions of use
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── EDIT ORDER MODAL ──────────────────────────────────────── */}
        {showEditModal && (
          <EditOrderModal
            cart={cart}
            shippingAddress={shippingAddress}
            onUpdateQuantity={updateQuantity}
            onUpdateAddress={handleUpdateAddress}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </div>
    </main>
  );
}
