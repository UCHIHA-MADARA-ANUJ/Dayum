"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import * as THREE from "three";

/* ── Three.js WebGL galaxy (beats 2D canvas) ───────────── */
export function GalaxyCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let W = host.clientWidth, H = host.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 70;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    // starfield
    const COUNT = 3200;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const rnd = (() => { let s = 1337; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
    for (let i = 0; i < COUNT; i++) {
      const r = 20 + Math.pow(rnd(), 0.6) * 60;
      const th = rnd() * Math.PI * 2;
      const ph = (rnd() - 0.5) * Math.PI * 0.9;
      pos[i * 3] = r * Math.cos(th) * Math.cos(ph);
      pos[i * 3 + 1] = r * Math.sin(ph);
      pos[i * 3 + 2] = r * Math.sin(th) * Math.cos(ph);
      const roll = rnd();
      if (roll < 0.12) { col[i * 3] = 1; col[i * 3 + 1] = 0.25; col[i * 3 + 2] = 0.3; }
      else if (roll < 0.3) { col[i * 3] = 0.62; col[i * 3 + 1] = 0.7; col[i * 3 + 2] = 0.85; }
      else { const v = 0.75 + rnd() * 0.25; col[i * 3] = v; col[i * 3 + 1] = v; col[i * 3 + 2] = v; }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.32, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);

    // nebula sprites
    const nebulaCols = ["#3a0a1a", "#10142e", "#250a2e"];
    nebulaCols.forEach((c, i) => {
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ color: c, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }));
      spr.position.set((i - 1) * 30, (i - 1) * 8, -40);
      spr.scale.set(70, 50, 1);
      scene.add(spr);
    });

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      W = host.clientWidth; H = host.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    let raf;
    const t0 = performance.now();
    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      stars.rotation.y = t * 0.02 + mouse.x * 0.05;
      stars.rotation.x = Math.sin(t * 0.05) * 0.05 + mouse.y * 0.03;
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose(); mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ── 2D matrix rain (gate screen) ──────────────────────── */
export function MatrixRain() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    let W, H, cols, drops;
    const chars = "█▓▒░01X78@#$%&*OBSIDIANEMPIREORDER66";
    const resize = () => {
      W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
      cols = Math.floor(W / 15);
      drops = Array.from({ length: cols }, () => Math.random() * -80);
    };
    resize();
    window.addEventListener("resize", resize);
    let raf;
    const draw = () => {
      ctx.fillStyle = "rgba(5,5,9,0.10)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = "15px monospace";
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * 15;
        if (y > 0 && y < H) {
          ctx.fillStyle = Math.random() > 0.94 ? "#ff2a44" : (Math.random() > 0.5 ? "rgba(232,228,216,.7)" : "rgba(224,30,55,.5)");
          ctx.fillText(ch, i * 15, y);
        }
        if (y > H + 20 && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fx-matrix" />;
}

/* ── Custom cursor (dot + trailing ring) ───────────────── */
export function CursorFX() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 400, damping: 40, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 400, damping: 40, mass: 0.6 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(max-width:768px)").matches) return;
    const onMove = (e) => {
      x.set(e.clientX); y.set(e.clientY);
      setVisible(true);
      const t = e.target;
      setHover(!!(t.closest && t.closest("button,a,.nav-item,.poster,.kan-card,.row,.doc-list-item,.sector,.blip,input,select,textarea,.eco-card,.stat-block")));
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", () => setVisible(false));
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);
  if (typeof window !== "undefined" && window.matchMedia("(max-width:768px)").matches) return null;
  return (
    <>
      <motion.div className="fx-cursor fx-cursor-dot" style={{ x, y, opacity: visible ? 1 : 0 }} animate={{ scale: hover ? 2.2 : 1 }} transition={{ duration: 0.15 }} />
      <motion.div className="fx-cursor fx-cursor-ring" style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }} animate={{ scale: hover ? 1.7 : 1, borderColor: hover ? "var(--red2)" : "rgba(224,30,55,.5)" }} transition={{ duration: 0.2 }} />
    </>
  );
}

/* ── Magnetic wrapper ──────────────────────────────────── */
export function Magnetic({ children, className = "", strength = 0.25 }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ── 3D tilt card ──────────────────────────────────────── */
export function Tilt({ children, className = "", max = 9 }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 20 });
  const sry = useSpring(ry, { stiffness: 260, damping: 20 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max); rx.set(-py * max);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ── Scramble text ─────────────────────────────────────── */
const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\|";
export function Scramble({ text, className = "", delay = 0, speed = 26 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [disp, setDisp] = useState(text.replace(/./g, "█"));
  useEffect(() => {
    if (!inView) return;
    let iteration = 0;
    const maxIter = text.length;
    let iv;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        iteration += 1.2;
        setDisp(
          text.split("").map((ch, i) => {
            if (ch === " " || ch === "·" || ch === "—") return ch;
            if (i < iteration) return text[i];
            return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
          }).join("")
        );
        if (iteration >= maxIter) clearInterval(iv);
      }, speed);
    }, delay);
    return () => { clearTimeout(t); if (iv) clearInterval(iv); };
  }, [inView, text, delay, speed]);
  return <span ref={ref} className={className}>{disp}</span>;
}

/* ── Word-stagger reveal ───────────────────────────────── */
export function WordReveal({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="overflow-hidden inline-flex mr-[0.24em] mb-[-0.1em] pb-[0.1em]">
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: delay + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── 5-column shutter ──────────────────────────────────── */
export function Shutter({ trigger }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    setGo(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)));
    const t = setTimeout(() => setGo(false), 650);
    return () => clearTimeout(t);
  }, [trigger]);
  return (
    <div className={`fx-shutter ${go ? "go" : ""}`} style={{ pointerEvents: "none" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="fx-shutter-col" style={{ transitionDelay: `${i * 0.045}s` }} />
      ))}
    </div>
  );
}

/* ── Film grain + scanline ─────────────────────────────── */
export function FilmLayer() {
  return (
    <>
      <div className="fx-noise" />
      <div className="fx-scanline" />
    </>
  );
}

/* ── Count-up number ───────────────────────────────────── */
export function CountUp({ value, className = "", duration = 1200, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return <span ref={ref} className={className}>{n.toLocaleString()}{suffix}</span>;
}
