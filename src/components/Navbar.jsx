import React, { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Kitchens", href: "/kitchens/" },
    { name: "Wardrobes", href: "/wardrobes/" },
    { name: "Doors", href: "/doors/" },
    { name: "About Us", href: "/about/" },
    { name: "Contact Us", href: "/contact/" },
  ];

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* =====================================================
          TRANSPARENT DESKTOP NAVBAR
      ====================================================== */}

      <header className="absolute left-0 top-0 z-50 w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <nav className="flex h-[88px] items-center justify-between">

            {/* ================= LOGO ================= */}

            <a
              href="/"
              onClick={closeMenu}
              className="flex shrink-0 items-center"
            >
              <img
                src={logo}
                alt="Chughtaiz"
                className="
                  h-[68px]
                  w-auto
                  max-w-[170px]
                  object-contain
                  sm:h-[76px]
                  sm:max-w-[190px]
                  lg:h-[97px]
                  mt-3
                  lg:max-w-[210px]
                "
              />
            </a>

            {/* ================= DESKTOP NAVIGATION ================= */}

            <div className="hidden lg:flex lg:items-center">
              <nav className="flex items-center gap-6 xl:gap-8">

                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="
                      group
                      relative
                      whitespace-nowrap
                      py-3
                      text-[13px]
                      font-semibold
                      tracking-[0.02em]
                      text-white
                      transition-colors
                      duration-200
                      hover:text-white/75
                    "
                  >
                    {item.name}

                    {/* Elegant underline */}
                    <span
                      className="
                        absolute
                        bottom-[5px]
                        left-0
                        h-[1.5px]
                        w-0
                        rounded-full
                        bg-white
                        transition-all
                        duration-300
                        ease-out
                        group-hover:w-full
                      "
                    />
                  </a>
                ))}

              </nav>
            </div>

            {/* ================= DESKTOP CTA ================= */}

            <div className="hidden lg:block">
              <a
                href="/contact/"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-[#641F2A]
                  bg-[#641F2A]
                  px-6
                  py-3.5
                  text-[12px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-white
                  shadow-[0_6px_20px_rgba(0,0,0,0.12)]
                  transition-all
                  duration-300
                  hover:bg-[#7A2936]
                  hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]
                "
              >
                <span>Get a Quote</span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </a>
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/50
                bg-white/10
                text-white
                backdrop-blur-sm
                transition-all
                duration-200
                hover:bg-white
                hover:text-[#641F2A]
                lg:hidden
              "
            >
              <Menu size={22} strokeWidth={2} />
            </button>

          </nav>
        </div>
      </header>

      {/* =====================================================
          MOBILE FULL SCREEN MENU
      ====================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[100]
          bg-[#641F2A]
          transition-opacity
          duration-300
          lg:hidden
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        <div
          className={`
            flex
            h-full
            w-full
            flex-col
            transition-transform
            duration-500
            ${
              isOpen
                ? "translate-y-0"
                : "-translate-y-5"
            }
          `}
        >

          {/* ================= MOBILE HEADER ================= */}

          <div
            className="
              flex
              h-[88px]
              shrink-0
              items-center
              justify-between
              border-b
              border-white/15
              px-5
              sm:px-8
            "
          >
            <a
              href="/"
              onClick={closeMenu}
              className="flex items-center"
            >
              <img
                src={logo}
                alt="Chughtaiz"
                className="
                  h-[68px]
                  w-auto
                  max-w-[170px]
                  object-contain
                  sm:h-[76px]
                "
              />
            </a>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/25
                text-white
                transition-all
                duration-200
                hover:bg-white
                hover:text-[#641F2A]
              "
            >
              <X size={23} strokeWidth={1.8} />
            </button>
          </div>

          {/* ================= MOBILE LINKS ================= */}

          <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-8">
            <nav className="flex flex-col">

              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  style={{
                    transitionDelay: isOpen
                      ? `${index * 60 + 100}ms`
                      : "0ms",
                  }}
                  className={`
                    group
                    flex
                    items-center
                    justify-between
                    border-b
                    border-white/15
                    py-5
                    text-[23px]
                    font-semibold
                    tracking-[-0.02em]
                    text-white
                    transition-all
                    duration-500
                    sm:text-[27px]
                    ${
                      isOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-5 opacity-0"
                    }
                  `}
                >
                  <span>{item.name}</span>

                  <ArrowUpRight
                    size={23}
                    strokeWidth={1.7}
                    className="
                      text-white/55
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
                </a>
              ))}

            </nav>

            {/* ================= MOBILE CTA ================= */}

            <div
              className={`
                mt-auto
                pt-8
                transition-all
                duration-500
                delay-500
                ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }
              `}
            >
              <a
                href="/contact/"
                onClick={closeMenu}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-full
                  bg-white
                  px-6
                  py-4
                  text-[12px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-[#641F2A]
                  transition-all
                  duration-200
                  hover:bg-[#F4EDEB]
                "
              >
                <span>Get a Quote</span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={2}
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
