import { ChevronRight } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import SocialLogins from "./SocialLogins";

export default function LoginContent() {
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

      {/* ── LOGIN CARD ────────────────────────────────────────────── */}
      <div className="w-full max-w-[400px] bg-white border border-[#E8E4DD] rounded-2xl shadow-sm overflow-hidden">
        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-[#D4A853]" />
            <h1 className="text-xl font-black text-[#1a1a2e] tracking-tight">
              Sign In
            </h1>
          </div>

          <LoginForm />
          <SocialLogins mode="login" />

          {/* Legal */}
          <p className="mt-5 text-[11px] text-[#1a1a2e]/30 leading-relaxed">
            By continuing, you agree to gadgetory's{" "}
            <a href="#" className="text-[#D4A853] hover:underline">
              Conditions of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#D4A853] hover:underline">
              Privacy Notice
            </a>
            .
          </p>

          {/* Help */}
          <a
            href="#"
            className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-[#1a1a2e]/30 hover:text-[#D4A853] transition-colors duration-150"
          >
            <ChevronRight className="w-3 h-3" />
            Need help?
          </a>
        </div>
      </div>

      {/* ── DIVIDER ───────────────────────────────────────────────── */}
      <div className="w-full max-w-[400px] flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#E8E4DD]" />
        <span className="text-[11px] font-medium text-[#1a1a2e]/30">
          New to gadgetory?
        </span>
        <div className="flex-1 h-px bg-[#E8E4DD]" />
      </div>

      {/* ── CREATE ACCOUNT ────────────────────────────────────────── */}
      <div className="w-full max-w-[400px]">
        <Link
          href="/register"
          className="block w-full py-3.5 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 hover:bg-[#FAF9F6] text-[#1a1a2e]/60 hover:text-[#1a1a2e] text-xs font-bold tracking-wide text-center rounded-2xl transition-all duration-200 shadow-sm"
        >
          Create your gadgetory account
        </Link>
      </div>
    </div>
  );
}
