"use client";

import { useCart } from "@/context/CartContext";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddressPage() {
  const { shippingAddress, setShippingAddress, cart, getCartTotal } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  const [errors, setErrors] = useState({});

  // Load existing address if available
  useEffect(() => {
    if (shippingAddress) {
      setFormData(shippingAddress);
    }
  }, [shippingAddress]);

  // If cart is empty, redirect to home
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^(\+880|880|0)?1[3-9]\d{8}$/.test(formData.phone.replace(/[\s-]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid Bangladesh phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^\d{4}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Please enter a valid 4-digit postal code";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Save address to context
      setShippingAddress(formData);
      // Redirect to payment page
      router.push("/payment-process");
    }
  };

  // Calculate service fee
  const serviceFee = cart.reduce((fee, item) => {
    if (item.category === "laptops") return fee + 200;
    if (item.category === "mobiles") return fee + 100;
    return fee;
  }, 0);

  const deliveryFee = getCartTotal() >= 5000 ? 0 : 100;
  const orderTotal = getCartTotal() + serviceFee + deliveryFee;

  return (
    <main className="flex-1 py-10 px-4 md:px-16 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">
        {/* ── CHECKOUT PROGRESS ─────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[
            { step: 1, label: "Cart" },
            { step: 2, label: "Address", active: true },
            { step: 3, label: "Payment" },
          ].map(({ step, label, active }, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    active
                      ? "bg-[#1a1a2e] text-white"
                      : step < 2
                        ? "bg-[#D4A853] text-[#1a1a2e]"
                        : "bg-[#E8E4DD] text-[#1a1a2e]/30"
                  }`}
                >
                  {step < 2 ? (
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
                  className={`text-xs font-bold tracking-wide ${active ? "text-[#1a1a2e]" : step < 2 ? "text-[#D4A853]" : "text-[#1a1a2e]/25"}`}
                >
                  {label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`w-12 h-px ${step < 2 ? "bg-[#D4A853]" : "bg-[#E8E4DD]"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT: ADDRESS FORM ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
              <div>
                <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
                  Shipping Address
                </h1>
                <p className="text-xs text-[#1a1a2e]/35 mt-0.5">
                  Please provide your delivery details
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ── CONTACT INFO ────────────────────────────────────── */}
              <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
                  <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                    Contact Information
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                      Full Name <span className="text-[#D4A853]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 bg-[#FAF9F6] border rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:ring-2 focus:ring-[#D4A853]/15 transition-all duration-200 ${
                        errors.name
                          ? "border-rose-300 bg-rose-50/30"
                          : "border-[#E8E4DD] focus:border-[#D4A853]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-rose-500 text-[11px] mt-1.5 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                      Email{" "}
                      <span className="text-[#1a1a2e]/25 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 bg-[#FAF9F6] border rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:ring-2 focus:ring-[#D4A853]/15 transition-all duration-200 ${
                        errors.email
                          ? "border-rose-300 bg-rose-50/30"
                          : "border-[#E8E4DD] focus:border-[#D4A853]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-rose-500 text-[11px] mt-1.5 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                      Phone Number <span className="text-[#D4A853]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1712-345678"
                      className={`w-full px-4 py-3 bg-[#FAF9F6] border rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:ring-2 focus:ring-[#D4A853]/15 transition-all duration-200 ${
                        errors.phone
                          ? "border-rose-300 bg-rose-50/30"
                          : "border-[#E8E4DD] focus:border-[#D4A853]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-rose-500 text-[11px] mt-1.5 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── DELIVERY DETAILS ────────────────────────────────── */}
              <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#E8E4DD] flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
                  <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                    Delivery Details
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                      Street Address <span className="text-[#D4A853]">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, Apartment 4B"
                      rows="3"
                      className={`w-full px-4 py-3 bg-[#FAF9F6] border rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:ring-2 focus:ring-[#D4A853]/15 transition-all duration-200 resize-none ${
                        errors.address
                          ? "border-rose-300 bg-rose-50/30"
                          : "border-[#E8E4DD] focus:border-[#D4A853]"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-rose-500 text-[11px] mt-1.5 font-medium">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City + Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                        City <span className="text-[#D4A853]">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Dhaka"
                        className={`w-full px-4 py-3 bg-[#FAF9F6] border rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:ring-2 focus:ring-[#D4A853]/15 transition-all duration-200 ${
                          errors.city
                            ? "border-rose-300 bg-rose-50/30"
                            : "border-[#E8E4DD] focus:border-[#D4A853]"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-rose-500 text-[11px] mt-1.5 font-medium">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                        Postal Code <span className="text-[#D4A853]">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="1212"
                        maxLength="4"
                        className={`w-full px-4 py-3 bg-[#FAF9F6] border rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:ring-2 focus:ring-[#D4A853]/15 transition-all duration-200 ${
                          errors.postalCode
                            ? "border-rose-300 bg-rose-50/30"
                            : "border-[#E8E4DD] focus:border-[#D4A853]"
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="text-rose-500 text-[11px] mt-1.5 font-medium">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                      Country <span className="text-[#D4A853]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[#FAF9F6] border rounded-xl text-sm text-[#1a1a2e] outline-none focus:ring-2 focus:ring-[#D4A853]/15 transition-all duration-200 appearance-none cursor-pointer ${
                          errors.country
                            ? "border-rose-300"
                            : "border-[#E8E4DD] focus:border-[#D4A853]"
                        }`}
                      >
                        {[
                          "Bangladesh",
                          "India",
                          "Pakistan",
                          "Nepal",
                          "Sri Lanka",
                        ].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <svg
                        className="w-3.5 h-3.5 text-[#1a1a2e]/30 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90"
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
                    {errors.country && (
                      <p className="text-rose-500 text-[11px] mt-1.5 font-medium">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ADDRESS SAVE NOTICE ─────────────────────────────── */}
              <div className="flex items-start gap-3 p-4 bg-[#1a1a2e]/3 border border-[#1a1a2e]/8 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#D4A853]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1a1a2e]/70 mb-0.5">
                    Address will be saved
                  </p>
                  <p className="text-[11px] text-[#1a1a2e]/40 leading-relaxed">
                    This address will be saved to your account for faster
                    checkout next time.
                  </p>
                </div>
              </div>

              {/* ── ACTION BUTTONS ──────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-lg shadow-[#1a1a2e]/10 transition-all duration-300"
                >
                  Continue to Payment →
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="sm:w-40 py-4 bg-white border border-[#E8E4DD] hover:border-[#1a1a2e]/20 text-xs font-bold text-[#1a1a2e]/50 hover:text-[#1a1a2e] rounded-xl transition-all duration-200"
                >
                  ← Back to Cart
                </button>
              </div>
            </form>
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
                {/* Cart items preview */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] border border-[#E8E4DD] overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1a1a2e] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#1a1a2e]/35 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-black text-[#1a1a2e] mt-0.5">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-[#E8E4DD] pt-4 space-y-2.5">
                  {[
                    {
                      label: `Items (${cart.length})`,
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

                {/* Note */}
                <div className="bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl p-3.5">
                  <p className="text-[11px] text-[#1a1a2e]/40 leading-relaxed">
                    <span className="font-bold text-[#1a1a2e]/60">Note: </span>
                    Please provide accurate delivery information to ensure
                    smooth delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
