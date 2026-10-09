// Kitchens.jsx
// Install:
// npm i three lucide-react
//
// Tailwind CSS must already be set up in your project.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ArrowRight, MessageCircle, RefreshCw, X } from "lucide-react";
import { supabase } from "../lib/supabase";

/* ==========================================================================
   SETTINGS
============================================================================= */

const WHATSAPP_NUMBER = "923238430015";
const BRAND = "Shalimar";
const KITCHEN_CATEGORY = "Kitchens";

/* ==========================================================================
   CLIENT RATES (PKR per sq ft)
============================================================================= */

const PRICING = {
  rate: {
    modular: 2700,
    imported: 3800,
    pine: 3800,
    ash: 6200,
  },
};

/* ==========================================================================
   KITCHEN TYPES
============================================================================= */

const COMMON_SPECS = ["Counter, appliances & accessories not included"];

const TYPES = {
  modular: {
    name: "Modular Kitchen",
    short: "Modular",
    glass: true,
    specs: [
      "Patex carcase",
      "Alnoor - Patex front",
      "3D hinges DTC",
      "Heated edge tape",
      "Handleless kitchen",
      "2 aluminium glass shutters",
      ...COMMON_SPECS,
    ],
  },
  imported: {
    name: "Imported Sheet Kitchen",
    short: "Imported",
    glass: true,
    specs: [
      "Imported front sheets (sheets up to PKR 25,000 - 35,000)",
      "Patex carcase",
      "3D hinges DTC",
      "Heated edge tape",
      "Handleless kitchen",
      "2 aluminium glass shutters",
      ...COMMON_SPECS,
    ],
  },
  pine: {
    name: "Tusan Kitchen - Yellow Pine",
    short: "Tusan Pine",
    glass: false,
    specs: [
      "Tusan luxurious kitchen",
      "Solid yellow pine wood",
      "Solid wood with motifs",
      ...COMMON_SPECS,
    ],
  },
  ash: {
    name: "Tusan Kitchen - Ashwood",
    short: "Tusan Ashwood",
    glass: false,
    specs: [
      "Tusan luxurious kitchen",
      "Solid ashwood",
      "Solid wood with motifs",
      ...COMMON_SPECS,
    ],
  },
};

const LAYOUTS = {
  straight: "Straight",
  l: "L-Shape",
  u: "U-Shape",
};

/* ==========================================================================
   LIMITS & CONSTANTS
============================================================================= */

const LIMITS = {
  a: { min: 72, max: 240, step: 1 },
  b: { min: 60, max: 180, step: 1 },
  c: { min: 60, max: 180, step: 1 },
};

const SLIDER_LABELS = {
  straight: { a: "Length" },
  l: { a: "Back wall", b: "Side wall" },
  u: { a: "Back wall", b: "Left wall", c: "Right wall" },
};

const BASE_D = 24;
const WALL_D = 12;
const BASE_H = 34.5;
const PLINTH = 4;
const WALL_Y0 = 54;
const WALL_H = 30;
const MODULE = 24;

/* ==========================================================================
   HELPERS
============================================================================= */

const fmtPKR = (n) => "PKR " + Math.round(n).toLocaleString("en-PK");

// Returns "PKR 3,444" when the admin has set a price, otherwise null
// (nothing is shown on the card when there is no price).
const formatProductPrice = (price) => {
  if (price === null || price === undefined || String(price).trim() === "") {
    return null;
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return null;
  }

  return `PKR ${numericPrice.toLocaleString("en-PK")}`;
};

const toDisp = (inch, unit) =>
  unit === "in"
    ? `${Number(inch.toFixed(1))} in`
    : `${Math.round(inch * 2.54)} cm`;

const unitCount = (len) => Math.max(1, Math.round(len / MODULE));

function getRuns(layout, p) {
  const runs = [{ kind: "A", base: p.a, wall: p.a }];

  if (layout === "l" || layout === "u") {
    runs.push({ kind: "B", base: p.b - BASE_D, wall: p.b - WALL_D });
  }

  if (layout === "u") {
    runs.push({ kind: "C", base: p.c - BASE_D, wall: p.c - WALL_D });
  }

  return runs;
}

