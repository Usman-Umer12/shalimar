import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  UploadCloud,
  X,
  AlertCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

const CATEGORY_OPTIONS = [
  {
    name: "Doors",
    subcategories: [
      "Entrance Doors",
      "Double Entrance Doors",
      "Solid Doors",
    ],
  },
  {
    name: "Kitchens",
    subcategories: [
      "Modern Kitchens",
      "Classic Kitchens",
      "Custom Kitchens",
    ],
  },
  {
    name: "Wardrobes",
    subcategories: [
      "Modern Wardrobes",
      "Sliding Wardrobes",
      "Custom Wardrobes",
    ],
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    delivery_text: "Delivery All Over Pakistan",
    category: "Doors",
    subcategory: "Entrance Doors",
    status: "active",
    featured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = CATEGORY_OPTIONS.find(
    (item) => item.name === form.category
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    const categoryObject = CATEGORY_OPTIONS.find(
      (item) => item.name === value
    );

    setForm((current) => ({
      ...current,
      category: value,
      subcategory:
        categoryObject?.subcategories?.[0] || "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

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

      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Image size must be 5 MB or less."
      );

      e.target.value = "";
      return;
    }

    setImageFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createSafeFileName = (file) => {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "webp";

    const random =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    return `${random}.${extension}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a product image.");
      return;
    }

    try {
      setSaving(true);

      const fileName = createSafeFileName(imageFile);

      const filePath = `${form.category.toLowerCase()}/${fileName}`;

      /* =====================================================
         UPLOAD IMAGE
      ====================================================== */

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

      if (uploadError) {
        throw uploadError;
      }

      /* =====================================================
         GET PUBLIC URL
      ====================================================== */

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData?.publicUrl;

      if (!imageUrl) {
        throw new Error(
          "Unable to generate image URL."
        );
      }

      /* =====================================================
         INSERT PRODUCT
      ====================================================== */

      const { error: insertError } = await supabase
        .from("products")
        .insert({
          title: form.title.trim(),
          description:
            form.description.trim() || null,
          price:
            form.price === ""
              ? null
              : Number(form.price),
          delivery_text:
            form.delivery_text.trim() ||
            "Delivery All Over Pakistan",
          category: form.category,
          subcategory:
            form.subcategory || null,
          image_url: imageUrl,
          status: form.status,
          featured: form.featured,
        });

      if (insertError) {
        /* If DB insert fails, clean uploaded image */
        await supabase.storage
          .from("product-images")
          .remove([filePath]);

        throw insertError;
      }

      navigate("/admin/products", {
        state: {
          success: "Product added successfully.",
        },
      });
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Something went wrong while creating the product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f7f3ee] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-6">
          <Link
            to="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#641F2A] hover:text-[#4A151F]"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#641F2A]">
            Catalog Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#24171a] sm:text-3xl">
            Add Product
          </h1>

          <p className="mt-1 text-sm text-[#817376]">
            Add a new product to your Shalimar website.
          </p>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">

            {/* =================================================
                LEFT
            ================================================== */}
            <div className="space-y-5">

              {/* Basic Information */}
              <section className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)] sm:p-6">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-[#24171a]">
                    Product Information
                  </h2>

                  <p className="mt-1 text-xs text-[#817376]">
                    Add the basic information customers will see.
                  </p>
                </div>

                <div className="space-y-5">

                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#45383b]">
                      Product Title
                      <span className="text-red-500"> *</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Grand Entrance Door"
                      className="h-12 w-full rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] px-4 text-sm text-[#24171a] outline-none focus:border-[#641F2A] focus:ring-2 focus:ring-[#641F2A]/10"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#45383b]">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Write a short professional description..."
                      className="w-full resize-none rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] px-4 py-3 text-sm leading-6 text-[#24171a] outline-none focus:border-[#641F2A] focus:ring-2 focus:ring-[#641F2A]/10"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#45383b]">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#817376]">
                        PKR
                      </span>

                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="45000"
                        className="h-12 w-full rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] pl-14 pr-4 text-sm text-[#24171a] outline-none focus:border-[#641F2A] focus:ring-2 focus:ring-[#641F2A]/10"
                      />
                    </div>
                  </div>

                  {/* Delivery */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#45383b]">
                      Delivery Text
                    </label>

                    <input
                      type="text"
                      name="delivery_text"
                      value={form.delivery_text}
                      onChange={handleChange}
                      placeholder="Delivery All Over Pakistan"
                      className="h-12 w-full rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] px-4 text-sm text-[#24171a] outline-none focus:border-[#641F2A] focus:ring-2 focus:ring-[#641F2A]/10"
                    />

                    <p className="mt-2 text-xs text-[#96878a]">
                      This text can be changed for every product.
                    </p>
                  </div>
                </div>
              </section>

              {/* Category */}
              <section className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)] sm:p-6">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-[#24171a]">
                    Catalog
                  </h2>

                  <p className="mt-1 text-xs text-[#817376]">
                    Organize this product in the correct category.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#45383b]">
                      Category
                      <span className="text-red-500"> *</span>
                    </label>

                    <select
                      name="category"
                      value={form.category}
                      onChange={handleCategoryChange}
                      className="h-12 w-full rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] px-4 text-sm text-[#24171a] outline-none focus:border-[#641F2A]"
                    >
                      {CATEGORY_OPTIONS.map(
                        (item) => (
                          <option
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#45383b]">
                      Subcategory
                    </label>

                    <select
                      name="subcategory"
                      value={form.subcategory}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-[#e5dcd7] bg-[#fcfaf8] px-4 text-sm text-[#24171a] outline-none focus:border-[#641F2A]"
                    >
                      {selectedCategory?.subcategories?.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </section>

              {/* Status */}
              <section className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)] sm:p-6">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-[#24171a]">
                    Visibility
                  </h2>

                  <p className="mt-1 text-xs text-[#817376]">
                    Control whether this product appears on the website.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e5dcd7] p-4">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={
                        form.status === "active"
                      }
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#641F2A]"
                    />

                    <div>
                      <p className="text-sm font-bold text-[#24171a]">
                        Active
                      </p>

                      <p className="mt-1 text-xs text-[#817376]">
                        Visible on the website
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e5dcd7] p-4">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={
                        form.status === "inactive"
                      }
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#641F2A]"
                    />

                    <div>
                      <p className="text-sm font-bold text-[#24171a]">
                        Inactive
                      </p>

                      <p className="mt-1 text-xs text-[#817376]">
                        Hidden from the website
                      </p>
                    </div>
                  </label>
                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl bg-[#fcfaf8] p-4">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#641F2A]"
                  />

                  <div>
                    <p className="text-sm font-bold text-[#24171a]">
                      Featured Product
                    </p>

                    <p className="mt-1 text-xs text-[#817376]">
                      Mark this product as featured for future use.
                    </p>
                  </div>
                </label>
              </section>
            </div>

            {/* =================================================
                RIGHT
            ================================================== */}
            <div className="space-y-5">

              {/* Image */}
              <section className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)]">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-[#24171a]">
                    Product Image
                  </h2>

                  <p className="mt-1 text-xs text-[#817376]">
                    Upload one product image.
                  </p>
                </div>

                {preview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[#e5dcd7] bg-[#f6f1ed]">
                    <img
                      src={preview}
                      alt="Product preview"
                      className="aspect-[4/5] w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-lg"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#dcd0ca] bg-[#fcfaf8] px-5 text-center transition hover:border-[#641F2A] hover:bg-[#faf5f2]"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#641F2A]/10 text-[#641F2A]">
                      <ImagePlus size={25} />
                    </div>

                    <p className="text-sm font-bold text-[#45383b]">
                      Upload Product Image
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#96878a]">
                      JPG, PNG or WebP
                      <br />
                      Maximum 5 MB
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#641F2A] px-4 py-2.5 text-xs font-bold text-white">
                      <UploadCloud size={16} />
                      Choose Image
                    </span>
                  </button>
                )}

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
                    className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#e5dcd7] text-xs font-bold text-[#45383b]"
                  >
                    <UploadCloud size={15} />
                    Replace Image
                  </button>
                )}
              </section>

              {/* Publish */}
              <section className="rounded-2xl border border-[#e9dfd9] bg-white p-5 shadow-[0_8px_30px_rgba(70,40,40,0.04)]">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-[#24171a]">
                    Publish Product
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#817376]">
                    Save the product when all required information is complete.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#641F2A] text-sm font-bold text-white shadow-sm transition hover:bg-[#4A151F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving Product...
                    </>
                  ) : (
                    <>
                      <Check size={17} />
                      Add Product
                    </>
                  )}
                </button>

                <Link
                  to="/admin/products"
                  className="mt-3 flex h-11 items-center justify-center rounded-xl border border-[#e5dcd7] text-sm font-bold text-[#45383b]"
                >
                  Cancel
                </Link>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;