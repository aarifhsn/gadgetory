import { CreditCard, Headphones, ShieldCheck, Truck } from "lucide-react";

export default function ShopCoices() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          icon: Truck,
          title: "Fast Delivery",
          desc: "Get your gadgets delivered within 24–48 hours across Bangladesh",
          stat: "24–48h",
        },
        {
          icon: ShieldCheck,
          title: "100% Authentic",
          desc: "All products are genuine with official warranty and certifications",
          stat: "Verified",
        },
        {
          icon: Headphones,
          title: "24/7 Support",
          desc: "Our customer service team is always ready to help you",
          stat: "Always On",
        },
        {
          icon: CreditCard,
          title: "Secure Payment",
          desc: "Multiple payment options with 100% secure transactions",
          stat: "SSL Safe",
        },
      ].map(({ icon: Icon, title, desc, stat }, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col items-start p-7 bg-white/5 hover:bg-white/8 border border-[#FAF9F6]/10 hover:border-[#D4A853]/30 rounded-2xl transition-all duration-300"
        >
          {/* Index number — top right */}
          <span className="absolute top-5 right-6 text-[11px] font-black tracking-widest text-[#FAF9F6]/15">
            0{idx + 1}
          </span>

          {/* Icon container */}
          <div className="w-12 h-12 rounded-xl bg-[#D4A853]/15 flex items-center justify-center mb-5 group-hover:bg-[#D4A853]/25 transition-colors duration-300">
            <Icon className="w-5 h-5 text-[#D4A853]" />
          </div>

          {/* Stat badge */}
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#D4A853]/70 mb-2">
            {stat}
          </span>

          {/* Title */}
          <h3 className="text-base font-black text-[#FAF9F6] tracking-tight mb-2">
            {title}
          </h3>

          {/* Desc */}
          <p className="text-[12px] text-[#FAF9F6]/40 leading-relaxed font-normal">
            {desc}
          </p>

          {/* Bottom accent line — animates in on hover */}
          <div className="absolute bottom-0 left-7 right-7 h-px bg-[#D4A853]/0 group-hover:bg-[#D4A853]/40 transition-colors duration-500 rounded-full" />
        </div>
      ))}
    </div>
  );
}
