import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  CircleOff,
  LayoutDashboard,
  Package,
  RefreshCw,
  ShoppingBag,
  Tags,
  TrendingUp,
  UtensilsCrossed,
  DoorOpen,
  PanelsTopLeft,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

const CATEGORY_LIST = [
  {
    key: "Kitchens",
    title: "Kitchens",
    icon: UtensilsCrossed,
  },
  {
    key: "Wardrobes",
    title: "Wardrobes",
    icon: PanelsTopLeft,
  },
  {
    key: "Doors",
    title: "Doors",
    icon: DoorOpen,
  },
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* ============================================================
     LOAD PRODUCTS
  ============================================================ */

  const loadProducts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    setError("");

    try {
      const { data, error: fetchError } = await supabase
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
          featured,
          created_at,
          updated_at
        `)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error(
          "ADMIN DASHBOARD PRODUCTS ERROR:",
          fetchError
        );

        setProducts([]);
        setError(
          fetchError.message ||
            "Unable to load products right now."
        );

        return;
      }

      setProducts(data || []);

      console.log(
        "ADMIN DASHBOARD PRODUCTS:",
        data || []
      );
    } catch (err) {
      console.error(
        "UNEXPECTED ADMIN DASHBOARD ERROR:",
        err
      );

      setProducts([]);

      setError(
        err?.message ||
          "Something went wrong while loading products."
      );
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  /* ============================================================
     INITIAL LOAD + REALTIME
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    loadProducts();

    const channel = supabase
      .channel("admin-dashboard-products")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          if (!mounted) return;

          console.log(
            "ADMIN DASHBOARD DATABASE CHANGE:",
            payload
          );

          loadProducts({ silent: true });
        }
      )
      .subscribe((status) => {
        console.log(
          "ADMIN DASHBOARD REALTIME STATUS:",
          status
        );
      });

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadProducts({ silent: true });
      }
    };

    const handleFocus = () => {
      loadProducts({ silent: true });
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      mounted = false;

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      supabase.removeChannel(channel);
    };
  }, [loadProducts]);

  /* ============================================================
     MANUAL REFRESH
  ============================================================ */

  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await loadProducts({ silent: true });
    } finally {
      setRefreshing(false);
    }
  };

  /* ============================================================
     PRODUCT COUNTS
  ============================================================ */

  const stats = useMemo(() => {
    const total = products.length;

    const active = products.filter(
      (product) =>
        String(product.status || "")
          .trim()
          .toLowerCase() === "active"
    ).length;

    const inactive = total - active;

    return {
      total,
      active,
      inactive,
      showing: active,
    };
  }, [products]);

  /* ============================================================
     CATEGORY COUNTS
  ============================================================ */

  const categoryCounts = useMemo(() => {
    return CATEGORY_LIST.map((category) => {
      const categoryProducts = products.filter(
        (product) =>
          String(product.category || "")
            .trim()
            .toLowerCase() ===
          category.key.toLowerCase()
      );

      const active = categoryProducts.filter(
        (product) =>
          String(product.status || "")
            .trim()
            .toLowerCase() === "active"
      ).length;

      return {
        ...category,
        total: categoryProducts.length,
        active,
        inactive:
          categoryProducts.length - active,
      };
    });
  }, [products]);

  /* ============================================================
     RECENT PRODUCTS
  ============================================================ */

  const recentProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  /* ============================================================
     PRICE FORMAT
  ============================================================ */

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return String(price);
    }

    return `PKR ${numericPrice.toLocaleString("en-PK")}`;
  };

  /* ============================================================
     DATE FORMAT
  ============================================================ */

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-PK",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  /* ============================================================
     STAT CARDS
  ============================================================ */

  const statsCards = [
    {
      title: "Total Products",
      value: stats.total,
      label: "All catalogue products",
      icon: Package,
    },
    {
      title: "Active Products",
      value: stats.active,
      label: "Currently visible",
      icon: CheckCircle2,
    },
    {
      title: "Inactive",
      value: stats.inactive,
      label: "Hidden from website",
      icon: CircleOff,
    },
    {
      title: "Showing",
      value: stats.showing,
      label: "Live on website",
      icon: Activity,
    },
  ];

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER SKELETON */}

        <div className="mb-8">
          <div className="h-3 w-20 animate-pulse rounded bg-black/10" />

          <div className="mt-3 h-9 w-44 animate-pulse rounded bg-black/10" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-black/5" />
        </div>

        {/* ====================================================
            STATS SKELETON
            MOBILE: 1
            SM+: 2
            XL: 4
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[170px] animate-pulse rounded-2xl border border-black/[0.07] bg-white"
            />
          ))}
        </div>

        {/* LOWER SKELETON */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="h-[430px] animate-pulse rounded-2xl bg-white" />
          <div className="h-[430px] animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  /* ============================================================
     MAIN DASHBOARD
  ============================================================ */

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

      {/* ======================================================
          PAGE INTRO
      ====================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <LayoutDashboard
              size={14}
              className="text-[#641F2A]"
            />

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#641F2A]">
              Overview
            </p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
            Welcome to your Shalimar administration panel.
            Monitor your complete catalogue from one place.
          </p>
        </div>

        {/* ACTIONS */}

        <div className="flex w-full flex-col gap-2 xs:flex-row sm:w-auto">

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-black/65 transition hover:border-[#641F2A]/20 hover:text-[#641F2A] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#641F2A] px-4 text-sm font-medium text-white transition hover:bg-[#4A151F] sm:w-auto"
          >
            View Website
            <ArrowUpRight size={16} />
          </a>

        </div>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

          <div className="flex items-start gap-3">

            <CircleOff
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-700">
                Unable to load products
              </p>

              <p className="mt-1 break-words text-xs leading-5 text-red-600/80">
                {error}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================
          STATS

          MOBILE:
          1
          2
          3
          4

          SM:
          1  2
          3  4

          XL:
          1  2  3  4
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {statsCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_8px_30px_rgba(20,20,20,0.025)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#641F2A]/[0.08] text-[#641F2A]">
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-black/25">
                  Shalimar
                </span>

              </div>

              <div className="mt-6">

                <p className="text-xs font-medium text-black/40">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-[#171717]">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-black/35">
                  {stat.label}
                </p>

              </div>

            </div>
          );
        })}

      </div>

      {/* ======================================================
          CATEGORY OVERVIEW
      ====================================================== */}

      <div className="mt-6">

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-[#171717]">
            Catalogue Overview
          </h2>

          <p className="mt-1 text-xs text-black/40">
            Products by category and their current status.
          </p>
        </div>

        {/* MOBILE: 1
            MD: 3 */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {categoryCounts.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.key}
                className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_8px_30px_rgba(20,20,20,0.025)]"
              >

                <div className="flex items-center justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F1EA] text-[#641F2A]">
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#171717]">
                        {category.title}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-black/35">
                        {category.total} total products
                      </p>
                    </div>

                  </div>

                  <span className="shrink-0 text-xl font-semibold text-[#641F2A]">
                    {category.active}
                  </span>

                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-black/[0.06] pt-4 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    <span className="text-xs text-black/50">
                      {category.active} Active
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-black/20" />

                    <span className="text-xs text-black/40">
                      {category.inactive} Inactive
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* ======================================================
          LOWER SECTION

          MOBILE/TABLET:
          1
          2

          XL:
          SIDE BY SIDE
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* ====================================================
            RECENT PRODUCTS
        ==================================================== */}

        <div className="min-w-0 overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_8px_30px_rgba(20,20,20,0.025)]">

          <div className="flex flex-col gap-3 border-b border-black/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[#171717]">
                Product Collection
              </h2>

              <p className="mt-1 text-xs text-black/40">
                Latest products added to your catalogue
              </p>
            </div>

            <a
              href="/admin/products"
              className="w-fit text-xs font-semibold text-[#641F2A] hover:underline"
            >
              View all
            </a>

          </div>

          {/* ==================================================
              NO PRODUCTS
          ================================================== */}

          {recentProducts.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F1EA] text-[#641F2A]">
                <Package
                  size={24}
                  strokeWidth={1.6}
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-[#171717]">
                No products yet
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-black/40">
                Your products will appear here once they
                are added to the Shalimar catalogue.
              </p>

              <a
                href="/admin/products"
                className="mt-5 rounded-xl bg-[#641F2A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#4A151F]"
              >
                Manage Products
              </a>

            </div>
          ) : (

            <div className="divide-y divide-black/[0.05]">

              {recentProducts.map((product) => {

                const isActive =
                  String(product.status || "")
                    .trim()
                    .toLowerCase() === "active";

                return (
                  <div
                    key={product.id}
                    className="flex min-w-0 items-center gap-3 px-4 py-4 transition hover:bg-[#F7F2EA]/60 sm:gap-4 sm:px-6"
                  >

                    {/* IMAGE */}

                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F5F1EA] sm:h-14 sm:w-14">

                      {product.image_url ? (
                        <img
                          src={`${product.image_url}${
                            product.image_url.includes("?")
                              ? "&"
                              : "?"
                          }v=${
                            product.updated_at ||
                            product.created_at ||
                            product.id
                          }`}
                          alt={
                            product.title ||
                            "Product"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#641F2A]/40">
                          <Package size={20} />
                        </div>
                      )}

                    </div>

                    {/* INFO */}

                    <div className="min-w-0 flex-1">

                      <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">

                        <h3 className="truncate text-sm font-semibold text-[#171717]">
                          {product.title ||
                            "Untitled Product"}
                        </h3>

                        <span
                          className={`w-fit shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-black/[0.05] text-black/40"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-black/40">

                        <span className="max-w-[120px] truncate">
                          {product.category ||
                            "Uncategorized"}
                        </span>

                        {product.subcategory && (
                          <>
                            <span className="text-black/15">
                              •
                            </span>

                            <span className="max-w-[120px] truncate">
                              {product.subcategory}
                            </span>
                          </>
                        )}

                        <span className="text-black/15">
                          •
                        </span>

                        <span>
                          {formatDate(
                            product.created_at
                          )}
                        </span>

                      </div>

                    </div>

                    {/* PRICE */}

                    <div className="hidden shrink-0 text-right md:block">

                      <p className="text-xs font-semibold text-[#641F2A]">
                        {formatPrice(
                          product.price
                        )}
                      </p>

                    </div>

                    {/* EDIT */}

                    <a
                      href={`/admin/products/${product.id}/edit`}
                      className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] text-black/35 transition hover:border-[#641F2A]/20 hover:bg-[#641F2A]/[0.05] hover:text-[#641F2A] sm:flex"
                      title="Edit product"
                    >
                      <ArrowUpRight size={15} />
                    </a>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ====================================================
            QUICK INFO
        ==================================================== */}

        <div className="min-w-0 rounded-2xl border border-black/[0.07] bg-[#4A151F] p-5 text-white shadow-[0_8px_30px_rgba(74,21,31,0.10)] sm:p-6">

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
                Shalimar CMS
              </p>

              <h2 className="mt-4 text-xl font-medium leading-snug sm:text-2xl">
                Catalogue at a glance.
              </h2>
            </div>

            <TrendingUp
              size={22}
              className="shrink-0 text-white/35"
              strokeWidth={1.7}
            />

          </div>

          <p className="mt-4 text-sm leading-6 text-white/55">
            Your dashboard automatically tracks products,
            categories and their current visibility status.
          </p>

          {/* ==================================================
              LIVE SUMMARY
          ================================================== */}

          <div className="mt-7 grid grid-cols-2 gap-3">

            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">

              <div className="flex items-center gap-2 text-white/50">
                <ShoppingBag size={14} />

                <span className="text-[10px] uppercase tracking-wide">
                  Active
                </span>
              </div>

              <p className="mt-2 text-2xl font-semibold text-white">
                {stats.active}
              </p>

            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">

              <div className="flex items-center gap-2 text-white/50">
                <Tags size={14} />

                <span className="text-[10px] uppercase tracking-wide">
                  Total
                </span>
              </div>

              <p className="mt-2 text-2xl font-semibold text-white">
                {stats.total}
              </p>

            </div>

          </div>

          {/* ==================================================
              CATEGORY MINI SUMMARY
          ================================================== */}

          <div className="mt-6 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">

            {categoryCounts.map((category) => (
              <div
                key={category.key}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3"
              >
                <p className="truncate text-[10px] uppercase tracking-wide text-white/40">
                  {category.title}
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  {category.active}
                </p>

                <p className="text-[10px] text-white/40">
                  active
                </p>
              </div>
            ))}

          </div>

          {/* ==================================================
              FEATURES
          ================================================== */}

          <div className="mt-6 space-y-3">

            {[
              "Single product image",
              "Custom product pricing",
              "Editable delivery text",
              "Active / inactive products",
              "Kitchen / Wardrobe / Door categories",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-xs text-white/75"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <CheckCircle2
                    size={12}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="leading-5">
                  {item}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* ======================================================
          FOOTER SUMMARY
      ====================================================== */}

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-black/[0.07] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#641F2A]/[0.07] text-[#641F2A]">
            <Package size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#171717]">
              Catalogue Status
            </p>

            <p className="mt-0.5 text-[11px] text-black/40">
              {stats.active} of {stats.total} products
              are currently visible.
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />


        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;