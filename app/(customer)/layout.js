import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import "../globals.css";

export const metadata = {
  title: {
    default: "Shop Gadgets Online",
    template: "%s | gadgetory",
  },

  description:
    "Shop authentic gadgets, smartphones, laptops, and accessories at the best prices in Bangladesh.",

  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "gadgetory",
  },
};

export default function CustomerLayout({ children, modal }) {
  return (
    <CartProvider>
      <div className="bg-[#FAF9F6] text-[#1a1a2e] flex flex-col min-h-screen font-sans antialiased">
        {/* Subtle top accent stripe */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />
        <Navbar />
        <main className="flex-1">
          {modal}
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
