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

  return (
    <main className="max-w-[1500px] mx-auto w-full">
      <ShopHeader shop={shop} stats={stats} />
      <div className="p-4">
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
    title: `${shop.shopName || shop.name} - Gadgets BD`,
    description:
      shop.shopDescription || `Shop for quality products at ${shop.shopName}`,
  };
}
