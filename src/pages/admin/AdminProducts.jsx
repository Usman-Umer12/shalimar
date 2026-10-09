import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  Plus,
  Search,
  Trash2,
  Package,
  Image as ImageIcon,
  X,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

const CATEGORIES = ["All", "Doors", "Kitchens", "Wardrobes"];
const STATUSES = ["All", "active", "inactive"];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: error.message || "Failed to load products.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStatus =
        status === "All" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      setDeleting(true);

      /*
       * Delete product image first if one exists.
       */
      if (deleteProduct.image_url) {
        try {
          const imageUrl = new URL(deleteProduct.image_url);

          const marker = "/storage/v1/object/public/product-images/";

          const markerIndex = imageUrl.pathname.indexOf(marker);

          if (markerIndex !== -1) {
            const filePath = decodeURIComponent(
              imageUrl.pathname.slice(
                markerIndex + marker.length
              )
            );

            if (filePath) {
              await supabase.storage
                .from("product-images")
                .remove([filePath]);
            }
          }
        } catch (imageError) {
          console.warn(
            "Image deletion warning:",
            imageError
          );
        }
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProduct.id);

      if (error) throw error;

      setProducts((current) =>
        current.filter(
          (product) => product.id !== deleteProduct.id
        )
      );

      setDeleteProduct(null);

      setMessage({
        type: "success",
        text: "Product deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: error.message || "Failed to delete product.",
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="min-h-full bg-[#f7f3ee] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#641F2A]">
              Catalog Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#24171a] sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-[#77696c]">
              Manage your website products, pricing and visibility.
            </p>
          </div>

          
        </div>

        {/* =====================================================
            ALERT
        ====================================================== */}
        {message.text && (
          <div
            className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}

            <span>{message.text}</span>
          </div>
        )}

        {/* =====================================================
            FILTER BAR
        ====================================================== */}
        <div className="mb-5 rounded-2xl border border-[#e9dfd9] bg-white p-4 shadow-[0_8px_30px_rgba(70,40,40,0.04)]">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_180px]">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8b8e]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-11 w-full rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] pl-10 pr-4 text-sm text-[#24171a] outline-none transition placeholder:text-[#a6989a] focus:border-[#641F2A] focus:ring-2 focus:ring-[#641F2A]/10"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] px-4 pr-10 text-sm font-medium text-[#45383b] outline-none focus:border-[#641F2A]"
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#806f73]"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] px-4 pr-10 text-sm font-medium text-[#45383b] outline-none focus:border-[#641F2A]"
              >
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Status"
                      : item === "active"
                      ? "Active"
                      : "Inactive"}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#806f73]"
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            SUMMARY
        ====================================================== */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#e9dfd9] bg-white p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#641F2A]/10 text-[#641F2A]">
              <Package size={18} />
            </div>

            <p className="text-xl font-bold text-[#24171a]">
              {products.length}
            </p>

            <p className="text-xs text-[#817376]">
              Total Products
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd9] bg-white p-4">
            <p className="text-xl font-bold text-[#24171a]">
              {
                products.filter(
                  (item) => item.status === "active"
                ).length
              }
            </p>

            <p className="mt-1 text-xs text-[#817376]">
              Active
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd9] bg-white p-4">
            <p className="text-xl font-bold text-[#24171a]">
              {
                products.filter(
                  (item) => item.status === "inactive"
                ).length
              }
            </p>

            <p className="mt-1 text-xs text-[#817376]">
              Inactive
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd9] bg-white p-4">
            <p className="text-xl font-bold text-[#24171a]">
              {filteredProducts.length}
            </p>

            <p className="mt-1 text-xs text-[#817376]">
              Showing
            </p>
          </div>
        </div>

        {/* =====================================================
            PRODUCT TABLE
        ====================================================== */}
        <div className="overflow-hidden rounded-2xl border border-[#e9dfd9] bg-white shadow-[0_8px_30px_rgba(70,40,40,0.04)]">

          {loading ? (
            <div className="p-10">
              <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#eadfdb] border-t-[#641F2A]" />

                <p className="text-sm font-semibold text-[#45383b]">
                  Loading products...
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#641F2A]/10 text-[#641F2A]">
                <Package size={25} />
              </div>

              <h3 className="text-base font-bold text-[#24171a]">
                No products found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-[#817376]">
                {products.length === 0
                  ? "Start adding products to your Shalimar catalog."
                  : "Try changing your search or filters."}
              </p>

              {products.length === 0 && (
                <Link
                  to="/admin/products/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#641F2A] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus size={17} />
                  Add First Product
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#eee5e1] bg-[#fcfaf8]">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#817376]">
                        Product
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#817376]">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#817376]">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#817376]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#817376]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#f0e8e4] last:border-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#eadfdb] bg-[#f6f1ed]">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#9c8d90]">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#24171a]">
                                {product.title}
                              </p>

                              <p className="mt-1 max-w-[330px] truncate text-xs text-[#817376]">
                                {product.description ||
                                  "No description"}
                              </p>

                              {product.subcategory && (
                                <p className="mt-1 text-xs font-medium text-[#641F2A]">
                                  {product.subcategory}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#f5eeea] px-2.5 py-1.5 text-xs font-semibold text-[#641F2A]">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-[#302427]">
                          {product.price !== null &&
                          product.price !== undefined &&
                          product.price !== ""
                            ? `PKR ${Number(
                                product.price
                              ).toLocaleString()}`
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          {product.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5dcd7] px-3 text-xs font-bold text-[#45383b] transition hover:border-[#641F2A] hover:text-[#641F2A]"
                            >
                              <Edit3 size={15} />
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteProduct(product)
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-100 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-[#eee5e1] lg:hidden">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 sm:p-5"
                  >
                    <div className="flex gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#eadfdb] bg-[#f6f1ed]">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#9c8d90]">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-[#24171a]">
                              {product.title}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#817376]">
                              {product.description ||
                                "No description"}
                            </p>
                          </div>

                          {product.status === "active" ? (
                            <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-[#f5eeea] px-2 py-1 text-[10px] font-bold text-[#641F2A]">
                            {product.category}
                          </span>

                          {product.subcategory && (
                            <span className="text-[10px] font-medium text-[#817376]">
                              {product.subcategory}
                            </span>
                          )}

                          <span className="text-xs font-bold text-[#302427]">
                            {product.price
                              ? `PKR ${Number(
                                  product.price
                                ).toLocaleString()}`
                              : "Price not set"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e5dcd7] text-xs font-bold text-[#45383b]"
                      >
                        <Edit3 size={15} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteProduct(product)
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-100 text-xs font-bold text-red-600"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}
      {deleteProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Trash2 size={21} />
                </div>

                <h2 className="text-lg font-bold text-[#24171a]">
                  Delete Product?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#817376]">
                  Are you sure you want to delete{" "}
                  <strong className="text-[#45383b]">
                    {deleteProduct.title}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                disabled={deleting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#817376] hover:bg-[#f5efec]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                disabled={deleting}
                className="h-11 rounded-xl border border-[#e5dcd7] text-sm font-bold text-[#45383b]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-11 rounded-xl bg-red-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;