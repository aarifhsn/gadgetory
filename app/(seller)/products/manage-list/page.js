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

  if (loading) {
    return (
      <div className="w-full p-6 text-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <main className="w-full p-6">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-normal">Manage Inventory</h1>
          <Link
            href="/products/create"
            className="bg-amazon-yellow hover:bg-amazon-yellow_hover px-6 py-2 rounded-md text-sm font-bold shadow-sm border border-amazon-secondary transition-colors"
          >
            Add a Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-300 rounded shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold">Status:</span>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border border-gray-300 py-1 px-2 rounded outline-none focus:ring-1 focus:ring-amazon-blue"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            <span className="font-bold">Category:</span>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="border border-gray-300 py-1 px-2 rounded outline-none focus:ring-1 focus:ring-amazon-blue"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            <span className="font-bold">Brand:</span>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="border border-gray-300 py-1 px-2 rounded outline-none focus:ring-1 focus:ring-amazon-blue"
            >
              <option value="All Brands">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters Indicator */}
          {(filters.status !== "All" ||
            filters.category !== "All Categories" ||
            filters.brand !== "All Brands") && (
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
              <button
                onClick={() =>
                  setFilters({
                    status: "All",
                    category: "All Categories",
                    brand: "All Brands",
                  })
                }
                className="text-xs text-amazon-blue hover:text-amazon-orange hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 text-center w-12">
                  <input type="checkbox" />
                </th>
                <th className="p-3">Status</th>
                <th className="p-3">Image</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Price (৳)</th>
                <th className="p-3">Available</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    {products.length === 0
                      ? 'No products found. Click "Add a Product" to create your first listing.'
                      : "No products match your filters. Try adjusting your search criteria."}
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => {
                  const productStatus = product.status || "Active";
                  const isActive = productStatus === "Active";

                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="p-3 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {productStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded border border-gray-200"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          SKU: {product.sku}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{product.category}</td>
                      <td className="p-3 text-gray-600">{product.brand}</td>
                      <td className="p-3 font-bold">
                        {product.price.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="text-green-600 font-bold">
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 text-amazon-blue" />
                          </button>

                          {/* Toggle Publish/Unpublish Button */}
                          <button
                            onClick={() => handleToggleStatus(product)}
                            disabled={toggleLoading === product._id}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                            title={isActive ? "Unpublish" : "Publish"}
                          >
                            {toggleLoading === product._id ? (
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : isActive ? (
                              <EyeOff className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-green-600" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}-
            {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
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

      {/* Edit Modal */}
      <EditProductModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleUpdateSuccess}
      />

      {/* Delete Confirmation Modal */}
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
