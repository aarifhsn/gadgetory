export default function PriceFilter({ minPrice, maxPrice, onUpdate }) {
  const priceRanges = [
    { label: "Under ৳10,000", min: 0, max: 10000 },
    { label: "৳10,000 - ৳25,000", min: 10000, max: 25000 },
    { label: "৳25,000 - ৳50,000", min: 25000, max: 50000 },
    { label: "৳50,000 - ৳1,00,000", min: 50000, max: 100000 },
    { label: "Over ৳1,00,000", min: 100000, max: null },
  ];

  const isSelected = (min, max) => {
    return minPrice === min && maxPrice === max;
  };

  const handleSelect = (min, max) => {
    if (isSelected(min, max)) {
      onUpdate(null, null);
    } else {
      onUpdate(min, max);
    }
  };

  // ── PriceFilter ───────────────────────────────────────────────
  return (
    <div>
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40 mb-3">
        Price
      </h3>
      <div className="space-y-2.5">
        {priceRanges.map((range) => {
          const checked = isSelected(range.min, range.max);
          return (
            <label
              key={range.label}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleSelect(range.min, range.max)}
                className="w-3.5 h-3.5 rounded border-[#E8E4DD] accent-[#D4A853] cursor-pointer"
              />
              <span
                className={`text-xs font-medium transition-colors duration-150 ${
                  checked
                    ? "text-[#D4A853] font-bold"
                    : "text-[#1a1a2e]/55 group-hover:text-[#1a1a2e]"
                }`}
              >
                {range.label}
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
