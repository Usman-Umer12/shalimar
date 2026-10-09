import React from "react";

import dor1 from "../assets/dor1.webp";
import dor2 from "../assets/dor2.webp";
import dor3 from "../assets/dor3.webp";
import dor4 from "../assets/dor4.webp";
import dor5 from "../assets/dor5.webp";
import dor6 from "../assets/dor6.webp";
import dor7 from "../assets/dor7.webp";
import dor8 from "../assets/dor8.webp";
import dor9 from "../assets/dor9.webp";
import dor10 from "../assets/dor10.webp";

import bdor1 from "../assets/bdor1.webp";
import bdor2 from "../assets/bdor2.webp";
import bdor3 from "../assets/bdor3.webp";
import bdor4 from "../assets/bdor4.webp";
import bdor5 from "../assets/bdor5.webp";
import bdor6 from "../assets/bdor6.webp";
import bdor7 from "../assets/bdor7.webp";
import bdor8 from "../assets/bdor8.webp";
import bdor9 from "../assets/bdor9.webp";
import bdor10 from "../assets/bdor10.webp";

import word1 from "../assets/word1.webp";
import word2 from "../assets/word2.webp";
import word3 from "../assets/word3.webp";
import word4 from "../assets/word4.webp";

import kitchen1 from "../assets/kitchen1.webp";
import kitchen2 from "../assets/kitchen2.webp";

/* =========================================================
   ROW DATA
========================================================= */

const rowOne = [
  { image: dor1, title: "Interior Doors" },
  { image: word1, title: "Custom Wardrobes" },
  { image: bdor1, title: "Premium Doors" },
  { image: kitchen1, title: "Luxury Kitchens" },
  { image: dor2, title: "Interior Doors" },
  { image: word2, title: "Custom Wardrobes" },
  { image: bdor2, title: "Premium Doors" },
  { image: kitchen2, title: "Luxury Kitchens" },
  { image: dor3, title: "Interior Doors" },
  { image: word3, title: "Custom Wardrobes" },
  { image: dor4, title: "Interior Doors" },
  { image: bdor3, title: "Premium Doors" },
  { image: dor10, title: "Interior Doors" },
  { image: word4, title: "Custom Wardrobes" },
];

const rowTwo = [
  { image: bdor4, title: "Premium Doors" },
  { image: dor5, title: "Interior Doors" },
  { image: word4, title: "Custom Wardrobes" },
  { image: bdor5, title: "Premium Doors" },
  { image: dor6, title: "Interior Doors" },
  { image: bdor6, title: "Premium Doors" },
  { image: dor7, title: "Interior Doors" },
  { image: bdor7, title: "Premium Doors" },
  { image: dor8, title: "Interior Doors" },
  { image: bdor8, title: "Premium Doors" },
  { image: dor9, title: "Interior Doors" },
  { image: bdor9, title: "Premium Doors" },
  { image: dor10, title: "Interior Doors" },
  { image: bdor10, title: "Premium Doors" },
];

/* =========================================================
   MARQUEE ROW
========================================================= */

