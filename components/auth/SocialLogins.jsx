"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

const SocialLogins = ({ mode }) => {
  const handleAuth = (event) => {
    signIn("google", { callbackUrl: "http://localhost:3000/" });
  };
  return (
    <>
      <div className="text-center text-xs text-gray-500 mt-4">
        {mode === "register" ? (
          <span>Login</span>
        ) : (
          <span href="/register">Register</span>
        )}{" "}
        or Signup with
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleAuth}
          className=" w-full mt-2 py-2 border-gray-600/30 border rounded-md flex items-center gap-2 justify-center"
        >
          <Image src="/google.png" alt="google" width={20} height={20} />
          <span>Google</span>
        </button>
      </div>
    </>
  );
};

export default SocialLogins;
