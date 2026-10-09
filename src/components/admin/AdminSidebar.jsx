import React from "react";
import {
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Shirt,
  Utensils,
  DoorOpen,
  X,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const closeMobile = () => {
    if (onClose) onClose();
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname === path;
  };

  const mainLinks = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
  ];

  const catalogLinks = [
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
  ];

  const contentLinks = [
    {
      label: "Doors",
      path: "/admin/doors",
      icon: DoorOpen,
    },
    {
      label: "Kitchens",
      path: "/admin/kitchens",
      icon: Utensils,
    },
    {
      label: "Wardrobes",
      path: "/admin/wardrobes",
      icon: Shirt,
    },
  ];

  const websiteLinks = [
    {
      label: "View Website",
      path: "/",
      icon: ExternalLink,
    },
    
  ];

  const renderLink = (item, external = false) => {
    const Icon = item.icon;

    if (external) {
      return (
        <NavLink
          key={item.label}
          to={item.path}
          onClick={closeMobile}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8C8178] transition-colors hover:bg-[#F7F2EA] hover:text-[#641F2A]"
        >
          <Icon
            size={18}
            strokeWidth={1.8}
            className="shrink-0"
          />

          <span>{item.label}</span>
        </NavLink>
      );
    }

    const active = isActive(item.path);

    return (
      <NavLink
        key={item.label}
        to={item.path}
        onClick={closeMobile}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-[#641F2A] text-white shadow-sm"
            : "text-[#716760] hover:bg-[#F7F2EA] hover:text-[#641F2A]"
        }`}
      >
        <Icon
          size={18}
          strokeWidth={active ? 2 : 1.8}
          className="shrink-0"
        />

        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* =========================================================
          MOBILE BACKDROP
      ========================================================= */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[260px] flex-col
          border-r border-[#E9DED3]
          bg-white
          shadow-[4px_0_24px_rgba(30,20,15,0.04)]
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:shadow-none
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =======================================================
            BRAND
        ======================================================= */}
        <div className="flex h-20 shrink-0 items-center border-b border-[#EEE5DD] px-5">
          <NavLink
            to="/admin"
            onClick={closeMobile}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#641F2A] text-sm font-bold text-white">
              S
            </div>

            <div>
              <div className="text-[17px] font-semibold tracking-[0.02em] text-[#241B18]">
                SHALIMAR
              </div>

              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9B8D83]">
                Administration
              </div>
            </div>
          </NavLink>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-[#766A62] transition-colors hover:bg-[#F7F2EA] hover:text-[#641F2A] lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* =======================================================
            NAVIGATION
        ======================================================= */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          {/* Overview */}
          <div className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0958D]">
              Overview
            </p>

            <nav className="space-y-1">
              {mainLinks.map((item) => renderLink(item))}
            </nav>
          </div>

          {/* Catalog */}
          <div className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0958D]">
              Catalog
            </p>

            <nav className="space-y-1">
              {catalogLinks.map((item) => renderLink(item))}
            </nav>
          </div>

          {/* Website Content */}
          <div className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0958D]">
              Website Content
            </p>

            <nav className="space-y-1">
              {contentLinks.map((item) => renderLink(item))}
            </nav>
          </div>

          {/* Website */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0958D]">
              Website
            </p>

            <nav className="space-y-1">
              {websiteLinks.map((item) =>
                renderLink(item, item.path === "/")
              )}
            </nav>
          </div>
        </div>

        {/* =======================================================
            LOGOUT
        ======================================================= */}
        <div className="shrink-0 border-t border-[#EEE5DD] p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#766A62] transition-colors hover:bg-[#F7F2EA] hover:text-[#641F2A]"
          >
            <LogOut size={18} strokeWidth={1.8} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;