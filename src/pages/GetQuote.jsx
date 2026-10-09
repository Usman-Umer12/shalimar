import React, { useState } from "react";
import { ArrowRight, MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "923238430015";

export default function GetQuote() {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    country: "",
    profession: "",
  });

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
Hello, I would like to get a quote.

Name: ${form.name}
Phone: ${form.phone}
City: ${form.city}
Country: ${form.country}
Profession: ${form.profession}

Please share more details and pricing.
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    setForm({
      name: "",
      phone: "",
      city: "",
      country: "",
      profession: "",
    });

    setIsOpen(false);
  };

  return (
    <>
      {/* =========================================================
          GET A QUOTE BUTTON
      ========================================================= */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          group inline-flex items-center justify-center gap-2
          rounded-xl bg-[#4A151F] px-6 py-3.5
          font-sans text-sm font-semibold text-white
          shadow-[0_10px_25px_rgba(74,21,31,0.16)]
          transition-all duration-300
          hover:bg-[#351019]
          hover:shadow-[0_14px_30px_rgba(74,21,31,0.22)]
        "
      >
        Get a Quote

        <ArrowRight
          size={16}
          strokeWidth={2}
          className="
            transition-transform duration-300
            group-hover:translate-x-1
          "
        />
      </button>

      {/* =========================================================
          POPUP OVERLAY
      ========================================================= */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-[999]
            flex items-center justify-center
            bg-black/60 px-4 py-6
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          {/* =====================================================
              POPUP
          ===================================================== */}
          <div
            className="
              relative w-full max-w-lg
              max-h-[92vh] overflow-y-auto
              rounded-[26px]
              border border-[#E2D8D0]
              bg-[#FBF9F5]
              shadow-[0_30px_80px_rgba(0,0,0,0.25)]
            "
          >
            {/* ===================================================
                HEADER
            =================================================== */}
            <div className="relative overflow-hidden bg-[#4A151F] px-6 py-7 text-white sm:px-8">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10" />
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-white/[0.08]" />

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  absolute right-4 top-4
                  flex h-9 w-9 items-center justify-center
                  rounded-full border border-white/15
                  bg-white/5 text-white/80
                  transition duration-200
                  hover:bg-white/10 hover:text-white
                "
                aria-label="Close"
              >
                <X size={17} strokeWidth={1.8} />
              </button>

              <div className="relative z-10 pr-10">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8CFC8]" />

                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E8CFC8]">
                    Get In Touch
                  </p>
                </div>

                <h2 className="font-serif text-3xl font-medium leading-tight sm:text-4xl">
                  Get a Quote
                </h2>

                <p className="mt-2 max-w-md font-sans text-sm leading-6 text-white/65">
                  Share your details and our team will contact you with more
                  information.
                </p>
              </div>
            </div>

            {/* ===================================================
                FORM
            =================================================== */}
            <form
              onSubmit={handleSubmit}
              className="px-6 py-6 sm:px-8 sm:py-8"
            >
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="quote-name"
                    className="
                      mb-2 block
                      font-sans text-xs font-semibold
                      text-[#433636]
                    "
                  >
                    Full Name
                  </label>

                  <input
                    id="quote-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="
                      w-full rounded-xl
                      border border-[#DCD3CB]
                      bg-white px-4 py-3.5
                      font-sans text-sm text-[#241619]
                      outline-none
                      transition duration-200
                      placeholder:text-[#A39A96]
                      focus:border-[#4A151F]
                      focus:ring-2 focus:ring-[#4A151F]/10
                    "
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="quote-phone"
                    className="
                      mb-2 block
                      font-sans text-xs font-semibold
                      text-[#433636]
                    "
                  >
                    Phone Number
                  </label>

                  <input
                    id="quote-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                    className="
                      w-full rounded-xl
                      border border-[#DCD3CB]
                      bg-white px-4 py-3.5
                      font-sans text-sm text-[#241619]
                      outline-none
                      transition duration-200
                      placeholder:text-[#A39A96]
                      focus:border-[#4A151F]
                      focus:ring-2 focus:ring-[#4A151F]/10
                    "
                  />
                </div>

                {/* City + Country */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* City */}
                  <div>
                    <label
                      htmlFor="quote-city"
                      className="
                        mb-2 block
                        font-sans text-xs font-semibold
                        text-[#433636]
                      "
                    >
                      City
                    </label>

                    <input
                      id="quote-city"
                      name="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Lahore"
                      className="
                        w-full rounded-xl
                        border border-[#DCD3CB]
                        bg-white px-4 py-3.5
                        font-sans text-sm text-[#241619]
                        outline-none
                        transition duration-200
                        placeholder:text-[#A39A96]
                        focus:border-[#4A151F]
                        focus:ring-2 focus:ring-[#4A151F]/10
                      "
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      htmlFor="quote-country"
                      className="
                        mb-2 block
                        font-sans text-xs font-semibold
                        text-[#433636]
                      "
                    >
                      Country
                    </label>

                    <input
                      id="quote-country"
                      name="country"
                      type="text"
                      required
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Pakistan"
                      className="
                        w-full rounded-xl
                        border border-[#DCD3CB]
                        bg-white px-4 py-3.5
                        font-sans text-sm text-[#241619]
                        outline-none
                        transition duration-200
                        placeholder:text-[#A39A96]
                        focus:border-[#4A151F]
                        focus:ring-2 focus:ring-[#4A151F]/10
                      "
                    />
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <label
                    htmlFor="quote-profession"
                    className="
                      mb-2 block
                      font-sans text-xs font-semibold
                      text-[#433636]
                    "
                  >
                    Profession
                  </label>

                  <input
                    id="quote-profession"
                    name="profession"
                    type="text"
                    required
                    value={form.profession}
                    onChange={handleChange}
                    placeholder="Business Owner, Architect, Designer..."
                    className="
                      w-full rounded-xl
                      border border-[#DCD3CB]
                      bg-white px-4 py-3.5
                      font-sans text-sm text-[#241619]
                      outline-none
                      transition duration-200
                      placeholder:text-[#A39A96]
                      focus:border-[#4A151F]
                      focus:ring-2 focus:ring-[#4A151F]/10
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}
              <button
                type="submit"
                className="
                  group mt-7 flex w-full
                  items-center justify-center gap-2
                  rounded-xl bg-[#4A151F]
                  px-5 py-4
                  font-sans text-sm font-semibold text-white
                  shadow-[0_10px_25px_rgba(74,21,31,0.16)]
                  transition-all duration-300
                  hover:bg-[#351019]
                  hover:shadow-[0_14px_30px_rgba(74,21,31,0.22)]
                "
              >
                <MessageCircle size={17} strokeWidth={2} />

                Send Request on WhatsApp

                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>

              <p className="mt-3 text-center font-sans text-[10px] leading-5 text-[#958A85]">
                Your information will be sent directly to our WhatsApp.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}