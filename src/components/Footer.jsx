import React from "react";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

import logo from "../assets/logo.png";

// ======================================================
// FOOTER LINKS
// ======================================================

const quickLinks = [
  { title: "Home", href: "/" },
  { title: "Kitchens", href: "/kitchens/" },
  { title: "Wardrobes", href: "/wardrobes/" },
  { title: "Doors", href: "/doors/" },
  { title: "About", href: "/about/" },
  { title: "Contact Us", href: "/contact/" },
];

// ======================================================
// INLINE SVG SOCIAL ICONS
// ======================================================

const InstagramIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      stroke="currentColor"
      strokeWidth="1.8"
    />

    <circle
      cx="12"
      cy="12"
      r="4"
      stroke="currentColor"
      strokeWidth="1.8"
    />

    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M14 8H16V4H14C10.686 4 8.5 6.238 8.5 9.7V12H5V16H8.5V21H12.5V16H15.5L16 12H12.5V10C12.5 8.8 13.1 8 14 8Z"
      fill="currentColor"
    />
  </svg>
);

const TikTokIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15.5 4C15.8 5.8 16.8 7 18.5 7.4V10.2C17.1 10.1 16 9.7 15 8.9V15.3C15 18.6 12.7 20.5 9.7 20.5C6.9 20.5 5 18.6 5 16C5 13.4 7 11.4 9.8 11.4C10.3 11.4 10.8 11.5 11.2 11.7V14.6C10.8 14.4 10.4 14.3 9.9 14.3C8.8 14.3 8 15 8 16C8 17 8.7 17.7 9.7 17.7C10.9 17.7 11.9 16.9 11.9 15.2V4H15.5Z"
      fill="currentColor"
    />
  </svg>
);

const YouTubeIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.92 4.75 12 4.75 12 4.75s-5.92 0-7.64.49a2.75 2.75 0 0 0-1.94 1.95C1.93 8.91 1.93 12 1.93 12s0 3.09.49 4.81a2.75 2.75 0 0 0 1.94 1.95c1.72.49 7.64.49 7.64.49s5.92 0 7.64-.49a2.75 2.75 0 0 0 1.94-1.95c.49-1.72.49-4.81.49-4.81s0-3.09-.49-4.81Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />

    <path
      d="m10 15.25 5-3.25-5-3.25v6.5Z"
      fill="currentColor"
    />
  </svg>
);

