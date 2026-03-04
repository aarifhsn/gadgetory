"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import SocialLogins from "./SocialLogins";

export default function RegistrationContent() {
  const [userType, setUserType] = useState("customer");
  return (
    <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
      <div className="mb-4">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-bold tracking-tighter text-black">
            gadgets<span className="italic text-amazon-secondary">BD</span>
          </span>
        </Link>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-[350px] p-6 a-box mb-6">
        <h1 className="text-2xl font-normal mb-4">Create account</h1>

        <RegistrationForm userType={userType} setUserType={setUserType} />
        <SocialLogins mode={"register"} />

        <div className="mt-4 text-xs">
          <p>
            By creating an account, you agree to gadgetory's
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

        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-amazon-blue hover:text-amazon-orange hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Shop Owner Info */}
        {userType === "shopOwner" && (
          <div
            id="shopOwnerInfo"
            className=" mt-4 p-3 bg-blue-50 border border-blue-200 rounded-sm"
          >
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900">
                <p className="font-bold mb-1">Shop Owner Registration</p>
                <p>
                  After registration, you'll be able to set up your shop
                  profile, add products, and start selling on gadgetory
                  marketplace.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
