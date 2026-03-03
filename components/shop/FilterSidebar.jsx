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
    <div className="w-64 hidden lg:block flex-shrink-0 border-r pr-4">
      <CategoryFilter
        selected={currentFilters.category}
        onToggle={(value) => toggleArrayFilter("category", value)}
      />

      <BrandFilter
        selected={currentFilters.brands}
        onToggle={(value) => toggleArrayFilter("brands", value)}
      />

      <RatingFilter
        selected={currentFilters.rating}
        onChange={(value) => updateFilter("rating", value)}
      />

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

      <AvailabilityFilter
        inStock={currentFilters.inStock}
        onToggle={(value) => updateFilter("inStock", value)}
        preOrder={currentFilters.preOrder}
        onTogglePreOrder={(value) => updateFilter("preOrder", value)}
      />

      <ConditionFilter
        selected={currentFilters.condition}
        onChange={(value) => updateFilter("condition", value)}
      />
    </div>
  );
}
