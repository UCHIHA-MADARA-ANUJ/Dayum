"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Toaster, toast } from "sonner";
import { Radar, Globe, FileText, Eye, Swords, Megaphone, MessageSquare, Archive, TerminalSquare, ScrollText, BarChart3, Ruler, LogOut, RotateCcw } from "lucide-react";
import { useObsidian } from "../lib/store";
import { TARGETS, SECTORS } from "../lib/data";
import { uid, esc, sigilMark } from "../lib/helpers";
import { GalaxyCanvas, MatrixRain, CursorFX, Magnetic, Scramble, Shutter, FilmLayer } from "../components/core";
import { CommandHero, GalaxyTracker, Dossiers, IntelFeed, setIntelEscalate, OpsBoard, setDossierOpener } from "../components/views1";
import { Interdiction, Comms, Archive as ArchiveView, TerminalView, Manifesto, Metrics, Standards } from "../components/views2";
import { audio } from "../lib/audio";

const NAV = [
  { id: "command", label: "Command Deck", Icon: Radar },
  { id: "tracker", label: "Galaxy Tracker", Icon: Globe },
  { id: "dossiers", label: "Wanted Dossiers", Icon: FileText },
  { id: "intel", label: "Intelligence", Icon: Eye },
  { id: "ops", label: "Operations", Icon: Swords },
  { id: "interdiction", label: "Interdiction", Icon: Megaphone },
  { id: "comms", label: "Inquisitor Comms", Icon: MessageSquare },
  { id: "archive", label: "Archive", Icon: Archive },
  { id: "terminal", label: "Terminal", Icon: TerminalSquare },
  { id: "manifesto", label: "Manifesto", Icon: ScrollText },
  { id: "metrics", label: "Hunt Metrics", Icon: BarChart3 },
  { id: "standards", label: "Standards", Icon: Ruler },
];

const BOOT_LINES = [
  { t: "OBSIDIAN CORE v1.0.0 — IMPERIAL SECURITY NETWORK", c: "sys" },
  { t: "MOUNTING SECTOR MAPS .................... OK", c: "ok" },
  { t: "DECRYPTING INQUISITOR CHANNELS .......... OK", c: "ok" },
  { t: "CALIBRATING PROBE NETWORK ................ OK", c: "ok" },
  { t: "LOADING TARGET DOSSIERS ................. [ 9 ]", c: "warn" },
  { t: "SYNCING GALACTIC GRID .................. [ 10 ]", c: "warn" },
  { t: "SECURITY PROTOCOL: ENCRYPTION AES-7 · ZERO-KEY", c: "sys" },
  { t: "CLEARANCE CHECK REQUIRED — ENTER PASSPHRASE", c: "amber" },
];

