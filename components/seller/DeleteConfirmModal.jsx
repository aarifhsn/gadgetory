"use client";

import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Confirm Delete
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this product?
          </p>
          <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
            {productName}
          </p>
          <p className="text-sm text-red-600 mt-3 font-medium">
            ⚠️ This action cannot be undone!
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
