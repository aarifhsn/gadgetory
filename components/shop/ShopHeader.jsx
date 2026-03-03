// components/shop/ShopHeader.jsx

import { Calendar, Mail, MapPin, Package, Star } from "lucide-react";
import Image from "next/image";

export default function ShopHeader({ shop, stats }) {
  const joinDate = new Date(shop.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white border-b">
      {/* Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative">
        {shop.shopBanner ? (
          <Image
            src={shop.shopBanner}
            alt={shop.shopName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amazon-blue/10 to-amazon-secondary/10">
            <Package className="w-24 h-24 text-amazon-blue/30" />
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-12 md:-mt-16 relative">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
            {shop.shopLogo ? (
              <Image
                src={shop.shopLogo}
                alt={shop.shopName}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 md:pt-8 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {shop.shopName || shop.name}
            </h1>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex text-amazon-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={
                        i < Math.floor(stats.avgRating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>
                <span className="font-medium">
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "New"}
                </span>
                {stats.totalRatings > 0 && (
                  <span className="text-amazon-blue">
                    ({stats.totalRatings.toLocaleString()} ratings)
                  </span>
                )}
              </div>

              {/* Products */}
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{stats.totalProducts.toLocaleString()} Products</span>
              </div>

              {/* Location */}
              {shop.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.location}</span>
                </div>
              )}

              {/* Join Date */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            {/* Description */}
            {shop.shopDescription && (
              <p className="text-gray-700 max-w-3xl mb-3">
                {shop.shopDescription}
              </p>
            )}

            {/* Contact */}
            {shop.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <a
                  href={`mailto:${shop.email}`}
                  className="text-amazon-blue hover:text-amazon-orange hover:underline"
                >
                  {shop.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
