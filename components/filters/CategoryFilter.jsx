import categories from "@/data/categories";

export default function CategoryFilter({ selected = [], onToggle }) {
  // ── CategoryFilter ────────────────────────────────────────────
  return (
    <div>
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40 mb-3">
        Category
      </h3>
      <div className="space-y-2.5">
        {categories.map((category) => {
          const checked = selected.includes(category.value);
          return (
            <label
              key={category.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(category.value)}
                className="w-3.5 h-3.5 rounded border-[#E8E4DD] accent-[#D4A853] cursor-pointer"
              />
              <span
                className={`text-xs font-medium transition-colors duration-150 ${
                  checked
                    ? "text-[#D4A853] font-bold"
                    : "text-[#1a1a2e]/55 group-hover:text-[#1a1a2e]"
                }`}
              >
                {category.name}
              </span>
              {checked && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
