"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || "guest";

  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  //  LOAD cart from localStorage on mount OR when user changes
  useEffect(() => {
    // Wait for session to be ready
    if (status === "loading") return;

    const cartKey = `cart_${userId}`;
    const addressKey = `shippingAddress_${userId}`;

    // Load cart
    const savedCart = localStorage.getItem(cartKey);
    const savedAddress = localStorage.getItem(addressKey);

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart:", error);
        setCart([]);
      }
    } else {
      setCart([]);
    }

    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress));
      } catch (error) {
        console.error("Failed to parse address:", error);
        setShippingAddress(null);
      }
    } else {
      setShippingAddress(null);
    }

    // 🔥 IMPORTANT: Mark as hydrated
    setIsHydrated(true);
  }, [userId, status]);

  // 🔥 Transfer guest cart to user cart on login
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const guestCartKey = "cart_guest";
      const userCartKey = `cart_${session.user.id}`;

      const guestCart = localStorage.getItem(guestCartKey);
      const userCart = localStorage.getItem(userCartKey);

      // If guest has items but user cart is empty, transfer
      if (guestCart && !userCart) {
        localStorage.setItem(userCartKey, guestCart);
        localStorage.removeItem(guestCartKey);

        // Reload the cart
        try {
          setCart(JSON.parse(guestCart));
        } catch (error) {
          console.error("Failed to transfer guest cart:", error);
        }
      }
    }
  }, [status, session?.user?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      const cartKey = `cart_${userId}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, isHydrated, userId]);

  // Save address to localStorage
  useEffect(() => {
    if (isHydrated) {
      const addressKey = `shippingAddress_${userId}`;
      if (shippingAddress) {
        localStorage.setItem(addressKey, JSON.stringify(shippingAddress));
      } else {
        localStorage.removeItem(addressKey);
      }
    }
  }, [shippingAddress, isHydrated, userId]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prevCart, { ...product, quantity }];
    });
  };

  // const updateQuantity = (productId, quantity) => {
  //   setCart((prevCart) =>
  //     prevCart.map((item) =>
  //       item.id === productId ? { ...item, quantity } : item,
  //     ),
  //   );
  // };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    const cartKey = `cart_${userId}`;
    localStorage.removeItem(cartKey);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const updateUnitsSold = async (productId, quantity) => {
    try {
      await fetch("/api/products/update-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (error) {
      console.error("Failed to update units sold:", error);
    }
  };

  // Don't render children until hydrated to prevent mismatch
  if (!isHydrated) {
    return null; // or return a loading skeleton
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        shippingAddress,
        setShippingAddress,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
        updateUnitsSold,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
