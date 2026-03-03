import { getShops } from "@/app/actions/sellerActions";
import ShopCard from "@/components/shop/ShopCard";
import ShopPagination from "@/components/shop/ShopPagination";

export default async function ShopsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;

  const result = await getShops(page, 9);
  const shops = result.success ? result.data : [];
  const pagination = result.pagination;

  return (
    <main className="max-w-[1500px] mx-auto w-full p-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Featured Shops & Storefronts</h1>
        <p className="text-sm text-gray-600">
          Discover trusted tech shops delivering premium gadgets across
          Bangladesh.
        </p>
        {pagination.totalShops > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Showing {(page - 1) * 9 + 1} -{" "}
            {Math.min(page * 9, pagination.totalShops)} of{" "}
            {pagination.totalShops} shops
          </p>
        )}
      </div>

      {/* Shops Grid */}
      {shops.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No shops found
          </h3>
          <p className="text-gray-500">There are no registered shops yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {shops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <ShopPagination pagination={pagination} />
          )}
        </>
      )}
    </main>
  );
}
