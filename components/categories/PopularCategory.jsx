import Image from "next/image";
import Link from "next/link";

export default function PopularCategories({ categories }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, idx) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group relative flex flex-col items-center bg-white border border-[#E8E4DD] hover:border-[#D4A853]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A853]/10 hover:-translate-y-1"
        >
          {/* Image area */}
          <div className="w-full h-32 bg-[#F5F3EF] flex items-center justify-center overflow-hidden relative">
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(212,168,83,0.15) 0%, transparent 70%)",
              }}
            />
            <Image
              alt={category.name}
              src={category.images[0] || "/placeholder.png"}
              className="h-24 w-24 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
              width={200}
              height={200}
            />
          </div>

          {/* Label */}
          <div className="w-full px-3 py-3 flex flex-col items-center border-t border-[#E8E4DD] group-hover:border-[#D4A853]/20 transition-colors duration-300">
            <h3 className="text-[11px] font-bold tracking-wide text-[#1a1a2e]/70 group-hover:text-[#D4A853] text-center transition-colors duration-300 uppercase leading-tight">
              {category.name}
            </h3>
          </div>

          {/* Gold bottom bar — slides in on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A853] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>
      ))}
    </div>
  );
}
