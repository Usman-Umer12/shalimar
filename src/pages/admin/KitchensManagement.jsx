import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Edit3,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* ==========================================================================
   EXISTING KITCHEN ASSETS
   Same assets used by Kitchens.jsx
============================================================================= */

import kitchen1 from "../../assets/kitchen1.webp";
import kitchen2 from "../../assets/kitchen2.webp";
import kitchen3 from "../../assets/kitchen3.webp";
import kitchen4 from "../../assets/kitchen4.webp";

/* ==========================================================================
   CATEGORY
============================================================================= */

const CATEGORY = "Kitchens";

const DEFAULT_DELIVERY =
  "Delivery All Over Pakistan";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

/* ==========================================================================
   EXISTING KITCHEN PRICING
   IMPORTANT:
   These rates remain exactly the same as Kitchens.jsx
============================================================================= */

const PRICING = {
  rate: {
    modular: 2700,
    imported: 3800,
    pine: 3800,
    ash: 6200,
  },
};

/* ==========================================================================
   KITCHEN TYPES
============================================================================= */

const KITCHEN_TYPES = [
  "Modular",
  "Imported",
  "Pine",
  "Ash",
];

/* ==========================================================================
   EXISTING KITCHEN DESIGNS
   These are the existing local designs from Kitchens.jsx.
============================================================================= */

const EXISTING_KITCHENS = [
  {
    key: "modular-kitchen",
    image: kitchen1,
    title: "Modular Kitchen",
    description:
      "A clean, handleless modular kitchen with practical storage and a smooth, modern finish for everyday cooking.",
    subcategory: "Modular",
    price: PRICING.rate.modular,
  },

  {
    key: "handleless-kitchen",
    image: kitchen2,
    title: "Handleless Kitchen",
    description:
      "Sleek handleless fronts with aluminium glass shutters, built to bring light, space and style to the kitchen.",
    subcategory: "Modular",
    price: PRICING.rate.modular,
  },

  {
    key: "tusan-solid-wood-kitchen",
    image: kitchen3,
    title: "Tusan Solid Wood Kitchen",
    description:
      "Luxurious solid wood kitchen with carved motifs, crafted in yellow pine or ashwood for timeless warmth.",
    subcategory: "Pine",
    price: PRICING.rate.pine,
  },

  {
    key: "luxury-kitchen",
    image: kitchen4,
    title: "Luxury Kitchen",
    description:
      "A premium kitchen concept with refined detailing, smart organisation and a sophisticated interior look.",
    subcategory: "Ash",
    price: PRICING.rate.ash,
  },
];

/* ==========================================================================
   HELPERS
============================================================================= */

const formatPrice = (price) => {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "Price on Request";
  }

  const value = Number(price);

  if (Number.isNaN(value)) {
    return "Price on Request";
  }

  return `PKR ${value.toLocaleString("en-PK")}`;
};

