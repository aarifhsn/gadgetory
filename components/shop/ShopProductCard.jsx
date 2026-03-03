export default function ShopProductCard({ product }) {
  return (
    <a
      href={`/products/${product.slug}`}
      className="bg-white border border-gray-200 rounded-sm p-3 hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-50 mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm line-clamp-2 mb-2 hover:text-amazon-orange">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-amazon-secondary text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <p className="text-lg font-bold text-amazon-orange mt-auto">
          ৳{Number(product.price).toLocaleString()}
        </p>

        {/* Stock status */}
        {product.stockQuantity > 0 ? (
          <p className="text-xs text-green-600 mt-1">In Stock</p>
        ) : (
          <p className="text-xs text-red-600 mt-1">Out of Stock</p>
        )}
      </div>
    </a>
  );
}
