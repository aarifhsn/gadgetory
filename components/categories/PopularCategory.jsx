import Image from "next/image";
import Link from "next/link";

export default function PopularCategories({ categories }) {
  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
          >
            <div className="h-32 flex items-center justify-center mb-2">
              <Image
                alt={category.name}
                src={category.images[0] || "/placeholder.png"}
                className="h-full object-cover"
                width={200}
                height={200}
              />
            </div>
            <h3 className="font-medium text-sm">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
