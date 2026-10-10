import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

import {
  ArrowDown,
  Check,
  Maximize2,
  MessageCircle,
  X,
} from "lucide-react";

/* =========================================================
   LOCAL DOOR ASSETS
========================================================= */

const entranceAssets = import.meta.glob("../assets/bdor*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const doubleAssets = import.meta.glob("../assets/ddor*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const solidAssets = import.meta.glob("../assets/dor*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const retailAssets = import.meta.glob("../assets/pdor*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const sortAssets = (assets) =>
  Object.entries(assets)
    .sort(([a], [b]) => {
      const numberA = Number(a.match(/(\d+)\.webp$/i)?.[1] || 0);
      const numberB = Number(b.match(/(\d+)\.webp$/i)?.[1] || 0);

      return numberA - numberB;
    })
    .map(([, value]) => value);

const entranceImages = sortAssets(entranceAssets);
const doubleEntranceImages = sortAssets(doubleAssets);
const solidImages = sortAssets(solidAssets);
const localRetailImages = sortAssets(retailAssets);

// Retail products use their own images, never in the entrance-door category.
const retailImages = [
  // pdor1.webp is the Malaysian plywood door and must appear in Retail Doors.
  localRetailImages[0] || localRetailImages[1] || null,
  "https://nplhmugotsnxphlrxpud.supabase.co/storage/v1/object/public/product-images/doors/existing/melamine-plywood-doors/melamine-plywood-door.webp",
  "https://nplhmugotsnxphlrxpud.supabase.co/storage/v1/object/public/product-images/doors/existing/fiber-doors/fiber-door.webp",
];


/* =========================================================
   WHATSAPP
========================================================= */

const WHATSAPP_NUMBER = "923238430015";

/* =========================================================
   PRICE FORMAT
========================================================= */

const formatPrice = (price, unit = "") => {
  if (price === null || price === undefined || price === "") {
    return "Price on Request";
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Price on Request";
  }

  const formatted = numericPrice.toLocaleString("en-PK");

  return unit
    ? `PKR ${formatted}/${unit}`
    : `PKR ${formatted}`;
};

/* =========================================================
   FALLBACK PRODUCTS
========================================================= */

const createProducts = (images, category, prefix) =>
  images.map((image, index) => {
    let description;

    if (category === "Entrance Door") {
      description =
        "Elegant entrance door with a refined profile, premium finish and timeless architectural appeal.";
    } else if (category === "Double Entrance Door") {
      description =
        "A statement double entrance design created for wider spaces and sophisticated architectural settings.";
    } else {
      description =
        "A clean solid door design with durable construction and an understated contemporary finish.";
    }

    return {
      id: `${prefix}-${index + 1}`,
      image,
      category,
      categoryId: prefix,
      subcategory:
        prefix === "entrance"
          ? "Entrance Doors"
          : prefix === "double"
            ? "Double Entrance Doors"
            : "Solid Doors",
      title: `${category} ${index + 1}`,
      description,
      price: null,
      priceUnit: "",
      delivery_text: "Delivery All Over Pakistan",
      features: [],
      material: "",
    };
  });

/* =========================================================
   RETAIL PRODUCTS
   pdor1.webp, pdor2.webp, pdor3.webp
   (only shown inside Retail Doors)
========================================================= */

const retailDefinitions = [
{
imageIndex: 0,
id: "retail-malaysian-plywood",
category: "Retail Door",
title: "Melamine Plywood Door",
description:
"Polish-free melamine plywood door with a clean modern finish and semi water-resistant construction. Available in sizes up to 7 feet in height.",
price: null,
material: "Melamine Plywood Door",
features: [
"Durable construction",
"Refined finish",
"Available in sizes up to 7 feet in height",
],
},
{
imageIndex: 1,
id: "retail-melamine-plywood",
category: "Retail Door",
title: "Fiber Door",
description:
"Durable fiber door designed to be water proof, moisture proof and termite proof. Starting from PKR 590 per square foot.",
price: null,
material: "Fiber Door",
features: [
"Polish-free finish",
"Clean modern finish",
"Semi water-resistant construction",
"Available in sizes up to 7 feet in height",
],
},
{
imageIndex: 2,
id: "retail-fiber",
category: "Retail Door",
title: "Malaysian Plywood Door",
description:
"Malaysian plywood door with a durable construction and refined finish. Available in sizes up to 7 feet in height.",
price: null,
material: "Malaysian Plywood Door",
features: [
"Durable construction",
"Water proof",
"Moisture proof",
"Termite proof",
],
},
];


const retailProducts = retailDefinitions
  .map((item) => ({
    ...item,
    image: retailImages[item.imageIndex],
    categoryId: "retail",
    subcategory: "Retail Doors",
    priceUnit: "sq.ft",
    delivery_text: "Delivery All Over Pakistan",
  }))
  .filter((product) => Boolean(product.image));

/* =========================================================
   ALL LOCAL PRODUCTS
========================================================= */

const fallbackProducts = [
  ...createProducts(entranceImages, "Entrance Door", "entrance"),
  ...createProducts(
    doubleEntranceImages,
    "Double Entrance Door",
    "double"
  ),
  ...createProducts(solidImages, "Solid Door", "solid"),
  ...retailProducts,
];

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    id: "entrance",
    label: "Entrance Doors",
    shortLabel: "Entrance Doors",
    subcategory: "Entrance Doors",
  },
  {
    id: "double",
    label: "Double Entrance Doors",
    shortLabel: "Double Doors",
    subcategory: "Double Entrance Doors",
  },
  {
    id: "solid",
    label: "Solid Doors",
    shortLabel: "Solid Doors",
    subcategory: "Solid Doors",
  },
  {
    id: "retail",
    label: "Retail Doors",
    shortLabel: "Retail Doors",
    subcategory: "Retail Doors",
  },
];

