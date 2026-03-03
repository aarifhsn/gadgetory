"use client";

import { useCart } from "@/context/CartContext";
import { CheckCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getItemCount } =
    useCart();
  const router = useRouter();

  const handleProceedToCheckout = () => {
    router.push("/checkout/address");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      removeFromCart(productId);
    }
  };

  // Calculate service fee
  const serviceFee = cart.reduce((fee, item) => {
    if (item.category === "laptops") return fee + 200;
    if (item.category === "mobiles") return fee + 100;
    return fee;
  }, 0);

  const subtotal = getCartTotal();
  const itemCount = getItemCount();
  const isFreeShipping = subtotal >= 50000;

  // Empty cart state
  if (cart.length === 0) {
    return (
      <main className="max-w-[1500px] mx-auto w-full p-4 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add items to your cart to see them here
          </p>
          <Link
            href="/products"
            className="inline-block bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary px-8 py-2 rounded-md text-sm font-bold"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1500px] mx-auto w-full p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cart Items */}
        <div className="flex-1">
          {/* Cart Header */}
          <div className="bg-white p-4 mb-4 border-b border-gray-300">
            <h1 className="text-2xl font-normal mb-2">Shopping Cart</h1>
            <div className="text-sm text-gray-600">
              <Link href="/" className="text-amazon-blue hover:underline">
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border-b border-gray-300 flex gap-4 hover:bg-gray-50"
              >
                {/* Product Image */}
                <div className="w-32 h-32 flex-shrink-0 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded border border-gray-200"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-medium text-base mb-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-amazon-blue hover:text-amazon-orange hover:underline"
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-green-700 font-medium">
                    {getItemCount ? "In Stock" : "Out of Stock"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Sold by: {item.shopInfo?.name || "Official Store"}
                  </p>
                  {isFreeShipping && (
                    <p className="text-xs text-gray-600">
                      Eligible for FREE Shipping
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600">Qty:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                        className="border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-amazon-blue"
                      >
                        {[...Array(Math.min(item.stock || 10, 10))].map(
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <span className="text-gray-300">|</span>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-amazon-orange">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-600 mt-1">
                      ৳{item.price.toLocaleString()} each
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Subtotal */}
            <div className="p-4 text-right">
              <p className="text-lg">
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):
                <span className="font-bold text-amazon-orange ml-2">
                  ৳{subtotal.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white p-4 border border-gray-300 rounded sticky top-4">
            {/* Free Shipping Badge */}
            {isFreeShipping ? (
              <div className="mb-4">
                <p className="text-sm mb-2">
                  <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                  <span className="text-green-700 font-medium">
                    Your order qualifies for FREE Shipping!
                  </span>
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm mb-2 text-gray-600">
                  Add ৳{(50000 - subtotal).toLocaleString()} more for FREE
                  shipping
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((subtotal / 50000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="mb-4">
              <p className="text-lg mb-2">
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):
                <span className="font-bold text-amazon-orange ml-2">
                  ৳{subtotal.toLocaleString()}
                </span>
              </p>
              <div className="flex items-start gap-2 text-xs">
                <input type="checkbox" id="gift" className="mt-0.5" />
                <label htmlFor="gift" className="text-gray-700">
                  This order contains a gift
                </label>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors mb-2"
            >
              Proceed to Checkout
            </button>

            {/* Security Info */}
            <div className="text-xs text-gray-600 mt-4 space-y-2">
              <p>
                <ShieldCheck className="w-3 h-3 inline mr-1" />
                Secure transaction
              </p>
              <p>
                <Truck className="w-3 h-3 inline mr-1" />
                Ships from Gadgets BD
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-bold text-sm mb-2">Price Details</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  {isFreeShipping ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    <span>৳100</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-amazon-orange pt-2 border-t border-gray-200">
                  <span>Estimated Total:</span>
                  <span>
                    ৳
                    {(
                      subtotal +
                      (isFreeShipping ? 0 : 100) +
                      serviceFee
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
