import ShopProductCard from "./ShopProductCard";

export default function ShopProductGrid({ products, shopName }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No products yet
        </h3>
        <p className="text-gray-500">
          {shopName} hasn't listed any products yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">All Products</h2>
        <p className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          available
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ShopProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
