import React from "react";
import { ArrowUpRight } from "lucide-react";
import des3 from "../assets/des3.webp";

const Trendsetter = () => {
  return (
    <section className="w-full bg-[#F7F2EA] py-6 sm:py-20 md:py-24 lg:py-8">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">

          {/* LEFT — CONTENT */}
          <div className="max-w-[620px]">

            {/* Label */}
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <span className="h-px w-10 bg-[#641F2A] sm:w-12"></span>

              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#641F2A] sm:text-xs">
                The Trendsetter
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-[34px] font-medium leading-[1.12] tracking-[-0.02em] text-[#241A16] sm:text-[40px] md:text-[46px] lg:text-[50px] xl:text-[56px]">
              Setting the Standard
              <span className="block text-[#641F2A]">
                for Luxury Interiors
              </span>
            </h2>

            {/* Description */}
            <div className="mt-6 max-w-[580px] space-y-4 text-[14px] leading-[1.85] text-[#625750] sm:mt-7 sm:text-[15px] md:text-[16px]">
              <p>
                Shalimar creates refined interior solutions designed to bring
                together timeless aesthetics, intelligent functionality, and
                exceptional craftsmanship. From bespoke kitchens and
                sophisticated wardrobes to premium interior doors, every
                detail is thoughtfully designed to complement the character of
                your space.
              </p>

              <p>
                Our kitchens are tailored around the way you live, our
                wardrobes combine elegant finishes with practical storage, and
                our interior doors add a distinctive sense of character and
                sophistication to every room.
              </p>

              
            </div>

            {/* CTA */}
            <div className="mt-7 sm:mt-8 md:mt-9">
              <a
                href="/about/"
                className="group inline-flex h-[46px] items-center gap-3 rounded-[2px] bg-[#641F2A] px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-[#4F1720] sm:h-[49px] sm:px-7"
              >
                <span>More About Shalimar</span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>

          {/* RIGHT — IMAGE */}
          <div className="relative w-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-[4/3]">
              <img
                src={des3}
                alt="Shalimar luxury interior"
                className="h-full w-full object-cover"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/[0.03]" />
            </div>

            {/* Decorative Corner */}
            <div className="absolute -bottom-3 -right-3 h-20 w-20 border-b border-r border-[#641F2A]/30 sm:-bottom-4 sm:-right-4 sm:h-24 sm:w-24" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Trendsetter;