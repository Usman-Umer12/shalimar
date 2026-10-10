import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

/* =========================================================
   WHATSAPP
========================================================= */

const WHATSAPP_NUMBER = "923238430015";

/* =========================================================
   MAP
========================================================= */

const MAP_URL =
  "https://www.google.com/maps?q=Lahore,Pakistan&output=embed";

/* =========================================================
   COMPONENT
========================================================= */

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    profession: "",
  });

  const [submitted, setSubmitted] = useState(false);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  /* =======================================================
     WHATSAPP SUBMIT
  ======================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
Hello, I would like to get in touch.

Name: ${form.name}
Phone: ${form.phone}
Interested In: ${form.profession}

I am interested in your ${form.profession.toLowerCase()} solutions.

Please share more details.
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    setSubmitted(true);

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");

      setSubmitted(false);

      setForm({
        name: "",
        phone: "",
        profession: "",
      });
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#241719]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A151F] text-white">

        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#351019] via-[#4A151F] to-[#671F2C]" />

        {/* Edge Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Center Glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[340px]
            w-[70%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#F8E9E5]/[0.06]
            blur-[100px]
          "
        />

        {/* Vertical Shine */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[-15%]
            h-[130%]
            w-[18%]
            -translate-x-1/2
            rotate-[8deg]
            bg-gradient-to-r
            from-transparent
            via-white/[0.045]
            to-transparent
            blur-2xl
          "
        />

        {/* Left Rings */}
        <div
          className="
            pointer-events-none
            absolute
            -left-32
            top-1/2
            h-72
            w-72
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.08]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-16
            top-1/2
            h-40
            w-40
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.06]
          "
        />

        {/* Right Rings */}
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            top-1/2
            h-72
            w-72
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.08]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            top-1/2
            h-40
            w-40
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
            min-h-[430px]
            max-w-7xl
            items-center
            justify-center
            px-5
            py-20
            text-center
            sm:min-h-[470px]
            sm:px-8
            lg:px-12
            mt-15
          "
        >
          <div className="mx-auto max-w-3xl">

            {/* Eyebrow */}
            <div className="mb-5 flex items-center justify-center gap-3">

              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />

              <p
                className="
                  font-sans
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  text-[#F8E9E5]/75
                  sm:text-xs
                "
              >
                Get In Touch
              </p>

              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />

            </div>

            {/* Title */}
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
              Let’s Create Something

              <span className="mt-1 block text-[#E8CFC8]">
                Beautiful Together
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                font-sans
                text-sm
                leading-7
                text-white/70
                sm:text-base
                sm:leading-8
              "
            >
              Have a project in mind? Share your details with us and our team
              will connect with you to discuss your requirements.
            </p>

          </div>
        </div>

        {/* Top Line */}
        <div
          className="
            absolute
            left-0
            top-0
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#F8E9E5]/35
            to-transparent
          "
        />

        {/* Bottom Line */}
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
          CONTACT SECTION
      ====================================================== */}

      <section className="px-5 py-5 sm:px-8 sm:py-16 lg:px-12 lg:py-10">

        <div className="mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">

            <p
              className="
                font-sans
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#7B4B54]
                sm:text-xs
              "
            >
              Contact Us
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
              Tell Us About Your Project
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                font-sans
                text-sm
                leading-7
                text-[#766B68]
              "
            >
              Whether you are planning a new kitchen, wardrobe or door,
              we are here to help you bring your vision to life.
            </p>

          </div>

          {/* =================================================
              MAIN CONTACT GRID
          ================================================== */}

          <div
            className="
              grid
              overflow-hidden
              rounded-[28px]
              border
              border-[#DED4CC]
              bg-[#FBF9F5]
              shadow-[0_15px_50px_rgba(55,35,28,0.07)]
              lg:grid-cols-[0.9fr_1.1fr]
            "
          >

            {/* =================================================
                LEFT — FORM
            ================================================== */}

            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">

              {/* Small Heading */}
              <div className="mb-8">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#4A151F]" />

                  <p
                    className="
                      font-sans
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.25em]
                      text-[#8A7772]
                    "
                  >
                    Start a Conversation
                  </p>

                </div>

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
                  How Can We Help?
                </h3>

                <p
                  className="
                    mt-2
                    max-w-md
                    font-sans
                    text-sm
                    leading-6
                    text-[#766B68]
                  "
                >
                  Fill in your details and continue the conversation with us
                  directly on WhatsApp.
                </p>

              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>

                <div className="space-y-5">

                  {/* =================================================
                      NAME
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="name"
                      className="
                        mb-2
                        block
                        font-sans
                        text-xs
                        font-semibold
                        text-[#433636]
                      "
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#DCD3CB]
                        bg-white
                        px-4
                        py-3.5
                        font-sans
                        text-sm
                        text-[#241619]
                        outline-none
                        transition
                        duration-200
                        placeholder:text-[#A39A96]
                        focus:border-[#4A151F]
                        focus:ring-2
                        focus:ring-[#4A151F]/10
                      "
                    />

                  </div>

                  {/* =================================================
                      PHONE
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="phone"
                      className="
                        mb-2
                        block
                        font-sans
                        text-xs
                        font-semibold
                        text-[#433636]
                      "
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="03XX XXXXXXX"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#DCD3CB]
                        bg-white
                        px-4
                        py-3.5
                        font-sans
                        text-sm
                        text-[#241619]
                        outline-none
                        transition
                        duration-200
                        placeholder:text-[#A39A96]
                        focus:border-[#4A151F]
                        focus:ring-2
                        focus:ring-[#4A151F]/10
                      "
                    />

                  </div>

                  {/* =================================================
                      INTERESTED IN — DROPDOWN
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="profession"
                      className="
                        mb-2
                        block
                        font-sans
                        text-xs
                        font-semibold
                        text-[#433636]
                      "
                    >
                      Interested In
                    </label>

                    <div className="relative">

                      <select
                        id="profession"
                        name="profession"
                        required
                        value={form.profession}
                        onChange={handleChange}
                        className="
                          w-full
                          appearance-none
                          rounded-xl
                          border
                          border-[#DCD3CB]
                          bg-white
                          px-4
                          py-3.5
                          pr-11
                          font-sans
                          text-sm
                          text-[#241619]
                          outline-none
                          transition
                          duration-200
                          focus:border-[#4A151F]
                          focus:ring-2
                          focus:ring-[#4A151F]/10
                        "
                      >
                        <option value="" disabled>
                          Select a service
                        </option>

                        <option value="Kitchens">
                          Kitchens
                        </option>

                        <option value="Wardrobes">
                          Wardrobes
                        </option>

                        <option value="Doors">
                          Doors
                        </option>
                        <option value="complete">
                          Complete Project
                        </option>
                      </select>

                      {/* Custom Arrow */}
                      <div
                        className="
                          pointer-events-none
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#4A151F]
                        "
                      >
                        <ArrowRight
                          size={16}
                          strokeWidth={1.8}
                          className="rotate-90"
                        />
                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    SUBMIT
                ================================================== */}

                <button
                  type="submit"
                  disabled={submitted}
                  className="
                    group
                    mt-7
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#4A151F]
                    px-5
                    py-3.5
                    font-sans
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_10px_25px_rgba(74,21,31,0.15)]
                    transition-all
                    duration-300
                    hover:bg-[#361018]
                    hover:shadow-[0_12px_30px_rgba(74,21,31,0.22)]
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >
                  {submitted ? (
                    <>
                      <Check size={17} strokeWidth={2} />
                      Opening WhatsApp...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={17} strokeWidth={2} />
                      Send on WhatsApp

                      <ArrowRight
                        size={15}
                        strokeWidth={2}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-0.5
                        "
                      />
                    </>
                  )}
                </button>

                <p
                  className="
                    mt-3
                    text-center
                    font-sans
                    text-[10px]
                    leading-5
                    text-[#958A85]
                  "
                >
                  Your details will be sent directly to our WhatsApp.
                </p>

              </form>

              {/* =================================================
                  CONTACT INFO
              ================================================== */}

              <div
                className="
                  mt-9
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  bg-[#F3ECE5]
                  p-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                {/* WhatsApp */}
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#4A151F]
                      text-white
                    "
                  >
                    <Phone size={16} />
                  </div>

                  <div>

                    <p
                      className="
                        font-sans
                        text-[10px]
                        uppercase
                        tracking-[0.15em]
                        text-[#958680]
                      "
                    >
                      WhatsApp
                    </p>

                    <p
                      className="
                        mt-0.5
                        font-sans
                        text-sm
                        font-semibold
                        text-[#2C1B1E]
                      "
                    >
                      +923238430015
                    </p>

                  </div>

                </div>

                {/* Location */}
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#4A151F]
                      text-white
                    "
                  >
                    <MapPin size={16} />
                  </div>

                  <div>

                    <p
                      className="
                        font-sans
                        text-[10px]
                        uppercase
                        tracking-[0.15em]
                        text-[#958680]
                      "
                    >
                      Location
                    </p>

                    <p
                      className="
                        mt-0.5
                        font-sans
                        text-sm
                        font-semibold
                        text-[#2C1B1E]
                      "
                    >
                      Lahore, Pakistan
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT — MAP
            ================================================== */}

            <div
              className="
                relative
                min-h-[380px]
                bg-[#E8DED5]
                sm:min-h-[460px]
                lg:min-h-full
              "
            >

              {/* Map */}
              <iframe
                title="Our Location"
                src={MAP_URL}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Overlay Card */}
              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  right-5
                  rounded-2xl
                  border
                  border-white/50
                  bg-[#FBF9F5]/95
                  p-4
                  shadow-[0_12px_35px_rgba(40,25,20,0.16)]
                  backdrop-blur-md
                  sm:bottom-7
                  sm:left-7
                  sm:right-auto
                  sm:max-w-xs
                "
              >

                <div className="flex items-start gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#4A151F]
                      text-white
                    "
                  >
                    <MapPin size={17} />
                  </div>

                  <div>

                    <p
                      className="
                        font-sans
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-[#8A7772]
                      "
                    >
                      Visit Us
                    </p>

                    <h4
                      className="
                        mt-1
                        font-serif
                        text-lg
                        font-medium
                        text-[#2C1B1E]
                      "
                    >
                      Lahore, Pakistan
                    </h4>

                    <p
                      className="
                        mt-1
                        font-sans
                        text-xs
                        leading-5
                        text-[#766B68]
                      "
                    >
                      Get in touch with our team for your next interior
                      project.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
