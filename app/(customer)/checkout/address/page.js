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
    <main className="checkout-container flex-1 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Side: Address Form */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Shipping Address</h1>
            <p className="text-sm text-gray-600">
              Please provide your shipping details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="box p-6 space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-amazon-blue ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2">
                Email <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-amazon-blue ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold mb-2">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1712-345678"
                className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-amazon-blue ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-bold mb-2">
                Street Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Apartment 4B"
                rows="3"
                className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-amazon-blue ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-600 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-bold mb-2">
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Dhaka"
                  className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-amazon-blue ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-bold mb-2"
                >
                  Postal Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="1212"
                  maxLength="4"
                  className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-amazon-blue ${
                    errors.postalCode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.postalCode && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-bold mb-2">
                Country <span className="text-red-600">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-amazon-blue ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="Bangladesh">Bangladesh</option>
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Nepal">Nepal</option>
                <option value="Sri Lanka">Sri Lanka</option>
              </select>
              {errors.country && (
                <p className="text-red-600 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {/* Saved Addresses Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-blue-900 mb-1">
                  Your address will be saved
                </p>
                <p className="text-blue-700 text-xs">
                  This address will be saved for future orders to make checkout
                  faster.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 btn-primary rounded-md text-sm font-medium"
              >
                Continue to Payment
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Back to Cart
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[300px]">
          <div className="box p-4 sticky top-10">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Items ({cart.length}):</span>
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
                <span>৳{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-amazon-orange text-lg font-bold pt-2">
                <span>Order Total:</span>
                <span>৳{orderTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Cart Items Preview */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-bold text-sm mb-3">Items in Cart:</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2 text-xs">
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-amazon-orange font-bold">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
              <p className="mb-2">
                <span className="font-bold">Note:</span> Please provide accurate
                delivery information to ensure smooth delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
