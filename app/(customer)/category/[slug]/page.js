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
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-amazon-text font-bold">{category.name}</span>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-4 shadow-sm border-b pb-2">
        <div className="text-sm">
          <span>
            1-{filteredProducts.length} of {filteredProducts.length} results
            for{" "}
          </span>
          <span className="font-bold text-amazon-orange">
            "{category.name}"
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <select className="text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Avg. Customer Review</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-12">
            No products found in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}
