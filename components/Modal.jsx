"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Modal({ children }) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  function handleClose() {
    router.push("/");
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal Content - Made scrollable and wider */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="sticky top-4 right-4 float-right z-10 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-1 pt-2">{children}</div>
      </div>
    </div>
  );
}
