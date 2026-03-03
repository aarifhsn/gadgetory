import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function HeroCategorySection({ categories }) {
  const session = await auth();

  const heroCategories = categories
    .filter((cat) => cat.showInHero)
    .sort((a, b) => a.order - b.order);

  // Show 3 categories if not logged in (4th slot is sign-in card)
  // Show 4 categories if logged in
  const displayCategories = session
    ? heroCategories.slice(0, 4)
    : heroCategories.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Category Cards */}
      {displayCategories.map((category) => (
        <div
          key={category.slug}
          className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20"
        >
          <h2 className="text-xl font-bold">{category.name}</h2>

          {/* Grid type: 2x2 image grid */}
          {category.type === "grid" && (
            <div className="grid grid-cols-2 gap-2 h-full">
              {category.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${category.name} ${i + 1}`}
                  className="w-full h-full object-cover mb-1"
                />
              ))}
              {/* Fill empty slots if less than 4 images */}
              {Array.from({
                length: Math.max(0, 4 - category.images.length),
              }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-full h-full bg-gray-100 flex items-center justify-center mb-1"
                >
                  <span className="text-gray-400 text-xs">
                    <Image
                      src="/placeholder.png"
                      alt="placeholder"
                      width={200}
                      height={160}
                    />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Single type: one large image */}
          {category.type === "single" && (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {category.images[0] ? (
                <img
                  src={category.images[0]}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">No products yet</span>
              )}
            </div>
          )}

          {/* Link */}
          <Link
            href={`/products?category=${category.slug}`}
            className="text-amazon-blue text-sm hover:underline hover:text-red-700 mt-auto"
          >
            {category.linkText}
          </Link>
        </div>
      ))}

      {/* Sign In Card — only shows if not logged in */}
      {!session && (
        <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20 justify-between">
          <div className="shrink-0">
            <h2 className="text-xl font-bold">
              Sign in for the best tech deals
            </h2>
            <Link
              href="/login"
              className="bg-amazon-yellow hover:bg-amazon-yellow_hover w-full py-2 rounded-md shadow-sm mt-4 text-sm block text-center"
            >
              Sign in securely
            </Link>
          </div>
          <div className="mt-4 grow h-full">
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500"
              alt="Tech deals"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
