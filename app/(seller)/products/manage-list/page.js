"use client";

import {
  deleteProduct,
  getSellerProducts,
  toggleProductStatus,
} from "@/app/actions/productManagementActions";
import DeleteConfirmModal from "@/components/seller/DeleteConfirmModal";
import EditProductModal from "@/components/seller/EditProductModal";
import brands from "@/data/brands";
import categories from "@/data/categories";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ManageListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: "All",
    category: "All Categories",
    brand: "All Brands",
  });

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    const result = await getSellerProducts();
    if (result.success) {
      setProducts(result.data);
    } else {
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const matchesStatus =
      filters.status === "All" || product.status === filters.status;
    const matchesCategory =
      filters.category === "All Categories" ||
      product.category === filters.category;
    const matchesBrand =
      filters.brand === "All Brands" || product.brand === filters.brand;

    return matchesStatus && matchesCategory && matchesBrand;
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when products change
  }, [products.length]);

  // Handle edit button click
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setDeleteLoading(true);
    const result = await deleteProduct(selectedProduct._id);

    if (result.success) {
      toast.success("Product deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      loadProducts(); // Reload products
    } else {
      toast.error(result.error || "Failed to delete product");
    }
    setDeleteLoading(false);
  };

  // Handle unpublish/publish toggle
  const handleToggleStatus = async (product) => {
    const currentStatus = product.status || "Active";

    setToggleLoading(product._id);
    const result = await toggleProductStatus(product._id, currentStatus);

    if (result.success) {
      const newStatus = result.data.newStatus;

      // Show correct message based on new status
      toast.success(
        newStatus === "Active"
          ? "Product published successfully!"
          : "Product unpublished successfully!",
      );

      loadProducts(); // Reload products
    } else {
      toast.error(result.error || "Failed to update product status");
    }
    setToggleLoading(null);
  };

  // Handle modal close
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    loadProducts(); // ✅ This reloads from database
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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

  const handleSelectAll = () => {
    setSelectedProducts(currentProducts.map((product) => product._id));
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-28">
        <div className="w-10 h-10 rounded-full border-2 border-[#2D7D6F] border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-[#1a2e28]/35 font-medium">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <main className="w-full px-4 md:px-8 py-10">
      <div className="max-w-[1500px] mx-auto">
        {/* ── PAGE HEADER ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 rounded-full bg-[#2D7D6F]" />
              <h1 className="text-2xl font-black text-[#1a2e28] tracking-tight">
                Manage Inventory
              </h1>
            </div>
            <p className="text-sm text-[#1a2e28]/35 pl-4">
              <span className="font-bold text-[#1a2e28]/55">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"} listed
            </p>
          </div>
          <Link
            href="/products/create"
            className="flex items-center gap-2 px-5 py-3 bg-[#2D7D6F] hover:bg-[#1a2e28] text-white text-xs font-black tracking-[0.2em] uppercase rounded-xl shadow-md shadow-[#2D7D6F]/20 transition-all duration-300"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Product
          </Link>
        </div>

        {/* ── FILTERS ─────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl px-5 py-4 mb-6 shadow-sm flex flex-wrap items-center gap-4">
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#1a2e28]/30">
            Filter
          </span>

          {[
            {
              key: "status",
              options: [
                { label: "All Status", value: "All" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ],
            },
            {
              key: "category",
              options: [
                { label: "All Categories", value: "All Categories" },
                ...categories.map((c) => ({ label: c.name, value: c.slug })),
              ],
            },
            {
              key: "brand",
              options: [
                { label: "All Brands", value: "All Brands" },
                ...brands.map((b) => ({ label: b, value: b })),
              ],
            },
          ].map(({ key, options }) => (
            <div key={key} className="relative">
              <select
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="appearance-none text-xs font-bold text-[#1a2e28] bg-[#F0F4F3] border border-[#d0dbd9] rounded-xl px-3.5 py-2.5 pr-8 outline-none focus:border-[#2D7D6F] focus:ring-2 focus:ring-[#2D7D6F]/10 transition-all cursor-pointer"
              >
                {options.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <svg
                className="w-3 h-3 text-[#1a2e28]/30 rotate-90 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))}

          {(filters.status !== "All" ||
            filters.category !== "All Categories" ||
            filters.brand !== "All Brands") && (
            <button
              onClick={() =>
                setFilters({
                  status: "All",
                  category: "All Categories",
                  brand: "All Brands",
                })
              }
              className="text-[11px] font-bold text-[#2D7D6F] hover:underline underline-offset-4 ml-1"
            >
              Clear filters →
            </button>
          )}
        </div>

        {/* ── TABLE ───────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F4F3] border-b border-[#E8E4DD]">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      className="accent-[#2D7D6F] w-3.5 h-3.5 rounded"
                    />
                  </th>
                  {[
                    "Status",
                    "Image",
                    "Product",
                    "Category",
                    "Brand",
                    "Price (৳)",
                    "Stock",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`p-4 text-[9px] font-black tracking-[0.25em] uppercase text-[#1a2e28]/40 ${h === "Actions" ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3EF]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-[#F0F4F3] border border-[#d0dbd9] flex items-center justify-center">
                          <svg
                            className="w-7 h-7 text-[#1a2e28]/15"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-[#1a2e28]/40">
                          {products.length === 0
                            ? "No products yet"
                            : "No products match your filters"}
                        </p>
                        {products.length === 0 && (
                          <Link
                            href="/products/create"
                            className="text-xs font-bold text-[#2D7D6F] hover:underline underline-offset-4"
                          >
                            Add your first product →
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => {
                    const productStatus = product.status || "Active";
                    const isActive = productStatus === "Active";

                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-[#FAFAF9] transition-colors duration-150"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="accent-[#2D7D6F] w-3.5 h-3.5 rounded"
                          />
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black rounded-full ${
                              isActive
                                ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                                : "bg-[#F0F4F3] border border-[#d0dbd9] text-[#1a2e28]/40"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-[#1a2e28]/20"}`}
                            />
                            {productStatus}
                          </span>
                        </td>

                        {/* Image */}
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-xl bg-[#F0F4F3] border border-[#d0dbd9] overflow-hidden flex items-center justify-center">
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        </td>

                        {/* Product name + SKU */}
                        <td className="p-4 max-w-[220px]">
                          <p className="text-xs font-bold text-[#1a2e28] line-clamp-2 leading-snug mb-0.5">
                            {product.name}
                          </p>
                          {product.sku && (
                            <p className="text-[10px] text-[#1a2e28]/30 font-medium">
                              SKU: {product.sku}
                            </p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="text-xs text-[#1a2e28]/50 font-medium capitalize">
                            {product.category}
                          </span>
                        </td>

                        {/* Brand */}
                        <td className="p-4">
                          <span className="text-xs text-[#1a2e28]/50 font-medium">
                            {product.brand}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4">
                          <span className="text-sm font-black text-[#1a2e28]">
                            {Number(product.price).toLocaleString()}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="p-4">
                          <span
                            className={`text-xs font-black ${product.stockQuantity > 0 ? "text-emerald-600" : "text-rose-500"}`}
                          >
                            {product.stockQuantity}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(product)}
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1a2e28]/30 hover:text-[#2D7D6F] hover:bg-[#F0F4F3] transition-all duration-200"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(product)}
                              disabled={toggleLoading === product._id}
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1a2e28]/30 hover:text-[#2D7D6F] hover:bg-[#F0F4F3] transition-all duration-200 disabled:opacity-40"
                              title={isActive ? "Unpublish" : "Publish"}
                            >
                              {toggleLoading === product._id ? (
                                <div className="w-3.5 h-3.5 border-2 border-[#2D7D6F] border-t-transparent rounded-full animate-spin" />
                              ) : isActive ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1a2e28]/30 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PAGINATION ──────────────────────────────────────────── */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#1a2e28]/35 font-medium">
              Showing{" "}
              <span className="font-bold text-[#1a2e28]/55">
                {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#1a2e28]/55">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-[#E8E4DD] hover:border-[#2D7D6F]/40 text-[#1a2e28]/40 hover:text-[#1a2e28] rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all duration-200 ${
                    currentPage === page
                      ? "bg-[#2D7D6F] text-white shadow-md shadow-[#2D7D6F]/20"
                      : "bg-white border border-[#E8E4DD] text-[#1a2e28]/40 hover:border-[#2D7D6F]/40 hover:text-[#1a2e28]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-[#E8E4DD] hover:border-[#2D7D6F]/40 text-[#1a2e28]/40 hover:text-[#1a2e28] rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ──────────────────────────────────────────────── */}
      <EditProductModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleUpdateSuccess}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        productName={selectedProduct?.name}
        loading={deleteLoading}
      />
    </main>
  );
}
