import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://github.com/aarifhsn/"),

  title: {
    default: "gadgetory | Premium Tech Marketplace in Bangladesh",
    template: "%s | gadgetory",
  },

  description:
    "gadgetory is Bangladesh’s premium online marketplace for smartphones, laptops, accessories, and smart gadgets from trusted sellers.",

  keywords: [
    "gadgetory",
    "buy gadgets in Bangladesh",
    "online tech shop bd",
    "smartphones",
    "laptops",
    "electronics store Bangladesh",
  ],

  authors: [{ name: "gadgetory" }],
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
      <body className="bg-[#FAF9F6] text-[#1a1a2e] flex flex-col min-h-screen font-sans antialiased">
        <SessionProvider>
          <CartProvider>
            {modal}
            {children}
            <ToastContainer
              position="bottom-right"
              toastClassName="!bg-white !text-[#1a1a2e] !border !border-[#e8e4dd] !rounded-xl !shadow-lg !font-medium"
              progressClassName="!bg-[#D4A853]"
            />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
