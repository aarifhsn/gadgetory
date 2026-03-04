"use client";

import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        toast.success("Password reset link sent!");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setShowSuccess(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4">
      {/* Logo */}
      <div className="mb-6">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-bold tracking-tighter text-black">
            gadgets<span className="italic text-amazon-secondary">BD</span>
          </span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[400px]">
        {!showSuccess ? (
          // ✅ Request Form
          <div className="a-box p-6 mb-6">
            <h1 className="text-2xl font-normal mb-2">Password assistance</h1>
            <p className="text-sm text-gray-600 mb-6">
              Enter the email address associated with your gadgetory account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-400 rounded-sm outline-none focus:ring-2 focus:ring-amazon-secondary focus:border-amazon-secondary disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-sm a-button-primary text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href="/login"
                className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign in
              </Link>
            </div>
          </div>
        ) : (
          // ✅ Success State
          <div className="a-box p-8 mb-6">
            <div className="text-center">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a password reset link to:
              </p>

              {/* Email Display */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 mb-6">
                <div className="flex items-center justify-center gap-2 text-amazon-text">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">{email}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  What to do next:
                </p>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Check your inbox (and spam/junk folder)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Click the reset link in the email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Create your new password</span>
                  </li>
                </ul>
                <p className="text-xs text-blue-700 mt-3 pt-3 border-t border-blue-300">
                  ⏱️ <strong>Note:</strong> Link expires in 1 hour
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleTryAgain}
                  className="w-full py-2 border border-gray-400 rounded-sm text-sm hover:bg-gray-50 transition-colors"
                >
                  Try another email
                </button>

                <Link
                  href="/login"
                  className="block w-full py-2 text-center text-sm text-amazon-blue hover:text-amazon-orange hover:underline"
                >
                  Back to Sign in
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            <strong>Need more help?</strong>
          </p>
          <p>
            If you no longer have access to this email, contact{" "}
            <Link href="/contact" className="text-amazon-blue hover:underline">
              Customer Service
            </Link>{" "}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
