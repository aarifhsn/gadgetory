"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function FeaturedProducts({ products }) {
  const { cart, addToCart, removeFromCart } = useCart();

  if (!products || products.length === 0) return null;

  const isInCart = (product) => {
    return cart.some((item) => item.id === product._id);
  };

  const handleToggleCart = (product, isInCart) => {
    if (isInCart) {
      removeFromCart(product._id);
      toast.success("Removed from cart 🗑️", {
        icon: "❌",
      });
    } else {
      addToCart(
        {
          id: product._id,
          name: product.name,
          slug: product.slug,
          image: product.mainImage,
          price: product.price,
          category: product.category,
          shopInfo: { name: product.seller?.shopName || "Official Store" },
          stock: product.stockQuantity,
        },
        1,
      );
      toast.success("Added to cart 🛒", {
        icon: "✅",
      });
    }
  };

  return (
    <div className="mt-8 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold">Featured Products</h2>
        <Link
          href="/products"
          className="text-amazon-blue text-sm hover:underline hover:text-red-700"
        >
          View All
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {products.slice(0, 12).map((product) => {
          const inStock = product.stockQuantity > 0;

          // check if product is in cart
          const isInCart = cart.some((item) => item.id === product._id);

          return (
            <div key={product._id} className="flex-none w-48">
              <Link href={`/products/${product.slug}`}>
                <div className="bg-gray-50 h-48 flex items-center justify-center mb-2 p-2">
                  <Image
                    alt={product.name}
                    src={product.mainImage}
                    className="h-full object-cover mix-blend-multiply"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="text-sm hover:text-amazon-orange text-amazon-blue line-clamp-2">
                  {product.name}
                </div>
              </Link>

              <div className="text-xs text-gray-500">{product.category}</div>

              <div className="mt-1">
                <span className="text-xs align-top">৳</span>
                <span className="text-xl font-bold">
                  {Number(product.price).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => handleToggleCart(product, isInCart)}
                disabled={!inStock}
                className={`w-full text-sm py-1.5 rounded-md shadow-sm font-medium border transition-colors
                  ${
                    isInCart
                      ? "bg-red-100 border-red-400 text-red-600 hover:bg-red-200"
                      : "bg-amazon-yellow border-amazon-secondary hover:bg-amazon-yellow_hover"
                  }
                  ${
                    !inStock
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                {isInCart
                  ? "Remove from Cart"
                  : inStock
                    ? "Add to Cart"
                    : "Out of Stock"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
