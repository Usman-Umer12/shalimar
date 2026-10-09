import React from "react";
import { ArrowUpRight, Ruler, Layers3, SlidersHorizontal } from "lucide-react";

import doorsImg from "../assets/des3.webp";
import wardrobeImg from "../assets/des2.webp";

const customSolutions = [
  {
    number: "01",
    title: "Custom Interior Doors",
    subtitle: "Made to Your Measurements",
    description:
      "Designed and crafted to fit your space precisely, our interior doors bring together refined design, quality materials, and lasting craftsmanship.",
    image: doorsImg,
    features: ["Made to Measure", "Premium Finishes", "Tailored Designs"],
    link: "/doors/",
  },
  {
    number: "02",
    title: "Custom Wardrobes",
    subtitle: "Storage Designed Around You",
    description:
      "Create a wardrobe that works beautifully with your lifestyle. From dimensions and layouts to finishes and internal storage, every detail is tailored to your space.",
    image: wardrobeImg,
    features: ["Custom Dimensions", "Smart Storage", "Elegant Finishes"],
    link: "/wardrobes/",
  },
];

const CustomSolutions = () => {
  return (
    <section className="w-full bg-[#F7F2EA] py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">

        {/* ================= HERO ================= */}
        <div className="mx-auto max-w-[820px] text-center">

          <div className="mb-5 flex items-center justify-center gap-3 sm:mb-6">
            <span className="h-px w-9 bg-[#641F2A] sm:w-12" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#641F2A] sm:text-xs">
              Custom Solutions
            </span>

            <span className="h-px w-9 bg-[#641F2A] sm:w-12" />
          </div>

          <h1 className="font-serif text-[36px] font-medium leading-[1.1] tracking-[-0.025em] text-[#241A16] sm:text-[44px] md:text-[52px] lg:text-[60px]">
            Made to
            <span className="text-[#641F2A]"> Your Measurements.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[680px] text-[14px] leading-[1.8] text-[#625750] sm:mt-6 sm:text-[15px] md:text-[16px]">
            Every space is different. That is why our doors and wardrobes are
            designed around your dimensions, your lifestyle, and your vision.
            From the first measurement to the final finish, every detail is
            carefully considered.
          </p>

          {/* Small Feature Row */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">

            <div className="flex items-center justify-center gap-2.5 border border-[#D8CCC0] bg-[#FBF8F3] px-4 py-3">
              <Ruler
                size={16}
                strokeWidth={1.5}
                className="text-[#641F2A]"
              />

              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#3B302A]">
                Made to Measure
              </span>
            </div>

            <div className="flex items-center justify-center gap-2.5 border border-[#D8CCC0] bg-[#FBF8F3] px-4 py-3">
              <Layers3
                size={16}
                strokeWidth={1.5}
                className="text-[#641F2A]"
              />

              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#3B302A]">
                Premium Materials
              </span>
            </div>

            <div className="flex items-center justify-center gap-2.5 border border-[#D8CCC0] bg-[#FBF8F3] px-4 py-3">
              <SlidersHorizontal
                size={16}
                strokeWidth={1.5}
                className="text-[#641F2A]"
              />

              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#3B302A]">
                Tailored Design
              </span>
            </div>

          </div>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-2 lg:gap-10 xl:gap-12">

          {customSolutions.map((item) => (
            <article
              key={item.number}
              className="group overflow-hidden border border-[#DDD2C7] bg-[#FBF8F3]"
            >

              {/* IMAGE */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E9E0D6]">

                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                {/* Number */}
                <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center border border-white/50 bg-black/20 text-[11px] font-medium text-white backdrop-blur-sm">
                  {item.number}
                </div>

                {/* Image Label */}
                <div className="absolute bottom-5 left-5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90">
                    Custom Collection
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 sm:p-7 md:p-8">

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#641F2A]">
                  {item.subtitle}
                </p>

                <h2 className="mt-2 font-serif text-[27px] font-medium leading-tight text-[#241A16] sm:text-[31px]">
                  {item.title}
                </h2>

                <p className="mt-4 max-w-[600px] text-[13px] leading-[1.8] text-[#625750] sm:text-[14px]">
                  {item.description}
                </p>

                {/* Features */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.features.map((feature) => (
                    <span
                      key={feature}
                      className="border border-[#D8CCC0] bg-[#F7F2EA] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.08em] text-[#51463F]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <div className="mt-6">
                  <a
                    href={item.link}
                    className="group/btn inline-flex h-[45px] items-center gap-3 bg-[#641F2A] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-[#4F1720]"
                  >
                    Explore {item.title.split(" ")[1]}
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.8}
                      className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                    />
                  </a>
                </div>

              </div>
            </article>
          ))}

        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-14 border border-[#D8CCC0] bg-[#EFE6DA] px-6 py-10 text-center sm:mt-16 sm:px-10 sm:py-12 md:px-16">

          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#641F2A]">
            Your Space. Your Dimensions.
          </p>

          <h2 className="mx-auto mt-3 max-w-[700px] font-serif text-[29px] font-medium leading-tight text-[#241A16] sm:text-[36px] md:text-[42px]">
            Designed Around the Way You Live
          </h2>

          <p className="mx-auto mt-4 max-w-[620px] text-[13px] leading-[1.8] text-[#625750] sm:text-[14px]">
            Tell us about your space and requirements. Our team will help you
            create a solution that fits beautifully, functions effortlessly,
            and reflects your personal style.
          </p>

          <div className="mt-6">
            <a
              href="/contact/"
              className="inline-flex h-[46px] items-center gap-3 bg-[#641F2A] px-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-[#4F1720]"
            >
              Start Your Project
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CustomSolutions;