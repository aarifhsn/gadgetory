import {
  getProductBySlug,
  getRelatedProducts,
} from "@/app/actions/productManagementActions";
import ProductCard from "@/components/shop/ProductCard";
import categories from "@/data/categories";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }) {
  const { slug } = params;

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

  // Find current category
  const category = categories.find((c) => c.slug === slug);

  // If category not found, show nothing
  if (!category) {
    return (
      <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
        <p className="text-gray-500">Category not found</p>
      </main>
    );
  }

  // Filter products by category slug
  const filteredProducts = relatedProducts.filter((p) => p.category === slug);

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 md:px-16 py-10">
      {/* ── BREADCRUMB ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-8">
        <Link
          href="/"
          className="text-xs font-medium text-[#1a1a2e]/35 hover:text-[#D4A853] transition-colors duration-150"
        >
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#1a1a2e]/20" />
        <Link
          href="/categories"
          className="text-xs font-medium text-[#1a1a2e]/35 hover:text-[#D4A853] transition-colors duration-150"
        >
          Categories
        </Link>
        <ChevronRight className="w-3 h-3 text-[#1a1a2e]/20" />
        <span className="text-xs font-bold text-[#1a1a2e]">
          {category.name}
        </span>
      </div>

      {/* ── CATEGORY HERO HEADER ──────────────────────────────────── */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl px-8 py-7 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-1 h-10 rounded-full bg-[#D4A853]" />
          <div>
            <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs text-[#1a1a2e]/35 mt-0.5 font-medium">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "result" : "results"}
            </p>
          </div>
        </div>

        {/* Sort control */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#1a1a2e]/35 tracking-wide uppercase">
            Sort by
          </span>
          <div className="relative">
            <select className="appearance-none text-xs font-bold text-[#1a1a2e] bg-[#FAF9F6] border border-[#E8E4DD] hover:border-[#D4A853]/50 rounded-xl px-4 py-2.5 pr-8 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200 cursor-pointer">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Avg. Customer Review</option>
              <option>Newest Arrivals</option>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-[#1a1a2e]/30 rotate-90 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── PRODUCT LIST ──────────────────────────────────────────── */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* ── EMPTY STATE ────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#F5F3EF] border border-[#E8E4DD] flex items-center justify-center mb-5">
            <svg
              className="w-9 h-9 text-[#1a1a2e]/15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-black text-[#1a1a2e] tracking-tight mb-2">
            No products found
          </h3>
          <p className="text-sm text-[#1a1a2e]/35 max-w-xs mb-8">
            No products in{" "}
            <span className="font-bold text-[#1a1a2e]/60">{category.name}</span>{" "}
            yet. Check back soon or explore other categories.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-[#1a1a2e]/10"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </main>
  );
}
