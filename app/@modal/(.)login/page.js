"use client";

import Modal from "@/components/Modal";
import LoginContent from "@/components/auth/LoginContent";
import { usePathname } from "next/navigation";

export default function LoginModal() {
  const pathname = usePathname();

  if (pathname !== "/login") {
    return null;
  }

  return (
    <Modal>
      <LoginContent />
    </Modal>
  );
}
