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
    <main className="max-w-[1500px] mx-auto w-full px-4 md:px-16 py-10">
      {/* ── PAGE HEADER ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-7 rounded-full bg-[#D4A853]" />
            <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">
              Featured Shops
            </h1>
          </div>
          <p className="text-sm text-[#1a1a2e]/40 pl-4 max-w-md">
            Discover trusted tech shops delivering premium gadgets across
            Bangladesh.
          </p>
        </div>
        {pagination.totalShops > 0 && (
          <p className="text-xs font-medium text-[#1a1a2e]/30 shrink-0">
            Showing{" "}
            <span className="font-bold text-[#1a1a2e]/50">
              {(page - 1) * 9 + 1}–{Math.min(page * 9, pagination.totalShops)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#1a1a2e]/50">
              {pagination.totalShops}
            </span>{" "}
            shops
          </p>
        )}
      </div>

      {/* ── EMPTY STATE ───────────────────────────────────────────── */}
      {shops.length === 0 ? (
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
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-black text-[#1a1a2e] tracking-tight mb-2">
            No shops found
          </h3>
          <p className="text-sm text-[#1a1a2e]/35">
            There are no registered shops yet.
          </p>
        </div>
      ) : (
        <>
          {/* ── SHOPS GRID ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {shops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>

          {/* ── PAGINATION ──────────────────────────────────────────── */}
          {pagination.totalPages > 1 && (
            <ShopPagination pagination={pagination} />
          )}
        </>
      )}
    </main>
  );
}
