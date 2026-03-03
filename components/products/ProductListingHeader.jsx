"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductListingHeader({
  totalResults,
  currentSort,
  searchTerm,
  searchQuery,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center mb-4 shadow-sm border-b pb-2">
      <div className="text-sm">
        <span>
          1-{totalResults} of over {totalResults} results for{" "}
        </span>
        {searchQuery && (
          <>
            {" for "}
            <span className="font-bold text-amazon-orange">
              "{searchQuery}"
            </span>
          </>
        )}
        {searchTerm && (
          <>
            {" in "}
            <span className="font-bold text-amazon-orange">{searchTerm}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Sort by:</span>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Avg. Customer Review</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
}
