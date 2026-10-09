import React from "react";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  Headset,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Finest materials & quality craftsmanship",
  },
  {
    icon: Sparkles,
    title: "Modern Designs",
    description: "Elegant & timeless designs for every home",
  },
  {
    icon: Truck,
    title: "Delivery Pakistan",
    description: "Safe & fast delivery all over Pakistan",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description: "We're here to help you anytime",
  },
];

export default function HomeFeatures() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden

        border-y
        border-[#641F2A]/30

        bg-gradient-to-r
        from-[#3F131B]
        via-[#641F2A]
        to-[#3F131B]

        shadow-[0_12px_40px_rgba(38,0,8,0.30)]
      "
    >
      {/* =========================================
          BURGUNDY OVERLAY
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-gradient-to-r
          from-black/20
          via-transparent
          to-black/20
        "
      />

      {/* =========================================
          LIGHT BURGUNDY CENTER GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2

          h-[180px]
          w-[45%]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-[#F8E9E5]/10

          blur-[80px]
        "
      />

      {/* =========================================
          SUBTLE BURGUNDY SHINE
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0

          h-full
          w-[16%]

          -translate-x-1/2
          rotate-[8deg]

          bg-gradient-to-r
          from-transparent
          via-[#F8E9E5]/[0.07]
          to-transparent

          blur-2xl
        "
      />

      {/* =========================================
          LEFT DECORATIVE CIRCLE
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          top-1/2

          h-56
          w-56

          -translate-y-1/2

          rounded-full

          border
          border-[#F8E9E5]/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-12
          top-1/2

          h-32
          w-32

          -translate-y-1/2

          rounded-full

          border
          border-[#F8E9E5]/[0.07]
        "
      />

      {/* =========================================
          RIGHT DECORATIVE CIRCLE
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          top-1/2

          h-56
          w-56

          -translate-y-1/2

          rounded-full

          border
          border-[#F8E9E5]/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          top-1/2

          h-32
          w-32

          -translate-y-1/2

          rounded-full

          border
          border-[#F8E9E5]/[0.07]
        "
      />

      {/* =========================================
          CONTENT
      ========================================= */}

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1600px]
        "
      >
        <div
          className="
            grid
            w-full

            grid-cols-2

            lg:grid-cols-4
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`
                  group
                  relative

                  flex
                  min-h-[135px]

                  items-center
                  justify-center

                  px-4
                  py-6

                  transition-all
                  duration-300

                  hover:bg-[#F8E9E5]/[0.045]

                  ${
                    index === 0
                      ? "border-b border-r border-[#F8E9E5]/15"
                      : ""
                  }

                  ${
                    index === 1
                      ? "border-b border-[#F8E9E5]/15"
                      : ""
                  }

                  ${
                    index === 2
                      ? "border-r border-[#F8E9E5]/15"
                      : ""
                  }

                  lg:min-h-[145px]
                  lg:px-6
                  lg:py-5

                  lg:border-b-0

                  ${
                    index !== 3
                      ? "lg:border-r lg:border-[#F8E9E5]/15"
                      : ""
                  }

                  xl:px-10
                `}
              >
                {/* =====================================
                    CARD CONTENT
                ====================================== */}

                <div
                  className="
                    flex
                    w-full
                    max-w-[330px]

                    flex-col
                    items-center
                    justify-center

                    gap-3

                    text-center

                    sm:gap-3.5

                    lg:flex-row
                    lg:items-center
                    lg:justify-start
                    lg:gap-4

                    lg:text-left
                  "
                >
                  {/* =================================
                      ICON
                  ================================= */}

                  <div
                    className="
                      relative

                      flex
                      h-11
                      w-11
                      shrink-0

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#F8E9E5]/30

                      bg-[#3F131B]/70

                      shadow-[0_6px_22px_rgba(0,0,0,0.25)]

                      backdrop-blur-sm

                      transition-all
                      duration-300

                      group-hover:scale-105
                      group-hover:border-[#F8E9E5]/55
                      group-hover:bg-[#7A2936]/70

                      sm:h-12
                      sm:w-12

                      lg:h-12
                      lg:w-12
                    "
                  >
                    {/* Inner Ring */}

                    <div
                      className="
                        absolute
                        inset-[3px]

                        rounded-full

                        border
                        border-[#F8E9E5]/10
                      "
                    />

                    <Icon
                      className="
                        relative
                        z-10

                        h-5
                        w-5

                        text-[#F8E9E5]

                        drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)]

                        sm:h-[21px]
                        sm:w-[21px]
                      "
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* =================================
                      TEXT CONTENT
                  ================================= */}

                  <div
                    className="
                      min-w-0
                      flex-1

                      text-center

                      lg:text-left
                    "
                  >
                    {/* TITLE */}

                    <h3
                      className="
                        font-sans

                        text-[13px]
                        font-bold

                        leading-tight

                        tracking-[0.01em]

                        text-white

                        drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]

                        sm:text-[14px]

                        md:text-[15px]

                        lg:text-[15px]

                        xl:text-[16px]
                      "
                    >
                      {feature.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mx-auto

                        mt-1.5

                        max-w-[210px]

                        font-sans

                        text-[9.5px]
                        font-medium

                        leading-[1.5]

                        text-[#F8E9E5]/75

                        sm:text-[10px]

                        md:text-[10.5px]

                        lg:mx-0
                        lg:max-w-[230px]

                        lg:text-[11px]

                        xl:text-[12px]
                      "
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* =====================================
                    HOVER ACCENT
                ====================================== */}

                <span
                  className="
                    pointer-events-none

                    absolute
                    bottom-0
                    left-1/2

                    h-[2px]
                    w-0

                    -translate-x-1/2

                    rounded-full

                    bg-[#F8E9E5]

                    shadow-[0_0_14px_rgba(248,233,229,0.35)]

                    transition-all
                    duration-500

                    group-hover:w-[38%]
                  "
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================
          TOP PREMIUM LINE
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-20

          h-px
          w-full

          bg-gradient-to-r
          from-transparent
          via-[#F8E9E5]/50
          to-transparent
        "
      />

      {/* =========================================
          BOTTOM PREMIUM LINE
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          z-20

          h-[2px]
          w-full

          bg-gradient-to-r
          from-[#3F131B]
          via-[#F8E9E5]/60
          to-[#3F131B]
        "
      />
    </section>
  );
}