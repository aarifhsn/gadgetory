import { getProducts } from "@/app/actions/productManagementActions";
import ProductGrid from "@/components/products/ProductGrid";
import ProductListingHeader from "@/components/products/ProductListingHeader";
import FilterSidebar from "@/components/shop/FilterSidebar";
import Link from "next/link";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;

  // Extract filters from URL
  const filters = {
    search: params.q || null,
    category: params.category?.split(",") || [],
    brands: params.brands?.split(",") || [],
    minPrice: params.minPrice ? Number(params.minPrice) : null,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : null,
    rating: params.rating ? Number(params.rating) : null,
    inStock: params.inStock === "true",
    preOrder: params.preOrder === "true",
    condition: params.condition || "",
    sort: params.sort || "",
  };

  // Fetch filtered products
  const result = await getProducts(filters);
  const products = result.success ? result.data : [];
  const totalResults = products.length;

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 md:px-16 py-10">
      {/* ── RESULTS HEADER ────────────────────────────────────────── */}
      <ProductListingHeader
        totalResults={products.length}
        currentSort={filters.sort}
        searchTerm={
          filters.category.length > 0
            ? filters.category.join(", ")
            : filters.search || "All products"
        }
        searchQuery={filters.search}
      />

      {/* ── ACTIVE FILTERS ────────────────────────────────────────── */}
      {(filters.search ||
        filters.category.length > 0 ||
        filters.brands.length > 0 ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.rating ||
        filters.inStock ||
        filters.preOrder ||
        filters.condition) && (
        <div className="flex items-center gap-2 flex-wrap mb-6 mt-2">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/30">
            Active Filters
          </span>

          {filters.search && (
            <Link
              href={`/products${filters.category.length > 0 ? `?category=${filters.category.join(",")}` : ""}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1a1a2e]/60 bg-white border border-[#E8E4DD] hover:border-rose-300 hover:text-rose-500 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              Search: {filters.search.slice(0, 20)}
              <span className="text-[10px] opacity-60">✕</span>
            </Link>
          )}

          {filters.category.length > 0 && (
            <Link
              href={`/products${filters.search ? `?q=${filters.search}` : ""}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1a1a2e]/60 bg-white border border-[#E8E4DD] hover:border-rose-300 hover:text-rose-500 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {filters.category.join(", ")}
              <span className="text-[10px] opacity-60">✕</span>
            </Link>
          )}

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4A853] hover:underline underline-offset-4 tracking-wide transition-all ml-1"
          >
            Clear all →
          </Link>
        </div>
      )}

      {/* ── MAIN LAYOUT ───────────────────────────────────────────── */}
      <div className="flex gap-6 items-start">
        <FilterSidebar currentFilters={filters} />
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
