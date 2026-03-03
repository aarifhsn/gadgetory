import { auth } from "@/auth";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export async function getCurrentUser() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isShopOwner() {
  const session = await getCurrentUser();

  if (!session || !session.user) {
    return false;
  }
  return session.user.userType === "seller";
}

export async function verifyShopOwner() {
  const session = await getCurrentUser();

  if (!session || !session.user) {
    return {
      isAuthorized: false,
      user: null,
      error: "You must be logged in to create products",
    };
  }

  const userRole = session.user.userType;

  if (userRole !== "shopOwner" && userRole !== "seller") {
    return {
      isAuthorized: false,
      user: session.user,
      error: "Only shop owners can create products",
    };
  }

  return {
    isAuthorized: true,
    user: session.user,
    error: null,
  };
}

export function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

export function Breadcrumbs({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs text-gray-500 mb-4 flex items-center gap-1"
    >
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-amazon-text font-bold">{item.label}</span>
          )}

          {index < items.length - 1 && <ChevronRight className="w-3 h-3" />}
        </span>
      ))}
    </nav>
  );
}

export function normalizeEnum(value) {
  if (!value) return value;
  return value.toString().trim().toLowerCase();
}
