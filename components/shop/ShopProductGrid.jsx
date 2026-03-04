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
      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#F5F3EF] border border-[#E8E4DD] flex items-center justify-center mb-5">
            <svg
              className="w-9 h-9 text-[#1a1a2e]/15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-black text-[#1a1a2e] tracking-tight mb-2">
            No products yet
          </h3>
          <p className="text-sm text-[#1a1a2e]/35 max-w-xs">
            <span className="font-bold text-[#1a1a2e]/55">{shopName}</span>{" "}
            hasn't listed any products yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ShopProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
