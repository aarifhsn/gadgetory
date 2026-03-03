// components/shop/ShopCard.jsx

import { MapPin, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShopCard({ shop }) {
  // Create slug from shop name
  const shopSlug = shop._id; // Using ID for now, you can add a slug field later

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Shop Banner */}
      <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 relative">
        {shop.shopBanner ? (
          <Image
            src={shop.shopBanner}
            alt={shop.shopName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amazon-blue/10 to-amazon-secondary/10">
            <Package className="w-16 h-16 text-amazon-blue/30" />
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <Link href={`/shops/${shopSlug}`}>
              <h3 className="font-bold text-lg text-amazon-blue hover:text-amazon-orange hover:underline cursor-pointer line-clamp-1">
                {shop.shopName || shop.name}
              </h3>
            </Link>
            {shop.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                <p>{shop.location}</p>
              </div>
            )}
          </div>

          {/* Shop Logo */}
          {shop.shopLogo && (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ml-2 flex-shrink-0">
              <Image
                src={shop.shopLogo}
                alt={shop.shopName}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amazon-secondary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4"
                fill={
                  i < Math.floor(shop.avgRating || 0) ? "currentColor" : "none"
                }
              />
            ))}
          </div>
          <span className="text-xs text-amazon-blue">
            {shop.avgRating > 0 ? shop.avgRating.toFixed(1) : "New"}
            {shop.totalRatings > 0 &&
              ` (${shop.totalRatings.toLocaleString()} ratings)`}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm line-clamp-3 mb-4 text-gray-700">
          {shop.shopDescription || "Quality products and excellent service."}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-gray-500">Products: </span>
            <span className="font-bold">{shop.productCount || 0}</span>
          </div>
          <Link href={`/shops/${shopSlug}`}>
            <button className="bg-amazon-yellow hover:bg-amazon-yellow_hover px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors">
              Visit Shop
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
