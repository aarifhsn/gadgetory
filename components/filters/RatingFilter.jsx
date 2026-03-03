import { Star } from "lucide-react";

export default function RatingFilter({ selected, onChange }) {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="border-t pt-4 mb-6">
      <h3 className="font-bold text-base mb-3">Customer Reviews</h3>
      <div className="space-y-2">
        {ratings.map((rating) => (
          <label
            key={rating}
            className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
          >
            <input
              type="radio"
              name="rating"
              checked={Number(selected) === rating}
              onChange={() =>
                onChange(Number(selected) === rating ? null : rating)
              }
              className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            />
            <div className="flex items-center gap-1">
              <div className="flex text-amazon-secondary text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm">& Up</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