function calcPrice(type, p) {
  const runs = getRuns(p.layout, p);

  const baseLen = runs.reduce((a, r) => a + r.base, 0);
  const wallLen = p.wall ? runs.reduce((a, r) => a + r.wall, 0) : 0;

  const area = (baseLen * BASE_H + wallLen * WALL_H) / 144;

  const baseUnits = runs.reduce((a, r) => a + unitCount(r.base), 0);
  const wallUnits = p.wall
    ? runs.reduce((a, r) => a + unitCount(r.wall), 0)
    : 0;

  return {
    total: area * PRICING.rate[type],
    area,
    baseUnits,
    wallUnits,
  };
}

function extents(p) {
  const depthExtent =
    p.layout === "straight"
      ? BASE_D
      : p.layout === "l"
      ? p.b
      : Math.max(p.b, p.c);

  return { W: p.a, Z: depthExtent };
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
    if (o.geometry) {
      o.geometry.dispose();
    }

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

const isTusan = (t) => t === "pine" || t === "ash";

function makeMats(type) {
  const std = (o) => new THREE.MeshStandardMaterial(o);

  const palette = {
    modular: {
      body: 0xe6dfd2,
      front: 0xd6c8ae,
      panel: 0xd6c8ae,
      r: 0.85,
      m: 0,
    },
    imported: {
      body: 0xe9e6df,
      front: 0xf1f2f0,
      panel: 0xf1f2f0,
      r: 0.14,
      m: 0.2,
    },
    pine: {
      body: 0xe3c58c,
      front: 0xd9a95c,
      panel: 0xc7923f,
      r: 0.55,
      m: 0,
    },
    ash: {
      body: 0xd8cbb7,
      front: 0xc8b9a3,
      panel: 0xb4a289,
      r: 0.6,
      m: 0,
    },
  }[type];

  return {
    body: std({ color: palette.body, roughness: 0.8 }),
    front: std({
      color: palette.front,
      roughness: palette.r,
      metalness: palette.m,
    }),
    panel: std({
      color: palette.panel,
      roughness: palette.r,
      metalness: palette.m,
    }),
    motif: std({ color: 0x8a5a24, roughness: 0.6 }),
    counter: std({ color: 0x3b3b3d, roughness: 0.35, metalness: 0.1 }),
    glass: std({
      color: 0x6b5a4a,
      transparent: true,
      opacity: 0.5,
      roughness: 0.05,
    }),
    steel: std({ color: 0xbfc4c8, metalness: 0.9, roughness: 0.25 }),
    dark: std({ color: 0x222222, roughness: 0.5 }),
  };
}

/* ==========================================================================
   BOX HELPER
============================================================================= */

function makeAdd(g, s) {
  return (w, h, d, x, y, z, m) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w * s, h * s, d * s), m);

    mesh.position.set(x * s, (y + h / 2) * s, z * s);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    g.add(mesh);

    return mesh;
  };
}

function frontPiece(add, m, type, cx, y, w, h, zFront, s, g) {
  add(w, h, 0.75, cx, y, zFront - 0.375, m.front);

  if (isTusan(type)) {
    const iw = w - 5;
    const ih = h - 5;

    if (iw > 4 && ih > 4) {
      add(iw, ih, 0.4, cx, y + 2.5, zFront + 0.2, m.panel);

      if (ih > 10) {
        const d = new THREE.Mesh(
          new THREE.BoxGeometry(3 * s, 3 * s, 0.3 * s),
          m.motif
        );

        d.rotation.z = Math.PI / 4;
        d.position.set(cx * s, (y + h / 2) * s, (zFront + 0.55) * s);

        g.add(d);
      }
    }
  }
}

/* ==========================================================================
   BASE CABINETS
============================================================================= */

