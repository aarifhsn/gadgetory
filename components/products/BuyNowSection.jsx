"use client";

import { useCart } from "@/context/CartContext";
import { Package, ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function BuyNowSection({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const inStock = product.stockQuantity > 0;

  // check if product is in cart
  const isInCart = cart.some((item) => item.id === product._id);

  const cartProduct = {
    id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.mainImage,
    price: product.price,
    category: product.category,
    shopInfo: { name: product.seller?.shopName || "Official Store" },
    stock: product.stockQuantity,
  };

  const handleToggleCart = (product, isInCart) => {
    if (isInCart) {
      removeFromCart(product._id.toString());
      toast.success("Removed from cart 🗑️", {
        icon: "❌",
      });
    } else {
      addToCart(cartProduct, quantity);
      toast.success(`Added ${quantity} item(s) to cart 🛒`, {
        icon: "✅",
      });
    }
  };

  const handleBuyNow = () => {
    if (!isInCart) {
      addToCart(cartProduct, quantity);
    }
    router.push("/checkout/address");
  };

  const deliveryFee = Number(product.price) >= 5000 ? 0 : 100;

  return (
    <div className="lg:col-span-3">
      <div className="box p-4 border border-gray-200 rounded shadow-sm">
        <p className="text-2xl font-bold text-amazon-orange mb-2">
          ৳{(Number(product.price) * quantity).toLocaleString()}
        </p>
        <p className="text-xs text-gray-600 mb-4">
          Delivery Charge: ৳{deliveryFee}
          <span className="block text-slate-400">
            Purchase more than ৳5000 to get free delivery
          </span>
        </p>

        <p className="text-sm mb-4">
          {inStock ? (
            <span className="text-green-600 font-bold">In Stock</span>
          ) : (
            <span className="text-red-600 font-bold">Out of Stock</span>
          )}
        </p>

        {/* Quantity */}

        <div className="mb-4">
          <label className="text-sm font-bold block mb-2">Quantity:</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={!inStock}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-20 disabled:opacity-50"
          >
            {[...Array(Math.min(product.stockQuantity || 0, 10))].map(
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ),
            )}
          </select>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleToggleCart(product, isInCart)}
            disabled={!inStock}
            className={`w-full py-2 rounded-md text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isInCart
                ? "bg-red-100 border-red-400 text-red-600 hover:bg-red-200"
                : "bg-amazon-yellow border-amazon-secondary hover:bg-amazon-yellow_hover"
            }`}
          >
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!inStock}
            className="w-full py-2 btn-primary rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <p className="mb-1">
              <ShieldCheck className="w-4 h-4 inline mr-1" />
              Secure transaction
            </p>
            <p className="mb-1">
              <Truck className="w-4 h-4 inline mr-1" />
              Ships from Gadgets BD
            </p>
            <p>
              <Package className="w-4 h-4 inline mr-1" />
              Sold by {product.seller?.shopName || "Official Store"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
