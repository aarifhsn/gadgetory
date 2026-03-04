export default function ShopProductCard({ product }) {
  // ── ShopProductCard ───────────────────────────────────────────
  return (
    <a
      href={`/products/${product.slug}`}
      className="group bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#D4A853]/8 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="aspect-square bg-[#F5F3EF] flex items-center justify-center overflow-hidden relative p-4">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,168,83,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Stock badge */}
        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-[#FAF9F6]/80 flex items-center justify-center">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#1a1a2e]/30 border border-[#1a1a2e]/15 px-3 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category */}
        <span className="text-[9px] font-black tracking-[0.25em] uppercase text-[#D4A853]">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-xs font-bold text-[#1a1a2e]/75 group-hover:text-[#1a1a2e] line-clamp-2 leading-relaxed transition-colors duration-150 min-h-[32px]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-[11px] ${i < Math.floor(product.rating) ? "text-[#D4A853]" : "text-[#E8E4DD]"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] font-medium text-[#1a1a2e]/30">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-[#E8E4DD] my-0.5" />

        {/* Price + stock */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[11px] font-bold text-[#D4A853]">৳</span>
            <span className="text-lg font-black text-[#1a1a2e] leading-none tracking-tight">
              {Number(product.price).toLocaleString()}
            </span>
          </div>
          {product.stockQuantity > 0 && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-600/70">
              In Stock
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