export default function Obsidian() {
  const phase = useObsidian((s) => s.phase);
  const view = useObsidian((s) => s.view);
  const session = useObsidian((s) => s.session);
  const setPhase = useObsidian((s) => s.setPhase);
  const setView = useObsidian((s) => s.setView);
  const setSession = useObsidian((s) => s.setSession);
  const resetAll = useObsidian((s) => s.resetAll);
  const pushOp = useObsidian((s) => s.pushOp);

  const [bootLines, setBootLines] = useState([]);
  const [bootStage, setBootStage] = useState("typing"); // typing | pass | busy
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [clock, setClock] = useState("--:--:--");
  const contentRef = useRef(null);

  /* dossier opener shared with views */
  useEffect(() => { setDossierOpener((id) => setDossier(id)); }, []);

  /* intel escalate */
  useEffect(() => {
    setIntelEscalate(() => {
      const t = TARGETS[Math.floor(Math.random() * TARGETS.length)];
      const s = SECTORS[Math.floor(Math.random() * SECTORS.length)];
      pushOp({ id: uid("o"), name: "ESCALATED—" + Math.random().toString(36).slice(2, 6).toUpperCase(), target: t.id, sector: s.id, squad: "ISB SHADOW CELL", pri: 1 + Math.floor(Math.random() * 3), status: "PLANNING", note: "Escalated from intel report." });
    });
  }, [pushOp]);

  /* session restore */
  useEffect(() => {
    if (useObsidian.getState().session) setPhase("app");
    const unlock = () => audio.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, [setPhase]);

  /* clock */
  useEffect(() => {
    const iv = setInterval(() => setClock(new Date().toLocaleTimeString("en-GB")), 1000);
    return () => clearInterval(iv);
  }, []);

  /* boot typing */
  useEffect(() => {
    if (phase !== "boot") return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setBootLines(BOOT_LINES.slice(0, i));
      audio.bootLine();
      if (i >= BOOT_LINES.length) { clearInterval(iv); setTimeout(() => setBootStage("pass"), 350); }
    }, 430);
    return () => clearInterval(iv);
  }, [phase]);

  const tryAuth = () => {
    if (bootStage !== "pass") return;
    if (!pass.trim()) { setPassErr(true); return; }
    setBootStage("busy");
    setTimeout(() => {
      if (pass.trim().toUpperCase() === "FOR THE EMPIRE") {
        audio.success();
        setSession(true);
        setWelcome(true);
        setTimeout(() => setWelcome(false), 3400);
        setPhase("app");
      } else {
        audio.deny();
        setPassErr(true); setPass("");
        setBootStage("pass");
        setTimeout(() => setPassErr(false), 600);
      }
    }, 1300);
  };

  const go = useCallback((v) => { audio.click(); audio.sweep(); setView(v); }, [setView]);

  /* lenis smooth scroll on content */
  useEffect(() => {
    if (phase !== "app" || !contentRef.current) return;
    const lenis = new Lenis({ wrapper: contentRef.current, content: contentRef.current, smoothWheel: true, duration: 1.15 });
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [phase]);

  const VIEWS = {
    command: <CommandHero go={go} />,
    tracker: <GalaxyTracker />,
    dossiers: <Dossiers />,
    intel: <IntelFeed />,
    ops: <OpsBoard />,
    interdiction: <Interdiction />,
    comms: <Comms />,
    archive: <ArchiveView />,
    terminal: <TerminalView />,
    manifesto: <Manifesto />,
    metrics: <Metrics />,
    standards: <Standards />,
  };

  const dossierTarget = dossier ? TARGETS.find((t) => t.id === dossier) : null;

  return (
    <>
      <GalaxyCanvas />
      <FilmLayer />
      <CursorFX />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0b0b12", border: "1px solid #2a2a3e", color: "#e8e4d8", fontFamily: "monospace", fontSize: 11, letterSpacing: ".1em" } }} />

      {/* GATE */}
      <AnimatePresence>
        {phase === "gate" && (
          <motion.div key="gate" className="gate" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <MatrixRain />
            <div className="gate-vignette" />
            <div className="gate-scan" />
            <div className="gate-inner">
              <motion.svg className="gate-emblem" viewBox="0 0 100 100" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                <defs><radialGradient id="emg" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#ff2a44" /><stop offset="70%" stopColor="#7a0e1e" /><stop offset="100%" stopColor="#2a050c" /></radialGradient></defs>
                <path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="url(#emg)" stroke="#e01e37" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="16" fill="none" stroke="#e8e4d8" strokeWidth="2" />
                <circle cx="50" cy="50" r="7" fill="#e01e37" />
              </motion.svg>
              <motion.h1 className="gate-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}>OBSIDIAN</motion.h1>
              <motion.div className="gate-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>IMPERIAL SECURITY NETWORK · JEDI APPREHENSION DIVISION</motion.div>
              <div className="gate-line" />
              <div className="gate-warn">⚠ ENCRYPTED TERMINAL — AUTHORIZED PERSONNEL ONLY</div>
              <Magnetic>
                <motion.button className="gate-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} onClick={() => { audio.unlock(); setPhase("boot"); }}>
                  ▶ &nbsp;CLICK TO INITIALIZE SEQUENCE
                </motion.button>
              </Magnetic>
              <div className="gate-foot">CLEARANCE LEVEL ALPHA-7 REQUIRED · UNAUTHORIZED ACCESS IS PUNISHABLE BY DEATH</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOT */}
      <AnimatePresence>
        {phase === "boot" && (
          <motion.div key="boot" className="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="boot-vignette" />
            <div className={`boot-term ${passErr ? "boot-shake" : ""}`}>
              <div className="boot-head">OBSIDIAN BOOTLOADER <span>v1.0.0</span></div>
              <div className="boot-lines">
                {bootLines.map((l, i) => <div key={i} className={l.c}>{l.t}</div>)}
                {bootStage === "typing" && <div className="cursor" />}
              </div>
              <div className="boot-prog"><div className="boot-prog-bar" style={{ width: (bootLines.length / BOOT_LINES.length) * 100 + "%" }} /></div>
              {bootStage === "pass" && (
                <motion.div className="boot-pass" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <span className="boot-prompt">CLEARANCE&gt;</span>
                  <input value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryAuth()} type="password" placeholder="••••••••••••" autoFocus autoComplete="off" />
                  <button className="btn btn-red btn-sm" onClick={tryAuth}>AUTH</button>
                </motion.div>
              )}
              <div className={`boot-status ${passErr ? "err" : ""}`}>{bootStage === "busy" ? "VERIFYING CREDENTIALS…" : passErr ? "✗ ACCESS DENIED — INCIDENT LOGGED" : ""}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WELCOME */}
      <AnimatePresence>
        {welcome && (
          <motion.div key="welcome" className="welcome" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}>
            <div className="welcome-inner">
              <motion.div className="welcome-title" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>WELCOME, OPERATIVE N-771</motion.div>
              <div className="welcome-sub"><Scramble text="DECRYPTING INTERFACE…" delay={600} /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APP */}
      <AnimatePresence>
        {phase === "app" && (
          <motion.div key="app" className="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Shutter trigger={view} />
            <div className="scanlines" />
            <div className="crt-vignette" />
            <div className="hud-corners">
              <span className="hc hc-tl" /><span className="hc hc-tr" /><span className="hc hc-bl" /><span className="hc hc-br" />
              <div className="hud-tag hud-tl">OBSIDIAN // SECURE LINK</div>
              <div className="hud-tag hud-br">OBSIDIAN v1.0.0 · ALPHA-7</div>
            </div>

            <aside className="sidebar">
              <div className="side-brand">
                <svg viewBox="0 0 100 100" className="side-emblem"><path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="#0d0d14" stroke="#e01e37" strokeWidth="2" /><circle cx="50" cy="50" r="14" fill="none" stroke="#e8e4d8" strokeWidth="2" /><circle cx="50" cy="50" r="6" fill="#e01e37" /></svg>
                <div><div className="side-name">OBSIDIAN</div><div className="side-tag">SECURITY NETWORK</div></div>
              </div>
              <nav className="side-nav">
                {NAV.map((n) => (
                  <button key={n.id} className={`nav-item ${view === n.id ? "active" : ""}`} onClick={() => go(n.id)}>
                    <n.Icon size={17} /><span>{n.label}</span>
                  </button>
                ))}
              </nav>
              <div className="side-foot">
                <div className="side-status"><span className="dot dot-red" /> CLASSIFIED LINK ACTIVE</div>
                <div className="side-user">OPERATIVE <span>N-771</span></div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => { setSession(false); location.reload(); }}><LogOut size={12} /> SEVER</button>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => { resetAll(); toast("LOCAL DATA PURGED — RELOADING"); setTimeout(() => location.reload(), 800); }}><RotateCcw size={12} /> PURGE</button>
                </div>
              </div>
            </aside>

            <div className="main">
              <header className="topbar">
                <div className="tb-left">
                  <div className="tb-title">IMPERIAL HUNT COMMAND</div>
                  <div className="tb-path">/{NAV.find((n) => n.id === view)?.label.toUpperCase().replace(/ /g, "_")}</div>
                </div>
                <div className="tb-right">
                  <div className="tb-clear">CLEARANCE <b>ALPHA-7</b></div>
                  <div className="tb-clock">{clock}</div>
                </div>
              </header>
              <main className="content" ref={contentRef}>
                <AnimatePresence mode="wait">
                  <motion.div key={view} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
                    {VIEWS[view]}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>

            {/* DOSSIER MODAL (global) */}
            <AnimatePresence>
              {dossierTarget && (
                <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setDossier(null)}>
                  <motion.div className="modal" initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
                    <div className="modal-head"><h2>TARGET DOSSIER — {dossierTarget.status}</h2><button className="modal-x" onClick={() => setDossier(null)}>✕</button></div>
                    <div className="modal-body">
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <div style={{ textAlign: "center", flexShrink: 0, margin: "0 auto" }}>
                          <span dangerouslySetInnerHTML={{ __html: sigilMark(dossierTarget.sigil, dossierTarget.color, 120) }} />
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: ".14em", marginTop: 10 }}>{dossierTarget.name}</div>
                          <div className="mono" style={{ fontSize: 10, letterSpacing: ".24em", color: dossierTarget.color, marginTop: 4 }}>{dossierTarget.epithet}</div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--amber)", marginTop: 10 }}>◈ {dossierTarget.reward} CREDITS</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 260 }}>
                          <div className="mi-row"><b>LAST SEEN</b><br />{dossierTarget.lastSeen}</div>
                          <div className="mi-row"><b>KNOWN ABILITIES</b><br />{dossierTarget.abilities.map((a) => "▸ " + a).join("<br />")}</div>
                          <div className="mi-row"><b>KNOWN ASSOCIATES</b><br />{dossierTarget.associates.map((a) => "▸ " + a).join("<br />")}</div>
                          <div className="mi-row"><b>OPERATIONAL NOTES</b><br />{dossierTarget.notes}</div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-foot">
                      <button className="btn btn-ghost" onClick={() => setDossier(null)}>CLOSE</button>
                      <button className="btn btn-red" onClick={() => { const t = dossierTarget; pushOp({ id: uid("o"), name: "HUNT—" + Math.random().toString(36).slice(2, 6).toUpperCase(), target: t.id, sector: SECTORS[0].id, squad: "1ST INQUISITORIAL", pri: Math.min(t.threatN, 3), status: "PLANNING", note: "Filed from dossier." }); setDossier(null); toast(`OPERATION CREATED — TARGET ${t.name}`); }}>FILE TO OPERATIONS</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
