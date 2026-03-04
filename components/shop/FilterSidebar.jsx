"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AvailabilityFilter from "../filters/AvailabilityFilter";
import BrandFilter from "../filters/BrandFilter";
import CategoryFilter from "../filters/CategoryFilter";
import ConditionFilter from "../filters/ConditionFilter";
import PriceFilter from "../filters/PriceFilter";
import RatingFilter from "../filters/RatingFilter";

export default function FilterSidebar({ currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`);
  };

  const toggleArrayFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",").filter(Boolean) || [];

    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    if (updated.length === 0) {
      params.delete(key);
    } else {
      params.set(key, updated.join(","));
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-64 hidden lg:flex flex-col flex-shrink-0 gap-1">
      {/* Sidebar header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
        <span className="text-xs font-black tracking-[0.2em] uppercase text-[#1a1a2e]">
          Filters
        </span>
      </div>

      {/* Each filter section sits in its own card */}
      <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#F5F3EF]">
        <div className="p-4">
          <CategoryFilter
            selected={currentFilters.category}
            onToggle={(value) => toggleArrayFilter("category", value)}
          />
        </div>
        <div className="p-4">
          <BrandFilter
            selected={currentFilters.brands}
            onToggle={(value) => toggleArrayFilter("brands", value)}
          />
        </div>
        <div className="p-4">
          <RatingFilter
            selected={currentFilters.rating}
            onChange={(value) => updateFilter("rating", value)}
          />
        </div>
        <div className="p-4">
          <PriceFilter
            minPrice={currentFilters.minPrice}
            maxPrice={currentFilters.maxPrice}
            onUpdate={(min, max) => {
              const params = new URLSearchParams(searchParams.toString());
              if (min) params.set("minPrice", min);
              else params.delete("minPrice");
              if (max) params.set("maxPrice", max);
              else params.delete("maxPrice");
              router.push(`?${params.toString()}`);
            }}
          />
        </div>
        <div className="p-4">
          <AvailabilityFilter
            inStock={currentFilters.inStock}
            onToggle={(value) => updateFilter("inStock", value)}
            preOrder={currentFilters.preOrder}
            onTogglePreOrder={(value) => updateFilter("preOrder", value)}
          />
        </div>
        <div className="p-4">
          <ConditionFilter
            selected={currentFilters.condition}
            onChange={(value) => updateFilter("condition", value)}
          />
        </div>
      </div>
    </div>
  );
}
