import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://github.com/aarifhsn/"),

  title: {
    default: "Gadgets BD | Premium Tech Marketplace in Bangladesh",
    template: "%s | Gadgets BD",
  },

  description:
    "Gadgets BD is Bangladesh’s premium online marketplace for smartphones, laptops, accessories, and smart gadgets from trusted sellers.",

  keywords: [
    "Gadgets BD",
    "buy gadgets in Bangladesh",
    "online tech shop bd",
    "smartphones",
    "laptops",
    "electronics store Bangladesh",
  ],

  authors: [{ name: "Gadgets BD" }],
  creator: "Arif Hassan",
  publisher: "Arif Hassan",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <body className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
        <SessionProvider>
          <CartProvider>
            {modal}
            {children}
            <ToastContainer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
