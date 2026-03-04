import { ChevronRight } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import SocialLogins from "./SocialLogins";

export default function LoginContent() {
  return (
    <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
      <div className="mb-4">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-bold tracking-tighter text-black">
            gadgets<span className="italic text-amazon-secondary">BD</span>
          </span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[350px] p-6 a-box mb-6">
        <h1 className="text-2xl font-normal mb-4">Sign in</h1>

        <LoginForm />
        <SocialLogins mode={"login"} />

        <div className="mt-4 text-xs">
          <p>
            By continuing, you agree to gadgetory's
            <a href="#" className="text-amazon-blue hover:underline">
              Conditions of Use
            </a>
            and
            <a href="#" className="text-amazon-blue hover:underline">
              Privacy Notice
            </a>
            .
          </p>
        </div>

        <div className="mt-4">
          <a
            href="#"
            className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline flex items-center gap-1"
          >
            <ChevronRight className="w-3 h-3" />
            Need help?
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full max-w-[350px] mb-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">
              New to gadgetory?
            </span>
          </div>
        </div>
      </div>

      {/* Create Account Button */}
      <div className="w-full max-w-[350px] mb-8">
        <Link
          href="/register"
          className="block w-full py-1.5 border border-gray-400 rounded-sm text-center text-sm hover:bg-gray-50 transition-colors"
        >
          Create your gadgetory account
        </Link>
      </div>
    </div>
  );
}
