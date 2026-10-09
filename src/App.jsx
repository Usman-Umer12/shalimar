import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

/* ============================================================
   PUBLIC WEBSITE COMPONENTS
============================================================ */

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import HomeFeatures from "./components/HomeFeatures";
import Trendsetter from "./components/Trendsetter";
import InteriorMarquee from "./components/InteriorMarquee";
import ExploreCollection from "./components/ExploreCollection";
import Footer from "./components/Footer";
import Customization from "./components/Customization.jsx";

/* ============================================================
   PUBLIC WEBSITE PAGES
============================================================ */

import Doors from "./pages/Doors.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import GetQuote from "./pages/GetQuote.jsx";
import Wardrobes from "./pages/Wardrobes.jsx";
import Kitchens from "./pages/Kitchens.jsx";
/* ============================================================
   ADMIN PAGES
============================================================ */

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";

import DoorsManagement from "./pages/admin/DoorsManagement.jsx";
import KitchensManagement from "./pages/admin/KitchensManagement.jsx";
import WardrobesManagement from "./pages/admin/WardrobesManagement.jsx";

/* ============================================================
   ADMIN COMPONENTS
============================================================ */

import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

/* ============================================================
   SCROLL TO TOP
============================================================ */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

/* ============================================================
   HOME PAGE
============================================================ */

const HomePage = () => {
  return (
    <>
      <Home />
      <HomeFeatures />
      <ExploreCollection />
      <Trendsetter />
      <Customization />
      <InteriorMarquee />
    </>
  );
};

/* ============================================================
   PUBLIC 404
============================================================ */

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md">

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#641F2A]">
          404
        </p>

        <h1 className="font-serif text-4xl leading-tight text-[#241A16] sm:text-5xl">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#625750]">
          The page you are looking for does not exist or
          may have been moved.
        </p>

        <a
          href="/"
          className="
            mt-6
            inline-flex
            items-center
            justify-center
            rounded-full
            bg-[#641F2A]
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            transition
            duration-200
            hover:bg-[#4f1721]
          "
        >
          Back to Home
        </a>

      </div>
    </div>
  );
};

/* ============================================================
   PUBLIC WEBSITE
============================================================ */

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F2EA]">

      <Navbar />

      <main>
        <Routes>

          {/* ==================================================
              HOME
          ================================================== */}

          <Route
            path="/"
            element={<HomePage />}
          />

          {/* ==================================================
              DOORS
          ================================================== */}

          <Route
            path="/doors"
            element={<Doors />}
          />

          <Route
            path="/doors/"
            element={<Doors />}
          />

          {/* ==================================================
              WARDROBES
          ================================================== */}

          <Route
            path="/wardrobes"
            element={<Wardrobes />}
          />

          <Route
            path="/wardrobes/"
            element={<Wardrobes />}
          />

          {/* ==================================================
              KITCHENS
          ================================================== */}

          <Route
            path="/kitchens"
            element={<Kitchens />}
          />

          <Route
            path="/kitchens/"
            element={<Kitchens />}
          />

          {/* ==================================================
              ABOUT
          ================================================== */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/about/"
            element={<About />}
          />

          {/* ==================================================
              CONTACT
          ================================================== */}

          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* ==================================================
              GET QUOTE
          ================================================== */}

          <Route
            path="/getquote"
            element={<GetQuote />}
          />

          {/* ==================================================
              PUBLIC 404
          ================================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      <Footer />

    </div>
  );
};

/* ============================================================
   ADMIN AREA
============================================================ */

const AdminArea = () => {
  return (
    <Routes>

      {/* ======================================================
          ADMIN LOGIN
      ====================================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* ======================================================
          PROTECTED ADMIN
      ====================================================== */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* DASHBOARD */}

          <Route
            index
            element={<AdminDashboard />}
          />

          {/* GENERAL PRODUCTS */}

          <Route
            path="products"
            element={<AdminProducts />}
          />

          {/* ADD PRODUCT */}

          <Route
            path="products/new"
            element={<AddProduct />}
          />

          {/* EDIT PRODUCT */}

          <Route
            path="products/:id/edit"
            element={<EditProduct />}
          />

          {/* ==================================================
              DOORS
          ================================================== */}

          <Route
            path="doors"
            element={<DoorsManagement />}
          />

          {/* ==================================================
              KITCHENS
          ================================================== */}

          <Route
            path="kitchens"
            element={<KitchensManagement />}
          />

          {/* ==================================================
              WARDROBES
          ================================================== */}

          <Route
            path="wardrobes"
            element={<WardrobesManagement />}
          />

        </Route>

      </Route>

      {/* ======================================================
          ADMIN FALLBACK
      ====================================================== */}

      <Route
        path="*"
        element={<AdminLogin />}
      />

    </Routes>
  );
};

/* ============================================================
   APP
============================================================ */

const App = () => {
  const location = useLocation();

  const isAdminRoute =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  return (
    <>
      <ScrollToTop />

      {isAdminRoute ? (
        <AdminArea />
      ) : (
        <PublicLayout />
      )}
    </>
  );
};

export default App;