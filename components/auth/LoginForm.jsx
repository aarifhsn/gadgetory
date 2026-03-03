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
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-1">
            Email or mobile phone number
          </label>
          <input
            type="email"
            id="email"
            required
            name="email"
            className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="password" className="text-sm font-bold">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            required
            name="password"
            className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-1.5 a-button-primary text-sm font-medium rounded-sm cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
