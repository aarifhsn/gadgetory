"use client";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Logout from "./auth/Logout";
import CartBadge from "./CartBadge";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { data: session, update } = useSession();

  const user = session?.user;

  const userFirstName = user?.name?.split(" ")[0] || "Guest";
  const isShopOwner = user?.userType === "shopOwner";
  const isLoggedIn = !!session;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-[#E8E4DD] text-[#1a1a2e] sticky top-0 z-50 shadow-sm shadow-[#1a1a2e]/5">
      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <div className="max-w-[1500px] mx-auto flex items-center gap-6 px-6 md:px-16 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="text-xl font-black tracking-tight text-[#1a1a2e] group-hover:text-[#D4A853] transition-colors duration-200">
            gadget
            <span className="text-[#D4A853] group-hover:text-[#1a1a2e] transition-colors duration-200">
              ory
            </span>
          </span>
          {isShopOwner && (
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white bg-[#2D7D6F] px-2.5 py-1 rounded-full">
              Seller
            </span>
          )}
        </Link>

        {/* Search — grows to fill space */}
        <div className="flex-1">
          <SearchBar />
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Desktop nav links */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center mr-2">
              {isShopOwner ? (
                <>
                  {[
                    { href: "/products/create", label: "Add Product" },
                    { href: "/products/manage-list", label: "Manage" },
                    { href: "/orders", label: "Orders" },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-xs font-semibold tracking-wide text-[#1a1a2e]/50 hover:text-[#2D7D6F] px-3 py-2 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { href: "/products", label: "Products" },
                    { href: "/shops", label: "Shops" },
                    { href: "/orders", label: "Orders" },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-xs font-semibold tracking-wide text-[#1a1a2e]/50 hover:text-[#D4A853] px-3 py-2 transition-colors duration-150 relative group/link"
                    >
                      {label}
                      <span className="absolute bottom-1 left-3 right-3 h-px bg-[#D4A853] scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 origin-left" />
                    </Link>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Divider */}
          {isLoggedIn && (
            <div className="hidden md:block w-px h-5 bg-[#E8E4DD] mx-1" />
          )}

          {/* User account */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="flex items-center gap-2 text-xs font-black tracking-[0.15em] uppercase text-white bg-[#1a1a2e] hover:bg-[#D4A853] hover:text-[#1a1a2e] px-5 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-[#1a1a2e]/10"
            >
              Sign In
            </Link>
          ) : (
            <Link href={isShopOwner ? "/seller/profile" : "/account"}>
              <div className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#F5F3EF] transition-colors duration-150 rounded-xl group">
                {user?.avatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden relative ring-2 ring-[#D4A853]/30">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#D4A853]/10 border border-[#D4A853]/30 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-[#D4A853]" />
                  </div>
                )}
                <div className="hidden md:block">
                  <div className="text-[10px] leading-none text-[#1a1a2e]/35 tracking-wide mb-0.5">
                    Hello, {userFirstName}
                  </div>
                  <div className="text-xs font-bold text-[#1a1a2e] group-hover:text-[#D4A853] transition-colors duration-150">
                    {isShopOwner ? "Seller Hub" : "Account"}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Logout */}
          {isLoggedIn && (
            <div className="text-xs text-[#1a1a2e]/30 hover:text-[#1a1a2e]/60 transition-colors duration-150 px-2">
              <Logout />
            </div>
          )}

          {/* Cart */}
          {!isShopOwner && (
            <div className="ml-1 relative">
              <CartBadge />
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE NAV STRIP ──────────────────────────────────────── */}
      {isLoggedIn && (
        <div className="md:hidden border-t border-[#E8E4DD] bg-[#FAF9F6]">
          <div className="max-w-[1500px] mx-auto flex items-center gap-1 px-4 py-1 overflow-x-auto scrollbar-none">
            <Link
              href="/"
              className="whitespace-nowrap text-[11px] font-semibold tracking-wide text-[#1a1a2e]/45 hover:text-[#D4A853] px-3 py-2 transition-colors duration-150"
            >
              Home
            </Link>
            {isShopOwner ? (
              <>
                {[
                  { href: "/products/create", label: "Add Product" },
                  { href: "/products/manage-list", label: "Manage Products" },
                  { href: "/orders", label: "Orders" },
                  { href: "/seller/profile", label: "Shop Profile" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="whitespace-nowrap text-[11px] font-semibold tracking-wide text-[#1a1a2e]/45 hover:text-[#2D7D6F] px-3 py-2 transition-colors duration-150"
                  >
                    {label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {[
                  { href: "/products", label: "Products" },
                  { href: "/shops", label: "Shops" },
                  { href: "/orders", label: "My Orders" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="whitespace-nowrap text-[11px] font-semibold tracking-wide text-[#1a1a2e]/45 hover:text-[#D4A853] px-3 py-2 transition-colors duration-150"
                  >
                    {label}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
