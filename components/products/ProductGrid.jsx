"use client";

import { useState } from "react";
import ProductCard from "../shop/ProductCard";

export default function ProductGrid({ products = [] }) {
  // Calculate pagination
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Empty state */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#F5F3EF] border border-[#E8E4DD] flex items-center justify-center mb-5">
            <svg
              className="w-9 h-9 text-[#1a1a2e]/15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-black text-[#1a1a2e] tracking-tight mb-2">
            No products found
          </h3>
          <p className="text-sm text-[#1a1a2e]/35 max-w-xs">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Product list */}
      {products.length > 0 && (
        <>
          <div className="space-y-4">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* ── PAGINATION ──────────────────────────────────────── */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#1a1a2e]/35 font-medium">
              Showing{" "}
              <span className="font-bold text-[#1a1a2e]/55">
                {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, products.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#1a1a2e]/55">
                {products.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/50 hover:text-[#1a1a2e] rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all duration-200 ${
                    currentPage === page
                      ? "bg-[#1a1a2e] text-white shadow-md shadow-[#1a1a2e]/10"
                      : "bg-white border border-[#E8E4DD] text-[#1a1a2e]/40 hover:border-[#D4A853]/40 hover:text-[#1a1a2e]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-[#E8E4DD] hover:border-[#D4A853]/40 text-[#1a1a2e]/50 hover:text-[#1a1a2e] rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
