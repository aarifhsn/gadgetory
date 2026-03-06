import { auth } from "@/auth";
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ── CATEGORY CARDS ────────────────────────────────────────── */}
      {displayCategories.map((category, idx) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group relative overflow-hidden bg-[#E8E4DD] aspect-[3/4] block rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500"
        >
          {/* Background image — full bleed */}
          {category.type === "single" && category.images[0] && (
            <img
              src={category.images[0]}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
            />
          )}

          {category.type === "grid" && (
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2">
              {category.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${category.name} ${i + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              ))}
              {Array.from({
                length: Math.max(0, 4 - category.images.length),
              }).map((_, i) => (
                <div key={`e-${i}`} className="bg-[#E8E4DD]" />
              ))}
            </div>
          )}

          {/* Content — pinned to bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-slate-50/80 backdrop-blur-sm rounded-b-2xl z-10">
            {/* Index number */}
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4A853] uppercase block mb-1">
              0{idx + 1}
            </span>
            <h2 className="text-base font-black tracking-tight text-[#1a1a2e] leading-tight mb-3 group-hover:text-[#D4A853] transition-colors duration-300">
              {category.name}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a2e]/50 group-hover:text-[#D4A853] transition-colors duration-300">
              {category.linkText}
              <svg
                className="w-2.5 h-2.5 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>

          {/* Top-left index pill */}
          <div className="absolute top-4 left-4 bg-[#FAF9F6]/80 backdrop-blur-sm rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[9px] font-black tracking-widest text-[#1a1a2e] uppercase">
              Explore
            </span>
          </div>

          {/* Gold corner accent dot */}
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#D4A853] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm" />
        </Link>
      ))}

      {/* ── SIGN IN CARD ──────────────────────────────────────────── */}
      {!session && (
        <div className="relative overflow-hidden bg-[#1a1a2e] aspect-[3/4] flex flex-col rounded-2xl shadow-sm">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500"
            alt="Tech deals"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[#D4A853]/10" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-[#D4A853]/8" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-5">
            <div className="w-8 h-8 rounded-full bg-[#D4A853]/15 flex items-center justify-center mb-4">
              <svg
                className="w-4 h-4 text-[#D4A853]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4A853] uppercase block mb-1">
              Members Only
            </span>
            <h2 className="text-base font-black tracking-tight text-[#FAF9F6] leading-tight mb-2">
              Unlock exclusive deals
            </h2>
            <p className="text-[11px] text-[#FAF9F6]/40 leading-relaxed mb-5">
              Sign in for member-only prices and fast checkout.
            </p>

            <Link
              href="/login"
              className="w-full py-3 bg-[#D4A853] hover:bg-[#c9973d] text-[#1a1a2e] text-[10px] font-black tracking-[0.25em] uppercase text-center transition-colors duration-300 block rounded-xl shadow-lg shadow-[#D4A853]/20"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="w-full py-2.5 mt-2 border border-[#FAF9F6]/10 hover:border-[#D4A853]/40 text-[#FAF9F6]/50 hover:text-[#D4A853] text-[10px] font-semibold tracking-[0.2em] uppercase text-center transition-all duration-300 block rounded-xl"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
