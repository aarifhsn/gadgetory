"use client";

export default function Footer() {
  const date = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#1a1a2e] text-[#FAF9F6] mt-auto">
      {/* ── BACK TO TOP ───────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleBackToTop}
        className="w-full py-3.5 bg-[#1f1f38] hover:bg-[#252545] border-b border-[#FAF9F6]/5 transition-colors duration-200 group"
      >
        <span className="flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase text-[#FAF9F6]/30 group-hover:text-[#D4A853] transition-colors duration-200">
          <svg
            className="w-3 h-3 rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          Back to Top
        </span>
      </button>

      {/* ── BRAND STRIP ───────────────────────────────────────────── */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-16 pt-14 pb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#FAF9F6]/8">
        <div>
          <span className="text-2xl font-black tracking-tight">
            gadget<span className="text-[#D4A853]">ory</span>
          </span>
          <p className="text-xs text-[#FAF9F6]/30 mt-1.5 max-w-xs leading-relaxed">
            Bangladesh's premium online marketplace for authentic tech, gadgets,
            and accessories.
          </p>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {[
            {
              label: "Facebook",
              path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
            },
            {
              label: "Twitter",
              path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
            },
            {
              label: "Instagram",
              path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z",
            },
          ].map(({ label, path }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="w-9 h-9 rounded-xl bg-[#FAF9F6]/5 hover:bg-[#D4A853]/15 border border-[#FAF9F6]/8 hover:border-[#D4A853]/30 flex items-center justify-center transition-all duration-300 group"
            >
              <svg
                className="w-4 h-4 text-[#FAF9F6]/35 group-hover:text-[#D4A853] transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={path} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── MAIN FOOTER GRID ──────────────────────────────────────── */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-16 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        {[
          {
            heading: "Get to Know Us",
            links: [
              { label: "About gadgetory", href: "/about" },
              { label: "Careers", href: "#" },
              { label: "Our Top Brands", href: "/shops" },
            ],
          },
          {
            heading: "Make Money with Us",
            links: [
              { label: "Sell on gadgetory", href: "/register" },
              { label: "Supply to gadgetory", href: "#" },
              { label: "Become an Affiliate", href: "#" },
            ],
          },
          {
            heading: "Payment Products",
            links: [
              { label: "gadgetory Business Card", href: "#" },
              { label: "Shop with Points", href: "#" },
              { label: "Reload Your Balance", href: "#" },
            ],
          },
          {
            heading: "Let Us Help You",
            links: [
              { label: "Your Account", href: "/account" },
              { label: "Your Orders", href: "/orders" },
              { label: "Shipping & Policies", href: "#" },
              { label: "Returns & Replacements", href: "#" },
              { label: "Help Center", href: "#" },
            ],
          },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#D4A853] mb-5">
              {heading}
            </h3>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-[#FAF9F6]/40 hover:text-[#FAF9F6] transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────── */}
      <div className="border-t border-[#FAF9F6]/5 bg-[#141428]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#FAF9F6]/20 tracking-wide text-center">
            &copy; {date} gadgetory · Premium Tech Marketplace · All rights
            reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] text-[#FAF9F6]/25 hover:text-[#D4A853] tracking-wide transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
