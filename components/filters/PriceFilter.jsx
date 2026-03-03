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

  return (
    <div className="border-t pt-4 mb-6">
      <h3 className="font-bold text-base mb-3">Price</h3>
      <div className="space-y-2">
        {priceRanges.map((range) => (
          <label
            key={range.label}
            className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
          >
            <input
              type="checkbox"
              checked={isSelected(range.min, range.max)}
              onChange={() => handleSelect(range.min, range.max)}
              className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            />
            <span className="text-sm">{range.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
