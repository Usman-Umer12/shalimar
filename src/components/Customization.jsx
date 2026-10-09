import React from "react";
import { ArrowRight, Ruler, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import wardrobeImage from "../assets/word1.webp";
import kitchenImage from "../assets/kitchen1.webp";

const customizationItems = [
  {
    id: 1,
    image: wardrobeImage,
    category: "WARDROBE",
    title: "Custom Wardrobes",
    description:
      "Designed around your space, lifestyle and storage needs with tailored dimensions, refined finishes and smart storage.",
    points: ["Custom dimensions", "Premium finishes", "Smart storage"],
    link: "/wardrobes",
  },
  {
    id: 2,
    image: kitchenImage,
    category: "KITCHEN",
    title: "Custom Kitchens",
    description:
      "Create a kitchen designed around the way you live with personalized layouts, elegant finishes and practical storage.",
    points: ["Tailored layouts", "Modern finishes", "Functional storage"],
    link: "/kitchens",
  },
];

export default function Customization() {
  return (
    <section
      id="customization"
      className="
        relative
        overflow-hidden
        bg-[#351019]
        px-4
        py-8
        sm:px-6
        sm:py-10
        lg:px-10
        lg:py-12
      "
    >
      {/* ============================================================
          BACKGROUND
      ============================================================ */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-1/2
            top-[-220px]
            h-[420px]
            w-[420px]
            -translate-x-1/2
            rounded-full
            bg-[#8b3d4d]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-180px]
            right-[-100px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-[#c9a24b]/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
          "
        />
      </div>

      <div className="relative mx-auto max-w-[1180px]">
        {/* ============================================================
            HEADER
        ============================================================ */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 flex items-center justify-center sm:mb-4">
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[#c9a24b]/25
                bg-white/[0.04]
                px-3
                py-1
                text-[8px]
                font-semibold
                tracking-[0.22em]
                text-[#d8b969]
                sm:px-3.5
                sm:py-1.5
                sm:text-[9px]
              "
            >
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              CUSTOM INTERIORS
            </span>
          </div>

          <h2
            className="
              font-serif
              text-[27px]
              leading-[1.08]
              tracking-[-0.02em]
              text-white
              sm:text-[35px]
              md:text-[40px]
              lg:text-[44px]
            "
          >
            Designed around{" "}
            <span className="italic text-[#d8b969]">
              your space.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-2.5
              max-w-xl
              text-[11px]
              leading-5
              text-white/55
              sm:mt-3
              sm:text-xs
              sm:leading-6
              md:text-[13px]
            "
          >
            Create wardrobes and kitchens tailored to your dimensions,
            lifestyle and interior style.
          </p>
        </div>

        {/* ============================================================
            CARDS
        ============================================================ */}
        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:mt-7
            sm:gap-5
            lg:mt-8
            lg:grid-cols-2
            lg:gap-6
          "
        >
          {customizationItems.map((item) => (
            <article
              key={item.id}
              className="
                group
                overflow-hidden
                rounded-[18px]
                border
                border-white/10
                bg-[#f7f3ed]
                shadow-[0_15px_40px_rgba(0,0,0,0.18)]
                transition
                duration-300
                hover:border-[#c9a24b]/30
              "
            >
              {/* ======================================================
                  IMAGE
              ====================================================== */}
              <div
                className="
                  relative
                  aspect-[2.05/1]
                  overflow-hidden
                  bg-[#e9e3da]
                  sm:aspect-[2.15/1]
                  lg:aspect-[2/1]
                "
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-[1.025]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/55
                    via-black/5
                    to-transparent
                  "
                />

                {/* Category */}
                <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                  <span
                    className="
                      rounded-full
                      border
                      border-white/20
                      bg-black/25
                      px-2.5
                      py-1
                      text-[8px]
                      font-semibold
                      tracking-[0.18em]
                      text-white
                      backdrop-blur-md
                      sm:px-3
                      sm:text-[9px]
                    "
                  >
                    {item.category}
                  </span>
                </div>

                {/* Image title */}
                <div
                  className="
                    absolute
                    bottom-3
                    left-3
                    right-3
                    flex
                    items-end
                    justify-between
                    gap-3
                    sm:bottom-4
                    sm:left-4
                    sm:right-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-white/65
                        sm:text-[9px]
                      "
                    >
                      Made for your home
                    </p>

                    <h3
                      className="
                        mt-0.5
                        font-serif
                        text-[20px]
                        leading-tight
                        text-white
                        sm:text-[23px]
                      "
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div
                    className="
                      hidden
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      text-white
                      backdrop-blur-md
                      sm:flex
                    "
                  >
                    <Ruler className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* ======================================================
                  CONTENT
              ====================================================== */}
              <div className="p-4 sm:p-5">
                <p
                  className="
                    text-[11px]
                    leading-5
                    text-[#756b68]
                    sm:text-xs
                    sm:leading-5
                  "
                >
                  {item.description}
                </p>

                {/* Features */}
                <div
                  className="
                    mt-3
                    grid
                    grid-cols-3
                    gap-2
                    border-t
                    border-[#ded7ce]
                    pt-3
                  "
                >
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[9px]
                        font-medium
                        leading-4
                        text-[#5d5050]
                        sm:text-[10px]
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          shrink-0
                          rounded-full
                          bg-[#9a5360]
                        "
                      />

                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <Link
                  to={item.link}
                  className="
                    mt-4
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#4A151F]
                    px-5
                    py-2.5
                    text-[10px]
                    font-semibold
                    tracking-wide
                    text-white
                    transition
                    duration-200
                    hover:bg-[#5b1f2c]
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#c9a24b]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#f7f3ed]
                    sm:px-6
                    sm:py-3
                    sm:text-[11px]
                  "
                >
                  Customize Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* ============================================================
            BOTTOM NOTE
        ============================================================ */}
        <p
          className="
            mt-5
            text-center
            text-[8px]
            tracking-[0.08em]
            text-white/30
            sm:mt-6
            sm:text-[9px]
          "
        >
          Custom dimensions • Premium materials • Professional craftsmanship
          • Delivery across Pakistan
        </p>
      </div>
    </section>
  );
}