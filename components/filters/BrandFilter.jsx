export default function BrandFilter({ selected = [], onToggle }) {
  const brands = ["apple", "samsung", "dell", "hp", "lenovo", "sony", "razer"];

  return (
    <div className="border-t pt-4 mb-6">
      <h3 className="font-bold text-base mb-3">Brand</h3>
      <div className="space-y-2">
        {brands.map((brand) => (
          <label
            key={brand}
            className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
          >
            <input
              type="checkbox"
              checked={selected.includes(brand)}
              onChange={() => onToggle(brand)}
              className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            />
            <span className="text-sm capitalize">{brand}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