function buildBase(g, len, type, m, s) {
  const add = makeAdd(g, s);

  const n = unitCount(len);
  const uw = len / n;
  const gap = 0.12;
  const D = BASE_D;

  const carcH = BASE_H - 1.5 - PLINTH;

  add(len - 1, PLINTH, D - 2, len / 2, 0, D / 2 - 1, m.dark);
  add(len, carcH, D - 0.75, len / 2, PLINTH, (D - 0.75) / 2, m.body);
  add(len, 1.5, D, len / 2, BASE_H - 1.5, D / 2, m.counter);

  for (let i = 0; i < n; i++) {
    const cx = i * uw + uw / 2;
    const w = uw - gap * 2;

    const drawerUnit = i % 3 === 1 && uw >= 18;

    if (drawerUnit) {
      const dh = carcH / 3;

      for (let j = 0; j < 3; j++) {
        const y = PLINTH + j * dh + gap / 2;

        frontPiece(add, m, type, cx, y, w, dh - gap, D, s, g);

        if (isTusan(type)) {
          add(
            Math.min(8, w / 2),
            0.5,
            0.6,
            cx,
            y + dh / 2 - 0.25,
            D + 0.9,
            m.steel
          );
        } else {
          add(w, 0.4, 0.2, cx, y + dh - gap - 0.6, D + 0.1, m.dark);
        }
      }
    } else {
      const y = PLINTH + gap / 2;
      const h = carcH - gap;

      frontPiece(add, m, type, cx, y, w, h, D, s, g);

      if (isTusan(type)) {
        const left = i % 2 === 0;
        const hx = cx + (left ? 1 : -1) * (w / 2 - 2.2);

        add(0.5, 6, 0.6, hx, y + h - 9, D + 0.7, m.steel);
      } else {
        add(w, 0.4, 0.2, cx, y + h - 0.6, D + 0.1, m.dark);
      }
    }
  }
}

/* ==========================================================================
   WALL CABINETS
============================================================================= */

function buildWall(g, len, type, m, s, glassCount) {
  const add = makeAdd(g, s);

  const n = unitCount(len);
  const uw = len / n;
  const gap = 0.12;
  const D = WALL_D;

  add(len, WALL_H, D - 0.75, len / 2, WALL_Y0, (D - 0.75) / 2, m.body);

  const glassSet = new Set();

  if (glassCount > 0) {
    if (n >= 2) {
      const mid = Math.floor(n / 2);

      glassSet.add(mid - 1);

      if (glassCount > 1) {
        glassSet.add(mid);
      }
    } else {
      glassSet.add(0);
    }
  }

  for (let i = 0; i < n; i++) {
    const cx = i * uw + uw / 2;
    const w = uw - gap * 2;
    const y = WALL_Y0 + gap / 2;
    const h = WALL_H - gap;

    if (glassSet.has(i)) {
      const fw = 1.4;

      add(w, h, 0.3, cx, y, D - 0.15, m.glass);
      add(w, fw, 0.6, cx, y, D - 0.3, m.dark);
      add(w, fw, 0.6, cx, y + h - fw, D - 0.3, m.dark);
      add(fw, h, 0.6, cx - w / 2 + fw / 2, y, D - 0.3, m.dark);
      add(fw, h, 0.6, cx + w / 2 - fw / 2, y, D - 0.3, m.dark);
    } else {
      frontPiece(add, m, type, cx, y, w, h, D, s, g);

      if (isTusan(type)) {
        const left = i % 2 === 0;
        const hx = cx + (left ? 1 : -1) * (w / 2 - 2.2);

        add(0.5, 6, 0.6, hx, y + 2, D + 0.7, m.steel);
      } else {
        add(w, 0.4, 0.2, cx, y + 0.6, D + 0.1, m.dark);
      }
    }
  }
}

/* ==========================================================================
   BUILD KITCHEN
============================================================================= */

