import { getShopById } from "@/app/actions/sellerActions";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopProductGrid from "@/components/shop/ShopProductGrid";
import { notFound } from "next/navigation";

export default async function ShopDetailPage({ params }) {
  const { shopId } = await params;

  const result = await getShopById(shopId);

  if (!result.success) {
    notFound();
  }

  const { shop, products, stats } = result.data;

  // ── ShopDetailPage ────────────────────────────────────────────
  return (
    <main className="max-w-[1500px] mx-auto w-full">
      {/* Shop header — full width, no padding (ShopHeader handles its own) */}
      <ShopHeader shop={shop} stats={stats} />

      {/* Products section */}
      <div className="px-4 md:px-16 py-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
            <span className="text-xl font-black text-[#1a1a2e] tracking-tight">
              Products by {shop.shopName || shop.name}
            </span>
          </div>
        </div>

        <ShopProductGrid
          products={products}
          shopName={shop.shopName || shop.name}
        />
      </div>
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { shopId } = await params;
  const result = await getShopById(shopId);

  if (!result.success) {
    return {
      title: "Shop Not Found",
    };
  }

  const { shop } = result.data;

  return {
    title: `${shop.shopName || shop.name} - gadgetory`,
    description:
      shop.shopDescription || `Shop for quality products at ${shop.shopName}`,
  };
}
