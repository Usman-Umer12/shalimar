// wardrobes.jsx
// Install: npm i three lucide-react
// Tailwind CSS must already be set up in your project.

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ArrowRight, MessageCircle, X } from "lucide-react";

/* ==========================================================================
   ASSETS
============================================================================= */

import word1 from "../assets/word1.webp";
import word2 from "../assets/word2.webp";
import word3 from "../assets/word3.webp";
import word4 from "../assets/word4.webp";

/* ====================== EDIT THESE ====================== */

const WHATSAPP_NUMBER = "923238430015";
const BRAND = "Shalimar";

/* ==========================================================================
   CLIENT RATES (PKR per sq ft)
============================================================================= */

const PRICING = {
  rate: {
    matte: 1700,
    glossy: 1950,
    aluminium: 2400,
  },
};

/* ==========================================================================
   WARDROBE TYPES
============================================================================= */

const TYPES = {
  matte: {
    name: "Matte Wardrobe",

    specs: [
      "3D soft closing hinges",
      "Soft closing drawers",
      "Patex LCB carcase",
      "Hanger of SS",
      "Handles up to 10 in",
      "Heated edge tape",
      "Sheet of front: Alnoor - Patex",
    ],
  },

  glossy: {
    name: "Glossy Wardrobe",

    specs: [
      "3D soft closing hinges",
      "Soft closing drawers",
      "Patex LCB carcase",
      "Hanger of SS",
      "Handles up to 10 in",
      "Heated edge tape",
      "Sheet of front: Alnoor or KMI",
    ],
  },

  aluminium: {
    name: "Aluminium Wardrobe",

    specs: [
      "DTC 3D soft closing hinges",
      "Soft closing drawers",
      "Patex LCB carcase",
      "Hanger of SS",
      "Handles up to 10 in",
      "Heated edge tape",
      "Black aluminium 1.2",
      "Brown glass, grey glass, clear glass 6 mm",
    ],
  },
};

/* ==========================================================================
   LIMITS (depth is fixed, drawers removed)
============================================================================= */

const FIXED_DEPTH = 22; // inches, used only for the 3D model

const LIMITS = {
  height: {
    min: 60,
    max: 108,
    step: 1,
    label: "Height",
  },

  width: {
    min: 36,
    max: 144,
    step: 1,
    label: "Width",
  },
};

/* ==========================================================================
   PRODUCT COLLECTION
============================================================================= */

const wardrobeProducts = [
  {
    id: 1,
    image: word1,
    title: "Modern Wardrobe",
    description:
      "A refined wardrobe design created for modern interiors with practical storage and a clean, elegant finish.",
  },

  {
    id: 2,
    image: word2,
    title: "Premium Wardrobe",
    description:
      "Elegant wardrobe styling with spacious storage, premium detailing and a sophisticated interior appearance.",
  },

  {
    id: 3,
    image: word3,
    title: "Contemporary Wardrobe",
    description:
      "A contemporary storage solution designed to bring functionality, organization and timeless style together.",
  },

  {
    id: 4,
    image: word4,
    title: "Luxury Wardrobe",
    description:
      "A luxury wardrobe concept featuring a refined look, smart organization and premium interior appeal.",
  },
];

/* ==========================================================================
   HELPERS
============================================================================= */

const fmtPKR = (n) => "PKR " + Math.round(n).toLocaleString("en-PK");

const toDisp = (inch, unit) =>
  unit === "in"
    ? `${Number(inch.toFixed(1))} in`
    : `${Math.round(inch * 2.54)} cm`;

const doorCount = (w) => Math.max(2, Math.round(w / 20));

// Price = (width x height in sq ft) x rate per sq ft
function calcPrice(type, { height, width }) {
  const doors = doorCount(width);

  const area = (width * height) / 144;

  const total = area * PRICING.rate[type];

  return {
    total,
    area,
    doors,
  };
}

