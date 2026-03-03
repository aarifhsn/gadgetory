export default function AvailabilityFilter({
  inStock,
  onToggle,
  preOrder,
  onTogglePreOrder,
}) {
  return (
    <div className="border-t pt-4 mb-6">
      <h3 className="font-bold text-base mb-3">Availability</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => onToggle(!inStock)}
            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
          />
          <span className="text-sm">In Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange">
          <input
            type="checkbox"
            checked={preOrder}
            onChange={() => onTogglePreOrder(!preOrder)}
            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
          />
          <span className="text-sm">Pre-Order</span>
        </label>
      </div>
    </div>
  );
}
