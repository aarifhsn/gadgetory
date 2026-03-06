"use client";

import categories from "@/data/categories";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();

    // Build search URL with query params
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (category !== "all") {
      params.set("category", category);
    }

    // Redirect to products page with search params
    router.push(`/products?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 flex h-11 bg-white border-2 border-transparent focus-within:border-[#D4A853] rounded-xl overflow-hidden shadow-sm transition-all duration-200"
    >
      {/* Category select */}
      <div className="relative shrink-0">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="appearance-none h-full bg-[#F5F3EF] border-r border-[#E8E4DD] text-[#1a1a2e] text-[11px] font-bold pl-3 pr-7 cursor-pointer hover:bg-[#EEE9E1] outline-none transition-colors duration-150"
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.name}
            </option>
          ))}
        </select>
        <svg
          className="w-2.5 h-2.5 text-[#1a1a2e]/30 rotate-90 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Text input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search gadgets, laptops, phones…"
        className="flex-1 px-4 text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none bg-white"
      />

      {/* Search button */}
      <button
        type="submit"
        className="bg-[#D4A853] hover:bg-[#c9973d] px-5 flex items-center justify-center transition-colors duration-200 shrink-0"
      >
        <Search className="w-4 h-4 text-[#1a1a2e]" />
      </button>
    </form>
  );
}
