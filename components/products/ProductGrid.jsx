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

  if (products.length === 0) {
    return (
      <div className="flex-1 flex justify-center py-20">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="space-y-4">
        {currentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {products.length > 0 ? indexOfFirstItem + 1 : 0}-
          {Math.min(indexOfLastItem, products.length)} of {products.length}{" "}
          products
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 border border-gray-300 rounded ${
                currentPage === page
                  ? "bg-amazon-yellow font-bold"
                  : "hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
