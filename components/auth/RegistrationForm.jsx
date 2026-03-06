"use client";

import { Info } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegistrationForm({ userType, setUserType }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      mobile: formData.get("mobile"),
      userType,
    };
    if (userType === "shopOwner") {
      data.shopName = formData.get("shopName");
    }
    // Validate password confirmation
    const passwordConfirm = formData.get("passwordConfirm");
    if (data.password !== passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Registration failed");
        setLoading(false);
        return;
      }
      // Check userType and redirect
      if (result.userType === "shopOwner") {
        // Sign in the shop owner
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/seller/profile?welcome=true");
        router.refresh();
      } else {
        router.push("/login?registered=true"); // ← Customer goes to login
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Type Toggle */}
        <div className="flex items-center gap-1 bg-[#F5F3EF] p-1 rounded-xl border border-[#E8E4DD] mb-6">
          <button
            type="button"
            id="customerTab"
            onClick={() => setUserType("customer")}
            className={`flex-1 py-1 text-xs font-bold  shadow-sm rounded-sm  ${
              userType === "customer" ? "bg-white" : "text-gray-500"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setUserType("shopOwner")}
            id="shopOwnerTab"
            className={`flex-1 py-1 text-xs font-bold shadow-sm rounded-sm ${
              userType === "shopOwner" ? "bg-white" : "text-gray-500"
            }`}
          >
            Shop Owner
          </button>
          <input type="hidden" name="userType" id="userType" value={userType} />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1">
            Your name
          </label>
          <input
            type="text"
            id="name"
            required
            name="name"
            placeholder="First and last name"
            className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
          />
        </div>

        {/* Shop Name (Only for Shop Owner) */}
        {userType === "shopOwner" && (
          <div id="shopNameField" className="">
            <label htmlFor="shopName" className="block text-sm font-bold mb-1">
              Shop name
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              placeholder="Your shop name"
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
            />
          </div>
        )}

        <div>
          <label htmlFor="mobile" className="block text-sm font-bold mb-1">
            Mobile number
          </label>
          <div className="flex gap-2">
            <select className="px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary">
              <option>BD +880</option>
            </select>
            <input
              type="tel"
              id="mobile"
              required
              name="mobile"
              placeholder="Mobile number"
              className="flex-1 px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="At least 6 characters"
            className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
          />
          <p className="text-xs text-gray-600 mt-1">
            <Info className="w-3 h-3 inline mr-1" />
            Passwords must be at least 6 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-bold mb-1"
          >
            Re-enter password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            required
            className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-1.5 a-button-primary text-sm font-medium rounded-sm cursor-pointer"
        >
          {loading ? "Creating account..." : "Create your gadgetory account"}
        </button>
      </form>
    </>
  );
}