const safeFileName = (name) => {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getTypePrice = (subcategory) => {
  const key =
    String(subcategory || "")
      .trim()
      .toLowerCase();

  return (
    PRICING.rate[key] ||
    PRICING.rate.modular
  );
};

/* ==========================================================================
   COMPONENT
============================================================================= */

const KitchensManagement = () => {
  /* ========================================================================
     PRODUCTS
  ======================================================================== */

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  /* ========================================================================
     SEARCH / FILTER
  ======================================================================== */

  const [search, setSearch] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("All");

  /* ========================================================================
     MODAL
  ======================================================================== */

  const [showModal, setShowModal] =
    useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] = useState(null);

  /* ========================================================================
     FORM
  ======================================================================== */

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      price: "",
      subcategory: "Modular",
      delivery_text:
        DEFAULT_DELIVERY,
      status: "active",
      featured: false,
    });

  const [imageFile, setImageFile] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const fileInputRef =
    useRef(null);

  /* ========================================================================
     UI
  ======================================================================== */

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [importing, setImporting] =
    useState(false);

  const [
    importProgress,
    setImportProgress,
  ] = useState({
    current: 0,
    total:
      EXISTING_KITCHENS.length,
    currentName: "",
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ========================================================================
     LOAD PRODUCTS
  ======================================================================== */

  const loadProducts = async (
    showRefresh = false
  ) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const {
        data,
        error: fetchError,
      } = await supabase
        .from("products")
        .select(
          `
            id,
            title,
            description,
            price,
            category,
            subcategory,
            image_url,
            delivery_text,
            status,
            featured,
            created_at,
            updated_at
          `
        )
        .eq(
          "category",
          CATEGORY
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

      if (fetchError) {
        throw fetchError;
      }

      setProducts(data || []);
    } catch (err) {
      console.error(
        "Kitchens load error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load kitchens from Supabase."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ========================================================================
     FILTERED PRODUCTS
  ======================================================================== */

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !query ||
            product.title
              ?.toLowerCase()
              .includes(query) ||
            product.description
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            activeFilter === "All" ||
            product.status ===
              activeFilter;

          const matchesType =
            typeFilter === "All" ||
            product.subcategory ===
              typeFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );
        }
      );
    }, [
      products,
      search,
      activeFilter,
      typeFilter,
    ]);

  /* ========================================================================
     COUNTS
  ======================================================================== */

  const totalProducts =
    products.length;

  const activeProducts =
    products.filter(
      (product) =>
        product.status ===
        "active"
    ).length;

  const inactiveProducts =
    products.filter(
      (product) =>
        product.status ===
        "inactive"
    ).length;

  const featuredProducts =
    products.filter(
      (product) =>
        Boolean(
          product.featured
        )
    ).length;

  /* ========================================================================
     RESET FORM
  ======================================================================== */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      subcategory: "Modular",
      delivery_text:
        DEFAULT_DELIVERY,
      status: "active",
      featured: false,
    });

    setImageFile(null);
    setPreview("");
    setEditingProduct(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  /* ========================================================================
     ADD
  ======================================================================== */

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  /* ========================================================================
     EDIT
  ======================================================================== */

  const openEditModal = (
    product
  ) => {
    setEditingProduct(product);

    setForm({
      title:
        product.title || "",

      description:
        product.description || "",

      price:
        product.price ===
          null ||
        product.price ===
          undefined
          ? ""
          : String(
              product.price
            ),

      subcategory:
        product.subcategory ||
        "Modular",

      delivery_text:
        product.delivery_text ||
        DEFAULT_DELIVERY,

      status:
        product.status ||
        "active",

      featured:
        Boolean(
          product.featured
        ),
    });

    setImageFile(null);

    setPreview(
      product.image_url || ""
    );

    setError("");
    setShowModal(true);
  };

  /* ========================================================================
     CLOSE
  ======================================================================== */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  /* ========================================================================
     FORM CHANGE
  ======================================================================== */

  const handleChange = (
    event
  ) => {
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

    setError("");
  };

  /* ========================================================================
     TYPE CHANGE
     Automatically applies the existing
     Kitchens.jsx rate when type changes.
  ======================================================================== */

  const handleTypeChange = (
    event
  ) => {
    const value =
      event.target.value;

    setForm((current) => ({
      ...current,

      subcategory:
        value,

      price:
        getTypePrice(value),
    }));

    setError("");
  };

  /* ========================================================================
     IMAGE CHANGE
  ======================================================================== */

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please upload a JPG, PNG or WebP image."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      setError(
        "Image size must be 5 MB or less."
      );

      event.target.value = "";

      return;
    }

    setImageFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  /* ========================================================================
     UPLOAD IMAGE
  ======================================================================== */

  const uploadImage = async (
    file
  ) => {
    if (!file) return null;

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "webp";

    const base =
      safeFileName(
        file.name
      ) || "kitchen";

    const fileName =
      `${base}-${crypto.randomUUID()}.${extension}`;

    const filePath =
      `kitchens/${fileName}`;

    const {
      data,
      error: uploadError,
    } =
      await supabase.storage
        .from(
          "product-images"
        )
        .upload(
          filePath,
          file,
          {
            cacheControl:
              "3600",

            upsert: false,

            contentType:
              file.type,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicData,
    } =
      supabase.storage
        .from(
          "product-images"
        )
        .getPublicUrl(
          data.path
        );

    return (
      publicData?.publicUrl ||
      null
    );
  };

  /* ========================================================================
     DELETE STORAGE IMAGE
  ======================================================================== */

  const deleteStorageImage =
    async (imageUrl) => {
      if (
        !imageUrl ||
        !imageUrl.includes(
          "/storage/v1/object/public/product-images/"
        )
      ) {
        return;
      }

      try {
        const marker =
          "/storage/v1/object/public/product-images/";

        const path =
          imageUrl.split(
            marker
          )[1];

        if (!path) return;

        await supabase.storage
          .from(
            "product-images"
          )
          .remove([path]);
      } catch (err) {
        console.warn(
          "Kitchen image delete warning:",
          err
        );
      }
    };

  /* ========================================================================
     SAVE PRODUCT
  ======================================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Product title is required."
      );

      return;
    }

    if (!form.subcategory) {
      setError(
        "Kitchen type is required."
      );

      return;
    }

    setSaving(true);

    let uploadedImageUrl =
      null;

    try {
      /* =====================================================
         NEW IMAGE
      ====================================================== */

      if (imageFile) {
        uploadedImageUrl =
          await uploadImage(
            imageFile
          );
      }

      /* =====================================================
         EDIT
      ====================================================== */

      if (editingProduct) {
        const updateData = {
          title:
            form.title.trim(),

          description:
            form.description.trim(),

          price:
            form.price === ""
              ? null
              : Number(
                  form.price
                ),

          category:
            CATEGORY,

          subcategory:
            form.subcategory,

          delivery_text:
            form.delivery_text.trim() ||
            DEFAULT_DELIVERY,

          status:
            form.status,

          featured:
            form.featured,

          updated_at:
            new Date().toISOString(),
        };

        if (
          uploadedImageUrl
        ) {
          updateData.image_url =
            uploadedImageUrl;
        }

        const {
          error: updateError,
        } =
          await supabase
            .from(
              "products"
            )
            .update(
              updateData
            )
            .eq(
              "id",
              editingProduct.id
            );

        if (updateError) {
          throw updateError;
        }

        if (
          uploadedImageUrl &&
          editingProduct.image_url
        ) {
          await deleteStorageImage(
            editingProduct.image_url
          );
        }

        setSuccess(
          "Kitchen updated successfully."
        );
      }

      /* =====================================================
         ADD
      ====================================================== */

      else {
        if (!uploadedImageUrl) {
          setError(
            "Please select a kitchen image."
          );

          setSaving(false);

          return;
        }

        const {
          error: insertError,
        } =
          await supabase
            .from(
              "products"
            )
            .insert({
              title:
                form.title.trim(),

              description:
                form.description.trim(),

              price:
                form.price === ""
                  ? null
                  : Number(
                      form.price
                    ),

              category:
                CATEGORY,

              subcategory:
                form.subcategory,

              image_url:
                uploadedImageUrl,

              delivery_text:
                form.delivery_text.trim() ||
                DEFAULT_DELIVERY,

              status:
                form.status,

              featured:
                form.featured,
            });

        if (insertError) {
          throw insertError;
        }

        setSuccess(
          "Kitchen added successfully."
        );
      }

      await loadProducts();

      setTimeout(() => {
        setShowModal(false);
        resetForm();
        setSuccess("");
      }, 700);
    } catch (err) {
      console.error(
        "Kitchen save error:",
        err
      );

      if (
        uploadedImageUrl
      ) {
        await deleteStorageImage(
          uploadedImageUrl
        );
      }

      setError(
        err?.message ||
          "Unable to save kitchen."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================================
     STATUS
  ======================================================================== */

  const toggleStatus = async (
    product
  ) => {
    setError("");
    setSuccess("");

    const nextStatus =
      product.status ===
      "active"
        ? "inactive"
        : "active";

    try {
      const {
        error: updateError,
      } =
        await supabase
          .from("products")
          .update({
            status:
              nextStatus,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            product.id
          );

      if (updateError) {
        throw updateError;
      }

      setProducts(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              product.id
                ? {
                    ...item,
                    status:
                      nextStatus,
                  }
                : item
          )
      );

      setSuccess(
        nextStatus ===
        "active"
          ? "Kitchen is now visible on the website."
          : "Kitchen is now hidden from the website."
      );

      setTimeout(
        () =>
          setSuccess(""),
        2500
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to update status."
      );
    }
  };

  /* ========================================================================
     DELETE
  ======================================================================== */

  const handleDelete = async (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${product.title}" permanently?\n\nThis will remove the kitchen from the admin panel and public website.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      product.id
    );

    setError("");
    setSuccess("");

    try {
      const {
        error: deleteError,
      } =
        await supabase
          .from(
            "products"
          )
          .delete()
          .eq(
            "id",
            product.id
          );

      if (deleteError) {
        throw deleteError;
      }

      await deleteStorageImage(
        product.image_url
      );

      setProducts(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              product.id
          )
      );

      setSuccess(
        "Kitchen deleted successfully."
      );

      setTimeout(
        () =>
          setSuccess(""),
        2500
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to delete kitchen."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ========================================================================
     IMPORT EXISTING KITCHENS
     
     Duplicate protection:
       category + title
  ======================================================================== */

  const importExistingKitchens =
    async () => {
      if (importing) return;

      setImporting(true);
      setError("");
      setSuccess("");

      setImportProgress({
        current: 0,
        total:
          EXISTING_KITCHENS.length,
        currentName:
          "Preparing import...",
      });

      try {
        /* ===================================================
           FETCH EXISTING DATABASE PRODUCTS
        ==================================================== */

        const {
          data: existingProducts,
          error: existingError,
        } =
          await supabase
            .from(
              "products"
            )
            .select(
              `
                id,
                title,
                category,
                image_url
              `
            )
            .eq(
              "category",
              CATEGORY
            );

        if (existingError) {
          throw existingError;
        }

        /* ===================================================
           DUPLICATE MAP
        ==================================================== */

        const existingMap =
          new Map();

        (
          existingProducts ||
          []
        ).forEach(
          (product) => {
            const key =
              `${product.category}::${product.title}`
                .trim()
                .toLowerCase();

            existingMap.set(
              key,
              product
            );
          }
        );

        let imported = 0;
        let skipped = 0;

        /* ===================================================
           IMPORT ONE BY ONE
        ==================================================== */

        for (
          let index = 0;
          index <
          EXISTING_KITCHENS.length;
          index++
        ) {
          const kitchen =
            EXISTING_KITCHENS[
              index
            ];

          setImportProgress({
            current:
              index + 1,
            total:
              EXISTING_KITCHENS.length,
            currentName:
              kitchen.title,
          });

          const duplicateKey =
            `${CATEGORY}::${kitchen.title}`
              .trim()
              .toLowerCase();

          /* ===============================================
             ALREADY EXISTS
          ============================================== */

          if (
            existingMap.has(
              duplicateKey
            )
          ) {
            skipped++;

            continue;
          }

          /* ===============================================
             FETCH LOCAL IMAGE
          ============================================== */

          const response =
            await fetch(
              kitchen.image
            );

          if (!response.ok) {
            throw new Error(
              `Unable to read ${kitchen.title} image.`
            );
          }

          const blob =
            await response.blob();

          /* ===============================================
             STORAGE PATH
          ============================================== */

          const extension =
            "webp";

          const base =
            safeFileName(
              kitchen.title
            );

          const storagePath =
            `kitchens/existing/${base}.${extension}`;

          /* ===============================================
             STORAGE
          ============================================== */

          const {
            error: uploadError,
          } =
            await supabase.storage
              .from(
                "product-images"
              )
              .upload(
                storagePath,
                blob,
                {
                  cacheControl:
                    "3600",

                  upsert: true,

                  contentType:
                    "image/webp",
                }
              );

          if (uploadError) {
            throw uploadError;
          }

          const {
            data: publicData,
          } =
            supabase.storage
              .from(
                "product-images"
              )
              .getPublicUrl(
                storagePath
              );

          const imageUrl =
            publicData?.publicUrl;

          if (!imageUrl) {
            throw new Error(
              `Unable to generate public image URL for ${kitchen.title}.`
            );
          }

          /* ===============================================
             DATABASE
          ============================================== */

          const {
            data: insertedProduct,
            error: insertError,
          } =
            await supabase
              .from(
                "products"
              )
              .insert({
                title:
                  kitchen.title,

                description:
                  kitchen.description,

                price:
                  kitchen.price,

                category:
                  CATEGORY,

                subcategory:
                  kitchen.subcategory,

                image_url:
                  imageUrl,

                delivery_text:
                  DEFAULT_DELIVERY,

                status:
                  "active",

                featured:
                  false,
              })
              .select()
              .single();

          if (insertError) {
            const message =
              insertError.message ||
              "";

            if (
              message
                .toLowerCase()
                .includes(
                  "duplicate"
                )
            ) {
              skipped++;

              continue;
            }

            throw insertError;
          }

          existingMap.set(
            duplicateKey,
            insertedProduct
          );

          imported++;
        }

        await loadProducts();

        setSuccess(
          `Import complete: ${imported} new kitchens imported, ${skipped} already existed.`
        );

        setTimeout(
          () =>
            setSuccess(""),
          6000
        );
      } catch (err) {
        console.error(
          "Kitchen import error:",
          err
        );

        setError(
          err?.message ||
            "Unable to import existing kitchens."
        );
      } finally {
        setImporting(false);

        setImportProgress(
          (current) => ({
            ...current,
            currentName:
              "Import finished",
          })
        );
      }
    };

  /* ========================================================================
     UI
  ======================================================================== */

  return (
    <div className="min-h-screen bg-[#F7F2EA]">

      {/* ================================================================
          HEADER
      ================================================================ */}

      <div className="border-b border-[#E4D9D0] bg-white">

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#641F2A]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B7770]">
                  Website Content
                </p>

              </div>

              <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#2C1B1E]">
                Kitchens
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#7D716D]">
                Manage kitchen products displayed
                on the public website while keeping
                the existing kitchen configurator,
                pricing and visual design unchanged.
              </p>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <button
                type="button"
                onClick={
                  importExistingKitchens
                }
                disabled={
                  importing
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#D9CBC2]
                  bg-[#F9F5F0]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-[#4A151F]
                  transition
                  hover:border-[#A88B91]
                  hover:bg-[#F1E9E2]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {importing ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <UploadCloud
                    size={16}
                  />
                )}

                {importing
                  ? "Importing..."
                  : "Import Existing Designs"}

              </button>

              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#4A151F]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#351018]
                "
              >

                <Plus size={16} />

                Add New Kitchen

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================================
          MAIN
      ================================================================ */}

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ================================================================
            ALERTS
        ================================================================ */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div className="min-w-0 flex-1">

              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 break-words text-xs leading-5">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X size={16} />
            </button>

          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

            <Check
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p className="font-medium">
              {success}
            </p>

          </div>
        )}

        {/* ================================================================
            IMPORT PROGRESS
        ================================================================ */}

        {importing && (
          <div className="mb-6 rounded-2xl border border-[#D9CBC2] bg-white p-5 shadow-[0_8px_30px_rgba(55,35,28,0.04)]">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7770]">
                  Importing Existing Collection
                </p>

                <p className="mt-1 text-sm font-semibold text-[#332326]">
                  {
                    importProgress.currentName
                  }
                </p>

              </div>

              <p className="text-sm font-bold text-[#641F2A]">

                {
                  importProgress.current
                }{" "}

                /{" "}

                {
                  importProgress.total
                }

              </p>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EEE6DF]">

              <div
                className="h-full rounded-full bg-[#641F2A] transition-all duration-300"
                style={{
                  width: `${
                    importProgress.total
                      ? Math.min(
                          100,
                          (importProgress.current /
                            importProgress.total) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

            <p className="mt-3 text-xs text-[#817471]">
              Importing the existing kitchen
              designs without changing the
              public configurator.
            </p>

          </div>
        )}

        {/* ================================================================
            STATS
        ================================================================ */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Kitchens"
            value={
              totalProducts
            }
            description="All kitchen products"
          />

          <StatCard
            label="Active"
            value={
              activeProducts
            }
            description="Currently visible"
          />

          <StatCard
            label="Inactive"
            value={
              inactiveProducts
            }
            description="Hidden from website"
          />

          <StatCard
            label="Featured"
            value={
              featuredProducts
            }
            description="Featured products"
          />

        </div>

        {/* ================================================================
            EXISTING COLLECTION
        ================================================================ */}

        <div className="mt-6 rounded-2xl border border-[#DCCFC6] bg-[#FBF8F3] p-5 sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A7772]">
                Existing Collection
              </p>

              <div className="mt-2 flex items-baseline gap-2">

                <span className="font-serif text-4xl font-medium text-[#4A151F]">
                  4
                </span>

                <span className="text-xs font-semibold text-[#817471]">
                  existing kitchen designs
                </span>

              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#817471]">
                Modular, Handleless, Tusan Solid
                Wood and Luxury kitchen designs
                from the existing public page.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <Badge>
                Modular
              </Badge>

              <Badge>
                Imported
              </Badge>

              <Badge>
                Pine
              </Badge>

              <Badge>
                Ash
              </Badge>

            </div>

          </div>

        </div>

        {/* ================================================================
            PRICING INFORMATION
        ================================================================ */}

        <div className="mt-6 rounded-2xl border border-[#E0D6CE] bg-white p-5 shadow-[0_6px_25px_rgba(55,35,28,0.035)]">

          <div className="mb-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7770]">
              Existing Configurator Pricing
            </p>

            <p className="mt-1 text-xs text-[#817471]">
              These rates remain unchanged and
              are displayed for reference only.
              The public Kitchens.jsx configurator
              controls the actual calculation.
            </p>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <PriceCard
              title="Modular"
              price="PKR 2,700"
              suffix="/ sq ft"
            />

            <PriceCard
              title="Imported"
              price="PKR 3,800"
              suffix="/ sq ft"
            />

            <PriceCard
              title="Pine"
              price="PKR 3,800"
              suffix="/ sq ft"
            />

            <PriceCard
              title="Ash"
              price="PKR 6,200"
              suffix="/ sq ft"
            />

          </div>

        </div>

        {/* ================================================================
            TOOLBAR
        ================================================================ */}

        <div className="mt-6 rounded-2xl border border-[#E0D6CE] bg-white p-4 shadow-[0_6px_25px_rgba(55,35,28,0.035)]">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-2xl">

              <div className="relative w-full">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#978983]"
                />

                <input
                  type="search"
                  value={
                    search
                  }
                  onChange={(event) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search kitchens..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#DDD3CB]
                    bg-[#FCFAF7]
                    py-3
                    pl-9
                    pr-4
                    text-sm
                    text-[#2C1B1E]
                    outline-none
                    placeholder:text-[#A39A96]
                    focus:border-[#641F2A]
                    focus:ring-2
                    focus:ring-[#641F2A]/10
                  "
                />

              </div>

              <div className="relative min-w-[170px]">

                <select
                  value={
                    typeFilter
                  }
                  onChange={(event) =>
                    setTypeFilter(
                      event.target
                        .value
                    )
                  }
                  className="
                    h-full
                    min-h-[46px]
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-[#DDD3CB]
                    bg-[#FCFAF7]
                    px-4
                    pr-9
                    text-xs
                    font-semibold
                    text-[#5E5050]
                    outline-none
                    focus:border-[#641F2A]
                    focus:ring-2
                    focus:ring-[#641F2A]/10
                  "
                >

                  <option value="All">
                    All Types
                  </option>

                  {KITCHEN_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}

                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7C77]"
                />

              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {[
                "All",
                "active",
                "inactive",
              ].map(
                (filter) => {
                  const isActive =
                    activeFilter ===
                    filter;

                  const label =
                    filter ===
                    "All"
                      ? "All"
                      : filter ===
                        "active"
                      ? "Active"
                      : "Inactive";

                  return (
                    <button
                      key={
                        filter
                      }
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          filter
                        )
                      }
                      className={`
                        rounded-full
                        px-4
                        py-2
                        text-[11px]
                        font-bold
                        transition
                        ${
                          isActive
                            ? "bg-[#4A151F] text-white"
                            : "bg-[#F3ECE5] text-[#685A57] hover:bg-[#E9DED6]"
                        }
                      `}
                    >
                      {label}
                    </button>
                  );
                }
              )}

              <button
                type="button"
                onClick={() =>
                  loadProducts(
                    true
                  )
                }
                disabled={
                  refreshing ||
                  loading
                }
                className="
                  ml-0
                  inline-flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DDD3CB]
                  bg-white
                  text-[#5C4A4D]
                  transition
                  hover:border-[#9B7B82]
                  hover:text-[#4A151F]
                  disabled:opacity-50
                  sm:ml-1
                "
                title="Refresh"
              >

                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

              </button>

            </div>

          </div>

        </div>

        {/* ================================================================
            DESKTOP TABLE
        ================================================================ */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E0D6CE] bg-white shadow-[0_6px_25px_rgba(55,35,28,0.035)]">

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full min-w-[1050px] border-collapse">

              <thead>

                <tr className="border-b border-[#E6DDD6] bg-[#FBF8F3]">

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7770]">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7770]">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7770]">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7770]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7770]">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (
                  <tr>

                    <td
                      colSpan={5}
                      className="px-5 py-20 text-center"
                    >

                      <Loader2
                        size={25}
                        className="mx-auto animate-spin text-[#641F2A]"
                      />

                      <p className="mt-3 text-xs text-[#817471]">
                        Loading kitchens...
                      </p>

                    </td>

                  </tr>
                ) : filteredProducts.length ===
                  0 ? (
                  <tr>

                    <td
                      colSpan={5}
                      className="px-5 py-20 text-center"
                    >

                      <Search
                        size={22}
                        className="mx-auto text-[#8B7770]"
                      />

                      <p className="mt-3 text-sm font-semibold text-[#332326]">
                        No kitchens found
                      </p>

                      <p className="mt-1 text-xs text-[#817471]">
                        Import the existing
                        collection or add a
                        new kitchen.
                      </p>

                    </td>

                  </tr>
                ) : (
                  filteredProducts.map(
                    (product) => (
                      <tr
                        key={
                          product.id
                        }
                        className="border-b border-[#EEE7E1] last:border-0"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-4">

                            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E0D6CE] bg-[#F1EAE3]">

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
                                <div className="flex h-full w-full items-center justify-center text-[#9A8B85]">

                                  <ImagePlus
                                    size={17}
                                  />

                                </div>
                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-[#2C1B1E]">
                                {
                                  product.title
                                }
                              </p>

                              <p className="mt-1 max-w-[380px] truncate text-xs text-[#817471]">
                                {
                                  product.description ||
                                  "No description"
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-[#A08F89]">
                                {
                                  product.delivery_text ||
                                  DEFAULT_DELIVERY
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <span className="rounded-full bg-[#F1E7E3] px-3 py-1.5 text-[10px] font-bold text-[#641F2A]">
                            {
                              product.subcategory ||
                              "Modular"
                            }
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <p className="text-sm font-bold text-[#3E2A2E]">
                            {formatPrice(
                              product.price
                            )}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(
                                product
                              )
                            }
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-3
                              py-1.5
                              text-[10px]
                              font-bold
                              ${
                                product.status ===
                                "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              }
                            `}
                          >

                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  product.status ===
                                  "active"
                                    ? "bg-emerald-500"
                                    : "bg-gray-400"
                                }
                              `}
                            />

                            {product.status ===
                            "active"
                              ? "Active"
                              : "Inactive"}

                          </button>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  product
                                )
                              }
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[#DED3CB]
                                bg-white
                                text-[#5C4A4D]
                                hover:bg-[#F7F1EB]
                              "
                              title="Edit"
                            >

                              <Edit3
                                size={15}
                              />

                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                              disabled={
                                deletingId ===
                                product.id
                              }
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-red-100
                                bg-white
                                text-red-500
                                hover:bg-red-50
                                disabled:opacity-50
                              "
                              title="Delete"
                            >

                              {deletingId ===
                              product.id ? (
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={15}
                                />
                              )}

                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* ================================================================
              MOBILE
          ================================================================ */}

          <div className="lg:hidden">

            {loading ? (
              <div className="px-5 py-20 text-center">

                <Loader2
                  size={25}
                  className="mx-auto animate-spin text-[#641F2A]"
                />

                <p className="mt-3 text-xs text-[#817471]">
                  Loading kitchens...
                </p>

              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div className="px-5 py-20 text-center">

                <Search
                  size={22}
                  className="mx-auto text-[#8B7770]"
                />

                <p className="mt-3 text-sm font-semibold text-[#332326]">
                  No kitchens found
                </p>

              </div>
            ) : (
              <div className="divide-y divide-[#EEE7E1]">

                {filteredProducts.map(
                  (product) => (
                    <div
                      key={
                        product.id
                      }
                      className="p-4"
                    >

                      <div className="flex gap-3">

                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E0D6CE] bg-[#F1EAE3]">

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
                            <div className="flex h-full w-full items-center justify-center text-[#9A8B85]">

                              <ImagePlus
                                size={18}
                              />

                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <div className="min-w-0">

                              <h3 className="truncate text-sm font-bold text-[#2C1B1E]">
                                {
                                  product.title
                                }
                              </h3>

                              <p className="mt-1 text-[10px] text-[#8A7772]">
                                {
                                  product.subcategory ||
                                  "Modular"
                                }
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                toggleStatus(
                                  product
                                )
                              }
                              className={`
                                shrink-0
                                rounded-full
                                px-2.5
                                py-1
                                text-[9px]
                                font-bold
                                ${
                                  product.status ===
                                  "active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-100 text-gray-600"
                                }
                              `}
                            >

                              {
                                product.status ===
                                "active"
                                  ? "Active"
                                  : "Inactive"
                              }

                            </button>

                          </div>

                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#817471]">
                            {
                              product.description ||
                              "No description"
                            }
                          </p>

                          <p className="mt-2 text-xs font-bold text-[#4A151F]">
                            {formatPrice(
                              product.price
                            )}
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
                          className="
                            flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-[#DED3CB]
                            bg-white
                            py-2.5
                            text-xs
                            font-bold
                            text-[#4A151F]
                          "
                        >

                          <Edit3
                            size={14}
                          />

                          Edit

                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-red-100
                            bg-red-50
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            text-red-600
                          "
                        >

                          {deletingId ===
                          product.id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={14}
                            />
                          )}

                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* ================================================================
            FOOTER
        ================================================================ */}

        <div className="mt-4 flex flex-col gap-2 text-xs text-[#8B7C77] sm:flex-row sm:items-center sm:justify-between">

          <p>

            Showing{" "}

            <span className="font-bold text-[#5C494D]">
              {
                filteredProducts.length
              }
            </span>{" "}

            of{" "}

            <span className="font-bold text-[#5C494D]">
              {products.length}
            </span>{" "}

            kitchens.

          </p>

          <p>
            Changes are synced with the public
            website.
          </p>

        </div>

      </div>

      {/* ================================================================
          ADD / EDIT MODAL
      ================================================================ */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/50
            p-4
            backdrop-blur-sm
          "
        >

          <div className="relative my-6 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#E7DED7] px-5 py-4 sm:px-6">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8B7770]">
                  {editingProduct
                    ? "Edit Website Product"
                    : "Create Website Product"}
                </p>

                <h2 className="mt-1 font-serif text-2xl font-medium text-[#2C1B1E]">

                  {editingProduct
                    ? "Edit Kitchen"
                    : "Add New Kitchen"}

                </h2>

              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={saving}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F2ECE6]
                  text-[#5E5050]
                  hover:bg-[#E9DFD7]
                  disabled:opacity-50
                "
              >

                <X size={17} />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-6">

                {/* ERROR */}

                {error && (
                  <div className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">

                    <AlertCircle
                      size={15}
                      className="mt-0.5 shrink-0"
                    />

                    <p>
                      {error}
                    </p>

                  </div>
                )}

                {/* IMAGE */}

                <div>

                  <label className="text-xs font-bold text-[#433639]">
                    Product Image
                  </label>

                  <div className="mt-2 grid gap-4 sm:grid-cols-[190px_1fr]">

                    <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#DDD3CB] bg-[#F1EAE3]">

                      {preview ? (
                        <img
                          src={
                            preview
                          }
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-[#978983]">

                          <ImagePlus
                            size={24}
                          />

                          <span className="mt-2 text-[10px]">
                            No image
                          </span>

                        </div>
                      )}

                    </div>

                    <div className="flex flex-col justify-center">

                      <input
                        ref={
                          fileInputRef
                        }
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="
                          inline-flex
                          w-fit
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-[#D9CBC2]
                          bg-[#FAF6F1]
                          px-4
                          py-3
                          text-xs
                          font-bold
                          text-[#4A151F]
                        "
                      >

                        <UploadCloud
                          size={16}
                        />

                        {editingProduct
                          ? "Replace Image"
                          : "Choose Image"}

                      </button>

                      <p className="mt-3 text-[10px] leading-5 text-[#8B7D78]">
                        JPG, PNG or WebP.
                        Maximum size 5 MB.
                        One image per kitchen
                        product.
                      </p>

                      {imageFile && (
                        <p className="mt-2 truncate text-[10px] font-medium text-[#641F2A]">
                          Selected:{" "}
                          {
                            imageFile.name
                          }
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                {/* FIELDS */}

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  <Field
                    label="Product Title"
                    required
                  >

                    <input
                      name="title"
                      value={
                        form.title
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Modern Modular Kitchen"
                      className={
                        inputClass
                      }
                      required
                    />

                  </Field>

                  <Field label="Category">

                    <input
                      value="Kitchens"
                      readOnly
                      className={`${inputClass} cursor-not-allowed opacity-70`}
                    />

                  </Field>

                  <Field
                    label="Kitchen Type"
                    required
                  >

                    <div className="relative">

                      <select
                        name="subcategory"
                        value={
                          form.subcategory
                        }
                        onChange={
                          handleTypeChange
                        }
                        className={`${inputClass} appearance-none pr-9`}
                      >

                        {KITCHEN_TYPES.map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                            >
                              {type}
                            </option>
                          )
                        )}

                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7C77]"
                      />

                    </div>

                  </Field>

                  <Field label="Price">

                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.price
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. 2700"
                      className={
                        inputClass
                      }
                    />

                  </Field>

                  <Field label="Delivery Text">

                    <input
                      name="delivery_text"
                      value={
                        form.delivery_text
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Delivery All Over Pakistan"
                      className={
                        inputClass
                      }
                    />

                  </Field>

                  <Field label="Status">

                    <div className="relative">

                      <select
                        name="status"
                        value={
                          form.status
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} appearance-none pr-9`}
                      >

                        <option value="active">
                          Active
                        </option>

                        <option value="inactive">
                          Inactive
                        </option>

                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7C77]"
                      />

                    </div>

                  </Field>

                  <Field label="Visibility">

                    <label className="flex h-[46px] cursor-pointer items-center justify-between rounded-xl border border-[#DDD3CB] bg-[#FCFAF7] px-4">

                      <span className="text-xs font-semibold text-[#5E5050]">
                        Featured Product
                      </span>

                      <input
                        type="checkbox"
                        name="featured"
                        checked={
                          form.featured
                        }
                        onChange={
                          handleChange
                        }
                        className="h-4 w-4 accent-[#641F2A]"
                      />

                    </label>

                  </Field>

                </div>

                {/* DESCRIPTION */}

                <div className="mt-5">

                  <Field label="Description">

                    <textarea
                      name="description"
                      rows={5}
                      value={
                        form.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Write a short kitchen description..."
                      className={`${inputClass} h-auto resize-none py-3`}
                    />

                  </Field>

                </div>

                {/* CONFIGURATOR INFORMATION */}

                <div className="mt-6 rounded-2xl border border-[#E2D9D1] bg-[#FBF8F3] p-5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EDE0DA] text-[#641F2A]">

                      <Check
                        size={16}
                      />

                    </div>

                    <div>

                      <h3 className="text-sm font-bold text-[#2C1B1E]">
                        Existing Configurator
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#817471]">
                        The public kitchen configurator
                        remains unchanged. Its layouts,
                        dimensions, 3D builder, kitchen
                        types and existing pricing are
                        controlled by Kitchens.jsx.
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">

                    <ConfigInfo
                      label="Modular"
                      value="PKR 2,700 / sq ft"
                    />

                    <ConfigInfo
                      label="Imported"
                      value="PKR 3,800 / sq ft"
                    />

                    <ConfigInfo
                      label="Pine"
                      value="PKR 3,800 / sq ft"
                    />

                    <ConfigInfo
                      label="Ash"
                      value="PKR 6,200 / sq ft"
                    />

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-2 border-t border-[#E7DED7] bg-[#FCFAF7] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                  className="
                    rounded-xl
                    border
                    border-[#D9CBC2]
                    bg-white
                    px-5
                    py-3
                    text-xs
                    font-bold
                    text-[#5E5050]
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#4A151F]
                    px-5
                    py-3
                    text-xs
                    font-bold
                    text-white
                    hover:bg-[#351018]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Check
                        size={15}
                      />

                      {editingProduct
                        ? "Save Changes"
                        : "Add Kitchen"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

/* ==========================================================================
   COMPONENTS
============================================================================= */

const StatCard = ({
  label,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-[#E0D6CE] bg-white p-5 shadow-[0_6px_25px_rgba(55,35,28,0.035)]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B7770]">
            {label}
          </p>

          <p className="mt-2 font-serif text-4xl font-medium text-[#4A151F]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#817471]">
            {description}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E8E2] text-[#641F2A]">

          <span className="h-2.5 w-2.5 rounded-full bg-[#641F2A]" />

        </div>

      </div>

    </div>
  );
};

const Badge = ({
  children,
}) => {
  return (
    <span className="rounded-full border border-[#D9CBC2] bg-white px-3 py-2 text-[10px] font-bold text-[#641F2A]">
      {children}
    </span>
  );
};

const PriceCard = ({
  title,
  price,
  suffix,
}) => {
  return (
    <div className="rounded-xl border border-[#E2D9D1] bg-[#FBF8F3] px-4 py-3">

      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B7770]">
        {title}
      </p>

      <div className="mt-1 flex items-baseline gap-1">

        <span className="font-serif text-lg font-medium text-[#4A151F]">
          {price}
        </span>

        <span className="text-[10px] text-[#817471]">
          {suffix}
        </span>

      </div>

    </div>
  );
};

const ConfigInfo = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E2D9D1] bg-white px-3 py-2.5">

      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8B7770]">
        {label}
      </span>

      <span className="text-xs font-bold text-[#4A151F]">
        {value}
      </span>

    </div>
  );
};

const Field = ({
  label,
  required = false,
  children,
}) => {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-bold text-[#433639]">

        {label}

        {required && (
          <span className="ml-1 text-[#A34858]">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
};

const inputClass = `
  h-[46px]
  w-full
  rounded-xl
  border
  border-[#DDD3CB]
  bg-[#FCFAF7]
  px-3.5
  text-sm
  text-[#2C1B1E]
  outline-none
  placeholder:text-[#A39A96]
  focus:border-[#641F2A]
  focus:ring-2
  focus:ring-[#641F2A]/10
`;

export default KitchensManagement;