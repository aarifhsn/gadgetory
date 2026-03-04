import { Star } from "lucide-react";

export default function RatingFilter({ selected, onChange }) {
  const ratings = [4, 3, 2, 1];

  // ── RatingFilter ──────────────────────────────────────────────
  return (
    <div>
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1a1a2e]/40 mb-3">
        Customer Reviews
      </h3>
      <div className="space-y-2.5">
        {ratings.map((rating) => {
          const checked = Number(selected) === rating;
          return (
            <label
              key={rating}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={checked}
                onChange={() => onChange(checked ? null : rating)}
                className="w-3.5 h-3.5 border-[#E8E4DD] accent-[#D4A853] cursor-pointer"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 transition-colors duration-150 ${
                      i < rating
                        ? "fill-[#D4A853] text-[#D4A853]"
                        : checked
                          ? "fill-[#E8E4DD] text-[#E8E4DD]"
                          : "fill-[#E8E4DD] text-[#E8E4DD]"
                    }`}
                  />
                ))}
                <span
                  className={`text-xs font-medium ml-0.5 transition-colors duration-150 ${
                    checked
                      ? "text-[#D4A853] font-bold"
                      : "text-[#1a1a2e]/55 group-hover:text-[#1a1a2e]"
                  }`}
                >
                  & Up
                </span>
              </div>
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