const MarqueeRow = ({ items, reverse = false }) => {
  /*
    IMPORTANT:
    Two EXACTLY identical groups are used.

    Animation moves exactly 50% of the total track.
    Since both groups have identical dimensions,
    the animation returns to the exact same visual
    position without any visible jump.
  */

  return (
    <div className="marquee-viewport">
      <div
        className={`marquee-track ${
          reverse
            ? "marquee-track-reverse"
            : "marquee-track-forward"
        }`}
      >
        {/* GROUP 1 */}
        <div className="marquee-group">
          {items.map((item, index) => (
            <article
              key={`group-one-${item.title}-${index}`}
              className="marquee-card"
            >
              <img
                src={item.image}
                alt={item.title}
                className="marquee-image"
                draggable="false"
                loading="eager"
              />

              <div className="marquee-overlay" />

              <div className="marquee-frame" />

              <div className="marquee-content">
                <span className="marquee-brand">
                  Shalimar
                </span>

                <h3 className="marquee-title">
                  {item.title}
                </h3>

                <span className="marquee-detail">
                  Explore Collection
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* GROUP 2 — EXACT DUPLICATE */}
        <div className="marquee-group" aria-hidden="true">
          {items.map((item, index) => (
            <article
              key={`group-two-${item.title}-${index}`}
              className="marquee-card"
            >
              <img
                src={item.image}
                alt=""
                className="marquee-image"
                draggable="false"
                loading="lazy"
              />

              <div className="marquee-overlay" />

              <div className="marquee-frame" />

              <div className="marquee-content">
                <span className="marquee-brand">
                  Shalimar
                </span>

                <h3 className="marquee-title">
                  {item.title}
                </h3>

                <span className="marquee-detail">
                  Explore Collection
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const InteriorMarquee = () => {
  return (
    <section className="interior-marquee-section">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="interior-marquee-header">

        <div className="marquee-label">
          <span className="marquee-label-line" />

          <span>Our Collection</span>

          <span className="marquee-label-line" />
        </div>

        <h2 className="marquee-heading">
          Crafted for{" "}
          <span className="marquee-heading-accent">
            Beautiful Spaces
          </span>
        </h2>

        <p className="marquee-description">
          Explore our collection of refined doors, bespoke
          wardrobes, and thoughtfully designed kitchens,
          created to bring character, functionality, and
          timeless elegance to every interior.
        </p>

      </div>

      {/* =====================================================
          ROW ONE
      ===================================================== */}

      <MarqueeRow items={rowOne} />

      <div className="marquee-row-gap" />

      {/* =====================================================
          ROW TWO
      ===================================================== */}

      <MarqueeRow
        items={rowTwo}
        reverse
      />

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           SECTION
        ===================================================== */

        .interior-marquee-section {
          width: 100%;
          overflow: hidden;

          background: #f7f2ea;

          padding: 72px 0 82px;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .interior-marquee-header {
          width: min(720px, calc(100% - 40px));

          margin: 0 auto 48px;

          text-align: center;
        }

        .marquee-label {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 12px;

          margin-bottom: 20px;

          color: #641f2a;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 11px;
          font-weight: 700;

          letter-spacing: 0.25em;

          text-transform: uppercase;
        }

        .marquee-label-line {
          width: 48px;
          height: 1px;

          flex: 0 0 auto;

          background: #641f2a;

          opacity: 0.7;
        }

        .marquee-heading {
          margin: 0;

          color: #241a16;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: clamp(34px, 4vw, 50px);

          font-weight: 500;

          line-height: 1.1;

          letter-spacing: -0.025em;
        }

        .marquee-heading-accent {
          color: #641f2a;

          font-style: italic;
        }

        .marquee-description {
          max-width: 600px;

          margin: 18px auto 0;

          color: #625750;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 14px;

          font-weight: 400;

          line-height: 1.8;
        }


        /* =====================================================
           VIEWPORT
        ===================================================== */

        .marquee-viewport {
          position: relative;

          width: 100%;

          overflow: hidden;
        }

        /*
          Soft fade at both sides.
          This makes cards smoothly disappear
          instead of suddenly entering/leaving.
        */

        .marquee-viewport::before,
        .marquee-viewport::after {
          content: "";

          position: absolute;

          top: 0;
          bottom: 0;

          width: 110px;

          z-index: 20;

          pointer-events: none;
        }

        .marquee-viewport::before {
          left: 0;

          background:
            linear-gradient(
              to right,
              #f7f2ea 0%,
              rgba(247, 242, 234, 0.92) 25%,
              rgba(247, 242, 234, 0) 100%
            );
        }

        .marquee-viewport::after {
          right: 0;

          background:
            linear-gradient(
              to left,
              #f7f2ea 0%,
              rgba(247, 242, 234, 0.92) 25%,
              rgba(247, 242, 234, 0) 100%
            );
        }


        /* =====================================================
           TRACK
        ===================================================== */

        .marquee-track {
          display: flex;

          width: max-content;

          will-change: transform;

          /*
            Prevent browser from trying to optimize
            the track in a way that can create a visual
            seam during the reset.
          */

          backface-visibility: hidden;

          transform: translate3d(0, 0, 0);
        }


        /*
          Both groups have the EXACT SAME width.

          No external track gap is used.

          The padding-right belongs to each group,
          meaning the second group begins at exactly
          the same spacing where the first group ends.
        */

        .marquee-group {
          display: flex;

          flex-shrink: 0;

          gap: 20px;

          padding-right: 20px;

          width: max-content;
        }


        /* =====================================================
           SEAMLESS ANIMATIONS
        ===================================================== */

        /*
          FORWARD:
          0% -> -50%

          At -50%, group 2 is exactly where
          group 1 started.

          The browser then resets to 0,
          but visually both positions are identical.
        */

        .marquee-track-forward {
          animation:
            marqueeForward
            48s
            linear
            infinite;
        }


        /*
          REVERSE:
          -50% -> 0%

          This gives the second row the
          opposite continuous direction.
        */

        .marquee-track-reverse {
          animation:
            marqueeReverse
            52s
            linear
            infinite;
        }


        @keyframes marqueeForward {

          from {
            transform: translate3d(
              0,
              0,
              0
            );
          }

          to {
            transform: translate3d(
              -50%,
              0,
              0
            );
          }

        }


        @keyframes marqueeReverse {

          from {
            transform: translate3d(
              -50%,
              0,
              0
            );
          }

          to {
            transform: translate3d(
              0,
              0,
              0
            );
          }

        }


        /* =====================================================
           CARD
        ===================================================== */

        .marquee-card {
          position: relative;

          width: 365px;

          height: 255px;

          flex: 0 0 365px;

          overflow: hidden;

          background: #e5dbd0;

          isolation: isolate;

          /*
            Premium editorial shape.
          */

          border-radius: 18px;

          box-shadow:
            0 10px 30px
            rgba(36, 26, 22, 0.08);

          transform: translateZ(0);
        }


        /* =====================================================
           IMAGE
        ===================================================== */

        .marquee-image {
          position: absolute;

          inset: 0;

          display: block;

          width: 100%;
          height: 100%;

          /*
            IMPORTANT:
            Image always fills the complete card.
          */

          object-fit: cover;

          object-position: center center;

          user-select: none;

          -webkit-user-drag: none;

          transform:
            scale(1.015)
            translateZ(0);

          backface-visibility: hidden;

          transition:
            transform
            800ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
        }


        .marquee-card:hover
        .marquee-image {
          transform:
            scale(1.055)
            translateZ(0);
        }


        /* =====================================================
           IMAGE OVERLAY
        ===================================================== */

        .marquee-overlay {
          position: absolute;

          inset: 0;

          z-index: 2;

          pointer-events: none;

          background:
            linear-gradient(
              to top,
              rgba(20, 12, 10, 0.82) 0%,
              rgba(20, 12, 10, 0.42) 35%,
              rgba(20, 12, 10, 0.08) 72%,
              rgba(20, 12, 10, 0.02) 100%
            );
        }


        /* =====================================================
           FRAME
        ===================================================== */

        .marquee-frame {
          position: absolute;

          inset: 13px;

          z-index: 4;

          border:
            1px solid
            rgba(255, 255, 255, 0.32);

          border-radius: 12px;

          pointer-events: none;

          opacity: 0.65;

          transition:
            border-color 500ms ease,
            inset 500ms ease;
        }


        .marquee-card:hover
        .marquee-frame {
          inset: 10px;

          border-color:
            rgba(255, 255, 255, 0.55);
        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .marquee-content {
          position: absolute;

          left: 0;
          right: 0;
          bottom: 0;

          z-index: 5;

          padding: 22px;
        }


        .marquee-brand {
          display: block;

          color:
            rgba(255, 255, 255, 0.72);

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 0.24em;

          line-height: 1;

          text-transform: uppercase;
        }


        .marquee-title {
          margin: 8px 0 0;

          color: white;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 22px;

          font-weight: 500;

          line-height: 1.1;
        }


        .marquee-detail {
          display: block;

          margin-top: 9px;

          color:
            rgba(255, 255, 255, 0.72);

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 9px;

          font-weight: 600;

          letter-spacing: 0.16em;

          text-transform: uppercase;

          opacity: 0;

          transform:
            translateY(6px);

          transition:
            opacity 450ms ease,
            transform 450ms ease;
        }


        .marquee-card:hover
        .marquee-detail {
          opacity: 1;

          transform:
            translateY(0);
        }


        /* =====================================================
           ROW GAP
        ===================================================== */

        .marquee-row-gap {
          height: 20px;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1024px) {

          .interior-marquee-section {
            padding:
              64px 0
              72px;
          }

          .interior-marquee-header {
            margin-bottom: 42px;
          }

          .marquee-card {
            width: 330px;

            height: 235px;

            flex-basis: 330px;
          }

          .marquee-group {
            gap: 16px;

            padding-right: 16px;
          }

          .marquee-track-forward {
            animation-duration: 42s;
          }

          .marquee-track-reverse {
            animation-duration: 46s;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 640px) {

          .interior-marquee-section {
            padding:
              54px 0
              62px;
          }


          .interior-marquee-header {
            width:
              calc(100% - 32px);

            margin-bottom: 34px;
          }


          .marquee-label {
            gap: 9px;

            margin-bottom: 16px;

            font-size: 9px;

            letter-spacing: 0.2em;
          }


          .marquee-label-line {
            width: 28px;
          }


          .marquee-heading {
            font-size: 31px;

            line-height: 1.13;
          }


          .marquee-description {
            margin-top: 14px;

            font-size: 12px;

            line-height: 1.75;
          }


          /*
            Larger mobile cards than before.
            This gives the images enough area
            to properly show their composition.
          */

          .marquee-card {
            width: 285px;

            height: 195px;

            flex-basis: 285px;

            border-radius: 15px;
          }


          .marquee-group {
            gap: 11px;

            padding-right: 11px;
          }


          .marquee-content {
            padding: 16px;
          }


          .marquee-brand {
            font-size: 7px;

            letter-spacing: 0.2em;
          }


          .marquee-title {
            margin-top: 6px;

            font-size: 18px;
          }


          /*
            Smooth but clearly visible movement.
          */

          .marquee-track-forward {
            animation-duration: 34s;
          }

          .marquee-track-reverse {
            animation-duration: 37s;
          }


          .marquee-row-gap {
            height: 11px;
          }


          .marquee-viewport::before,
          .marquee-viewport::after {
            width: 42px;
          }


          .marquee-frame {
            inset: 9px;

            border-radius: 10px;
          }


          .marquee-detail {
            display: none;
          }


          /*
            Keep the frame visible on touch devices.
          */

          .marquee-card:hover
          .marquee-frame {
            inset: 9px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 380px) {

          .marquee-card {
            width: 265px;

            height: 185px;

            flex-basis: 265px;
          }


          .marquee-group {
            gap: 10px;

            padding-right: 10px;
          }


          .marquee-track-forward {
            animation-duration: 31s;
          }

          .marquee-track-reverse {
            animation-duration: 34s;
          }


          .marquee-title {
            font-size: 17px;
          }

        }


        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .marquee-track-forward,
          .marquee-track-reverse {
            animation: none;

            transform:
              translate3d(
                0,
                0,
                0
              );
          }

          .marquee-image,
          .marquee-frame,
          .marquee-detail {
            transition: none;
          }

        }


        /* =====================================================
           DESKTOP HOVER PAUSE
        ===================================================== */

        @media (hover: hover) and (pointer: fine) {

          .marquee-viewport:hover
          .marquee-track {
            animation-play-state: paused;
          }

        }

      `}</style>
    </section>
  );
};

export default InteriorMarquee;
