import { CreditCard, Headphones, ShieldCheck, Truck } from "lucide-react";

export default function ShopCoices() {
  return (
    <div className="bg-white py-12 mt-8">
      <div className="max-w-[1500px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Shop with Gadgets BD?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-amazon" />
            </div>
            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Get your gadgets delivered within 24-48 hours across Bangladesh
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-amazon" />
            </div>
            <h3 className="font-bold text-lg mb-2">100% Authentic</h3>
            <p className="text-sm text-gray-600">
              All products are genuine with official warranty and certifications
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-amazon" />
            </div>
            <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">
              Our customer service team is always ready to help you
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-amazon" />
            </div>
            <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-600">
              Multiple payment options with 100% secure transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
