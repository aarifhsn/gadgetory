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
    <nav className="bg-amazon text-white">
      {/* Top Nav */}
      <div className="max-w-[1500px] mx-auto flex items-center p-2 gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1"
        >
          <span className="text-2xl font-bold tracking-tighter">
            gadgets<span className="italic text-amazon-secondary">BD</span>
          </span>
          {isShopOwner && (
            <span className="text-sm font-normal ml-2 bg-gray-700 px-2 py-0.5 rounded">
              seller central
            </span>
          )}
        </Link>

        <SearchBar />

        {/* Right Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Navigation Menu */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="hover:underline">
                Home
              </Link>

              {isShopOwner ? (
                <>
                  <Link href="/products/create" className="hover:underline">
                    Add Product
                  </Link>
                  <Link
                    href="/products/manage-list"
                    className="hover:underline"
                  >
                    Manage Products
                  </Link>

                  <Link href="/orders" className="hover:underline">
                    Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/products" className="hover:underline">
                    Products
                  </Link>
                  <Link href="/shops" className="hover:underline">
                    Shops
                  </Link>
                  <Link href="/orders" className="hover:underline">
                    My Orders
                  </Link>
                </>
              )}
            </div>
          )}

          {/* User Account Section */}
          {!isLoggedIn ? (
            // Not Logged In - Show Sign In
            <Link
              href="/login"
              className="hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer"
            >
              <div className="text-xs leading-none text-gray-300">Sign in</div>
              <div className="font-bold text-sm">Account & Lists</div>
            </Link>
          ) : (
            // Logged In - Show User Profile
            <Link href={isShopOwner ? "/seller/profile" : "/account"}>
              <div className="flex items-center gap-2 hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer">
                {user?.avatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="hidden md:block">
                  <div className="text-xs leading-none text-gray-300">
                    Hello, {userFirstName}
                  </div>
                  <div className="font-bold text-sm">
                    {isShopOwner ? "Shop Owner" : "Account"}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Logout Button */}
          {isLoggedIn && (
            <div className="text-sm">
              <span className="hidden md:inline"> | </span>
              <Logout />
            </div>
          )}

          {/* Cart - Only for normal users */}
          {!isShopOwner && <CartBadge />}
        </div>
      </div>

      {/* Mobile Menu - Show navigation links on mobile */}
      {isLoggedIn && (
        <div className="md:hidden bg-amazon-dark border-t border-gray-700">
          <div className="max-w-[1500px] mx-auto flex items-center gap-4 p-2 text-sm overflow-x-auto">
            <Link
              href="/"
              className="whitespace-nowrap hover:text-amazon-secondary"
            >
              Home
            </Link>

            {isShopOwner ? (
              <>
                <Link
                  href="/products/create"
                  className="whitespace-nowrap hover:text-amazon-secondary"
                >
                  Add Product
                </Link>
                <Link
                  href="/products/manage-list"
                  className="whitespace-nowrap hover:text-amazon-secondary"
                >
                  Manage Products
                </Link>
                <Link
                  href="/orders"
                  className="whitespace-nowrap hover:text-amazon-secondary"
                >
                  Orders
                </Link>
                <Link
                  href="/seller/profile"
                  className="whitespace-nowrap hover:text-amazon-secondary"
                >
                  Shop Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/products"
                  className="whitespace-nowrap hover:text-amazon-secondary"
                >
                  Products
                </Link>
                <Link
                  href="/shops"
                  className="whitespace-nowrap hover:text-amazon-secondary"
                >
                  Shops
                </Link>
                <Link
                  href="/orders"
                  className="whitespace-nowrap hover:text-amazon-secondary"
                >
                  My Orders
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
