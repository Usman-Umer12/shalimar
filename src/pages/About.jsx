import React from "react";
import {
  ArrowRight,
  Check,
  CircleCheck,
  Hammer,
  MapPin,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Users,
  Building2,
  BadgeCheck,
  Quote,
} from "lucide-react";

/* =========================================================
   WHATSAPP
========================================================= */

const WHATSAPP_NUMBER = "923238430015";

/* =========================================================
   TESTIMONIALS
========================================================= */

const testimonials = [
  {
    name: "Nahal Malaika",
    meta: "4 reviews · 1 photo",
    date: "a month ago",
    text: "I had a great experience, as a women I was expecting them to ignore me but they treated me very fairly and respectfully. I wanted to renew my room door. They provided me with great service and they gave me the door within a week. Definitely recommended it to everyone.",
  },
  {
    name: "Kashan Ur Rehman",
    meta: "1 review · 2 photos",
    date: "a month ago",
    text: "I ordered 25 doors + Double Heighted Main Door for my new home in DHA Phase 7. Their quality and customer service was amazing. They are currently working on brother’s site. Would definitely recommend.",
  },
  {
    name: "Muhammad Sameer",
    meta: "4 reviews",
    date: "4 months ago",
    text: "We had great of work with the company and owners are quite friendly. Every thing they did at my home in DHA phase 5 DD was reliable and very flexible in pricing.",
  },
  {
    name: "Rana Shayan",
    meta: "4 reviews · 3 photos",
    date: "a week ago",
    text: "A very professional experience from consultation to execution. The quality of work and attention to detail made the overall experience smooth and reliable.",
  },
];

/* =========================================================
   QUALITY POINTS
========================================================= */

const qualityPoints = [
  {
    icon: Ruler,
    title: "Precision Work",
    text: "Every project is measured, planned and executed with close attention to dimensions, alignment and finishing.",
  },
  {
    icon: ShieldCheck,
    title: "Strict Quality Control",
    text: "We maintain strict standards throughout production and installation instead of compromising for lower-cost alternatives.",
  },
  {
    icon: CircleCheck,
    title: "No Material Waste",
    text: "Our process focuses on accurate planning and responsible material usage so unnecessary waste is kept to a minimum.",
  },
  {
    icon: BadgeCheck,
    title: "Reliable Materials",
    text: "We do not use low-quality sheets, hardware or materials simply to reduce the cost of a project.",
  },
];

/* =========================================================
   STATS
========================================================= */

