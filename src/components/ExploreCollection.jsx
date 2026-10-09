import React from "react";
import { ArrowUpRight } from "lucide-react";

import kitchen1 from "../assets/kitchen1.webp";
import word1 from "../assets/word1.webp";
import dor1 from "../assets/dor1.webp";

const categories = [
  {
    title: "Kitchens",
    subtitle: "Bespoke Kitchen Design",
    description:
      "Thoughtfully designed kitchens combining refined aesthetics, intelligent layouts, and exceptional craftsmanship.",
    image: kitchen1,
    link: "/kitchens/",
  },
  {
    title: "Wardrobes",
    subtitle: "Tailored Storage Solutions",
    description:
      "Elegant wardrobe solutions designed around your space, lifestyle, and storage requirements.",
    image: word1,
    link: "/wardrobes/",
  },
  {
    title: "Doors",
    subtitle: "Interior Doors",
    description:
      "Distinctive interior doors crafted with refined finishes and timeless detailing to elevate every room.",
    image: dor1,
    link: "/doors/",
  },
];

const ExploreCollection = () => {
  return (
    <section className="w-full overflow-hidden bg-[#F7F2EA] py-10 sm:py-20 md:py-24 lg:py-15">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">

        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-12 md:mb-16">

          {/* Label */}
          <div className="mb-4 flex items-center justify-center gap-3 sm:mb-5">
            <span className="h-px w-8 bg-[#641F2A] sm:w-12" />

            <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.28em] text-[#641F2A] sm:text-[10px] md:text-xs">
              Explore Collection
            </span>

            <span className="h-px w-8 bg-[#641F2A] sm:w-12" />
          </div>

          {/* Title */}
          <h2 className="font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.025em] text-[#241A16] sm:text-[40px] md:text-[48px] lg:text-[52px]">
            Designed for{" "}
            <span className="italic text-[#641F2A]">
              Beautiful Living
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-[620px] font-sans text-[12px] leading-[1.8] text-[#625750] sm:mt-5 sm:text-[13px] md:text-[14px]">
            Discover thoughtfully crafted interior solutions designed to
            bring together timeless design, intelligent functionality, and
            exceptional craftsmanship.
          </p>
        </div>

        {/* ================= CATEGORY GRID ================= */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">

          {categories.map((category, index) => (
            <a
              key={category.title}
              href={category.link}
              className="group relative block overflow-hidden bg-[#E8DED3]"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/4.7] w-full overflow-hidden sm:aspect-[4/4.5] md:aspect-[4/4.8] lg:aspect-[4/4.7]">

                <img
                  src={category.image}
                  alt={category.title}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-transform
                    duration-1000
                    ease-out
                    group-hover:scale-[1.04]
                  "
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Dark Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/75
                    via-black/20
                    to-black/5
                  "
                />

                {/* Subtle top border */}
                <div className="absolute left-5 right-5 top-5 h-px bg-white/45 opacity-70 sm:left-6 sm:right-6 sm:top-6" />

                {/* Number */}
                <div className="absolute right-5 top-5 sm:right-6 sm:top-6">
                  <span className="font-sans text-[9px] font-medium tracking-[0.2em] text-white/75">
                    0{index + 1}
                  </span>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-6 lg:p-7">

                  {/* Subtitle */}
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-[10px]">
                    {category.subtitle}
                  </p>

                  {/* Title */}
                  <h3 className="mt-2 font-serif text-[27px] font-medium leading-none tracking-[-0.015em] text-white sm:text-[30px] md:text-[29px] lg:text-[32px]">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 max-w-[390px] font-sans text-[11px] leading-[1.65] text-white/75 sm:text-[12px]">
                    {category.description}
                  </p>

                  {/* Bottom Action */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4 sm:mt-6 sm:pt-5">

                    <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-white sm:text-[10px]">
                      Explore Collection
                    </span>

                    <span
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/45
                        text-white
                        transition-all
                        duration-500
                        group-hover:border-white
                        group-hover:bg-white
                        group-hover:text-[#641F2A]
                        sm:h-10
                        sm:w-10
                      "
                    >
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* ================= BOTTOM STATEMENT ================= */}
        <div className="mt-10 border-t border-[#D8CCC0] pt-6 sm:mt-12 sm:pt-7 md:mt-14">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

            <p className="font-serif text-[15px] italic text-[#641F2A] sm:text-[17px]">
              Crafted around the way you live.
            </p>

            <p className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#756A63] sm:text-[10px]">
              Kitchens · Wardrobes · Doors
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ExploreCollection;