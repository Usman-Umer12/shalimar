import React from "react";
import { Menu, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const AdminHeader = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E9DED3] bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =======================================================
            LEFT
        ======================================================= */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#641F2A] transition-colors hover:bg-[#F7F2EA] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A0958D]">
              Administration
            </p>

            <h1 className="text-sm font-semibold text-[#241B18] sm:text-base">
              Shalimar Admin
            </h1>
          </div>
        </div>

        {/* =======================================================
            RIGHT
        ======================================================= */}
        <div className="flex items-center gap-3">
          {/* Website */}
          <Link
            to="/"
            className="hidden items-center gap-2 rounded-xl border border-[#E5D9CE] px-3 py-2 text-xs font-semibold text-[#641F2A] transition-colors hover:bg-[#F7F2EA] sm:flex"
          >
            <ExternalLink size={15} />
            <span>View Website</span>
          </Link>

          {/* Admin */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#641F2A] text-xs font-bold text-white">
              A
            </div>

            <div className="hidden md:block">
              <p className="text-xs font-semibold text-[#241B18]">
                Administrator
              </p>

              <p className="text-[10px] text-[#9B8D83]">
                Manage Website
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;