const stats = [
  {
    value: "80+",
    label: "Projects Delivered",
  },
  {
    value: "9–10",
    label: "Projects Currently Running",
  },
  {
    value: "2016",
    label: "Projects Delivered Since",
  },
  {
    value: "DHA",
    label: "Strong Presence in Lahore",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function About() {
  const handleWhatsApp = () => {
    const message =
      "Hello, I would like to discuss an interior project with Shalimar. Please share more details about your services.";

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#241719]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A151F] text-white">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#351019] via-[#4A151F] to-[#641F2A]" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Soft light */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[380px]
            w-[75%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#F8E9E5]/[0.055]
            blur-[110px]
          "
        />

        {/* Decorative circles */}
        <div
          className="
            pointer-events-none
            absolute
            -left-40
            top-1/2
            h-80
            w-80
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.07]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-16
            top-1/2
            h-44
            w-44
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.06]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            top-1/2
            h-80
            w-80
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.07]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            top-1/2
            h-44
            w-44
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.06]
          "
        />

        {/* Content */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[500px]
            max-w-7xl
            items-center
            justify-center
            px-5
            py-24
            text-center
            sm:min-h-[540px]
            sm:px-8
            lg:px-12
          "
        >
          <div className="mx-auto max-w-4xl">
            {/* Logo */}
            <div className="mb-7 flex justify-center">
             
            </div>

            {/* Eyebrow */}
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />

              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-[#F8E9E5]/75
                  sm:text-xs
                "
              >
                About Shalimar
              </p>

              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />
            </div>

            {/* Heading */}
            <h1
              className="
                font-serif
                text-4xl
                font-medium
                leading-[1.08]
                tracking-[-0.025em]
                text-white
                sm:text-5xl
                lg:text-7xl
              "
            >
              Built Around
              <span className="mt-2 block text-[#E8CFC8]">
                Quality & Precision
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-white/70
                sm:text-base
                sm:leading-8
              "
            >
              From carefully selected materials to precise installation, we
              focus on creating interior solutions that are made to last,
              perform and look right.
            </p>
          </div>
        </div>

        {/* Lines */}
        <div
          className="
            absolute
            left-0
            top-0
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#F8E9E5]/30
            to-transparent
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#F8E9E5]/30
            to-transparent
          "
        />
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* Left */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[#641F2A]" />

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#7B4B54]
                    sm:text-xs
                  "
                >
                  Who We Are
                </p>
              </div>

              <h2
                className="
                  font-serif
                  text-3xl
                  font-medium
                  leading-tight
                  tracking-[-0.02em]
                  text-[#2C1B1E]
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Interior work should be measured by the details.
              </h2>

              <p
                className="
                  mt-6
                  text-sm
                  leading-7
                  text-[#766B68]
                  sm:text-base
                  sm:leading-8
                "
              >
                Shalimar is focused on practical, refined and durable interior
                solutions across kitchens, wardrobes, doors and related
                interior work.
              </p>

              <p
                className="
                  mt-4
                  text-sm
                  leading-7
                  text-[#766B68]
                  sm:text-base
                  sm:leading-8
                "
              >
                Since 2016, we have delivered more than 80 projects, while
                currently managing around 9–10 active projects. A significant
                part of our work is outside our immediate area, with Lahore
                — particularly DHA — being one of the key areas where our
                projects are delivered.
              </p>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#4A151F]
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_10px_25px_rgba(74,21,31,0.14)]
                  transition-all
                  duration-300
                  hover:bg-[#351019]
                "
              >
                <MessageCircle size={17} strokeWidth={1.8} />
                Discuss Your Project
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Right */}
            <div
              className="
                rounded-[28px]
                border
                border-[#DED4CC]
                bg-[#FBF9F5]
                p-6
                shadow-[0_15px_50px_rgba(55,35,28,0.06)]
                sm:p-8
                lg:p-10
              "
            >
              <div className="mb-8">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#8A7772]
                  "
                >
                  Our Work
                </p>

                <h3
                  className="
                    mt-3
                    font-serif
                    text-2xl
                    font-medium
                    text-[#2C1B1E]
                    sm:text-3xl
                  "
                >
                  Different projects. Dedicated teams.
                </h3>
              </div>

              <div className="space-y-5">
                {[
                  [
                    Building2,
                    "Project-Based Teams",
                    "Different projects are handled by dedicated teams so planning, production and installation can receive proper attention.",
                  ],
                  [
                    Users,
                    "Experienced Coordination",
                    "Our teams coordinate measurements, material requirements, production and site work according to each project's needs.",
                  ],
                  [
                    MapPin,
                    "Projects Beyond Our City",
                    "Our work extends beyond a single local area, with a strong number of projects delivered in Lahore, especially DHA.",
                  ],
                ].map(([Icon, title, text]) => (
                  <div
                    key={title}
                    className="flex gap-4 border-b border-[#E5DDD6] pb-5 last:border-0 last:pb-0"
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#4A151F]
                        text-white
                      "
                    >
                      <Icon size={18} strokeWidth={1.7} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#2C1B1E] sm:text-base">
                        {title}
                      </h4>

                      <p className="mt-1.5 text-xs leading-6 text-[#766B68] sm:text-sm">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="border-y border-[#DED4CC] bg-[#FBF9F5]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                px-5 py-8 text-center sm:px-8 sm:py-10
                ${
                  index < 3
                    ? "border-b border-[#DED4CC] lg:border-b-0 lg:border-r"
                    : "border-b border-[#DED4CC] lg:border-b-0"
                }
                ${index === 2 ? "border-b-0" : ""}
              `}
            >
              <p
                className="
                  font-serif
                  text-3xl
                  font-medium
                  tracking-tight
                  text-[#4A151F]
                  sm:text-4xl
                "
              >
                {stat.value}
              </p>

              <p
                className="
                  mt-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#8A7772]
                  sm:text-[10px]
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          QUALITY SECTION
      ====================================================== */}

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#7B4B54]
                sm:text-xs
              "
            >
              What We Do Better
            </p>

            <h2
              className="
                mt-3
                font-serif
                text-3xl
                font-medium
                tracking-[-0.02em]
                text-[#2C1B1E]
                sm:text-4xl
                lg:text-5xl
              "
            >
              Quality is not an option.
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                text-sm
                leading-7
                text-[#766B68]
                sm:text-base
              "
            >
              Our approach is simple: better planning, better materials,
              accurate workmanship and strict quality control from start to
              finish.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {qualityPoints.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    rounded-[22px]
                    border
                    border-[#DED4CC]
                    bg-[#FBF9F5]
                    p-6
                    shadow-[0_10px_35px_rgba(55,35,28,0.045)]
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#4A151F]
                      text-white
                    "
                  >
                    <Icon size={19} strokeWidth={1.7} />
                  </div>

                  <h3
                    className="
                      mt-5
                      font-serif
                      text-xl
                      font-medium
                      text-[#2C1B1E]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2.5
                      text-sm
                      leading-6
                      text-[#766B68]
                    "
                  >
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quality Statement */}
          <div
            className="
              mt-8
              rounded-[24px]
              bg-[#4A151F]
              px-6
              py-8
              text-white
              sm:px-10
              sm:py-9
            "
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2">
                  <Hammer size={17} strokeWidth={1.7} />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8CFC8]">
                    Our Standard
                  </p>
                </div>

                <h3 className="mt-3 font-serif text-2xl font-medium sm:text-3xl">
                  We do not compromise on the materials behind the finish.
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/65">
                  Low-quality sheets, low-quality hardware and unsuitable
                  materials are not part of our working standard. We believe
                  that a good interior should look refined because it has been
                  built correctly — not because compromises were hidden.
                </p>
              </div>

              <div className="shrink-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F8E9E5]">
                  <Check size={18} />
                  Strict Quality Process
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#F8E9E5]">
                  <Check size={18} />
                  Precision Execution
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ====================================================== */}

      <section className="bg-[#EDE5DC] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#7B4B54]
                  sm:text-xs
                "
              >
                Our Approach
              </p>

              <h2
                className="
                  mt-3
                  font-serif
                  text-3xl
                  font-medium
                  leading-tight
                  text-[#2C1B1E]
                  sm:text-4xl
                "
              >
                From measurement to final installation.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#766B68] sm:text-base">
                Every project has its own requirements. Our teams work around
                those requirements rather than forcing every project through
                the same process.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  "01",
                  "Understand",
                  "We understand the client's requirements, space and intended use.",
                ],
                [
                  "02",
                  "Measure & Plan",
                  "Dimensions, material requirements and practical details are carefully planned.",
                ],
                [
                  "03",
                  "Build",
                  "Production is carried out with attention to material quality and precision.",
                ],
                [
                  "04",
                  "Install",
                  "Our site teams focus on proper fitting, alignment and final finishing.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="
                    rounded-[20px]
                    border
                    border-[#D9CEC4]
                    bg-[#F8F4EE]
                    p-5
                  "
                >
                  <span className="text-xs font-semibold tracking-[0.15em] text-[#8A7772]">
                    {number}
                  </span>

                  <h3 className="mt-4 font-serif text-xl font-medium text-[#2C1B1E]">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#766B68]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ====================================================== */}

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#7B4B54]
                sm:text-xs
              "
            >
              Client Feedback
            </p>

            <h2
              className="
                mt-3
                font-serif
                text-3xl
                font-medium
                tracking-[-0.02em]
                text-[#2C1B1E]
                sm:text-4xl
                lg:text-5xl
              "
            >
              What our clients say
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#766B68]">
              Real feedback from clients who have worked with our teams on
              residential and interior projects.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((review) => (
              <article
                key={review.name}
                className="
                  relative
                  rounded-[24px]
                  border
                  border-[#DED4CC]
                  bg-[#FBF9F5]
                  p-6
                  shadow-[0_10px_35px_rgba(55,35,28,0.045)]
                  sm:p-7
                "
              >
                {/* Quote */}
                <div
                  className="
                    absolute
                    right-6
                    top-6
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F0E6DE]
                    text-[#4A151F]
                  "
                >
                  <Quote size={16} strokeWidth={1.7} />
                </div>

                {/* Stars */}
                <div className="mb-5 flex gap-1 text-[#8B5E3C]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-sm">
                      ★
                    </span>
                  ))}
                </div>

                <p
                  className="
                    max-w-xl
                    text-sm
                    leading-7
                    text-[#514447]
                    sm:text-[15px]
                  "
                >
                  “{review.text}”
                </p>

                <div className="mt-6 border-t border-[#E5DDD6] pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#2C1B1E]">
                        {review.name}
                      </h3>

                      <p className="mt-1 text-[10px] text-[#8A7772]">
                        {review.meta}
                      </p>
                    </div>

                    <p className="text-[10px] text-[#9A8F8A]">
                      {review.date}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <div
          className="
            relative
            mx-auto
            max-w-7xl
            overflow-hidden
            rounded-[30px]
            bg-[#4A151F]
            px-6
            py-14
            text-center
            text-white
            sm:px-10
            sm:py-16
          "
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#351019]/30 via-transparent to-[#641F2A]/40" />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-72
              w-72
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-white/[0.035]
              blur-[80px]
            "
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#E8CFC8]
                sm:text-xs
              "
            >
              Start Your Project
            </p>

            <h2
              className="
                mt-3
                font-serif
                text-3xl
                font-medium
                leading-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Have a space in mind?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Tell us what you are planning and our team can help you discuss
              the right solution for your space.
            </p>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="
                group
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#F8F4EE]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-[#4A151F]
                transition-all
                duration-300
                hover:bg-white
              "
            >
              <MessageCircle size={17} strokeWidth={1.8} />
              Talk to Our Team
              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
