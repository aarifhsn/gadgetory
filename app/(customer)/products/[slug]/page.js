import {
  getProductBySlug,
  getRelatedProducts,
} from "@/app/actions/productManagementActions";
import { getProductReviews } from "@/app/actions/reviewActions";
import {
  getSellerById,
  getSellerProductsCount,
} from "@/app/actions/sellerActions";
import BuyNowSection from "@/components/products/BuyNowSection";
import ImageGallery from "@/components/products/ImageGallery";
import RelatedProductsCard from "@/components/products/RelatedProductsCard";
import ProductTabs from "@/components/shop/ProductTabs";
import { formatSpecifications } from "@/utils/formatSpecifications";
import { Breadcrumbs } from "@/utils/util";
import { Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  // Fetch related products
  const relatedResult = await getRelatedProducts(
    product._id,
    product.category,
    6,
  );
  const relatedProducts = relatedResult.success ? relatedResult.data : [];

  const specsArray = formatSpecifications(product?.specifications);

  const seller = await getSellerById(product.sellerId);

  // Fetch reviews with pagination
  const reviewsResult = await getProductReviews(product._id, {
    page: 1,
    limit: 10,
    sortBy: "recent",
  });

  const reviewsData = reviewsResult.success
    ? reviewsResult.data
    : {
        reviews: [],
        userReview: null,
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalReviews: 0,
          hasMore: false,
        },
      };

  // Calculate average rating from reviews
  const averageRating =
    reviewsData.reviews.length > 0
      ? reviewsData.reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviewsData.reviews.length
      : 0;

  const totalReviews = reviewsData.pagination.totalReviews;

  // Update product with calculated rating
  const productWithRating = {
    ...product,
    rating: averageRating,
    reviews: totalReviews,
  };

  // get products count by seller
  const sellerProductsCount = await getSellerProductsCount(product.sellerId);

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 md:px-16 py-10">
      {/* ── BREADCRUMB ────────────────────────────────────────────── */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Laptops & Computers", href: "/products?category=laptops" },
          { label: product.name },
        ]}
      />

      {/* ── PRODUCT HERO ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-5 flex gap-2">
          <ImageGallery product={product} />
        </div>

        {/* Center: Product Info */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Category + seller */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#D4A853]">
              {product.category}
            </span>
            <Link
              href={`/shops/${product.sellerId}`}
              className="text-[11px] font-bold text-[#1a1a2e]/40 hover:text-[#D4A853] transition-colors duration-150"
            >
              by {seller?.shopName || "Official Store"} →
            </Link>
          </div>

          {/* Product name */}
          <h1 className="text-2xl font-black text-[#1a1a2e] leading-snug tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating || 0)
                      ? "fill-[#D4A853] text-[#D4A853]"
                      : "fill-[#E8E4DD] text-[#E8E4DD]"
                  }`}
                />
              ))}
            </div>
            <Link
              href={`/products/${product.slug}/#reviews`}
              className="text-xs font-bold text-[#1a1a2e]/40 hover:text-[#D4A853] transition-colors"
            >
              {averageRating.toFixed(1)} ({totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"})
            </Link>
          </div>

          {/* Price block */}
          <div className="bg-[#F5F3EF] border border-[#E8E4DD] rounded-2xl px-5 py-4">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/30 mb-1">
              Price
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#D4A853]">৳</span>
              <span className="text-4xl font-black text-[#1a1a2e] tracking-tight leading-none">
                {Number(product.price).toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-[#1a1a2e]/35 mt-1.5">
              Inclusive of all taxes
            </p>
          </div>

          {/* Specs */}
          <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-[#E8E4DD] flex items-center gap-3">
              <div className="w-1 h-4 rounded-full bg-[#D4A853]" />
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
                About this item
              </h3>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {specsArray.map((spec, index) => (
                <li key={index} className="flex gap-2 text-xs leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] mt-1.5 shrink-0" />
                  <span>
                    {spec.label && (
                      <span className="font-bold text-[#1a1a2e]/70">
                        {spec.label}:{" "}
                      </span>
                    )}
                    <span className="text-[#1a1a2e]/55">{spec.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Meta tags */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Brand", value: product.brand?.toUpperCase() },
              { label: "Category", value: product.category },
              {
                label: "Stock",
                value: `${product.stockQuantity} units`,
                green: true,
              },
            ].map(({ label, value, green }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white border border-[#E8E4DD] rounded-xl px-3.5 py-2"
              >
                <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/30">
                  {label}
                </span>
                <span
                  className={`text-xs font-bold ${green ? "text-emerald-600" : "text-[#1a1a2e]/70"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Buy Box */}
        <BuyNowSection product={product} />
      </div>

      {/* ── TABS: DESCRIPTION / REVIEWS / SELLER ──────────────────── */}
      <div className="mt-16">
        <ProductTabs
          product={product}
          seller={seller}
          reviewsData={reviewsData}
          averageRating={averageRating}
          totalReviews={totalReviews}
          sellerProductsCount={sellerProductsCount}
        />
      </div>

      {/* ── RELATED PRODUCTS ──────────────────────────────────────── */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
            <span className="text-xl font-black text-[#1a1a2e] tracking-tight">
              Related Products
            </span>
          </div>
          <Link
            href={`/products?category=${product.category}`}
            className="text-[#D4A853] text-xs font-bold tracking-[0.15em] uppercase hover:underline underline-offset-4"
          >
            View All →
          </Link>
        </div>
        <RelatedProductsCard products={relatedProducts} />
      </div>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result?.success || !result?.data) {
    return {
      title: "Product Not Found | gadgetory",
      robots: { index: false, follow: false },
    };
  }

  const product = result.data;

  return {
    title: product.name,
    description:
      product.shortDescription || `Buy ${product.name} online in Bangladesh.`,
  };
}