// Opens WhatsApp. Falls back to same-tab navigation if the popup is blocked.
function openWhatsApp(text) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    text
  )}`;

  const w = window.open(url, "_blank", "noopener,noreferrer");

  if (!w) {
    window.location.href = url;
  }
}

/* ==========================================================================
   3D BUILDER
============================================================================= */

function disposeGroup(g) {
  g.traverse((o) => {
    if (o.geometry) o.geometry.dispose();

    if (o.material) {
      if (Array.isArray(o.material)) {
        o.material.forEach((m) => m.dispose());
      } else {
        o.material.dispose();
      }
    }
  });

  g.clear();
}

function buildWardrobe(group, type, p) {
  disposeGroup(group);

  const s = 0.1;

  const W = p.width * s;
  const H = p.height * s;
  const D = FIXED_DEPTH * s;

  const t = 0.75 * s;
  const plinth = 3 * s;
  const gap = 0.12 * s;

  const body = new THREE.MeshStandardMaterial({
    color: type === "glossy" ? 0xeeeae2 : 0xd8c6a6,
    roughness: type === "glossy" ? 0.2 : 0.85,
    metalness: type === "glossy" ? 0.15 : 0,
  });

  const front = new THREE.MeshStandardMaterial({
    color:
      type === "glossy" ? 0xf6f4ef : type === "matte" ? 0xcdbb9b : 0x1b1b1b,
    roughness: type === "glossy" ? 0.12 : 0.9,
    metalness: type === "glossy" ? 0.2 : 0,
  });

  const glass = new THREE.MeshStandardMaterial({
    color: 0x6b5a4a,
    transparent: true,
    opacity: 0.5,
    roughness: 0.05,
  });

  const steel = new THREE.MeshStandardMaterial({
    color: 0xbfc4c8,
    metalness: 0.9,
    roughness: 0.25,
  });

  const dark = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.5,
  });

  const add = (w, h, d, x, y, z, m) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);

    mesh.position.set(x, y + h / 2, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    group.add(mesh);

    return mesh;
  };

  const bodyH = H - plinth;

  /* Carcase */

  add(t, bodyH, D, -W / 2 + t / 2, plinth, 0, body);
  add(t, bodyH, D, W / 2 - t / 2, plinth, 0, body);
  add(W, t, D, 0, plinth, 0, body);
  add(W, t, D, 0, H - t, 0, body);
  add(W, bodyH, 0.3 * s, 0, plinth, -D / 2 + 0.15 * s, body);
  add(W - 2 * t, plinth, D - 2 * s, 0, 0, -0.5 * s, dark);

  if (p.width > 60) {
    add(t, bodyH - 2 * t, D - 0.5 * s, 0, plinth + t, 0, body);
  }

  /* Hanger rod */

  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35 * s, 0.35 * s, W - 2 * t, 16),
    steel
  );

  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, H - 5 * s, 0);

  group.add(rod);

  /* Doors (full height, no drawers) */

  const n = doorCount(p.width);

  const dw = (W - 2 * t) / n;

  const y0 = plinth + t;

  const dH = H - t - y0;

  for (let i = 0; i < n; i++) {
    const x = -W / 2 + t + dw * (i + 0.5);

    const zf = D / 2 + 0.2 * s;

    if (type === "aluminium") {
      const fw = 1.4 * s;

      add(dw - gap * 2, dH - gap, 0.3 * s, x, y0, zf, glass);
      add(dw - gap * 2, fw, 0.6 * s, x, y0, zf, front);
      add(dw - gap * 2, fw, 0.6 * s, x, y0 + dH - fw - gap, zf, front);
      add(fw, dH - gap, 0.6 * s, x - dw / 2 + fw / 2 + gap, y0, zf, front);
      add(fw, dH - gap, 0.6 * s, x + dw / 2 - fw / 2 - gap, y0, zf, front);
    } else {
      add(dw - gap * 2, dH - gap, 0.75 * s, x, y0, zf, front);
    }

    const left = i % 2 === 0;

    const hx = x + (left ? 1 : -1) * (dw / 2 - 1.8 * s);

    const vLen = Math.min(10 * s, dH * 0.5);

    add(0.5 * s, vLen, 0.6 * s, hx, y0 + dH / 2 - vLen / 2, zf + 0.7 * s, steel);
  }

  group.position.y = 0;
}

/* ==========================================================================
   3D VIEWER
============================================================================= */

function Viewer({ type, params, apiRef }) {
  const mountRef = useRef(null);

  const sceneRef = useRef({});

  useEffect(() => {
    const el = mountRef.current;

    if (!el) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d0c4, 1.1));

    const sun = new THREE.DirectionalLight(0xffffff, 1.4);

    sun.position.set(12, 20, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);

    Object.assign(sun.shadow.camera, {
      left: -20,
      right: 20,
      top: 20,
      bottom: -20,
      near: 1,
      far: 70,
    });

    scene.add(sun);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.ShadowMaterial({ opacity: 0.16 })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    scene.add(floor);

    const group = new THREE.Group();

    scene.add(group);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2.02;

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;

      if (!w || !h) return;

      renderer.setSize(w, h);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);

    ro.observe(el);

    resize();

    let raf;

    const loop = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    loop();

    sceneRef.current = {
      group,
      camera,
      controls,
      renderer,
      scene,
      first: true,
    };

    return () => {
      cancelAnimationFrame(raf);

      ro.disconnect();
      controls.dispose();

      disposeGroup(group);

      renderer.dispose();

      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  const resetView = (p) => {
    const { camera, controls } = sceneRef.current;

    if (!camera || !controls) return;

    const s = 0.1;

    const W = p.width * s;
    const H = p.height * s;
    const D = FIXED_DEPTH * s;

    const r = Math.max(W, H) * 1.9 + D;

    camera.position.set(r * 0.62, H * 0.62 + 1, r * 0.78);

    controls.target.set(0, H / 2, 0);
    controls.update();
  };

  useEffect(() => {
    const sc = sceneRef.current;

    if (!sc.group) return;

    buildWardrobe(sc.group, type, params);

    if (sc.first) {
      resetView(params);

      sc.first = false;
    }

    // eslint-disable-next-line
  }, [type, params]);

  useEffect(() => {
    apiRef.current = {
      reset: () => resetView(params),

      snapshot: () =>
        new Promise((res) => {
          const { renderer, scene, camera } = sceneRef.current;

          if (!renderer || !scene || !camera) {
            res(null);
            return;
          }

          renderer.render(scene, camera);

          renderer.domElement.toBlob((b) => res(b), "image/png");
        }),
    };
  });

  return (
    <div
      ref={mountRef}
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
    />
  );
}

/* ==========================================================================
   2D VIEW
============================================================================= */

function Front2D({ type, params, unit }) {
  const { width: w, height: h } = params;

  const n = doorCount(w);

  const pad = 40;

  const scale = Math.min(520 / w, 380 / h);

  const W = w * scale;
  const H = h * scale;

  const fill =
    type === "glossy" ? "#f3f1ec" : type === "matte" ? "#cdbb9b" : "#1b1b1b";

  return (
    <svg
      viewBox={`0 0 ${W + pad * 2} ${H + pad * 2}`}
      className="h-full w-full p-4"
    >
      <rect
        x={pad}
        y={pad}
        width={W}
        height={H}
        fill={fill}
        stroke="#3a3a3a"
        strokeWidth="2"
        rx="2"
      />

      {Array.from({ length: n }).map((_, i) => {
        const dw = W / n;

        const top = pad + 6;

        const hh = H - 12;

        return (
          <g key={i}>
            <rect
              x={pad + i * dw + 4}
              y={top}
              width={dw - 8}
              height={hh}
              fill={type === "aluminium" ? "rgba(107,90,74,.5)" : "none"}
              stroke="#6b6b6b"
            />

            <rect
              x={pad + i * dw + (i % 2 ? 10 : dw - 14)}
              y={top + hh / 2 - 22}
              width="4"
              height="44"
              fill="#9aa0a6"
            />
          </g>
        );
      })}

      <text
        x={pad + W / 2}
        y={pad - 12}
        textAnchor="middle"
        fontSize="13"
        fill="#555"
      >
        {toDisp(w, unit)}
      </text>

      <text
        x={pad - 12}
        y={pad + H / 2}
        textAnchor="middle"
        fontSize="13"
        fill="#555"
        transform={`rotate(-90 ${pad - 12} ${pad + H / 2})`}
      >
        {toDisp(h, unit)}
      </text>
    </svg>
  );
}

/* ==========================================================================
   SMALL UI PIECES
============================================================================= */

function Pill({ active, children, ...r }) {
  return (
    <button
      {...r}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-[#5b1f2c] text-white"
          : "text-neutral-600 hover:text-[#5b1f2c]"
      }`}
    >
      {children}
    </button>
  );
}

