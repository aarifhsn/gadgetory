"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import SocialLogins from "./SocialLogins";

export default function RegistrationContent() {
  const [userType, setUserType] = useState("customer");
  return (
    <div className="bg-[#FAF9F6] flex flex-col min-h-screen items-center justify-center px-4 py-12">
      {/* ── LOGO ──────────────────────────────────────────────────── */}
      <Link href="/" className="mb-8 group">
        <span className="text-2xl font-black tracking-tight text-[#1a1a2e] group-hover:text-[#D4A853] transition-colors duration-200">
          gadget
          <span className="text-[#D4A853] group-hover:text-[#1a1a2e] transition-colors duration-200">
            ory
          </span>
        </span>
      </Link>

      {/* ── REGISTER CARD ─────────────────────────────────────────── */}
      <div className="w-full max-w-[420px] bg-white border border-[#E8E4DD] rounded-2xl shadow-sm overflow-hidden">
        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-[#D4A853]" />
            <h1 className="text-xl font-black text-[#1a1a2e] tracking-tight">
              Create Account
            </h1>
          </div>

          {/* Shop owner info banner */}
          {userType === "shopOwner" && (
            <div className="flex items-start gap-3 p-4 bg-[#1a1a2e]/3 border border-[#1a1a2e]/8 rounded-2xl mb-5">
              <div className="w-8 h-8 rounded-xl bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-[#D4A853]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#1a1a2e]/70 mb-0.5">
                  Shop Owner Registration
                </p>
                <p className="text-[11px] text-[#1a1a2e]/40 leading-relaxed">
                  After registration, you'll be able to set up your shop
                  profile, add products, and start selling on gadgetory
                  marketplace.
                </p>
              </div>
            </div>
          )}

          <RegistrationForm userType={userType} setUserType={setUserType} />
          <SocialLogins mode="register" />

          {/* Legal */}
          <p className="mt-5 text-[11px] text-[#1a1a2e]/30 leading-relaxed">
            By creating an account, you agree to gadgetory's{" "}
            <a href="#" className="text-[#D4A853] hover:underline">
              Conditions of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#D4A853] hover:underline">
              Privacy Notice
            </a>
            .
          </p>

          {/* Sign in link */}
          <div className="mt-5 pt-5 border-t border-[#E8E4DD] flex items-center justify-between">
            <p className="text-xs text-[#1a1a2e]/40 font-medium">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="text-xs font-black text-[#D4A853] hover:underline underline-offset-4 tracking-wide"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
