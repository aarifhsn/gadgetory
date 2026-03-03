// app/not-found.js
import {
  Home,
  Package,
  Search,
  SearchIcon,
  Settings,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-4">
            <div className="mb-4">
              <Link href="/" className="flex items-center">
                <span className="text-3xl font-bold tracking-tighter text-black">
                  gadgets
                  <span className="italic text-amazon-secondary">BD</span>
                </span>
              </Link>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-amazon mb-4">404</h1>
          <h2 className="text-3xl font-normal text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. It might have
            been removed, renamed, or doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amazon-secondary hover:bg-amazon-yellow_hover px-6 py-3 rounded-md text-black text-sm font-bold shadow-sm border border-amazon-secondary transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 rounded-md text-sm font-bold shadow-sm border border-gray-300 transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

        {/* Suggested Links */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4 text-center">
            You might be looking for:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link
              href="/products"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded hover:border-amazon-blue hover:shadow-md transition-all group"
            >
              <SearchIcon className="w-6 h-6 text-amazon-blue mb-2 group-hover:text-amazon-orange" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-amazon-orange">
                Products
              </span>
            </Link>

            <Link
              href="/orders"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded hover:border-amazon-blue hover:shadow-md transition-all group"
            >
              <Package className="w-6 h-6 text-amazon-blue mb-2 group-hover:text-amazon-orange" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-amazon-orange">
                Your Orders
              </span>
            </Link>

            <Link
              href="/cart"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded hover:border-amazon-blue hover:shadow-md transition-all group"
            >
              <ShoppingCart className="w-6 h-6 text-amazon-blue mb-2 group-hover:text-amazon-orange" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-amazon-orange">
                Shopping Cart
              </span>
            </Link>

            <Link
              href="/account"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded hover:border-amazon-blue hover:shadow-md transition-all group"
            >
              <Settings className="w-6 h-6 text-amazon-blue mb-2 group-hover:text-amazon-orange" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-amazon-orange">
                Account
              </span>
            </Link>

            <Link
              href="/shops"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded hover:border-amazon-blue hover:shadow-md transition-all group"
            >
              <Settings className="w-6 h-6 text-amazon-blue mb-2 group-hover:text-amazon-orange" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-amazon-orange">
                Shops
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
