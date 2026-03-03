"use client";

import ImageGallery from "@/components/products/ImageGallery";
import ProductTabs from "@/components/shop/ProductTabs";
import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsClient({ product }) {
  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
        <a href="index.html" className="hover:underline">
          Home
        </a>
        <ChevronRight className="w-3 h-3" />
        <a href="products.html" className="hover:underline">
          Electronics
        </a>
        <ChevronRight className="w-3 h-3" />
        <a href="products.html" className="hover:underline">
          Laptops & Computers
        </a>
        <ChevronRight className="w-3 h-3" />
        <span className="text-amazon-text font-bold">MacBook Pro</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-5 flex gap-4">
          <ImageGallery product={product} />
        </div>

        {/* Center: Product Info */}
        <div className="lg:col-span-4">
          <h1 className="text-2xl font-normal mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-3">
            Visit the
            <Link href="/shops" className="text-amazon-blue hover:underline">
              {product.category}
            </Link>
          </p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amazon-secondary">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={
                    index < Math.floor(product.rating)
                      ? "w-5 h-5 fill-current"
                      : "w-5 h-5"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-amazon-blue hover:underline cursor-pointer">
              {product.rating} ratings
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-sm">Price:</span>
              <span className="text-3xl text-amazon-orange">
                ৳{product.price}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">Inclusive of all taxes</p>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="font-bold text-base mb-2">About this item</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {product.features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm mb-2">
              <span className="font-bold">Category:</span> {product.category}
            </p>
            <p className="text-sm mb-2">
              <span className="font-bold">Brand:</span> {product.brand}
            </p>
            <p className="text-sm">
              <span className="font-bold">Stock:</span>
              <span className="text-green-600 font-semibold">
                {product.stock} units available
              </span>
            </p>
          </div>
        </div>

        {/* Right: Buy Box */}
        {/* <BuyNowSection product={product} /> */}
      </div>

      {/* Tabs Section */}
      <ProductTabs product={product} />

      {/* Related Products */}
      <RelatedProductsCard />
    </main>
  );
}