/* =========================================================
   MARQUEE DATA
========================================================= */

const woodNames = [
  "Mahogany",
  "Ash Wood",
  "African Teak",
  "Sepali",
  "Red Oak",
  "Yellow Pine",
  "Kail",
  "Partal",
  "Green Maple",
];

const flushMaterials = [
  "Red Oak Veneer",
  "Mahogany Veneer",
  "Teak Veneer",
  "Sheesham Veneer",
  "Plain HDX",
  "Plain HDF",
  "Plain MDF",
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Doors() {
  const productsRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("entrance");
  const [products, setProducts] = useState(fallbackProducts);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [imageFit, setImageFit] = useState("cover");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
  });

  /* =======================================================
     LOAD SUPABASE PRODUCTS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadDoors = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            title,
            description,
            price,
            category,
            subcategory,
            image_url,
            delivery_text,
            status,
            created_at
          `)
          .eq("category", "Doors")
          .eq("status", "active")
          .order("created_at", { ascending: true });

        if (!mounted) return;

        if (error) {
          console.error("Public doors load error:", error);
          setProducts(fallbackProducts);
          setProductsLoaded(true);
          return;
        }

        const databaseProducts = (data || [])
          .filter((product) => product.image_url)
          .map((product) => {
            const subcategory = product.subcategory || "";
            const lowerSubcategory = subcategory.toLowerCase();
            const searchableName =
              `${product.title || ""} ${product.description || ""} ${subcategory}`.toLowerCase();

            let category = "Entrance Door";
            let categoryId = "entrance";
            let normalizedSubcategory = "Entrance Doors";
            let priceUnit = "";

            if (
              lowerSubcategory.includes("specialty") ||
              lowerSubcategory.includes("retail") ||
              searchableName.includes("malaysian plywood") ||
              searchableName.includes("melamine plywood") ||
              searchableName.includes("fiber door") ||
              searchableName.includes("fibre door")
            ) {
              category = "Retail Door";
              categoryId = "retail";
              normalizedSubcategory = "Retail Doors";
              priceUnit = "sq.ft";
            } else if (
              lowerSubcategory.includes("double") ||
              searchableName.includes("double entrance")
            ) {
              category = "Double Entrance Door";
              categoryId = "double";
              normalizedSubcategory = "Double Entrance Doors";
            } else if (
              lowerSubcategory.includes("solid") ||
              lowerSubcategory.includes("interior door")
            ) {
              category = "Solid Door";
              categoryId = "solid";
              normalizedSubcategory = "Solid Doors";
            } else if (
              lowerSubcategory.includes("entrance") ||
              searchableName.includes("entrance door")
            ) {
              category = "Entrance Door";
              categoryId = "entrance";
              normalizedSubcategory = "Entrance Doors";
            } else {
              // Unknown categories are excluded from entrance/solid grids.
              category = "Retail Door";
              categoryId = "retail";
              normalizedSubcategory = "Retail Doors";
              priceUnit = "sq.ft";
            }

            return {
              id: `db-${product.id}`,
              image: product.image_url,
              category,
              categoryId,
              subcategory: normalizedSubcategory,
              title: product.title || category,
              description: product.description || "",
              price: product.price,
              priceUnit,
              delivery_text:
                product.delivery_text ||
                "Delivery All Over Pakistan",
              material: "",
              features: [],
            };
          })
          // Retail Doors always come only from pdor1 - pdor3
          .filter((product) => product.categoryId !== "retail");

        /*
         * Keep database products and preserve local assets for
         * categories which have no database products.
         *
         * Retail products always come from pdor1-pdor3.
         */

        const databaseSubcategories = new Set(
          databaseProducts.map((product) => product.subcategory)
        );

        const missingLocalProducts = fallbackProducts.filter(
          (product) =>
            product.categoryId !== "retail" &&
            !databaseSubcategories.has(product.subcategory)
        );

        setProducts([
          ...databaseProducts,
          ...missingLocalProducts,
          ...retailProducts,
        ]);

        setProductsLoaded(true);
      } catch (error) {
        console.error("Doors loading exception:", error);

        if (!mounted) return;

        setProducts(fallbackProducts);
        setProductsLoaded(true);
      }
    };

    loadDoors();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const selectedCategory = categories.find(
      (category) => category.id === activeCategory
    );

    if (!productsLoaded || !selectedCategory) {
      return [];
    }

    return products.filter(
      (product) =>
        product.subcategory === selectedCategory.subcategory
    );
  }, [products, productsLoaded, activeCategory]);

  /* =======================================================
     SCROLL
  ======================================================= */

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const changeCategory = (categoryId) => {
    setActiveCategory(categoryId);

    window.setTimeout(() => {
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  /* =======================================================
     MODAL OPEN / CLOSE
  ======================================================= */

  const openProduct = (product) => {
    setSelectedProduct(product);
    setInquiryOpen(false);
    setSubmitted(false);
    setImageFit("cover");
    setForm({
      name: "",
      phone: "",
      city: "",
    });

    document.body.style.overflow = "hidden";
  };

  const openInquiry = (product) => {
    setSelectedProduct(product);
    setInquiryOpen(true);
    setSubmitted(false);
    setImageFit("cover");
    setForm({
      name: "",
      phone: "",
      city: "",
    });

    document.body.style.overflow = "hidden";
  };

  const closeInquiry = () => {
    setSelectedProduct(null);
    setInquiryOpen(false);
    setSubmitted(false);
    setImageFit("cover");
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeInquiry();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, []);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     WHATSAPP SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedProduct || submitted) return;

    const priceText = formatPrice(
      selectedProduct.price,
      selectedProduct.priceUnit
    );

    const featureText = selectedProduct.features?.length
      ? selectedProduct.features.map((item) => `• ${item}`).join("\n")
      : "• Customized according to requirements";

    const materialText = selectedProduct.material
      ? `Material: ${selectedProduct.material}`
      : "";

    const message = `
Hello, I am interested in this door.

Product: ${selectedProduct.title}
Category: ${selectedProduct.category}
Price: ${priceText}
${materialText}
Delivery: ${selectedProduct.delivery_text || "Delivery All Over Pakistan"}

Product Features:
${featureText}

Name: ${form.name}
Phone: ${form.phone}
City: ${form.city}

Please share more details, available options and final pricing.

Door Construction Options:
- Solid Door — Starting from PKR 45,000
- Semi-Solid Door — Starting from PKR 24,000
- Engineered Solid Door — Starting from PKR 16,000
- Flush Door — Custom Quote

Prices may vary depending on size, design, wood/material selection, finish and customization.
    `.trim();

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setSubmitted(true);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    closeInquiry();
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#241719]">
      {/* HERO */}

      <section className="relative overflow-hidden bg-[#4A151F] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#351019] via-[#4A151F] to-[#671F2C]" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8E9E5]/[0.06] blur-[100px]" />

        <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/[0.08]" />

        <div className="pointer-events-none absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/[0.08]" />

        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-center justify-center px-5 pb-20 pt-32 text-center sm:min-h-[540px] sm:px-8 sm:pt-36 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />

              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#F8E9E5]/75 sm:text-xs">
                Crafted Door Collection
              </p>

              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />
            </div>

            <h1 className="font-serif text-4xl font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-5xl lg:text-7xl">
              Doors Designed to
              <span className="mt-1 block text-[#E8CFC8]">
                Define Your Space
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Discover a refined collection of entrance, double entrance,
              solid and retail doors, thoughtfully designed to bring
              character, craftsmanship and timeless elegance to your space.
            </p>

            <button
              type="button"
              onClick={scrollToProducts}
              className="group mx-auto mt-9 inline-flex items-center gap-2.5 rounded-full border border-[#F8E9E5]/25 bg-[#F8E9E5]/[0.08] px-6 py-3 text-xs font-semibold tracking-wide text-white backdrop-blur-sm transition duration-300 hover:bg-[#F8E9E5]/[0.14]"
            >
              Explore Collection
              <ArrowDown
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-y-0.5"
              />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#F8E9E5]/30 to-transparent" />
      </section>

      {/* MATERIAL MARQUEE */}

      <section className="overflow-hidden border-b border-[#D9CEC6] bg-[#EFE7DF]">
        <div className="overflow-hidden border-b border-[#D9CEC6]">
          <div className="flex min-w-max animate-[marquee_32s_linear_infinite] items-center py-4">
            {[...woodNames, ...woodNames].map((wood, index) => (
              <React.Fragment key={`wood-${index}`}>
                <span className="mx-5 whitespace-nowrap font-serif text-sm font-medium tracking-wide text-[#4A151F] sm:mx-8 sm:text-base">
                  {wood}
                </span>

                <span className="h-1 w-1 rounded-full bg-[#9A5360]" />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex min-w-max animate-[marqueeReverse_38s_linear_infinite] items-center py-3.5">
            {[...flushMaterials, ...flushMaterials].map((material, index) => (
              <React.Fragment key={`material-${index}`}>
                <span className="mx-5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-[#72565B] sm:mx-8 sm:text-xs">
                  {material}
                </span>

                <span className="h-1 w-1 rounded-full bg-[#B28A8F]" />
              </React.Fragment>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          @keyframes marqueeReverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* COLLECTION */}

      <section
        ref={productsRef}
        className="scroll-mt-8 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7B4B54] sm:text-xs">
              Our Door Collection
            </p>

            <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.02em] text-[#2C1B1E] sm:text-4xl md:text-5xl">
              Crafted for Beautiful Spaces
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#766B68]">
              Explore our collection by door type and discover designs made
              to complement your interior and architectural style.
            </p>
          </div>

          {/* CATEGORY BUTTONS */}

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {categories.map((category) => {
              const active = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => changeCategory(category.id)}
                  className={`rounded-full border px-4 py-2.5 text-xs font-semibold tracking-wide transition duration-300 sm:px-5 sm:py-3 sm:text-sm ${
                    active
                      ? "border-[#4A151F] bg-[#4A151F] text-white shadow-[0_8px_24px_rgba(74,21,31,0.16)]"
                      : "border-[#D9CEC7] bg-[#EFE8E0] text-[#4A151F] hover:border-[#9B7A7F] hover:bg-[#E9DFD7]"
                  }`}
                >
                  {category.shortLabel}
                </button>
              );
            })}
          </div>

          {/* CURRENT CATEGORY */}

          <div className="mt-12 flex flex-col items-center justify-between gap-2 border-b border-[#DDD4CC] pb-5 text-center sm:flex-row sm:items-end sm:text-left">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#958680]">
                Currently Viewing
              </p>

              <h3 className="mt-1 font-serif text-2xl font-medium text-[#2C1B1E] sm:text-3xl">
                {categories.find((item) => item.id === activeCategory)?.label}
              </h3>
            </div>

            <p className="text-xs text-[#807470] sm:text-sm">
              {productsLoaded
                ? `${filteredProducts.length} designs`
                : "Loading designs..."}
            </p>
          </div>

          {/* PRODUCT GRID */}

          {!productsLoaded ? (
            <div className="mt-10 flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#D8CBC2] border-t-[#4A151F]" />

                <p className="mt-4 text-xs font-medium text-[#817471]">
                  Loading door collection...
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mt-8 flex min-h-[220px] items-center justify-center rounded-2xl border border-[#DDD4CC] bg-[#FBF8F3] px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE7DF] text-[#4A151F]">
                  <Maximize2 size={19} />
                </div>

                <h3 className="mt-4 font-serif text-xl font-medium text-[#2C1B1E]">
                  No doors available
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#817471]">
                  New designs will appear here when they are added to the collection.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-xl border border-[#E1D9D1] bg-[#FBF9F5] shadow-[0_5px_20px_rgba(55,35,28,0.035)]"
                >
                  <button
                    type="button"
                    onClick={() => openProduct(product)}
                    className="relative block w-full overflow-hidden bg-[#E7DED5] text-left"
                    aria-label={`View details for ${product.title}`}
                  >
                    <div className="aspect-[4/5]">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    </div>

                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-md">
                      <Maximize2 size={15} strokeWidth={1.8} />
                    </span>
                  </button>

                  <div className="p-3.5 sm:p-5">
                    <h3 className="line-clamp-1 font-serif text-sm font-medium text-[#2C1B1E] sm:text-base">
                      {product.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-[10px] leading-5 text-[#756B68] sm:text-xs sm:leading-6">
                      {product.description}
                    </p>

                    {product.price !== null &&
                      product.price !== undefined &&
                      product.price !== "" && (
                        <p className="mt-2 font-serif text-sm font-semibold text-[#4A151F] sm:text-base">
                          From {formatPrice(product.price, product.priceUnit)}
                        </p>
                      )}

                    <p className="mt-2 text-[10px] font-bold leading-5 text-[#4A151F] sm:text-xs sm:leading-6">
                      {product.delivery_text}
                    </p>

                    <button
                      type="button"
                      onClick={() => openInquiry(product)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A151F] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#361018]"
                    >
                      <MessageCircle size={15} />
                      WhatsApp Inquiry
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* RETAIL NOTE */}

          {activeCategory === "retail" && (
            <div className="mt-7 rounded-2xl border border-[#D9C7C0] bg-[#4A151F] px-5 py-5 text-center sm:px-7">
              <p className="font-serif text-lg font-medium text-white sm:text-xl">
                More Designs Available
              </p>

              <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-white/65 sm:text-sm">
                The designs displayed represent our selected available options.
                For additional designs, custom requirements or material selections,
                please contact our team.
              </p>
            </div>
          )}

          {/* DOOR PRICING */}

          <div className="mt-12 overflow-hidden rounded-2xl border border-[#DDD2CA] bg-[#FBF8F3]">
            <div className="border-b border-[#E1D8D0] bg-[#EFE7DF] px-5 py-5 sm:px-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7B4B54]">
                Door Construction & Pricing
              </p>

              <h3 className="mt-1.5 font-serif text-xl font-medium text-[#2C1B1E] sm:text-2xl">
                Crafted to your requirements
              </h3>
            </div>

            <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-sm leading-7 text-[#766B68]">
                  All our door designs can be customized according to your
                  preferred material, size, design, finish and architectural
                  requirements.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["Solid", "PKR 45,000+"],
                    ["Semi Solid", "PKR 24,000+"],
                    ["Engineered", "PKR 16,000+"],
                  ].map(([label, price]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-[#E1D8D0] bg-white p-4"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B7770]">
                        {label}
                      </p>

                      <p className="mt-1 font-serif text-lg font-medium text-[#4A151F]">
                        {price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#E1D8D0] bg-[#F5F0E9] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7B4B54]">
                  Available Options
                </p>

                <p className="mt-3 text-sm leading-7 text-[#655956]">
                  All doors can be made in:
                </p>

                <ul className="mt-3 space-y-2">
                  {[
                    "Solid Door",
                    "Semi-Solid Door",
                    "Engineered Solid Door",
                    "Flush Door",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs font-medium text-[#4A151F]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9A5360]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 border-t border-[#DDD2CA] pt-4 text-[11px] leading-5 text-[#8A7A75]">
                  Prices may vary according to door size, design, material,
                  finish and customization requirements.
                </p>
              </div>
            </div>
          </div>

          {/* GRAND ENTRANCE */}

          <div className="mt-5 rounded-2xl border border-[#D9C7C0] bg-gradient-to-r from-[#4A151F] to-[#671F2C] px-5 py-6 text-white sm:px-7 sm:py-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E8CFC8]/70">
                  Grand Entrance Doors
                </p>

                <h3 className="mt-1.5 font-serif text-2xl font-medium sm:text-3xl">
                  Statement doors for grand spaces
                </h3>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-white/65 sm:text-sm">
                  Custom grand entrance doors available for impressive
                  architectural spaces with heights ranging from{" "}
                  <span className="font-semibold text-[#E8CFC8]">
                    10' to 26'
                  </span>.
                </p>
              </div>

              <div className="shrink-0 rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-center text-xs font-semibold tracking-wide text-[#F3E4DF]">
                10' – 26' Height
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS / WHATSAPP MODAL */}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/70 p-3 backdrop-blur-md sm:p-5 lg:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeInquiry();
            }
          }}
        >
          <div className="relative flex h-[min(90vh,780px)] w-full max-w-6xl overflow-hidden rounded-2xl bg-[#FBF9F5] shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:rounded-3xl">
            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeInquiry}
              aria-label="Close product details"
              className="absolute right-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition hover:bg-[#4A151F] sm:right-5 sm:top-5"
            >
              <X size={19} strokeWidth={2} />
            </button>

            {/* DESKTOP IMAGE */}

            <div className="relative hidden h-full w-[52%] overflow-hidden bg-[#E7DED5] lg:block">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className={`h-full w-full transition-all duration-300 ${
                  imageFit === "cover"
                    ? "object-cover"
                    : "object-contain p-8"
                }`}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

              <button
                type="button"
                onClick={() =>
                  setImageFit((previous) =>
                    previous === "cover" ? "contain" : "cover"
                  )
                }
                aria-label="Toggle image crop"
                className="absolute bottom-5 left-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition hover:bg-[#4A151F]/80"
              >
                <Maximize2 size={17} strokeWidth={1.8} />
              </button>

              <div className="absolute bottom-5 left-16 right-5 z-10">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/65">
                  {selectedProduct.category}
                </p>

                <h3 className="mt-1 font-serif text-2xl font-medium text-white sm:text-3xl">
                  {selectedProduct.title}
                </h3>
              </div>
            </div>

            {/* MOBILE IMAGE */}

            <div className="absolute left-0 right-0 top-0 h-[34%] overflow-hidden bg-[#E7DED5] lg:hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className={`h-full w-full ${
                  imageFit === "cover"
                    ? "object-cover"
                    : "object-contain p-5"
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5" />

              <button
                type="button"
                onClick={() =>
                  setImageFit((previous) =>
                    previous === "cover" ? "contain" : "cover"
                  )
                }
                aria-label="Toggle image crop"
                className="absolute bottom-4 left-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md"
              >
                <Maximize2 size={16} strokeWidth={1.8} />
              </button>
            </div>

            {/* RIGHT SIDE */}

            <div
              className={`flex h-full w-full flex-col overflow-hidden bg-[#FBF9F5] lg:w-[48%] ${
                inquiryOpen ? "pt-[34%]" : "pt-[34%]"
              } lg:pt-0`}
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
                <div className="pr-10">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#8A7772]">
                    Product Details
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-[#2C1B1E] sm:text-3xl">
                    {selectedProduct.title}
                  </h2>

                  <p className="mt-2 text-xs font-medium text-[#8B666D]">
                    {selectedProduct.category}
                  </p>
                </div>

                <div className="my-6 h-px bg-[#E1D8D0]" />

                <p className="text-sm leading-7 text-[#6F6260]">
                  {selectedProduct.description}
                </p>

                {/* FEATURES */}

                {selectedProduct.features?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A7772]">
                      Product Highlights
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {selectedProduct.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2.5 rounded-xl border border-[#E2D9D1] bg-white px-3.5 py-3"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFE2DF] text-[#4A151F]">
                            <Check size={12} strokeWidth={2.5} />
                          </span>

                          <span className="text-xs font-medium text-[#554846]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MATERIAL */}

                {selectedProduct.material && (
                  <div className="mt-5 rounded-xl border border-[#E1D5CD] bg-[#F4EEE8] px-4 py-3.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A7772]">
                      Material
                    </p>

                    <p className="mt-1 font-serif text-base font-medium text-[#4A151F]">
                      {selectedProduct.material}
                    </p>
                  </div>
                )}

                {/* PRICE AND DELIVERY */}

                <div className="mt-5 rounded-xl border border-[#E1D5CD] bg-[#F4EEE8] px-4 py-3.5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A7772]">
                        Product Price
                      </p>

                      <p className="mt-1 font-serif text-lg font-medium text-[#4A151F]">
                        {formatPrice(
                          selectedProduct.price,
                          selectedProduct.priceUnit
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A7772]">
                        Delivery
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-[#4A151F]">
                        {selectedProduct.delivery_text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RETAIL NOTE */}

                {selectedProduct.categoryId === "retail" && (
                  <div className="mt-5 rounded-xl border border-[#D9C7C0] bg-[#EFE5DE] px-4 py-3.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7B4B54]">
                      Collection Note
                    </p>

                    <p className="mt-2 text-xs leading-6 text-[#655956]">
                      These are selected designs from our current collection.
                      For more designs, custom dimensions or additional
                      material options, please contact our team.
                    </p>
                  </div>
                )}

                {/* CONSTRUCTION OPTIONS */}

                <div className="mt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A7772]">
                    Available Door Construction
                  </p>

                  <div className="mt-3 space-y-2.5">
                    {[
                      ["Solid Door", "From PKR 45,000"],
                      ["Semi-Solid Door", "From PKR 24,000"],
                      ["Engineered Solid", "From PKR 16,000"],
                      ["Flush Door", "Custom Quote"],
                    ].map(([label, price]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 rounded-xl border border-[#E2D9D1] bg-white px-4 py-3"
                      >
                        <span className="text-xs font-medium text-[#554846]">
                          {label}
                        </span>

                        <span className="text-right text-xs font-semibold text-[#4A151F]">
                          {price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FLUSH MATERIALS */}

                <div className="mt-6 rounded-xl border border-[#E1D8D0] bg-[#F5F0E9] px-4 py-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#7B4B54]">
                    Flush Door Material Options
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {flushMaterials.map((material) => (
                      <span
                        key={material}
                        className="rounded-full border border-[#DCCFC7] bg-white px-3 py-1.5 text-[10px] font-medium text-[#5E4C4F]"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GRAND ENTRANCE */}

                <div className="mt-6 rounded-xl bg-[#4A151F] px-4 py-4 text-white">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E8CFC8]/70">
                    Grand Entrance Doors
                  </p>

                  <p className="mt-1 font-serif text-lg">
                    Custom heights from 10' to 26'
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-white/60">
                    Designed for large residential and architectural entrance spaces.
                  </p>
                </div>

                {/* WHATSAPP INQUIRY FORM */}

                {inquiryOpen ? (
                  <form onSubmit={handleSubmit} className="mt-7">
                    <div>
                      <h4 className="font-serif text-xl font-medium text-[#2C1B1E]">
                        Request Product Details
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-[#817471]">
                        Enter your details and continue directly to WhatsApp.
                      </p>
                    </div>

                    <div className="mt-5 space-y-3.5">
                      <div>
                        <label
                          htmlFor="door-name"
                          className="mb-1.5 block text-[11px] font-semibold text-[#433636]"
                        >
                          Full Name
                        </label>

                        <input
                          id="door-name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full rounded-xl border border-[#DCD3CB] bg-white px-4 py-3 text-sm text-[#241619] outline-none transition placeholder:text-[#A39A96] focus:border-[#4A151F] focus:ring-2 focus:ring-[#4A151F]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="door-phone"
                          className="mb-1.5 block text-[11px] font-semibold text-[#433636]"
                        >
                          Phone Number
                        </label>

                        <input
                          id="door-phone"
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="03XX XXXXXXX"
                          className="w-full rounded-xl border border-[#DCD3CB] bg-white px-4 py-3 text-sm text-[#241619] outline-none transition placeholder:text-[#A39A96] focus:border-[#4A151F] focus:ring-2 focus:ring-[#4A151F]/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="door-city"
                          className="mb-1.5 block text-[11px] font-semibold text-[#433636]"
                        >
                          City
                        </label>

                        <input
                          id="door-city"
                          name="city"
                          type="text"
                          required
                          autoComplete="address-level2"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="Enter your city"
                          className="w-full rounded-xl border border-[#DCD3CB] bg-white px-4 py-3 text-sm text-[#241619] outline-none transition placeholder:text-[#A39A96] focus:border-[#4A151F] focus:ring-2 focus:ring-[#4A151F]/10"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitted}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A151F] px-5 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#361018] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitted ? (
                        <>
                          <Check size={17} />
                          Opening WhatsApp...
                        </>
                      ) : (
                        <>
                          <MessageCircle size={17} />
                          Continue on WhatsApp
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-[10px] leading-5 text-[#918580]">
                      Product information will be included automatically
                      in your WhatsApp inquiry.
                    </p>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(true)}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A151F] px-5 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#361018]"
                  >
                    <MessageCircle size={17} />
                    WhatsApp Inquiry
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}