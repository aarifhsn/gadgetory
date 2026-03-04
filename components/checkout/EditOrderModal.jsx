"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function EditOrderModal({
  cart,
  shippingAddress,
  onUpdateQuantity,
  onUpdateAddress,
  onClose,
}) {
  const [editMode, setEditMode] = useState("products"); // "products" or "address"
  const [address, setAddress] = useState(shippingAddress || {});

  const handleSaveAddress = () => {
    onUpdateAddress(address);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a2e]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl shadow-[#1a1a2e]/20 max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[#E8E4DD]">
        {/* Gold top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4A853] via-[#c9973d] to-[#e8c87a]" />

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DD]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-[#D4A853]" />
            <h2 className="text-base font-black text-[#1a1a2e] tracking-tight">
              Edit Order Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1a1a2e]/25 hover:text-[#1a1a2e] hover:bg-[#F5F3EF] transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── TABS ────────────────────────────────────────────────── */}
        <div className="flex gap-1 p-3 bg-[#FAF9F6] border-b border-[#E8E4DD]">
          {[
            { value: "products", label: "Products & Quantity" },
            { value: "address", label: "Delivery Address" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setEditMode(value)}
              className={`flex-1 py-2.5 text-xs font-black tracking-wide rounded-xl transition-all duration-200 ${
                editMode === value
                  ? "bg-white text-[#1a1a2e] shadow-sm border border-[#E8E4DD]"
                  : "text-[#1a1a2e]/35 hover:text-[#1a1a2e]/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── CONTENT ─────────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto max-h-[55vh]">
          {/* Products tab */}
          {editMode === "products" && (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-[#FAF9F6] border border-[#E8E4DD] rounded-2xl hover:border-[#D4A853]/30 transition-colors duration-200"
                >
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#E8E4DD] overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[#1a1a2e] line-clamp-2 leading-snug mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs font-black text-[#1a1a2e] mb-3">
                      ৳{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-[#1a1a2e]/35 uppercase tracking-wide">
                        Qty
                      </span>
                      <div className="flex items-center gap-2 bg-white border border-[#E8E4DD] rounded-xl px-3 py-1.5">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-4 h-4 flex items-center justify-center text-[#1a1a2e]/40 hover:text-[#1a1a2e] disabled:opacity-20 font-black text-sm"
                        >
                          −
                        </button>
                        <span className="text-xs font-black text-[#1a1a2e] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-4 h-4 flex items-center justify-center text-[#1a1a2e]/40 hover:text-[#1a1a2e] font-black text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Address tab */}
          {editMode === "address" && (
            <div className="space-y-4">
              {[
                {
                  label: "Full Name",
                  key: "name",
                  type: "text",
                  placeholder: "John Doe",
                },
                {
                  label: "Street Address",
                  key: "address",
                  type: "text",
                  placeholder: "123 Main St",
                },
                {
                  label: "Phone",
                  key: "phone",
                  type: "tel",
                  placeholder: "+880 1712 345678",
                },
                {
                  label: "Email",
                  key: "email",
                  type: "email",
                  placeholder: "you@example.com",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={address[key] || ""}
                    onChange={(e) =>
                      setAddress({ ...address, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "City", key: "city", placeholder: "Dhaka" },
                  {
                    label: "Postal Code",
                    key: "postalCode",
                    placeholder: "1212",
                  },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-[#1a1a2e]/60 mb-1.5 tracking-wide">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={address[key] || ""}
                      onChange={(e) =>
                        setAddress({ ...address, [key]: e.target.value })
                      }
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DD] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 outline-none focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/10 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#E8E4DD] bg-[#FAF9F6]">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-[#E8E4DD] hover:border-[#1a1a2e]/20 text-xs font-bold text-[#1a1a2e]/50 hover:text-[#1a1a2e] rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={editMode === "address" ? handleSaveAddress : onClose}
            className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#D4A853] text-white hover:text-[#1a1a2e] text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-md shadow-[#1a1a2e]/10 transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
