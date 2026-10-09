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

/* =========================================================
   EXISTING WEBSITE DOOR ASSETS

   25 Entrance
   18 Double Entrance
   41 Solid
   3 New Material Doors

   TOTAL = 87
========================================================= */

const entranceAssets = import.meta.glob(
  "../../assets/bdor*.webp",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const doubleAssets = import.meta.glob(
  "../../assets/ddor*.webp",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const solidAssets = import.meta.glob(
  "../../assets/dor*.webp",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

/*
  New material/category doors

  pdor1.webp = Malaysian Plywood
  pdor2.webp = Melamine Plywood
  pdor3.webp = Fiber Door
*/

const materialDoorAssets = import.meta.glob(
  "../../assets/pdor*.webp",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

/* =========================================================
   HELPERS
========================================================= */

const sortAssetEntries = (entries) => {
  return Object.entries(entries)
    .sort(([a], [b]) => {
      const aNumber =
        Number(
          a.match(/(\d+)\.webp$/i)?.[1]
        ) || 0;

      const bNumber =
        Number(
          b.match(/(\d+)\.webp$/i)?.[1]
        ) || 0;

      return aNumber - bNumber;
    })
    .map(([path, url]) => ({
      path,
      url,
      fileName:
        path.split("/").pop() || "",
    }));
};

const entranceAssetsList =
  sortAssetEntries(entranceAssets);

const doubleAssetsList =
  sortAssetEntries(doubleAssets);

const solidAssetsList =
  sortAssetEntries(solidAssets);

const materialDoorAssetsList =
  sortAssetEntries(materialDoorAssets);

/* =========================================================
   EXPECTED EXISTING DESIGNS
========================================================= */

const EXISTING_DESIGNS = [
  /* -------------------------------------------------------
     ENTRANCE DOORS
  ------------------------------------------------------- */

  ...entranceAssetsList.map(
    (asset, index) => ({
      ...asset,

      title:
        `Entrance Door ${index + 1}`,

      subcategory:
        "Entrance Doors",

      description:
        "Elegant entrance door with a refined profile, premium finish and timeless architectural appeal.",

      price: null,
    })
  ),

  /* -------------------------------------------------------
     DOUBLE ENTRANCE DOORS
  ------------------------------------------------------- */

  ...doubleAssetsList.map(
    (asset, index) => ({
      ...asset,

      title:
        `Double Entrance Door ${index + 1}`,

      subcategory:
        "Double Entrance Doors",

      description:
        "A statement double entrance design created for wider spaces and sophisticated architectural settings.",

      price: null,
    })
  ),

  /* -------------------------------------------------------
     SOLID DOORS
  ------------------------------------------------------- */

  ...solidAssetsList.map(
    (asset, index) => ({
      ...asset,

      title:
        `Solid Door ${index + 1}`,

      subcategory:
        "Solid Doors",

      description:
        "A clean solid door design with durable construction and an understated contemporary finish.",

      price: null,
    })
  ),

  /* -------------------------------------------------------
     MALAYSIAN PLYWOOD DOOR
  ------------------------------------------------------- */

  ...(materialDoorAssetsList[0]
    ? [
        {
          ...materialDoorAssetsList[0],

          title:
            "Malaysian Plywood Door",

          subcategory:
            "Malaysian Plywood Doors",

          description:
            "Malaysian plywood door with a durable construction and refined finish. Available in sizes up to 7 feet in height.",

          price: 480,
        },
      ]
    : []),

  /* -------------------------------------------------------
     MELAMINE PLYWOOD DOOR
  ------------------------------------------------------- */

  ...(materialDoorAssetsList[1]
    ? [
        {
          ...materialDoorAssetsList[1],

          title:
            "Melamine Plywood Door",

          subcategory:
            "Melamine Plywood Doors",

          description:
            "Polish-free melamine plywood door with a clean modern finish and semi water-resistant construction. Available in sizes up to 7 feet in height.",

          price: 340,
        },
      ]
    : []),

  /* -------------------------------------------------------
     FIBER DOOR
  ------------------------------------------------------- */

  ...(materialDoorAssetsList[2]
    ? [
        {
          ...materialDoorAssetsList[2],

          title:
            "Fiber Door",

          subcategory:
            "Fiber Doors",

          description:
            "Durable fiber door designed to be water proof, moisture proof and termite proof. Starting from PKR 590 per square foot.",

          price: 590,
        },
      ]
    : []),
];

/* =========================================================
   CONSTANTS
========================================================= */

const CATEGORY = "Doors";

const SUBCATEGORIES = [
  "Entrance Doors",
  "Double Entrance Doors",
  "Solid Doors",
  "Malaysian Plywood Doors",
  "Melamine Plywood Doors",
  "Fiber Doors",
];

const DEFAULT_DELIVERY =
  "Delivery All Over Pakistan";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

/* =========================================================
   FORMAT PRICE
========================================================= */

const formatPrice = (price) => {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "Price on Request";
  }

  const number = Number(price);

  if (Number.isNaN(number)) {
    return "Price on Request";
  }

  return `PKR ${number.toLocaleString(
    "en-PK"
  )}`;
};

/* =========================================================
   SAFE FILE NAME
========================================================= */

const getSafeFileName = (fileName) => {
  return fileName
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

/* =========================================================
   COMPONENT
========================================================= */

const DoorsManagement = () => {
  /* =======================================================
     DATA
  ======================================================= */

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  /* =======================================================
     SEARCH / FILTER
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All");

  /* =======================================================
     MODAL
  ======================================================= */

  const [showModal, setShowModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      price: "",
      subcategory:
        "Entrance Doors",
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

  /* =======================================================
     UI STATES
  ======================================================= */

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [
    importing,
    setImporting,
  ] = useState(false);

  const [
    importProgress,
    setImportProgress,
  ] = useState({
    current: 0,
    total:
      EXISTING_DESIGNS.length,
    currentName: "",
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

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
        "Doors load error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load doors from Supabase."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =======================================================
     FILTERED PRODUCTS
  ======================================================= */

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const matchesSearch =
            !searchValue ||
            product.title
              ?.toLowerCase()
              .includes(searchValue) ||
            product.description
              ?.toLowerCase()
              .includes(searchValue) ||
            product.subcategory
              ?.toLowerCase()
              .includes(searchValue);

          const matchesCategory =
            activeFilter ===
              "All" ||
            product.subcategory ===
              activeFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      search,
      activeFilter,
    ]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const totalDoors =
    products.length;

  const activeDoors =
    products.filter(
      (product) =>
        product.status ===
        "active"
    ).length;

  const inactiveDoors =
    products.filter(
      (product) =>
        product.status ===
        "inactive"
    ).length;

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      subcategory:
        "Entrance Doors",
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

  /* =======================================================
     OPEN ADD
  ======================================================= */

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEditModal = (
    product
  ) => {
    setEditingProduct(product);

    setForm({
      title:
        product.title || "",

      description:
        product.description ||
        "",

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
        "Entrance Doors",

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

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm(
      (current) => ({
        ...current,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );

    setError("");
  };

  /* =======================================================
     IMAGE CHANGE
  ======================================================= */

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

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  /* =======================================================
     UPLOAD IMAGE
  ======================================================= */

  const uploadImage = async (
    file,
    folder = "doors"
  ) => {
    if (!file) return null;

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "webp";

    const safeName =
      getSafeFileName(
        file.name
      ) || "door";

    const uniqueName =
      `${safeName}-${crypto.randomUUID()}.${extension}`;

    const filePath =
      `${folder}/${uniqueName}`;

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

    return publicData.publicUrl;
  };

  /* =======================================================
     DELETE STORAGE IMAGE
  ======================================================= */

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
          "Storage image delete warning:",
          err
        );
      }
    };

  /* =======================================================
     SAVE PRODUCT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.title.trim()
    ) {
      setError(
        "Product title is required."
      );
      return;
    }

    if (
      !form.subcategory
    ) {
      setError(
        "Please select a door category."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    let uploadedImageUrl =
      null;

    try {
      /* ---------------------------------------------------
         UPLOAD NEW IMAGE
      --------------------------------------------------- */

      if (imageFile) {
        uploadedImageUrl =
          await uploadImage(
            imageFile
          );
      }

      /* ---------------------------------------------------
         EDIT
      --------------------------------------------------- */

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
        } = await supabase
          .from("products")
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
          "Door updated successfully."
        );
      } else {
        /* -------------------------------------------------
           ADD NEW
        ------------------------------------------------- */

        if (
          !uploadedImageUrl
        ) {
          setError(
            "Please select a door image."
          );

          setSaving(false);
          return;
        }

        const {
          error: insertError,
        } = await supabase
          .from("products")
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
          "New door added successfully."
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
        "Door save error:",
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
          "Unable to save door."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

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
      } = await supabase
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
          ? "Door is now active on the website."
          : "Door has been hidden from the website."
      );

      setTimeout(
        () =>
          setSuccess(""),
        2500
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update door status."
      );
    }
  };

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  const handleDelete = async (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${product.title}" permanently?\n\nThis will remove the product from the admin panel and public website.`
      );

    if (!confirmed)
      return;

    setDeletingId(
      product.id
    );

    setError("");
    setSuccess("");

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("products")
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
        "Door deleted successfully."
      );

      setTimeout(
        () =>
          setSuccess(""),
        2500
      );
    } catch (err) {
      console.error(
        "Door delete error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete door."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     IMPORT EXISTING DESIGNS
  ======================================================= */

  const importExistingDesigns =
    async () => {
      if (importing) return;

      setImporting(true);
      setError("");
      setSuccess("");

      setImportProgress({
        current: 0,
        total:
          EXISTING_DESIGNS.length,
        currentName:
          "Preparing import...",
      });

      try {
        /* -------------------------------------------------
           VALIDATE ASSETS
        ------------------------------------------------- */

        if (
          EXISTING_DESIGNS.length !==
          87
        ) {
          throw new Error(
            `Expected 87 door assets but found ${EXISTING_DESIGNS.length}. Please check bdor, ddor, dor and pdor files.`
          );
        }

        if (
          materialDoorAssetsList.length <
          3
        ) {
          throw new Error(
            "Expected pdor1.webp, pdor2.webp and pdor3.webp in the assets folder."
          );
        }

        /* -------------------------------------------------
           GET EXISTING PRODUCTS
        ------------------------------------------------- */

        const {
          data: existingProducts,
          error: existingError,
        } = await supabase
          .from("products")
          .select(
            `
              id,
              title,
              subcategory,
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

        /* -------------------------------------------------
           DUPLICATE MAP
        ------------------------------------------------- */

        const existingMap =
          new Map();

        (
          existingProducts || []
        ).forEach(
          (product) => {
            const key =
              `${product.subcategory || ""}::${product.title || ""}`
                .trim()
                .toLowerCase();

            if (key) {
              existingMap.set(
                key,
                product
              );
            }
          }
        );

        let imported = 0;
        let skipped = 0;

        /* -------------------------------------------------
           PROCESS ONE BY ONE
        ------------------------------------------------- */

        for (
          let index = 0;
          index <
          EXISTING_DESIGNS.length;
          index++
        ) {
          const design =
            EXISTING_DESIGNS[
              index
            ];

          setImportProgress({
            current:
              index + 1,

            total:
              EXISTING_DESIGNS.length,

            currentName:
              design.title,
          });

          const duplicateKey =
            `${design.subcategory}::${design.title}`
              .trim()
              .toLowerCase();

          /* -----------------------------------------------
             SKIP DUPLICATE
          ----------------------------------------------- */

          if (
            existingMap.has(
              duplicateKey
            )
          ) {
            skipped++;
            continue;
          }

          /* -----------------------------------------------
             FETCH LOCAL VITE ASSET
          ----------------------------------------------- */

          const response =
            await fetch(
              design.url
            );

          if (!response.ok) {
            throw new Error(
              `Unable to read ${design.fileName} from assets.`
            );
          }

          const blob =
            await response.blob();

          /* -----------------------------------------------
             EXTENSION
          ----------------------------------------------- */

          const extension =
            design.fileName
              .split(".")
              .pop()
              ?.toLowerCase() ||
            "webp";

          const safeBase =
            getSafeFileName(
              design.title
            );

          /* -----------------------------------------------
             STORAGE PATH
          ----------------------------------------------- */

          const storageCategory =
            design.subcategory
              .toLowerCase()
              .replace(
                /[^a-z0-9]+/g,
                "-"
              );

          const storagePath =
            `doors/existing/${storageCategory}/${safeBase}.${extension}`;

          /* -----------------------------------------------
             UPLOAD
          ----------------------------------------------- */

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
            publicData.publicUrl;

          /* -----------------------------------------------
             INSERT DATABASE RECORD
          ----------------------------------------------- */

          const {
            data: insertedProduct,
            error: insertError,
          } =
            await supabase
              .from("products")
              .insert({
                title:
                  design.title,

                description:
                  design.description,

                price:
                  design.price ??
                  null,

                category:
                  CATEGORY,

                subcategory:
                  design.subcategory,

                image_url:
                  imageUrl,

                delivery_text:
                  DEFAULT_DELIVERY,

                status:
                  "active",

                featured:
                  false,
              })
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

        /* -------------------------------------------------
           RELOAD
        ------------------------------------------------- */

        await loadProducts();

        /* -------------------------------------------------
           SUCCESS
        ------------------------------------------------- */

        setSuccess(
          `Import complete: ${imported} new designs imported, ${skipped} already existed. Total available designs: 87.`
        );

        setTimeout(
          () =>
            setSuccess(""),
          6000
        );
      } catch (err) {
        console.error(
          "Existing doors import error:",
          err
        );

        setError(
          err?.message ||
            "Unable to import existing door designs."
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

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F7F2EA]">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

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
                Doors
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#7D716D]">
                Manage all Entrance, Double
                Entrance, Solid and
                Material Door products
                displayed on the public
                website.
              </p>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <button
                type="button"
                onClick={
                  importExistingDesigns
                }
                disabled={importing}
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

                Add New Door
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            ALERTS
        ================================================= */}

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
              className="shrink-0"
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

        {/* =================================================
            IMPORT PROGRESS
        ================================================= */}

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
              Please keep this page open
              while the 87 existing door
              designs are being uploaded.
            </p>

          </div>
        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            label="Total Doors"
            value={totalDoors}
            description="All door products"
          />

          <StatCard
            label="Active"
            value={activeDoors}
            description="Currently visible"
          />

          <StatCard
            label="Inactive"
            value={inactiveDoors}
            description="Hidden from website"
          />

        </div>

        {/* =================================================
            EXISTING COLLECTION INFO
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-[#DCCFC6] bg-[#FBF8F3] p-5 sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A7772]">
                Existing Designs
              </p>

              <div className="mt-2 flex items-baseline gap-2">

                <span className="font-serif text-4xl font-medium text-[#4A151F]">
                  {
                    EXISTING_DESIGNS.length
                  }
                </span>

                <span className="text-xs font-semibold text-[#817471]">
                  website designs ready
                  to import
                </span>

              </div>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-[#817471]">
                The collection contains
                25 Entrance Doors, 18
                Double Entrance Doors,
                41 Solid Doors and 3
                Material Doors:
                Malaysian Plywood,
                Melamine Plywood and
                Fiber.
                Importing again will
                automatically skip
                designs that already
                exist.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <Badge>
                25 Entrance
              </Badge>

              <Badge>
                18 Double Entrance
              </Badge>

              <Badge>
                41 Solid
              </Badge>

              <Badge>
                1 Malaysian Plywood
              </Badge>

              <Badge>
                1 Melamine Plywood
              </Badge>

              <Badge>
                1 Fiber
              </Badge>

            </div>

          </div>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-[#E0D6CE] bg-white p-4 shadow-[0_6px_25px_rgba(55,35,28,0.035)]">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-md">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#978983]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search doors..."
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

            {/* Filters */}

            <div className="flex flex-wrap items-center gap-2">

              {[
                "All",
                ...SUBCATEGORIES,
              ].map(
                (filter) => {
                  const active =
                    activeFilter ===
                    filter;

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
                        px-3
                        py-2
                        text-[11px]
                        font-bold
                        transition
                        ${
                          active
                            ? "bg-[#4A151F] text-white"
                            : "bg-[#F3ECE5] text-[#685A57] hover:bg-[#E9DED6]"
                        }
                      `}
                    >
                      {
                        filter
                      }
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

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E0D6CE] bg-white shadow-[0_6px_25px_rgba(55,35,28,0.035)]">

          {/* Desktop */}

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full min-w-[950px] border-collapse">

              <thead>

                <tr className="border-b border-[#E6DDD6] bg-[#FBF8F3]">

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7770]">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7770]">
                    Category
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

                      <p className="mt-3 text-xs font-medium text-[#817471]">
                        Loading doors...
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
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1E9E2] text-[#641F2A]">
                        <Search size={19} />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-[#332326]">
                        No doors found
                      </p>

                      <p className="mt-1 text-xs text-[#817471]">
                        Try another
                        search or
                        category.
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

                        {/* Product */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-4">

                            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E0D6CE] bg-[#F1EAE3]">

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

                              <p className="mt-1 max-w-[360px] truncate text-xs text-[#817471]">
                                {
                                  product.description ||
                                  "No description"
                                }
                              </p>

                              <p className="mt-1 text-[10px] font-medium text-[#A08F89]">
                                {
                                  product.delivery_text ||
                                  DEFAULT_DELIVERY
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Category */}

                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-full bg-[#F1E7E3] px-3 py-1.5 text-[10px] font-bold text-[#641F2A]">
                            {
                              product.subcategory ||
                              "Uncategorized"
                            }
                          </span>

                        </td>

                        {/* Price */}

                        <td className="px-5 py-4">

                          <p className="text-sm font-bold text-[#3E2A2E]">
                            {formatPrice(
                              product.price
                            )}
                          </p>

                        </td>

                        {/* Status */}

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

                        {/* Actions */}

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
                                transition
                                hover:border-[#A58A90]
                                hover:bg-[#F7F1EB]
                                hover:text-[#4A151F]
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
                                transition
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

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="lg:hidden">

            {loading ? (
              <div className="px-5 py-20 text-center">

                <Loader2
                  size={25}
                  className="mx-auto animate-spin text-[#641F2A]"
                />

                <p className="mt-3 text-xs text-[#817471]">
                  Loading doors...
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
                  No doors found
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

                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E0D6CE] bg-[#F1EAE3]">

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
                                  product.subcategory
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

        {/* =================================================
            FOOTER INFO
        ================================================= */}

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
            door products.
          </p>

          <p>
            Changes are synced with the
            public website.
          </p>

        </div>

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

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

            {/* Header */}

            <div className="flex items-center justify-between border-b border-[#E7DED7] px-5 py-4 sm:px-6">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8B7770]">
                  {editingProduct
                    ? "Edit Website Product"
                    : "Create Website Product"}
                </p>

                <h2 className="mt-1 font-serif text-2xl font-medium text-[#2C1B1E]">
                  {editingProduct
                    ? "Edit Door"
                    : "Add New Door"}
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
                  transition
                  hover:bg-[#E9DFD7]
                  disabled:opacity-50
                "
              >
                <X size={17} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-6">

                {/* Error */}

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

                {/* Image */}

                <div>

                  <label className="text-xs font-bold text-[#433639]">
                    Product Image
                  </label>

                  <div className="mt-2 grid gap-4 sm:grid-cols-[160px_1fr]">

                    <div className="aspect-[4/5] overflow-hidden rounded-xl border border-[#DDD3CB] bg-[#F1EAE3]">

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

                {/* Fields */}

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  {/* Title */}

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
                      placeholder="e.g. Malaysian Plywood Door"
                      className={
                        inputClass
                      }
                      required
                    />
                  </Field>

                  {/* Category */}

                  <Field
                    label="Door Category"
                    required
                  >
                    <div className="relative">

                      <select
                        name="subcategory"
                        value={
                          form.subcategory
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} appearance-none pr-9`}
                        required
                      >

                        {SUBCATEGORIES.map(
                          (
                            category
                          ) => (
                            <option
                              key={
                                category
                              }
                              value={
                                category
                              }
                            >
                              {
                                category
                              }
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

                  {/* Price */}

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
                      placeholder="e.g. 45000"
                      className={
                        inputClass
                      }
                    />

                  </Field>

                  {/* Delivery */}

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

                  {/* Status */}

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

                  {/* Featured */}

                  <Field label="Website Visibility">

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

                {/* Description */}

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
                      placeholder="Write a short product description..."
                      className={`${inputClass} resize-none`}
                    />

                  </Field>

                </div>

              </div>

              {/* Footer */}

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
                    transition
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
                        : "Add Door"}
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

/* =========================================================
   STAT CARD
========================================================= */

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

/* =========================================================
   BADGE
========================================================= */

const Badge = ({
  children,
}) => {
  return (
    <span className="rounded-full border border-[#D9CBC2] bg-white px-3 py-2 text-[10px] font-bold text-[#641F2A]">
      {children}
    </span>
  );
};

/* =========================================================
   FIELD
========================================================= */

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

/* =========================================================
   INPUT CLASS
========================================================= */

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

/* =========================================================
   EXPORT
========================================================= */

export default DoorsManagement;
