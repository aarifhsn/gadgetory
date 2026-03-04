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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Result count + context */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-[#D4A853]" />
          <h1 className="text-xl font-black text-[#1a1a2e] tracking-tight">
            {searchQuery ? (
              <>
                Results for{" "}
                <span className="text-[#D4A853]">"{searchQuery}"</span>
              </>
            ) : searchTerm ? (
              <>{searchTerm}</>
            ) : (
              "All Products"
            )}
          </h1>
        </div>
        <p className="text-xs text-[#1a1a2e]/35 font-medium pl-4">
          <span className="font-bold text-[#1a1a2e]/55">{totalResults}</span>{" "}
          {totalResults === 1 ? "result" : "results"} found
        </p>
      </div>

      {/* Sort control */}
      <div className="flex items-center gap-3 bg-white border border-[#E8E4DD] rounded-xl px-4 py-2.5 self-start sm:self-auto">
        <span className="text-xs font-black text-[#1a1a2e]/30 tracking-[0.2em] uppercase whitespace-nowrap">
          Sort by
        </span>
        <div className="relative">
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="appearance-none text-xs font-bold text-[#1a1a2e] bg-transparent pr-5 outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
            <option value="newest">Newest Arrivals</option>
          </select>
          <svg
            className="w-3 h-3 text-[#1a1a2e]/30 rotate-90 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
