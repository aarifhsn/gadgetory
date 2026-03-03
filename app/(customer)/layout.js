import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import "../globals.css";

export const metadata = {
  title: {
    default: "Shop Gadgets Online",
    template: "%s | Gadgets BD",
  },

  description:
    "Shop authentic gadgets, smartphones, laptops, and accessories at the best prices in Bangladesh.",

  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "Gadgets BD",
  },
};

export default function CustomerLayout({ children, modal }) {
  return (
    <CartProvider>
      <div className="bg-white text-amazon-text flex flex-col min-h-screen">
        <Navbar />
        {modal}
        {children}
        <Footer />
      </div>
    </CartProvider>
  );
}
