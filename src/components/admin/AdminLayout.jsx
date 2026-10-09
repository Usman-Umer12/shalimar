import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F2EA] text-[#241B18]">
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =========================================================
          MAIN AREA
          Desktop sidebar = 260px
      ========================================================= */}
      <div className="min-h-screen lg:ml-[260px]">
        {/* Header */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;