function buildKitchen(group, type, p) {
  disposeGroup(group);

  const s = 0.1;
  const m = makeMats(type);

  const runs = getRuns(p.layout, p);

  const glassCount = TYPES[type].glass ? 2 : 0;

  const place = (g, kind, isWall) => {
    if (kind === "A") {
      g.position.set(0, 0, 0);
      g.rotation.y = 0;
    }

    if (kind === "B") {
      g.rotation.y = Math.PI / 2;
      g.position.set(0, 0, p.b * s);
    }

    if (kind === "C") {
      g.rotation.y = -Math.PI / 2;
      g.position.set(p.a * s, 0, (isWall ? WALL_D : BASE_D) * s);
    }

    group.add(g);
  };

  runs.forEach((r) => {
    const base = new THREE.Group();

    buildBase(base, r.base, type, m, s);
    place(base, r.kind, false);

    if (p.wall) {
      const wall = new THREE.Group();

      buildWall(wall, r.wall, type, m, s, r.kind === "A" ? glassCount : 0);
      place(wall, r.kind, true);
    }
  });

  const { W, Z } = extents(p);

  group.position.set((-W * s) / 2, 0, (-Z * s) / 2);
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

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d0c4, 1.1));

    const sun = new THREE.DirectionalLight(0xffffff, 1.4);

    sun.position.set(14, 26, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);

    Object.assign(sun.shadow.camera, {
      left: -30,
      right: 30,
      top: 30,
      bottom: -30,
      near: 1,
      far: 100,
    });

    scene.add(sun);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
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
      layout: null,
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
    const { W, Z } = extents(p);
    const H = 84;

    const r = Math.max(W, Z, H) * s * 1.75 + 4;

    camera.position.set(r * 0.62, H * s * 0.75 + 2, r * 0.9);

    controls.target.set(0, H * s * 0.4, 0);
    controls.update();
  };

  useEffect(() => {
    const sc = sceneRef.current;

    if (!sc.group) return;

    buildKitchen(sc.group, type, params);

    if (sc.first || sc.layout !== params.layout) {
      resetView(params);

      sc.first = false;
      sc.layout = params.layout;
    }
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
   2D PLAN VIEW
============================================================================= */

function Plan2D({ type, params, unit }) {
  const p = params;

  const { W, Z } = extents(p);

  const pad = 56;

  const scale = Math.min(520 / W, 340 / Z);

  const vw = W * scale;
  const vh = Z * scale;

  const fill =
    type === "imported"
      ? "#f1f2f0"
      : type === "modular"
      ? "#d6c8ae"
      : type === "pine"
      ? "#d9a95c"
      : "#c8b9a3";

  const rects = [{ x: 0, y: 0, w: p.a, h: BASE_D, horiz: true, len: p.a }];

  const walls = [{ x: 0, y: 0, w: p.a, h: WALL_D }];

  if (p.layout === "l" || p.layout === "u") {
    rects.push({
      x: 0,
      y: BASE_D,
      w: BASE_D,
      h: p.b - BASE_D,
      horiz: false,
      len: p.b - BASE_D,
    });

    walls.push({ x: 0, y: WALL_D, w: WALL_D, h: p.b - WALL_D });
  }

  if (p.layout === "u") {
    rects.push({
      x: p.a - BASE_D,
      y: BASE_D,
      w: BASE_D,
      h: p.c - BASE_D,
      horiz: false,
      len: p.c - BASE_D,
    });

    walls.push({
      x: p.a - WALL_D,
      y: WALL_D,
      w: WALL_D,
      h: p.c - WALL_D,
    });
  }

  const X = (v) => pad + v * scale;
  const Y = (v) => pad + v * scale;

  return (
    <svg
      viewBox={`0 0 ${vw + pad * 2} ${vh + pad * 2}`}
      className="h-full w-full p-4"
    >
      <rect
        x={pad - 6}
        y={pad - 6}
        width={vw + 12}
        height={vh + 12}
        fill="none"
        stroke="#d4cdc2"
        strokeDasharray="4 4"
      />

      {rects.map((r, idx) => {
        const n = unitCount(r.len);
        const step = r.len / n;

        return (
          <g key={idx}>
            <rect
              x={X(r.x)}
              y={Y(r.y)}
              width={r.w * scale}
              height={r.h * scale}
              fill={fill}
              stroke="#3a3a3a"
              strokeWidth="1.5"
            />

            {Array.from({ length: n - 1 }).map((_, i) =>
              r.horiz ? (
                <line
                  key={i}
                  x1={X(r.x + step * (i + 1))}
                  x2={X(r.x + step * (i + 1))}
                  y1={Y(r.y)}
                  y2={Y(r.y + r.h)}
                  stroke="#6b6b6b"
                />
              ) : (
                <line
                  key={i}
                  x1={X(r.x)}
                  x2={X(r.x + r.w)}
                  y1={Y(r.y + step * (i + 1))}
                  y2={Y(r.y + step * (i + 1))}
                  stroke="#6b6b6b"
                />
              )
            )}
          </g>
        );
      })}

      {p.wall &&
        walls.map((r, idx) => (
          <rect
            key={idx}
            x={X(r.x)}
            y={Y(r.y)}
            width={r.w * scale}
            height={r.h * scale}
            fill="rgba(107,90,74,.18)"
            stroke="#6b5a4a"
            strokeDasharray="5 3"
          />
        ))}

      <text
        x={pad + vw / 2}
        y={pad - 20}
        textAnchor="middle"
        fontSize="13"
        fill="#555"
      >
        {toDisp(p.a, unit)}
      </text>

      {(p.layout === "l" || p.layout === "u") && (
        <text
          x={pad - 20}
          y={pad + (p.b * scale) / 2}
          textAnchor="middle"
          fontSize="13"
          fill="#555"
          transform={`rotate(-90 ${pad - 20} ${pad + (p.b * scale) / 2})`}
        >
          {toDisp(p.b, unit)}
        </text>
      )}

      {p.layout === "u" && (
        <text
          x={pad + vw + 20}
          y={pad + (p.c * scale) / 2}
          textAnchor="middle"
          fontSize="13"
          fill="#555"
          transform={`rotate(90 ${pad + vw + 20} ${pad + (p.c * scale) / 2})`}
        >
          {toDisp(p.c, unit)}
        </text>
      )}

      <text
        x={pad + vw / 2}
        y={pad + vh + 40}
        textAnchor="middle"
        fontSize="11"
        fill="#8a8a8a"
      >
        Plan view
        {p.wall ? " (dashed = wall cabinets)" : ""}
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
              The photo shown here is <b>sample photo</b>. You can choose your
              own colour and finish when you order, and we will build it to
              match.
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
      `Hello ${BRAND}, I want a quote for a kitchen.\n\n` +
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

    const file = blob && new File([blob], "my-kitchen.png", { type: "image/png" });

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

    if (blob) {
      const a = document.createElement("a");

      a.href = URL.createObjectURL(blob);
      a.download = "my-kitchen.png";
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

    const priceText = formatProductPrice(product.price);

    const message = `
Hello ${BRAND}, I would like to inquire about a kitchen.

*Product:* ${product.title}${priceText ? `\n*Price:* ${priceText}` : ""}
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}

Please share more details and available options.
    `.trim();

    openWhatsApp(message);

    // Close immediately (no setTimeout) so the popup never stays open,
    // even when the browser jumps to WhatsApp and pauses timers.
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

export default function Kitchens() {
  const [type, setType] = useState("modular");
  const [view, setView] = useState("3d");
  const [unit, setUnit] = useState("in");

  const [params, setParams] = useState({
    layout: "l",
    a: 144,
    b: 96,
    c: 96,
    wall: true,
  });

  const [showNotice, setShowNotice] = useState(true);
  const [showOrder, setShowOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const closeOrder = useCallback(() => setShowOrder(false), []);
  const closeProduct = useCallback(() => setSelectedProduct(null), []);

  /* ======================================================================
     SUPABASE PRODUCTS
  ====================================================================== */

  const [kitchenProducts, setKitchenProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [productsRefreshing, setProductsRefreshing] = useState(false);

  const api = useRef({});

  /* ======================================================================
     LOAD KITCHEN PRODUCTS
  ====================================================================== */

  const loadKitchenProducts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setProductsLoading(true);
    }

    setProductsError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,
          title,
          description,
          price,
          category,
          subcategory,
          image_url,
          delivery_text,
          status,
          featured,
          created_at,
          updated_at
        `
        )
        .eq("category", KITCHEN_CATEGORY)
        .order("created_at", { ascending: false });

      if (error) {
        setKitchenProducts([]);
        setProductsError(
          error.message || "Unable to load kitchen products right now."
        );

        return;
      }

      const activeProducts = (data || []).filter((product) => {
        const category = String(product.category || "")
          .trim()
          .toLowerCase();

        const status = String(product.status || "")
          .trim()
          .toLowerCase();

        return category === "kitchens" && status === "active";
      });

      setKitchenProducts(activeProducts);
      setProductsError("");
    } catch (error) {
      setKitchenProducts([]);

      setProductsError(
        error?.message || "Unable to load kitchen products right now."
      );
    } finally {
      if (!silent) {
        setProductsLoading(false);
      }
    }
  }, []);

  /* ======================================================================
     INITIAL LOAD + REALTIME + FOCUS + VISIBILITY
  ====================================================================== */

  useEffect(() => {
    let mounted = true;

    loadKitchenProducts();

    const channel = supabase
      .channel("public-kitchens-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          if (!mounted) return;

          loadKitchenProducts({ silent: true });
        }
      )
      .subscribe();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadKitchenProducts({ silent: true });
      }
    };

    const handleFocus = () => {
      loadKitchenProducts({ silent: true });
    };

    const handlePageShow = () => {
      loadKitchenProducts({ silent: true });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      mounted = false;

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);

      supabase.removeChannel(channel);
    };
  }, [loadKitchenProducts]);

  /* ======================================================================
     MANUAL REFRESH
  ====================================================================== */

  const handleRefreshProducts = async () => {
    if (productsRefreshing) return;

    setProductsRefreshing(true);

    try {
      await loadKitchenProducts({ silent: true });
    } finally {
      setProductsRefreshing(false);
    }
  };

  /* ======================================================================
     CONFIGURATOR CALCULATIONS
  ====================================================================== */

  const { total, area, baseUnits, wallUnits } = useMemo(
    () => calcPrice(type, params),
    [type, params]
  );

  const labels = SLIDER_LABELS[params.layout];

  const summary = useMemo(() => {
    const lines = [
      `*${TYPES[type].name}*`,
      `Layout: ${LAYOUTS[params.layout]}`,
      ...Object.entries(labels).map(
        ([k, l]) => `${l}: ${toDisp(params[k], unit)}`
      ),
      `Wall cabinets: ${params.wall ? "Yes" : "No"}`,
      `Total area: ${area.toFixed(1)} sq ft`,
      `Rate: ${fmtPKR(PRICING.rate[type])} / sq ft`,
      `Estimated price: ${fmtPKR(total)}`,
      "",
      "Specs:",
      ...TYPES[type].specs.map((s) => `- ${s}`),
    ];

    return lines.join("\n");
  }, [type, params, unit, area, total, labels]);

  /* ======================================================================
     SCROLL TO PRODUCTS
  ====================================================================== */

  const scrollToProducts = () => {
    document.getElementById("kitchen-products")?.scrollIntoView({
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
          onClose={closeOrder}
          summary={summary}
          getSnapshot={() => api.current.snapshot()}
        />
      )}

      {selectedProduct && (
        <ProductInquiryModal product={selectedProduct} onClose={closeProduct} />
      )}

      {/* CONFIGURATOR HEADER */}

      <header className="bg-gradient-to-b from-[#2e0b13] to-[#5b1f2c] px-4 pb-10 pt-32 text-center text-white sm:pt-40">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Design your kitchen
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
            Choose your kitchen type
          </h2>

          <div className="flex max-w-full flex-wrap rounded-3xl bg-white p-1 shadow-sm ring-1 ring-black/5 sm:rounded-full">
            {Object.entries(TYPES).map(([k, v]) => (
              <Pill key={k} active={type === k} onClick={() => setType(k)}>
                {v.short}
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
                className="absolute right-3 top-3 z-10 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium shadow ring-1 ring-black/5 hover:bg-neutral-50"
              >
                Reset view
              </button>
            )}

            <div className={`h-full w-full ${view === "3d" ? "" : "hidden"}`}>
              <Viewer type={type} params={params} apiRef={api} />
            </div>

            {view === "2d" && (
              <Plan2D type={type} params={params} unit={unit} />
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
              <h2 className="text-xl font-semibold">Your kitchen</h2>

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

            {/* Layout */}

            <div className="border-b border-neutral-200 py-4">
              <div className="mb-2 text-sm font-medium">Layout</div>

              <div className="grid grid-cols-3 gap-2">
                {Object.entries(LAYOUTS).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setParams({ ...params, layout: k })}
                    className={`whitespace-nowrap rounded-xl border px-2 py-2 text-xs font-medium transition sm:text-sm ${
                      params.layout === k
                        ? "border-[#5b1f2c] bg-[#5b1f2c] text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-[#5b1f2c] hover:text-[#5b1f2c]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}

            <div className="space-y-4 py-5">
              {Object.entries(labels).map(([k, label]) => {
                const l = LIMITS[k];

                return (
                  <div
                    key={k}
                    className="grid grid-cols-[84px_1fr_76px] items-center gap-3"
                  >
                    <label htmlFor={k} className="text-sm font-medium">
                      {label}
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
                );
              })}

              {/* Wall cabinets */}

              <label className="flex cursor-pointer items-center justify-between rounded-xl bg-neutral-50 px-3 py-3">
                <span className="text-sm font-medium">Wall cabinets</span>

                <input
                  type="checkbox"
                  checked={params.wall}
                  onChange={(e) =>
                    setParams({ ...params, wall: e.target.checked })
                  }
                  className="h-5 w-5 cursor-pointer accent-[#5b1f2c]"
                />
              </label>
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
                    <b className="text-neutral-800">{baseUnits}</b> base units
                  </div>

                  <div>
                    <b className="text-neutral-800">{wallUnits}</b> wall units
                  </div>

                  <div>
                    <b className="text-neutral-800">{area.toFixed(1)}</b> sq ft
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowOrder(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#1ebe5b] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:py-4 sm:text-base"
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

              <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
                Countertop is shown in the 3D view for visualisation only and
                is not included in the price.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* KITCHEN COLLECTION HEADER */}

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
                Kitchen Collection
              </p>

              <span className="h-px w-8 bg-[#F8E9E5]/40 sm:w-12" />
            </div>

            <h2 className="font-serif text-4xl font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-5xl lg:text-7xl">
              Crafted for
              <span className="mt-1 block text-[#E8CFC8]">
                Beautiful Cooking
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl font-sans text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Discover our modular and Tusan solid wood kitchens, thoughtfully
              designed to combine elegant aesthetics, practical storage and
              timeless style.
            </p>

            <button
              type="button"
              onClick={scrollToProducts}
              className="group mt-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 py-3.5 font-sans text-sm font-semibold text-[#4A151F] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#F5E8E4]"
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
        id="kitchen-products"
        className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4A151F]" />

                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A7772] sm:text-xs">
                  Our Collection
                </p>
              </div>

              <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-[#2C1B1E] sm:text-4xl lg:text-5xl">
                Kitchens Designed
                <span className="block text-[#7B4B54]">
                  Around Your Space
                </span>
              </h2>

              <p className="mt-3 max-w-xl font-sans text-sm leading-7 text-[#766B68] sm:text-base">
                Explore our carefully selected kitchen designs and find a style
                that complements your home.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefreshProducts}
              disabled={productsRefreshing}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start whitespace-nowrap rounded-xl border border-[#D8CCC4] bg-[#FBF9F5] px-4 py-2.5 font-sans text-xs font-semibold text-[#4A151F] transition hover:border-[#4A151F] hover:bg-[#4A151F] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:self-end"
            >
              <RefreshCw
                size={14}
                className={productsRefreshing ? "animate-spin" : ""}
              />

              {productsRefreshing ? "Refreshing..." : "Refresh Collection"}
            </button>
          </div>

          {/* LOADING */}

          {productsLoading && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[#E1D8D0] bg-[#FBF9F5]"
                >
                  <div className="aspect-[4/5] animate-pulse bg-[#E9E1D9]" />

                  <div className="space-y-3 p-3 sm:p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#E7DED6]" />
                    <div className="h-12 animate-pulse rounded bg-[#EEE7E1]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[#E7DED6]" />
                    <div className="h-10 animate-pulse rounded-lg bg-[#E5D9D3]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}

          {!productsLoading && productsError && (
            <div className="rounded-2xl border border-[#E5D4D0] bg-[#FBF5F3] px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <h3 className="font-serif text-xl font-medium text-[#4A151F]">
                  Kitchen collection
                </h3>

                <p className="mt-2 font-sans text-sm leading-6 text-[#766B68]">
                  {productsError}
                </p>

                <button
                  type="button"
                  onClick={handleRefreshProducts}
                  disabled={productsRefreshing}
                  className="mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#4A151F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#351019] disabled:opacity-60"
                >
                  <RefreshCw
                    size={15}
                    className={productsRefreshing ? "animate-spin" : ""}
                  />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* EMPTY */}

          {!productsLoading &&
            !productsError &&
            kitchenProducts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#D8CCC4] bg-[#FBF9F5] px-6 py-16 text-center">
                <div className="mx-auto max-w-md">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4A151F]/[0.06] text-[#4A151F]">
                    <MessageCircle size={24} />
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-medium text-[#2C1B1E]">
                    Kitchen collection
                  </h3>

                  <p className="mt-2 font-sans text-sm leading-6 text-[#766B68]">
                    New kitchen designs will appear here once they are added
                    from our collection.
                  </p>

                  <button
                    type="button"
                    onClick={handleRefreshProducts}
                    disabled={productsRefreshing}
                    className="mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#D8CCC4] bg-white px-4 py-2.5 text-xs font-semibold text-[#4A151F] transition hover:border-[#4A151F] disabled:opacity-60"
                  >
                    <RefreshCw
                      size={14}
                      className={productsRefreshing ? "animate-spin" : ""}
                    />
                    Check Again
                  </button>
                </div>
              </div>
            )}

          {/* DYNAMIC PRODUCTS */}

          {!productsLoading &&
            !productsError &&
            kitchenProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {kitchenProducts.map((product) => {
                  const imageUrl = product.image_url
                    ? `${product.image_url}${
                        product.image_url.includes("?") ? "&" : "?"
                      }v=${
                        product.updated_at || product.created_at || product.id
                      }`
                    : "";

                  const priceText = formatProductPrice(product.price);

                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E1D8D0] bg-[#FBF9F5] shadow-[0_8px_30px_rgba(55,35,28,0.05)] transition-shadow duration-300 hover:shadow-[0_14px_38px_rgba(55,35,28,0.10)]"
                    >
                      {/* Image */}

                      <div className="relative aspect-[4/5] overflow-hidden bg-[#E9E1D9]">
                        {imageUrl ? (
                          <img
                            key={`${product.id}-${
                              product.updated_at || product.image_url
                            }`}
                            src={imageUrl}
                            alt={product.title || "Kitchen"}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#E9E1D9] px-5 text-center">
                            <span className="font-sans text-xs text-[#8A7772]">
                              Image not available
                            </span>
                          </div>
                        )}

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Product Content */}

                      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
                        {/* Product Name */}

                        <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-[#4A151F] sm:text-lg">
                          {product.title}
                        </h3>

                        {/* Short Description */}

                        {product.description && (
                          <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-[#766967] sm:text-sm">
                            {product.description}
                          </p>
                        )}

                        {/* Product Price - shown only when the admin has set one */}

                        {priceText && (
                          <p className="mt-3 text-base font-bold tracking-tight text-[#641F2A] sm:text-lg md:text-xl">
                            <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A7772] sm:text-xs">
                              Price:
                            </span>
                            {priceText}
                          </p>
                        )}

                        {/* Delivery Information */}

                        <p className="mt-2 text-[11px] font-medium text-[#766967] sm:text-xs">
                          {product.delivery_text ||
                            "Delivery All Over Pakistan"}
                        </p>

                        {/* WhatsApp Inquiry (always one line, responsive) */}

                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="mt-auto flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-[#4A151F] px-2 py-2.5 text-[11px] font-semibold text-white transition-colors duration-200 hover:bg-[#351019] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#641F2A] focus-visible:ring-offset-2 active:scale-[0.99] min-[400px]:px-3 min-[400px]:text-xs sm:gap-2 sm:py-3 sm:text-sm"
                          style={{ marginTop: "1rem" }}
                        >
                          <MessageCircle
                            strokeWidth={1.8}
                            className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                          />
                          <span className="truncate">WhatsApp Inquiry</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      <div className="h-6 sm:h-10" />
    </main>
  );
}