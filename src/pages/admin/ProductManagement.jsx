import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Edit3,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ProductManagement = ({
  pageTitle,
  pageDescription,
  category,
  singularName,
  typeLabel,
  typeOptions = [],
}) => {
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    subcategory: typeOptions[0] || "",
    delivery_text: "Delivery All Over Pakistan",
    status: "active",
    featured: false,
  });

  /* ============================================================
     LOAD PRODUCTS
  ============================================================ */

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error(fetchError);
      setError(
        fetchError.message || "Unable to load products."
      );
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  /* ============================================================
     FILTER
  ============================================================ */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        product.status === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        product.subcategory === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    products,
    search,
    statusFilter,
    typeFilter,
  ]);

  /* ============================================================
     RESET FORM
  ============================================================ */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      subcategory: typeOptions[0] || "",
      delivery_text: "Delivery All Over Pakistan",
      status: "active",
      featured: false,
    });

    setImageFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ============================================================
     CREATE MODAL
  ============================================================ */

  const openCreateModal = () => {
    setEditingProduct(null);
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /* ============================================================
     EDIT MODAL
  ============================================================ */

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      description: product.description || "",
      price:
        product.price !== null &&
        product.price !== undefined
          ? String(product.price)
          : "",
      subcategory:
        product.subcategory ||
        typeOptions[0] ||
        "",
      delivery_text:
        product.delivery_text ||
        "Delivery All Over Pakistan",
      status:
        product.status || "active",
      featured: Boolean(product.featured),
    });

    setImageFile(null);
    setPreview(product.image_url || "");

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /* ============================================================
     CLOSE MODAL
  ============================================================ */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    resetForm();
    setError("");
  };

  /* ============================================================
     FORM CHANGE
  ============================================================ */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ============================================================
     IMAGE CHANGE
  ============================================================ */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG or WebP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Image size must be 5 MB or less."
      );

      event.target.value = "";
      return;
    }

    setImageFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const removeImage = () => {
    setImageFile(null);

    if (editingProduct?.image_url) {
      setPreview(editingProduct.image_url);
    } else {
      setPreview("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ============================================================
     UPLOAD IMAGE
  ============================================================ */

  const createSafeFileName = (file) => {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "webp";

    const random =
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    return `${random}.${extension}`;
  };

  const uploadImage = async (file) => {
    const fileName = createSafeFileName(file);
    const filePath = `products/${fileName}`;

    const {
      data,
      error: uploadError,
    } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicData,
    } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return {
      url: publicData.publicUrl,
      path: data.path,
    };
  };

  /* ============================================================
     DELETE STORAGE IMAGE
  ============================================================ */

  const deleteStorageImage = async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const marker =
        "/storage/v1/object/public/product-images/";

      const index = imageUrl.indexOf(marker);

      if (index === -1) return;

      const path = imageUrl.slice(
        index + marker.length
      );

      if (!path) return;

      await supabase.storage
        .from("product-images")
        .remove([path]);
    } catch (storageError) {
      console.warn(
        "Old image could not be removed:",
        storageError
      );
    }
  };

  /* ============================================================
     CREATE / UPDATE
  ============================================================ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.title.trim()) {
        throw new Error(
          "Product title is required."
        );
      }

      if (!form.subcategory) {
        throw new Error(
          `${typeLabel} is required.`
        );
      }

      if (
        form.price !== "" &&
        Number(form.price) < 0
      ) {
        throw new Error(
          "Price cannot be negative."
        );
      }

      let imageUrl =
        editingProduct?.image_url || null;

      let newUploadedImagePath = null;

      if (imageFile) {
        const uploaded =
          await uploadImage(imageFile);

        imageUrl = uploaded.url;
        newUploadedImagePath =
          uploaded.path;
      }

      const payload = {
        title: form.title.trim(),

        description:
          form.description.trim() || null,

        price:
          form.price === ""
            ? null
            : Number(form.price),

        category,

        subcategory:
          form.subcategory,

        image_url: imageUrl,

        delivery_text:
          form.delivery_text.trim() ||
          "Delivery All Over Pakistan",

        status: form.status,

        featured: form.featured,

        updated_at:
          new Date().toISOString(),
      };

      /* UPDATE */

      if (editingProduct) {
        const {
          error: updateError,
        } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);

        if (updateError) {
          if (newUploadedImagePath) {
            await supabase.storage
              .from("product-images")
              .remove([
                newUploadedImagePath,
              ]);
          }

          throw updateError;
        }

        if (
          imageFile &&
          editingProduct.image_url &&
          editingProduct.image_url !== imageUrl
        ) {
          await deleteStorageImage(
            editingProduct.image_url
          );
        }

        setSuccess(
          "Product updated successfully."
        );
      }

      /* CREATE */

      else {
        const {
          error: insertError,
        } = await supabase
          .from("products")
          .insert([
            {
              ...payload,
              created_at:
                new Date().toISOString(),
            },
          ]);

        if (insertError) {
          if (newUploadedImagePath) {
            await supabase.storage
              .from("product-images")
              .remove([
                newUploadedImagePath,
              ]);
          }

          throw insertError;
        }

        setSuccess(
          "Product created successfully."
        );
      }

      await loadProducts();

      setTimeout(() => {
        closeModal();
      }, 500);
    } catch (submitError) {
      console.error(submitError);

      setError(
        submitError?.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     DELETE
  ============================================================ */

  const confirmDelete = async () => {
    if (!deleteProduct) return;

    setSaving(true);
    setError("");

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProduct.id);

      if (deleteError) {
        throw deleteError;
      }

      if (deleteProduct.image_url) {
        await deleteStorageImage(
          deleteProduct.image_url
        );
      }

      setProducts((current) =>
        current.filter(
          (item) =>
            item.id !== deleteProduct.id
        )
      );

      setDeleteProduct(null);

      setSuccess(
        "Product deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (deleteError) {
      console.error(deleteError);

      setError(
        deleteError?.message ||
          "Unable to delete product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     TOGGLE STATUS
  ============================================================ */

  const toggleStatus = async (product) => {
    const newStatus =
      product.status === "active"
        ? "inactive"
        : "active";

    setError("");

    const {
      error: updateError,
    } = await supabase
      .from("products")
      .update({
        status: newStatus,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", product.id);

    if (updateError) {
      console.error(updateError);

      setError(
        updateError.message ||
          "Unable to update status."
      );

      return;
    }

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    setSuccess(
      `Product ${
        newStatus === "active"
          ? "activated"
          : "deactivated"
      } successfully.`
    );

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  /* ============================================================
     STATS
  ============================================================ */

  const activeCount = products.filter(
    (item) => item.status === "active"
  ).length;

  const inactiveCount =
    products.length - activeCount;

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="min-h-full bg-[#f7f3ee] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#641F2A]">
              Website Content
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#24171a] sm:text-3xl">
              {pageTitle}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[#817376]">
              {pageDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#641F2A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f1721]"
          >
            <Plus size={17} />
            Add {singularName}
          </button>
        </div>

        {/* ALERTS */}

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <Check size={17} />
            {success}
          </div>
        )}

        {error && !showModal && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#817376]">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-[#24171a]">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#817376]">
              Active
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#817376]">
              Inactive
            </p>

            <p className="mt-2 text-3xl font-bold text-neutral-500">
              {inactiveCount}
            </p>
          </div>
        </div>

        {/* FILTERS */}

        <div className="mb-6 rounded-2xl border border-[#e9dfd9] bg-white p-4 shadow-[0_8px_30px_rgba(70,40,40,0.04)]">
          <div className="grid gap-3 md:grid-cols-[1fr_200px_170px]">

            {/* SEARCH */}

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#817376]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={`Search ${category.toLowerCase()}...`}
                className="h-11 w-full rounded-xl border border-[#e4dcd6] bg-[#fcfaf8] pl-10 pr-4 text-sm text-[#24171a] outline-none transition placeholder:text-[#a39898] focus:border-[#641F2A]"
              />
            </div>

            {/* TYPE */}

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-[#e4dcd6] bg-[#fcfaf8] px-3 text-sm text-[#24171a] outline-none focus:border-[#641F2A]"
            >
              <option value="all">
                All {typeLabel}
              </option>

              {typeOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-[#e4dcd6] bg-[#fcfaf8] px-3 text-sm text-[#24171a] outline-none focus:border-[#641F2A]"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

          </div>
        </div>

        {/* PRODUCTS TABLE */}

        <div className="overflow-hidden rounded-2xl border border-[#e9dfd9] bg-white shadow-[0_8px_30px_rgba(70,40,40,0.04)]">

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#641F2A]">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Loading products...
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5ebe7] text-[#641F2A]">
                <Package size={25} />
              </div>

              <h3 className="mt-4 text-base font-bold text-[#24171a]">
                No products found
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-[#817376]">
                Add your first product or change your filters.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#641F2A] px-4 py-2.5 text-xs font-semibold text-white"
              >
                <Plus size={14} />
                Add {singularName}
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px]">

                  <thead className="border-b border-[#eee6e0] bg-[#fcfaf8]">
                    <tr>
                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#817376]">
                        Product
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#817376]">
                        {typeLabel}
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#817376]">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#817376]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-[#817376]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#eee6e0]">

                    {filteredProducts.map(
                      (product) => (
                        <tr
                          key={product.id}
                          className="transition hover:bg-[#fcfaf8]"
                        >
                          {/* PRODUCT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-4">

                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f3eee9]">
                                {product.image_url ? (
                                  <img
                                    src={
                                      product.image_url
                                    }
                                    alt={
                                      product.title
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[#b3a7a7]">
                                    <ImagePlus
                                      size={20}
                                    />
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
                              </div>

                            </div>
                          </td>

                          {/* TYPE */}

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-[#f5ebe7] px-3 py-1 text-xs font-semibold text-[#641F2A]">
                              {product.subcategory ||
                                "—"}
                            </span>
                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-[#24171a]">
                              {product.price !==
                                null &&
                              product.price !==
                                undefined
                                ? `PKR ${Number(
                                    product.price
                                  ).toLocaleString()}`
                                : "Contact"}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                toggleStatus(
                                  product
                                )
                              }
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                                product.status ===
                                "active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  product.status ===
                                  "active"
                                    ? "bg-green-600"
                                    : "bg-neutral-400"
                                }`}
                              />

                              {product.status ===
                              "active"
                                ? "Active"
                                : "Inactive"}
                            </button>
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    product
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4dcd6] text-[#817376] transition hover:border-[#641F2A] hover:text-[#641F2A]"
                                title="Edit"
                              >
                                <Edit3 size={15} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteProduct(
                                    product
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      )
                    )}

                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-[#eee6e0] md:hidden">

                {filteredProducts.map(
                  (product) => (
                    <div
                      key={product.id}
                      className="p-4"
                    >

                      <div className="flex gap-3">

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f3eee9]">
                          {product.image_url ? (
                            <img
                              src={
                                product.image_url
                              }
                              alt={
                                product.title
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#b3a7a7]">
                              <ImagePlus
                                size={20}
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold text-[#24171a]">
                                {product.title}
                              </h3>

                              <p className="mt-1 text-xs text-[#817376]">
                                {product.subcategory ||
                                  "No type"}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                toggleStatus(
                                  product
                                )
                              }
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                product.status ===
                                "active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              {product.status ===
                              "active"
                                ? "Active"
                                : "Inactive"}
                            </button>
                          </div>

                          <p className="mt-2 text-sm font-bold text-[#24171a]">
                            {product.price !==
                              null &&
                            product.price !==
                              undefined
                              ? `PKR ${Number(
                                  product.price
                                ).toLocaleString()}`
                              : "Contact"}
                          </p>

                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              product
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#e4dcd6] py-2.5 text-xs font-bold text-[#24171a]"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteProduct(
                              product
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 py-2.5 text-xs font-bold text-red-500"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>

                      </div>
                    </div>
                  )
                )}

              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================================================
          CREATE / EDIT MODAL
      ============================================================ */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">

          <div className="max-h-[94vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#eee6e0] px-5 py-4 sm:px-6">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#641F2A]">
                  {category}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#24171a]">
                  {editingProduct
                    ? `Edit ${singularName}`
                    : `Add ${singularName}`}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f0ed] text-[#817376] transition hover:bg-[#ebe4df]"
              >
                <X size={17} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(94vh-75px)] overflow-y-auto"
            >

              <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[230px_1fr]">

                {/* IMAGE */}

                <div>

                  <p className="mb-2 text-xs font-bold text-[#24171a]">
                    Product Image
                  </p>

                  <div className="overflow-hidden rounded-2xl border border-dashed border-[#d9cec8] bg-[#fcfaf8]">

                    {preview ? (
                      <div className="relative aspect-square">

                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow"
                        >
                          <X size={15} />
                        </button>

                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="flex aspect-square w-full flex-col items-center justify-center px-5 text-center"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5ebe7] text-[#641F2A]">
                          <UploadCloud size={22} />
                        </div>

                        <p className="mt-3 text-sm font-bold text-[#24171a]">
                          Upload image
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#a39898]">
                          JPG, PNG or WebP
                          <br />
                          Maximum 5 MB
                        </p>
                      </button>
                    )}

                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {preview && (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#e4dcd6] py-2.5 text-xs font-bold text-[#24171a]"
                    >
                      <ImagePlus size={14} />
                      Replace Image
                    </button>
                  )}

                </div>

                {/* FIELDS */}

                <div className="space-y-4">

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-red-700">
                      <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0"
                      />
                      {error}
                    </div>
                  )}

                  {/* TITLE */}

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#24171a]">
                      Product Title
                    </label>

                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter product title"
                      className="h-11 w-full rounded-xl border border-[#e4dcd6] bg-white px-3 text-sm outline-none focus:border-[#641F2A]"
                    />
                  </div>

                  {/* TYPE */}

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#24171a]">
                      {typeLabel}
                    </label>

                    <select
                      name="subcategory"
                      value={
                        form.subcategory
                      }
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-[#e4dcd6] bg-white px-3 text-sm outline-none focus:border-[#641F2A]"
                    >
                      {typeOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* PRICE */}

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#24171a]">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#a39898]">
                        PKR
                      </span>

                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0"
                        className="h-11 w-full rounded-xl border border-[#e4dcd6] bg-white pl-12 pr-3 text-sm outline-none focus:border-[#641F2A]"
                      />
                    </div>
                  </div>

                  {/* DELIVERY */}

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#24171a]">
                      Delivery Text
                    </label>

                    <input
                      name="delivery_text"
                      value={
                        form.delivery_text
                      }
                      onChange={handleChange}
                      placeholder="Delivery All Over Pakistan"
                      className="h-11 w-full rounded-xl border border-[#e4dcd6] bg-white px-3 text-sm outline-none focus:border-[#641F2A]"
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#24171a]">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={handleChange}
                      rows={5}
                      placeholder="Write product description..."
                      className="w-full resize-none rounded-xl border border-[#e4dcd6] bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#641F2A]"
                    />
                  </div>

                  {/* STATUS */}

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#24171a]">
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-[#e4dcd6] bg-white px-3 text-sm outline-none focus:border-[#641F2A]"
                    >
                      <option value="active">
                        Active
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>
                    </select>
                  </div>

                  {/* FEATURED */}

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e4dcd6] bg-[#fcfaf8] p-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={
                        form.featured
                      }
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#641F2A]"
                    />

                    <div>
                      <p className="text-xs font-bold text-[#24171a]">
                        Featured Product
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#a39898]">
                        Mark this product as featured.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-[#eee6e0] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#e4dcd6] px-5 py-2.5 text-sm font-bold text-[#24171a]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#641F2A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#4f1721] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingProduct
                        ? "Update Product"
                        : "Create Product"}
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          DELETE MODAL
      ============================================================ */}

      {deleteProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#24171a]">
              Delete Product?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#817376]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#24171a]">
                {deleteProduct.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setDeleteProduct(null)
                }
                disabled={saving}
                className="rounded-xl border border-[#e4dcd6] px-5 py-2.5 text-sm font-bold text-[#24171a]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white"
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}

                Delete
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;