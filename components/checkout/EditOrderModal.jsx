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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setEditMode("products")}
            className={`flex-1 py-3 text-sm font-medium ${
              editMode === "products"
                ? "border-b-2 border-amazon-orange text-amazon-orange"
                : "text-gray-600"
            }`}
          >
            Products & Quantity
          </button>
          <button
            onClick={() => setEditMode("address")}
            className={`flex-1 py-3 text-sm font-medium ${
              editMode === "address"
                ? "border-b-2 border-amazon-orange text-amazon-orange"
                : "text-gray-600"
            }`}
          >
            Delivery Address
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {editMode === "products" ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border rounded">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-amazon-orange font-bold text-sm">
                      ৳{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs">Quantity:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(item.id, Number(e.target.value))
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={address.name || ""}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Address</label>
                <input
                  type="text"
                  value={address.address || ""}
                  onChange={(e) =>
                    setAddress({ ...address, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={address.city || ""}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={address.postalCode || ""}
                    onChange={(e) =>
                      setAddress({ ...address, postalCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Phone</label>
                <input
                  type="tel"
                  value={address.phone || ""}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={address.email || ""}
                  onChange={(e) =>
                    setAddress({ ...address, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={editMode === "address" ? handleSaveAddress : onClose}
            className="flex-1 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover rounded font-bold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
