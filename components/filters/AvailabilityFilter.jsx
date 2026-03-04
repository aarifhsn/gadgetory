export default function AvailabilityFilter({
  inStock,
  onToggle,
  preOrder,
  onTogglePreOrder,
}) {
  return (
    <div>
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40 mb-3">
        Availability
      </h3>
      <div className="space-y-2.5">
        {[
          {
            label: "In Stock",
            checked: inStock,
            onChange: () => onToggle(!inStock),
          },
          {
            label: "Pre-Order",
            checked: preOrder,
            onChange: () => onTogglePreOrder(!preOrder),
          },
        ].map(({ label, checked, onChange }) => (
          <label
            key={label}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="w-3.5 h-3.5 rounded border-[#E8E4DD] accent-[#D4A853] cursor-pointer"
            />
            <span
              className={`text-xs font-medium transition-colors duration-150 ${
                checked
                  ? "text-[#D4A853] font-bold"
                  : "text-[#1a1a2e]/55 group-hover:text-[#1a1a2e]"
              }`}
            >
              {label}
            </span>
            {checked && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