/* ==========================================================================
   WHATSAPP ICON
============================================================================= */

const WaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M20.5 3.5A11 11 0 0 0 3.4 17.3L2 22l4.8-1.3A11 11 0 1 0 20.5 3.5zM12 20a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.8.8-2.7-.2-.3A9 9 0 1 1 12 20zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.5-.1-.6.1-.7.9-.9 1.1-.3.2-.6.1a7.4 7.4 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.3 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4.1c1.7.7 2.4.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3z" />
  </svg>
);

/* ==========================================================================
   NOTICE MODAL
============================================================================= */

function NoticeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/45 px-4 pt-24 backdrop-blur-[2px] sm:pt-28">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v5h1" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Choose your own colour
            </h2>

            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
              The photo shown here is a <b>sample photo</b>. You can choose
              your own colour and finish when you order, and we will build it
              to match.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-[#5b1f2c] py-3 text-sm font-semibold text-white transition hover:bg-[#431621] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b] focus-visible:ring-offset-2"
        >
          Got it, start designing
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   ORDER MODAL
============================================================================= */

function OrderModal({ onClose, summary, getSnapshot }) {
  const [f, setF] = useState({
    name: "",
    phone: "",
    city: "",
    country: "Pakistan",
  });

  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    const er = {};

    if (!f.name.trim()) {
      er.name = "Enter your name";
    }

    if (!/^[+\d][\d\s-]{8,}$/.test(f.phone.trim())) {
      er.phone = "Enter a valid phone number";
    }

    if (!f.city.trim()) {
      er.city = "Enter your city";
    }

    if (!f.country.trim()) {
      er.country = "Enter your country";
    }

    setErr(er);

    if (Object.keys(er).length) return;

    setBusy(true);

    const text =
      `Hello ${BRAND}, I would like to request a quotation for a wardrobe.\n\n` +
      `*Name:* ${f.name}\n` +
      `*Phone:* ${f.phone}\n` +
      `*City:* ${f.city}\n` +
      `*Country:* ${f.country}\n\n` +
      summary;

    let blob = null;

    try {
      blob = await getSnapshot();
    } catch {
      blob = null;
    }

    const file =
      blob && new File([blob], "my-wardrobe.png", { type: "image/png" });

    /* Mobile */

    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text });

        setBusy(false);
        onClose();

        return;
      } catch {
        // cancelled - continue with the WhatsApp link below
      }
    }

    /* Desktop */

    if (blob) {
      const a = document.createElement("a");

      a.href = URL.createObjectURL(blob);
      a.download = "my-wardrobe.png";
      a.click();
    }

    openWhatsApp(text);

    // Close the popup right away so it never stays open.
    setBusy(false);
    onClose();
  };

  const field = (k, label, type = "text", ph = "") => (
    <label className="block">
      <span className="text-xs font-medium text-neutral-700">{label}</span>

      <input
        type={type}
        value={f[k]}
        onChange={set(k)}
        placeholder={ph}
        className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/40 ${
          err[k]
            ? "border-red-400"
            : "border-neutral-300 focus:border-emerald-500"
        }`}
      />

      {err[k] && (
        <span className="mt-1 block text-xs text-red-600">{err[k]}</span>
      )}
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Send your design on WhatsApp
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              We will reply with a final quote and timeline.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-neutral-50 p-3 font-sans text-xs leading-relaxed text-neutral-600">
          {summary}
        </pre>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {field("name", "Full name", "text", "Ahmed Khan")}
          {field("phone", "Phone number", "tel", "+92 300 1234567")}
          {field("city", "City", "text", "Lahore")}
          {field("country", "Country")}
        </div>

        <p className="mt-3 text-xs text-neutral-500">
          A picture of your design is sent with the message. If it downloads
          instead, please attach it in the WhatsApp chat.
        </p>

        <button
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#1ebe5b] disabled:opacity-60"
        >
          <WaIcon />

          {busy ? "Preparing..." : "Continue on WhatsApp"}
        </button>
      </form>
    </div>
  );
}

/* ==========================================================================
   PRODUCT INQUIRY MODAL
============================================================================= */

function ProductInquiryModal({ product, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
Hello ${BRAND}, I would like to inquire about a wardrobe.

*Product:* ${product.title}
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}

Please share more details, pricing and available options.
    `.trim();

    openWhatsApp(message);

    setForm({ name: "", phone: "", city: "" });
    onClose();
  };

  const inputCls =
    "w-full rounded-xl border border-[#DCD3CB] bg-white px-4 py-3.5 font-sans text-sm text-[#241619] outline-none transition duration-200 placeholder:text-[#A39A96] focus:border-[#4A151F] focus:ring-2 focus:ring-[#4A151F]/10";

  const labelCls = "mb-2 block font-sans text-xs font-semibold text-[#433636]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[26px] border border-[#E2D8D0] bg-[#FBF9F5] shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        {/* Header */}

        <div className="relative overflow-hidden bg-[#4A151F] px-6 py-7 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full border border-white/[0.08]" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          <div className="relative z-10 pr-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8CFC8]" />

              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E8CFC8]">
                Product Inquiry
              </p>
            </div>

            <h2 className="font-serif text-2xl font-medium leading-tight sm:text-3xl">
              {product.title}
            </h2>

            <p className="mt-2 font-sans text-xs leading-6 text-white/65">
              Share your details and we'll continue the conversation on
              WhatsApp.
            </p>
          </div>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="product-name" className={labelCls}>
                Full Name
              </label>

              <input
                id="product-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="product-phone" className={labelCls}>
                Phone Number
              </label>

              <input
                id="product-phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="product-city" className={labelCls}>
                City
              </label>

              <input
                id="product-city"
                name="city"
                type="text"
                required
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className={inputCls}
              />
            </div>
          </div>

          <button
            type="submit"
            className="group mt-7 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#4A151F] px-4 py-4 font-sans text-xs font-semibold text-white shadow-[0_10px_25px_rgba(74,21,31,0.16)] transition-all duration-300 hover:bg-[#351019] sm:px-5 sm:text-sm"
          >
            <MessageCircle size={17} strokeWidth={2} className="shrink-0" />

            <span>Send Inquiry on WhatsApp</span>

            <ArrowRight
              size={15}
              strokeWidth={2}
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <p className="mt-3 text-center font-sans text-[10px] leading-5 text-[#958A85]">
            Your inquiry will be sent directly to our WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN PAGE