// ======================================================
// FOOTER
// ======================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: "https://tr.ee/lBX7LKg1Rp",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: "https://tr.ee/xcqbm861sB",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      href: "https://tr.ee/qT94RN9aGc",
    },
    {
      name: "YouTube",
      icon: YouTubeIcon,
      href: "https://tr.ee/tlc-xoRKD2",
    },
  ];

  return (
<footer className="relative w-full overflow-hidden bg-[#3A1018] text-white">
      {/* ==================================================
          TOP ACCENT
      ================================================== */}

      <div className="h-[2px] w-full bg-white/25" />

      {/* ==================================================
          SUBTLE BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -right-40
            -top-44
            h-[380px]
            w-[380px]
            rounded-full
            border
            border-white/[0.07]
          "
        />

        <div
          className="
            absolute
            -left-40
            -bottom-48
            h-[400px]
            w-[400px]
            rounded-full
            bg-black/[0.10]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-white/[0.025]
            via-transparent
            to-black/[0.12]
          "
        />

      </div>

      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1380px]
          px-5
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >

        {/* ==================================================
            MAIN FOOTER GRID
        ================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-x-7
            gap-y-8
            py-9

            sm:gap-x-10
            sm:gap-y-9
            sm:py-10

            lg:grid-cols-[1.5fr_0.75fr_0.75fr_1fr]
            lg:gap-12
            lg:py-11

            xl:gap-16
          "
        >

          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="col-span-2 lg:col-span-1">

            {/* Logo */}

            <a
              href="/"
              aria-label="Go to homepage"
              className="inline-flex"
            >
              <img
                src={logo}
                alt="Company Logo"
                className="
                  w-[125px]
                  object-contain
                  sm:w-[140px]
                "
              />
            </a>

            {/* Professional Brand Title */}

            <h2
              className="
                mt-4
                text-[18px]
                font-extrabold
                leading-tight
                tracking-[-0.02em]
                text-white
                sm:text-[20px]
              "
            >
              Premium Interior Solutions
            </h2>

            {/* Small Divider */}

            <div className="mt-2.5 flex items-center gap-2">

              <span className="h-[2px] w-8 bg-white" />

              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-white/75
                "
              >
                Design • Quality • Craftsmanship
              </span>

            </div>

            {/* Professional Description */}

            <p
              className="
                mt-3
                max-w-[365px]
                text-[11px]
                font-semibold
                leading-[1.75]
                text-white/80
                sm:text-[12px]
                sm:leading-[1.7]
              "
            >
              We create thoughtfully designed kitchens, wardrobes and doors
              that combine timeless aesthetics, smart functionality and
              quality craftsmanship for modern interiors.
            </p>

            {/* Social Icons */}

            <div className="mt-5 flex items-center gap-2">

              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/25
                      bg-white/[0.08]
                      text-white
                      transition-all
                      duration-200
                      hover:border-white
                      hover:bg-white
                      hover:text-[#641F2A]
                    "
                  >
                    <Icon size={14} />
                  </a>
                );
              })}

            </div>

          </div>

          {/* ==================================================
              QUICK LINKS
          ================================================== */}

          <div>

            <div className="flex items-center gap-2">

              <span
                className="
                  h-5
                  w-[3px]
                  rounded-full
                  bg-white
                "
              />

              <h3
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-white
                "
              >
                Quick Links
              </h3>

            </div>

            <ul className="mt-4 space-y-2.5">

              {quickLinks.slice(0, 3).map((link) => (
                <li key={link.title}>

                  <a
                    href={link.href}
                    className="
                      group
                      inline-flex
                      items-center
                      text-[11px]
                      font-semibold
                      text-white/75
                      transition-all
                      duration-200
                      hover:translate-x-1
                      hover:text-white
                    "
                  >

                    <span
                      className="
                        mr-0
                        h-[2px]
                        w-0
                        rounded-full
                        bg-white
                        transition-all
                        duration-200
                        group-hover:mr-2
                        group-hover:w-3
                      "
                    />

                    {link.title}

                  </a>

                </li>
              ))}

            </ul>

          </div>

          {/* ==================================================
              EXPLORE
          ================================================== */}

          <div>

            <div className="flex items-center gap-2">

              <span
                className="
                  h-5
                  w-[3px]
                  rounded-full
                  bg-white
                "
              />

              <h3
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-white
                "
              >
                Explore
              </h3>

            </div>

            <ul className="mt-4 space-y-2.5">

              {quickLinks.slice(3).map((link) => (
                <li key={link.title}>

                  <a
                    href={link.href}
                    className="
                      group
                      inline-flex
                      items-center
                      text-[11px]
                      font-semibold
                      text-white/75
                      transition-all
                      duration-200
                      hover:translate-x-1
                      hover:text-white
                    "
                  >

                    <span
                      className="
                        mr-0
                        h-[2px]
                        w-0
                        rounded-full
                        bg-white
                        transition-all
                        duration-200
                        group-hover:mr-2
                        group-hover:w-3
                      "
                    />

                    {link.title}

                  </a>

                </li>
              ))}

              <li>

                <a
                  href="/contact/"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1
                    text-[11px]
                    font-extrabold
                    text-white
                    transition-colors
                    hover:text-white/75
                  "
                >
                  Get a Quote

                  <ArrowUpRight
                    size={12}
                    strokeWidth={2}
                    className="
                      transition-transform
                      duration-200
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />

                </a>

              </li>

            </ul>

          </div>

          {/* ==================================================
              CONTACT
          ================================================== */}

          <div className="col-span-2 sm:col-span-1">

            <div className="flex items-center gap-2">

              <span
                className="
                  h-5
                  w-[3px]
                  rounded-full
                  bg-white
                "
              />

              <h3
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-white
                "
              >
                Contact
              </h3>

            </div>

            <div className="mt-4 space-y-2.5">

              {/* Phone */}

              <a
                href="tel:+923110706005"
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  rounded-md
                  border
                  border-white/20
                  bg-black/[0.08]
                  px-2.5
                  py-2
                  text-[10px]
                  font-bold
                  text-white/85
                  transition-all
                  duration-200
                  hover:border-white/50
                  hover:bg-black/[0.14]
                  hover:text-white
                "
              >

                <span
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/[0.08]
                    text-white
                  "
                >
                  <Phone size={12} strokeWidth={2} />
                </span>

                <span>+923238430015</span>

              </a>

              {/* Location */}

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-md
                  border
                  border-white/20
                  bg-black/[0.08]
                  px-2.5
                  py-2
                  text-[10px]
                  font-bold
                  text-white/85
                "
              >

                <span
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/[0.08]
                    text-white
                  "
                >
                  <MapPin size={12} strokeWidth={2} />
                </span>

                <span>Lahore, Pakistan</span>

              </div>

             
            </div>

          </div>

        </div>

        {/* ==================================================
            BOTTOM BAR
        ================================================== */}

        <div className="border-t border-white/20">

          <div
            className="
              flex
              flex-col
              gap-2
              py-3.5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p
              className="
                text-[8px]
                font-semibold
                tracking-[0.05em]
                text-white/65
                sm:text-[9px]
              "
            >
              © {currentYear} All Rights Reserved.
            </p>

            <div
              className="
                flex
                items-center
                gap-4
                text-[8px]
                font-extrabold
                uppercase
                tracking-[0.1em]
                text-white/65
                sm:text-[9px]
              "
            >

              <a
                href="/"
                className="transition-colors hover:text-white"
              >
                Home
              </a>

              <a
                href="/contact/"
                className="transition-colors hover:text-white"
              >
                Contact
              </a>

              <a
                href="/contact/"
                className="
                  text-white
                  transition-colors
                  hover:text-white/75
                "
              >
                Get In Touch
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM ACCENT
      ================================================== */}

      <div className="h-[2px] w-full bg-white/25" />

    </footer>
  );
}
