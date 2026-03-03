import brands from "@/data/brands";
import Link from "next/link";

export default function ShopBrand() {
  return (
    <div className="bg-white py-8 mt-8">
      <div className="max-w-[1500px] mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Shop by Brand</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {brands.map((brand) => (
            <Link
              href={`/products?brands=${brand}`}
              key={brand}
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400 capitalize">
                {brand}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