============================================================================= */

export default function Wardrobes() {
  const [type, setType] = useState("matte");
  const [view, setView] = useState("3d");
  const [unit, setUnit] = useState("in");

  const [params, setParams] = useState({
    height: 84,
    width: 72,
  });

  const [showNotice, setShowNotice] = useState(true);
  const [showOrder, setShowOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const api = useRef({});

  const { total, area, doors } = useMemo(
    () => calcPrice(type, params),
    [type, params]
  );

  const summary = useMemo(
    () =>
      `*${TYPES[type].name}*\n` +
      `Height: ${toDisp(params.height, unit)}\n` +
      `Width: ${toDisp(params.width, unit)}\n` +
      `Doors: ${doors}\n` +
      `Total area: ${area.toFixed(1)} sq ft\n` +
      `Rate: ${fmtPKR(PRICING.rate[type])} / sq ft\n` +
      `Estimated price: ${fmtPKR(total)}\n\n` +
      `Specs:\n` +
      TYPES[type].specs.map((s) => `- ${s}`).join("\n"),
    [type, params, unit, doors, area, total]
  );

  const scrollToProducts = () => {
    document.getElementById("wardrobe-products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-neutral-900">
      {/* MODALS */}

      {showNotice && <NoticeModal onClose={() => setShowNotice(false)} />}

      {showOrder && (
        <OrderModal
          onClose={() => setShowOrder(false)}
          summary={summary}
          getSnapshot={() => api.current.snapshot()}
        />
      )}

      {selectedProduct && (
        <ProductInquiryModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* CONFIGURATOR HEADER */}

      <header className="bg-gradient-to-b from-[#2e0b13] to-[#5b1f2c] px-4 pb-10 pt-32 text-center text-white sm:pt-40">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Design your wardrobe
        </h1>

        <div className="mx-auto mt-3 h-px w-16 bg-[#c9a24b]" />

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          <span className="font-semibold text-[#e3c47a]">Note:</span> You can
          choose your own colour. The photo shown is a sample photo only.
        </p>
      </header>

      {/* CONFIGURATOR */}

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Type Selector */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#5b1f2c]">
            Choose your wardrobe type
          </h2>

          <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5">
            {Object.entries(TYPES).map(([k, v]) => (
              <Pill key={k} active={type === k} onClick={() => setType(k)}>
                {v.name.replace(" Wardrobe", "")}
              </Pill>
            ))}
          </div>
        </div>

        {/* Main Configurator */}

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          {/* Viewer */}

          <section className="relative h-[52vh] min-h-[340px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#faf8f4] to-[#ebe6dc] shadow-sm ring-1 ring-black/5 lg:h-[680px]">
            <div className="absolute left-3 top-3 z-10 flex rounded-full bg-white p-1 shadow ring-1 ring-black/5">
              <Pill active={view === "2d"} onClick={() => setView("2d")}>
                2D
              </Pill>

              <Pill active={view === "3d"} onClick={() => setView("3d")}>
                3D
              </Pill>
            </div>

            {view === "3d" && (
              <button
                onClick={() => api.current.reset()}
                className="absolute right-3 top-3 z-10 rounded-full bg-white px-4 py-2 text-sm font-medium shadow ring-1 ring-black/5 hover:bg-neutral-50"
              >
                Reset view
              </button>
            )}

            <div className={`h-full w-full ${view === "3d" ? "" : "hidden"}`}>
              <Viewer type={type} params={params} apiRef={api} />
            </div>

            {view === "2d" && (
              <Front2D type={type} params={params} unit={unit} />
            )}

            {view === "3d" && (
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-[10px] text-neutral-600 backdrop-blur sm:text-xs">
                Drag to rotate 360°, scroll or pinch to zoom
              </p>
            )}
          </section>

          {/* Panel */}

          <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:self-start">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h2 className="text-xl font-semibold">Your build</h2>

              <div className="flex rounded-full bg-neutral-100 p-0.5 text-sm">
                {["in", "cm"].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`rounded-full px-3 py-1 ${
                      unit === u
                        ? "bg-white font-medium shadow"
                        : "text-neutral-500"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}

            <div className="space-y-4 py-5">
              {Object.entries(LIMITS).map(([k, l]) => (
                <div
                  key={k}
                  className="grid grid-cols-[84px_1fr_76px] items-center gap-3"
                >
                  <label htmlFor={k} className="text-sm font-medium">
                    {l.label}
                  </label>

                  <input
                    id={k}
                    type="range"
                    min={l.min}
                    max={l.max}
                    step={l.step}
                    value={params[k]}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        [k]: Number(e.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-[#5b1f2c]"
                  />

                  <span className="rounded-lg border border-neutral-200 px-2 py-1.5 text-center text-sm">
                    {toDisp(params[k], unit)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price */}

            <div className="border-t border-neutral-200 pt-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {fmtPKR(total)}
                  </div>

                  <div className="mt-1 text-xs text-neutral-500">
                    {fmtPKR(PRICING.rate[type])} / sq ft. Estimated price,
                    final quote on WhatsApp.
                  </div>
                </div>

                <div className="shrink-0 text-right text-xs text-neutral-500">
                  <div>
                    <b className="text-neutral-800">{doors}</b> doors
                  </div>

                  <div>
                    <b className="text-neutral-800">{area.toFixed(1)}</b> sq ft
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowOrder(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#1ebe5b] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <WaIcon />
                Order on WhatsApp
              </button>
            </div>

            {/* Specs */}

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <h3 className="text-sm font-semibold">
                {TYPES[type].name} includes
              </h3>

              <ul className="mt-2 grid gap-1.5 text-sm text-neutral-600">
                {TYPES[type].specs.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      fill="currentColor"
                    >
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0z" />
                    </svg>

                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* WARDROBE COLLECTION HEADER */}

      <section className="relative mt-8 overflow-hidden bg-[#4A151F] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#351019] via-[#4A151F] to-[#671F2C]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8E9E5]/[0.055] blur-[110px]" />
        <div className="pointer-events-none absolute left-1/2 top-[-15%] h-[130%] w-[18%] -translate-x-1/2 rotate-[8deg] bg-gradient-to-r from-transparent via-white/[0.045] to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/[0.08]" />
        <div className="pointer-events-none absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/[0.08]" />
        <div className="pointer-events-none absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-white/[0.06]" />

        <div className="relative z-10 mx-auto flex min-h-[430px] max-w-7xl items-center justify-center px-5 py-20 text-center sm:min-h-[470px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />

              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[#F8E9E5]/75 sm:text-xs">
                Wardrobe Collection
              </p>

              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />
            </div>

            <h2 className="font-serif text-4xl font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-5xl lg:text-7xl">
              Designed for
              <span className="mt-1 block text-[#E8CFC8]">
                Beautiful Living
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl font-sans text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Discover our wardrobe collection, thoughtfully designed to
              combine elegant aesthetics, practical storage and timeless
              interior style.
            </p>

            <button
              type="button"
              onClick={scrollToProducts}
              className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-sans text-sm font-semibold text-[#4A151F] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#F5E8E4]"
            >
              Explore Collection

              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#F8E9E5]/35 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#F8E9E5]/30 to-transparent" />
      </section>

      {/* PRODUCTS */}

      <section
        id="wardrobe-products"
        className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4A151F]" />

                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A7772] sm:text-xs">
                  Our Collection
                </p>
              </div>

              <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-[#2C1B1E] sm:text-4xl lg:text-5xl">
                Wardrobes Designed
                <span className="block text-[#7B4B54]">Around Your Space</span>
              </h2>

              <p className="mt-3 max-w-xl font-sans text-sm leading-7 text-[#766B68] sm:text-base">
                Explore our carefully selected wardrobe designs and find a
                style that complements your space.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {wardrobeProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-[#E1D8D0] bg-[#FBF9F5] shadow-[0_8px_30px_rgba(55,35,28,0.05)] transition-shadow duration-300 hover:shadow-[0_14px_38px_rgba(55,35,28,0.10)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E9E1D9]">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-3 sm:p-5">
                  <h3 className="font-serif text-base font-medium leading-tight text-[#2C1B1E] sm:text-lg">
                    {product.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 font-sans text-[11px] leading-5 text-[#766B68] sm:text-xs sm:leading-6">
                    {product.description}
                  </p>

                  <p className="mt-2 font-sans text-[10px] font-bold leading-5 text-[#4A151F] sm:text-xs sm:leading-6">
                    Delivery All Over Pakistan
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#4A151F] px-3 py-2.5 font-sans text-[11px] font-semibold text-white transition-all duration-300 hover:bg-[#351019] sm:py-3 sm:text-xs"
                  >
                    <MessageCircle size={14} strokeWidth={2} />
                    WhatsApp Inquiry
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-6 sm:h-10" />
    </main>
  );
}