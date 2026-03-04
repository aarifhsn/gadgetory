import brands from "@/data/brands";
import Link from "next/link";

export default function ShopBrand() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
      {brands.map((brand, idx) => (
        <Link
          href={`/products?brands=${brand}`}
          key={brand}
          className="group flex-none w-36 h-24 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-[#D4A853]/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
        >
          {/* Hover glow bg */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,168,83,0.08) 0%, transparent 75%)",
            }}
          />

          {/* Brand name */}
          <span className="relative z-10 text-sm font-black tracking-tight text-[#1a1a2e]/35 group-hover:text-[#1a1a2e]/80 capitalize transition-colors duration-300">
            {brand}
          </span>

          {/* Gold dot accent */}
          <div className="w-1 h-1 rounded-full bg-[#D4A853] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A853] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
        </Link>
      ))}
    </div>
  );
}
