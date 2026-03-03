import Image from "next/image";
import Link from "next/link";

export default function RelatedProductsCard({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="border border-gray-200 rounded p-3 hover:shadow-md transition"
          >
            <div className="bg-gray-50 h-32 flex items-center justify-center mb-2 relative">
              <Image
                src={product.mainImage || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-amazon-blue hover:text-amazon-orange line-clamp-2 mb-1">
              {product.name}
            </p>
            <p className="text-sm font-bold">
              ৳{product.price.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
