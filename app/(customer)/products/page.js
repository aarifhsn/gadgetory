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
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      {/* Results Header */}
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
      {/* Clear Filters */}
      {(filters.search ||
        filters.category.length > 0 ||
        filters.brands.length > 0 ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.rating ||
        filters.inStock ||
        filters.preOrder ||
        filters.condition) && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.search && (
            <Link
              href={`/products${filters.category.length > 0 ? `?category=${filters.category.join(", ")}` : ""}`}
              className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Search: {filters.search.slice(0, 20)} ✕
            </Link>
          )}
          {filters.category.length > 0 && (
            <Link
              href={`/products${filters.search ? `?q=${filters.search}` : ""}`}
              className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Category: {filters.category.join(", ")} ✕
            </Link>
          )}
          <Link
            href="/products"
            className="text-xs text-amazon-blue hover:underline"
          >
            Clear all
          </Link>
        </div>
      )}

      <div className="flex gap-6">
        <FilterSidebar currentFilters={filters} />
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
