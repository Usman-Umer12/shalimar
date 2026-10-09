import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import des1 from "../assets/des1.webp";
import des3 from "../assets/des3.webp";
import des2 from "../assets/des2.webp";
import des4 from "../assets/des4.png";

import mob1 from "../assets/mob1.webp";
import mob2 from "../assets/mob2.webp";
import mob3 from "../assets/mob3.webp";
import mob4 from "../assets/mob4.webp";

const slides = [
  {
    desktopImage: des3,
    mobileImage: mob3,
    category: "Premium Doors",
    title: (
      <>
      Crafted to Define
      <br />
Your Entrance
      </>
    ),
    description:
      "Discover premium doors created to complement sophisticated interiors, combining enduring materials, refined finishes, and meticulous craftsmanship.",
    exploreUrl: "/doors/",
  },
  {
    desktopImage: des1,
    mobileImage: mob2,
    category: "Bespoke Kitchens",
    title: (
      <>
       Kitchens Designed
       <br />
Around Your Lifestyle
      </>
    ),
    description:
      "Thoughtfully designed kitchens that bring together refined aesthetics, intelligent layouts, and exceptional craftsmanship for beautifully considered interiors.",
    exploreUrl: "/kitchens/",
  },

  {
    desktopImage: des2,
    mobileImage: mob1,
    category: "Interior Doors",
    title: (
      <>
        Make Every
        <br />
        Entrance Remarkable
      </>
    ),
    description:
      "Elevate your interiors with beautifully crafted doors, designed with distinctive finishes, precise detailing, and timeless character.",
    exploreUrl: "/doors/",
  },


  {
    desktopImage: des4,
    mobileImage: mob4,
    category: "Bespoke Wardrobes",
    title: (
      <>
        Storage Designed
        <br />
        Around You
      </>
    ),
    description:
      "Custom wardrobes designed to make the most of your space, with elegant finishes, intelligent storage, and details tailored to your lifestyle.",
    exploreUrl: "/wardrobes/",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section
      className="
        relative
        flex
        h-[85vh]
        min-h-[560px]
        w-full
        overflow-hidden
        bg-black

        sm:min-h-[600px]
        md:min-h-[620px]
        lg:min-h-[650px]
      "
    >
      {/* =====================================================
          BACKGROUND SLIDES
      ====================================================== */}

      {slides.map((item, index) => (
        <picture
          key={index}
          className={`
            absolute
            inset-0
            h-full
            w-full
            transition-opacity
            duration-[1200ms]
            ease-in-out

            ${
              currentSlide === index
                ? "z-10 opacity-100"
                : "z-0 opacity-0"
            }
          `}
        >
          <source
            media="(max-width: 767px)"
            srcSet={item.mobileImage}
          />

          <img
            src={item.desktopImage}
            alt={item.category}
            className="
              h-full
              w-full
              object-cover
              object-center
            "
          />
        </picture>
      ))}

      {/* =====================================================
          DARK OVERLAY
      ====================================================== */}

      <div className="absolute inset-0 z-20 bg-black/40" />

      {/* =====================================================
          HERO CONTENT AREA
      ====================================================== */}

      <div
        className="
          relative
          z-30
          mx-auto
          flex
          h-full
          w-full
          max-w-[1440px]
          items-center

          px-5
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-16
        "
      >
        <div
          key={currentSlide}
          className="
            w-full
            animate-[heroContent_0.75s_ease-out]
            text-white

            max-w-[340px]

            sm:max-w-[560px]

            md:max-w-[680px]

            lg:mt-3
            lg:max-w-[800px]

            xl:max-w-[850px]
          "
        >
          {/* =================================================
              CATEGORY
          ================================================== */}

          <div
            className="
              mb-4
              flex
              items-center
              gap-3

              min-[375px]:mb-5

              sm:mb-6
              sm:gap-4

              md:mb-6
            "
          >
            <span
              className="
                h-px
                w-7
                shrink-0
                bg-[#D4AA9F]

                min-[375px]:w-8

                sm:w-10

                md:w-14
              "
            />

            <span
              className="
                font-sans
                text-[9px]
                font-medium
                uppercase
                leading-none
                tracking-[0.22em]
                text-[#F0DDD8]

                min-[375px]:text-[10px]

                sm:text-[10px]

                md:text-[12px]
              "
            >
              {slide.category}
            </span>
          </div>

          {/* =================================================
              MAIN TITLE
          ================================================== */}

          <h1
            className="
              w-full
              font-serif
              font-medium
              leading-[1.04]
              tracking-[-0.035em]
              text-white

              text-[37px]

              max-[374px]:text-[35px]

              min-[375px]:text-[40px]

              sm:text-[48px]
              sm:leading-[1.05]

              md:text-[57px]

              lg:text-[67px]

              xl:text-[75px]
            "
          >
            {slide.title}
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <div
            className="
              mt-4
              w-full
              max-w-[330px]

              min-[375px]:mt-5
              min-[375px]:max-w-[345px]

              sm:mt-5
              sm:max-w-[540px]

              md:mt-6
              md:max-w-[625px]

              lg:mt-6
              lg:max-w-[680px]
            "
          >
            <p
              className="
                font-sans
                text-[12.5px]
                font-normal
                leading-[1.65]
                tracking-[0.002em]
                text-white/90

                max-[374px]:text-[12px]

                min-[375px]:text-[13px]

                sm:text-[14px]
                sm:leading-6

                md:text-[15px]
                md:leading-7

                lg:text-[17px]
                lg:leading-8
              "
            >
              {slide.description}
            </p>
          </div>

          {/* =================================================
              CTA BUTTONS
          ================================================== */}

          <div
            className="
              mt-5
              flex
              w-full
              max-w-[340px]
              items-center
              gap-2.5

              max-[374px]:max-w-[300px]
              max-[374px]:gap-2

              min-[375px]:max-w-[345px]

              sm:mt-6
              sm:max-w-[370px]
              sm:gap-3

              md:mt-7
              md:max-w-[395px]
            "
          >
            {/* =================================================
                EXPLORE PRODUCTS
            ================================================== */}

            <a
              href={slide.exploreUrl}
              className="
                group
                inline-flex
                h-[45px]
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-full
                bg-[#641F2A]
                px-2
                font-sans
                text-center
                text-[8.5px]
                font-semibold
                uppercase
                tracking-[0.07em]
                text-white
                shadow-lg
                shadow-black/20
                transition-colors
                duration-200
                hover:bg-[#762633]

                min-[375px]:h-[47px]
                min-[375px]:text-[9px]

                sm:h-[49px]
                sm:w-[180px]
                sm:flex-none
                sm:px-4
                sm:text-[10px]

                md:h-[52px]
                md:w-[190px]
                md:text-[11px]
              "
            >
              <span className="whitespace-nowrap">
                Explore Collection
              </span>

              <ArrowRight
                size={14}
                strokeWidth={2}
                className="
                  shrink-0
                  transition-transform
                  duration-200
                  group-hover:translate-x-1

                  sm:size-[15px]
                "
              />
            </a>

            {/* =================================================
                CONTACT US
            ================================================== */}

            <a
              href="/contact/"
              className="
                group
                inline-flex
                h-[45px]
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-full
                border
                border-white/90
                bg-white
                px-2
                font-sans
                text-center
                text-[8.5px]
                font-semibold
                uppercase
                tracking-[0.07em]
                text-[#641F2A]
                shadow-lg
                shadow-black/20
                transition-colors
                duration-200
                hover:bg-[#F5EEEC]

                min-[375px]:h-[47px]
                min-[375px]:text-[9px]

                sm:h-[49px]
                sm:w-[180px]
                sm:flex-none
                sm:px-4
                sm:text-[10px]

                md:h-[52px]
                md:w-[190px]
                md:text-[11px]
              "
            >
              <span className="whitespace-nowrap">
                Start Your Project
              </span>

              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="
                  shrink-0
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5

                  sm:size-[15px]
                "
              />
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================
          SLIDE INDICATORS
      ====================================================== */}

      <div
        className="
          absolute
          bottom-5
          left-5
          z-40
          flex
          items-center
          gap-1.5

          sm:bottom-8
          sm:left-8
          sm:gap-2

          lg:left-12

          xl:left-16
        "
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="
              flex
              h-5
              items-center
              justify-center
              px-0.5
            "
          >
            <span
              className={`
                block
                h-[2px]
                rounded-full
                transition-all
                duration-500

                ${
                  currentSlide === index
                    ? "w-10 bg-white"
                    : "w-5 bg-white/40 hover:bg-white/70"
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* =====================================================
          SLIDE NUMBER
      ====================================================== */}

      <div
        className="
          absolute
          bottom-5
          right-5
          z-40
          flex
          items-center
          font-sans
          text-[8px]
          font-semibold
          tracking-[0.18em]
          text-white/60

          sm:bottom-8
          sm:right-8
          sm:text-[9px]

          lg:right-12

          xl:right-16
        "
      >
        <span className="text-white">
          0{currentSlide + 1}
        </span>

        <span className="mx-2 text-white/35">
          /
        </span>

        <span>
          0{slides.length}
        </span>
      </div>

    
{/* =====================================================
    PROFESSIONAL WHATSAPP FLOATING BUTTON
====================================================== */}

<a
  href={`https://wa.me/923238430015?text=${encodeURIComponent(
    "Assalam-o-Alaikum Shalimar Team! I visited your website and would like to know more about your premium kitchens, wardrobes, and doors. Could you please guide me with the available designs and pricing? Thank you."
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with Shalimar on WhatsApp"
  title="Chat with us on WhatsApp"
  className="
    fixed bottom-5 right-5 z-50
    flex h-14 w-14 items-center justify-center
    rounded-full bg-[#25D366] text-white
    shadow-lg
    transition-colors duration-200
    hover:bg-[#20BA5A]
    active:scale-95
    sm:bottom-6 sm:right-6
    sm:h-[60px] sm:w-[60px]
    lg:bottom-7 lg:right-7
    lg:h-16 lg:w-16
    focus-visible:outline-none
    focus-visible:ring-4
    focus-visible:ring-[#25D366]/40
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    className="h-8 w-8"
    aria-hidden="true"
  >
    <path d="M16.01 3C8.84 3 3.01 8.83 3.01 16c0 2.29.6 4.44 1.65 6.31L3 29l6.88-1.61A12.94 12.94 0 0 0 16.01 29C23.18 29 29 23.17 29 16S23.18 3 16.01 3Zm0 23.73c-2.01 0-3.88-.59-5.45-1.61l-.39-.24-4.08.96.97-3.98-.25-.41A10.7 10.7 0 0 1 5.28 16c0-5.92 4.81-10.73 10.73-10.73S26.74 10.08 26.74 16s-4.81 10.73-10.73 10.73Zm5.89-8.03c-.32-.16-1.89-.93-2.18-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.87-1.76-2.18-.18-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.21 3.37 5.35 4.73.75.32 1.33.52 1.79.66.75.24 1.43.21 1.97.13.6-.09 1.89-.77 2.16-1.52.26-.76.26-1.4.18-1.52-.08-.13-.29-.21-.6-.37Z" />
  </svg>
</a>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes heroContent {
            0% {
              opacity: 0;
              transform: translateY(14px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes whatsappBlink {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }

            50% {
              opacity: 0.72;
              transform: scale(1.07);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Home;