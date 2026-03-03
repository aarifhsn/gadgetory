export default function ConditionFilter({ selected, onChange }) {
  return (
    <div className="border-t pt-4 mb-6">
      <h3 className="font-bold text-base mb-3">Condition</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange">
          <input
            type="checkbox"
            checked={selected === "new"}
            onChange={() => onChange(selected === "new" ? null : "new")}
            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
          />
          <span className="text-sm">New</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange">
          <input
            type="checkbox"
            checked={selected === "renewed"}
            onChange={() => onChange(selected === "renewed" ? null : "renewed")}
            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
          />
          <span className="text-sm">Renewed</span>
        </label>
      </div>
    </div>
  );
}
