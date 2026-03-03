import { User } from "lucide-react";
import Link from "next/link";

export default function ShopNavbar() {
  return (
    <nav className="bg-amazon text-white p-3 shadow-md">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="index.html" className="flex items-center">
            <span className="text-2xl font-bold tracking-tighter">
              gadgets<span className="italic text-amazon-secondary">BD</span>
              <span className="text-sm font-normal ml-2 bg-gray-700 px-2 py-0.5 rounded">
                seller central
              </span>
            </span>
          </a>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <a href="manageList.html" className="hover:underline">
            Catalog
          </a>
          <a href="bookings.html" className="hover:underline">
            Orders
          </a>
          <Link
            href="/shop/profile"
            className="underline decoration-amazon-secondary decoration-2 underline-offset-4"
          >
            Shop Profile
          </Link>
          <div className="h-4 w-px bg-gray-600"></div>
          <div className="flex items-center gap-1 cursor-pointer">
            <User className="w-4 h-4" />
            <span>Shop Owner</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
