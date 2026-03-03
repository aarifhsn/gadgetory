import categories from "@/data/categories";

export default function CategoryFilter({ selected = [], onToggle }) {
  return (
    <div className="mb-6">
      <h3 className="font-bold text-base mb-3">Category</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.value}
            className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
          >
            <input
              type="checkbox"
              checked={selected.includes(category.value)}
              onChange={() => onToggle(category.value)}
              className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            />
            <span className="text-sm">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
