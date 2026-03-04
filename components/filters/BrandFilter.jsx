export default function BrandFilter({ selected = [], onToggle }) {
  const brands = ["apple", "samsung", "dell", "hp", "lenovo", "sony", "razer"];

  // ── BrandFilter ───────────────────────────────────────────────
  return (
    <div>
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40 mb-3">
        Brand
      </h3>
      <div className="space-y-2.5">
        {brands.map((brand) => {
          const checked = selected.includes(brand);
          return (
            <label
              key={brand}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(brand)}
                className="w-3.5 h-3.5 rounded border-[#E8E4DD] accent-[#D4A853] cursor-pointer"
              />
              <span
                className={`text-xs font-medium capitalize transition-colors duration-150 ${
                  checked
                    ? "text-[#D4A853] font-bold"
                    : "text-[#1a1a2e]/55 group-hover:text-[#1a1a2e]"
                }`}
              >
                {brand}
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
