"use client";

import { login } from "@/app/actions/auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { update } = useSession();

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await login(formData);

      if (!!response.error) {
        setError(response.error);
        setLoading(false);
        return;
      } else {
        router.push("/");

        update().then(() => {
          router.refresh();
        });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  return (
    <>
      {/* ── ERROR ALERT ───────────────────────────────────────────── */}
      {error && (
        <div className="mb-5 px-4 py-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 text-sm font-medium">
          <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <svg
              className="w-3 h-3 text-rose-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-xs font-bold text-[#1a1a2e]/60 tracking-wide"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-bold text-[#D4A853] hover:underline underline-offset-4 transition-all"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-md shadow-[#1a1a2e]/10 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
}
