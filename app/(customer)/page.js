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
    <main className="flex-1 max-w-[1500px] mx-auto w-full">
      {/* Hero Banner */}
      <div
        className="relative w-full h-64 md:h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2574&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-amazon-background to-transparent"></div>
      </div>

      {/* Categories & Content Grid */}
      <div className="relative z-10 -mt-32 px-4">
        <HeroCategorySection categories={heroCategories} />

        {/* Featured Product Carousel (Horizontal Scroll) */}
        <FeaturedProducts products={featuredProducts} />
      </div>

      {/* Why Shop With Us Section */}
      <ShopCoices />

      {/* Popular Categories Section */}
      <PopularCategories categories={popularCategories} />

      {/* Shop by Brand Section */}
      <ShopBrand />
    </main>
  );
}
