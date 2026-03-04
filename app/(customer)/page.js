import { getCategoryImages } from "@/app/actions/categoryActions";
import { getProducts } from "@/app/actions/productManagementActions";
import HeroCategorySection from "@/components/categories/HeroCategorySection";
import PopularCategories from "@/components/categories/PopularCategory";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import ShopBrand from "@/components/shop/ShopBrand";
import ShopCoices from "@/components/shop/ShopChoices";
import categories from "@/data/categories";

export default async function Home() {
  const productsResult = await getProducts();
  const allProducts = productsResult.success ? productsResult.data : [];

  // Get featured products
  const featuredProducts = allProducts
    .filter((p) => p.status === "Active")
    .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
    .slice(0, 12); // Limit to top 12
  const categoryImages = await getCategoryImages();
  const imageMap = categoryImages.success ? categoryImages.data : {};

  // Attach images from DB to each category
  const categoriesWithImages = categories.map((cat) => ({
    ...cat,
    images: imageMap[cat.value] || [],
  }));

  // Split into hero (top) and popular (bottom)
  const heroCategories = categoriesWithImages
    .filter((c) => c.showInHero)
    .sort((a, b) => a.order - b.order);

  const popularCategories = categoriesWithImages
    .filter((c) => c.showInPopular)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="flex-1 w-full bg-[#FAF9F6] overflow-x-hidden">
      {/* ── HERO BANNER ───────────────────────────────────────────── */}
      <section className="relative w-full h-[90vh] min-h-[580px] max-h-[860px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2574&auto=format&fit=crop')",
          }}
        />
        {/* Soft light overlay — keeps it bright but readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/70 to-[#FAF9F6]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent" />

        {/* Hero copy */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-[1500px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs tracking-[0.35em] uppercase font-semibold">
              Premium Tech Marketplace · Bangladesh
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[88px] font-black leading-[0.9] tracking-tight text-[#1a1a2e] max-w-3xl">
            Next-Level
            <br />
            <span className="text-[#D4A853]">Gadgets.</span>
            <br />
            <span className="text-[#1a1a2e]/40 font-light italic">
              Delivered.
            </span>
          </h1>

          <p className="mt-7 text-[#1a1a2e]/55 text-base md:text-lg max-w-md leading-relaxed font-normal">
            Smartphones, laptops, and smart accessories — curated from trusted
            sellers across the country.
          </p>

          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <a
              href="/products"
              className="bg-[#1a1a2e] text-[#FAF9F6] text-xs font-bold tracking-[0.2em] uppercase px-9 py-4 rounded-full hover:bg-[#D4A853] hover:text-[#1a1a2e] transition-all duration-300 shadow-lg shadow-[#1a1a2e]/10"
            >
              Shop Now
            </a>
            <a
              href="/categories"
              className="border border-[#1a1a2e]/20 text-[#1a1a2e]/70 text-xs font-semibold tracking-[0.2em] uppercase px-9 py-4 rounded-full hover:border-[#D4A853] hover:text-[#D4A853] transition-all duration-300"
            >
              Browse Categories
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex items-center gap-6 flex-wrap">
            {["Free Delivery", "Authentic Products", "Easy Returns"].map(
              (badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
                  <span className="text-[#1a1a2e]/50 text-xs font-medium tracking-wide">
                    {badge}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
      </section>

      {/* ── HERO CATEGORY STRIP ───────────────────────────────────── */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-16 -mt-6 relative z-10">
        <HeroCategorySection categories={heroCategories} />
      </section>

      {/* ── TRENDING SECTION HEADER ───────────────────────────────── */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-16 mt-24 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
          <span className="text-[#1a1a2e] text-xl font-bold tracking-tight">
            Trending Now
          </span>
        </div>
        <a
          href="/products"
          className="text-[#D4A853] text-xs font-semibold tracking-[0.15em] uppercase hover:underline underline-offset-4 transition-all"
        >
          View All →
        </a>
      </div>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────── */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-16">
        <FeaturedProducts products={featuredProducts} />
      </section>

      {/* ── SHOP CHOICES / WHY US ─────────────────────────────────── */}
      <section className="mt-28 bg-[#1a1a2e] relative overflow-hidden">
        {/* Decorative background detail */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D4A853]/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#D4A853]/5 translate-y-1/2 -translate-x-1/3" />
        <div className="max-w-[1500px] mx-auto px-6 md:px-16 py-20 relative z-10">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
            <span className="text-[#FAF9F6] text-xl font-bold tracking-tight">
              Why Choose Gadgetory
            </span>
          </div>
          <ShopCoices />
        </div>
      </section>

      {/* ── POPULAR CATEGORIES ────────────────────────────────────── */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-16 mt-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
            <span className="text-[#1a1a2e] text-xl font-bold tracking-tight">
              Popular Categories
            </span>
          </div>
          <a
            href="/categories"
            className="text-[#D4A853] text-xs font-semibold tracking-[0.15em] uppercase hover:underline underline-offset-4 transition-all"
          >
            All Categories →
          </a>
        </div>
        <PopularCategories categories={popularCategories} />
      </section>

      {/* ── SHOP BY BRAND ─────────────────────────────────────────── */}
      <section className="mt-24 mb-0 bg-[#F2EFE9]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-16 py-20">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
            <span className="text-[#1a1a2e] text-xl font-bold tracking-tight">
              Shop by Brand
            </span>
          </div>
          <ShopBrand />
        </div>
      </section>
    </main>
  );
}
