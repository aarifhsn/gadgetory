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
      className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-amazon-secondary"
    >
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-100 text-black text-xs px-2 border-r border-gray-300 cursor-pointer hover:bg-gray-200"
      >
        <option value="all">All</option>
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Gadgets, Laptops, Phones..."
        className="flex-1 px-3 text-black outline-none"
      />
      <button
        type="submit"
        className="bg-amazon-secondary hover:bg-[#fa8900] px-4 flex items-center justify-center"
      >
        <Search className="text-black w-5 h-5" />
      </button>
    </form>
  );
}
