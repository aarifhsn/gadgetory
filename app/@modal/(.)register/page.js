"use client";

import RegistrationContent from "@/components/auth/RegistrationContent";
import Modal from "@/components/Modal";
import { usePathname } from "next/navigation";

export default function RegisterPage() {
  const pathname = usePathname();

  // ✅ Add this check (same as login modal)
  if (pathname !== "/register") {
    return null;
  }
  return (
    <Modal>
      <RegistrationContent />
    </Modal>
  );
}
