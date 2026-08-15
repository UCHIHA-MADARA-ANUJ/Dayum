"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { toast } from "sonner";
import { ArrowUpRight, Radar, FileText, Crosshair, Eye, Megaphone, MessageSquare, Archive, TerminalSquare, ScrollText, BarChart3, Ruler, Plus, RotateCw, Printer, X, MapPin, Clock3, Swords } from "lucide-react";
import { useObsidian } from "../lib/store";
import { TARGETS, SECTORS, INQUISITORS, INTEL_TEMPLATES, OP_NAMES, SQUADS, TICKER_LINES } from "../lib/data";
import { esc, uid, mulberry32, sigilMark, posterSVG } from "../lib/helpers";
import { Magnetic, Tilt, Scramble, WordReveal, CountUp } from "./core";
import { audio } from "../lib/audio";

const targetById = (id) => TARGETS.find((t) => t.id === id);
const sectorById = (id) => SECTORS.find((s) => s.id === id);
const opName = () => { let n = OP_NAMES[Math.floor(Math.random() * OP_NAMES.length)]; return n; };

/* ═══════════ HERO / COMMAND ═══════════ */
export function CommandHero({ go }) {
  const ops = useObsidian((s) => s.ops);
  const titleRef = useRef(null);
  useEffect(() => {
    const words = titleRef.current?.querySelectorAll(".hero-word");
    if (words && words.length) {
      gsap.fromTo(words, { y: 120, opacity: 0, rotateX: -40 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.4, stagger: 0.12, ease: "power4.out", delay: 0.15 });
    }
  }, []);
  useEffect(() => {
    const iv = setInterval(() => {
      const el = document.getElementById("hudMem");
      if (el) el.textContent = "MEM_ALLOC: " + (12 + Math.random() * 6).toFixed(2) + " GB";
    }, 700);
    return () => clearInterval(iv);
  }, []);
  const activeOps = ops.filter((o) => o.status === "ACTIVE").length;
  const eco = [
    { id: "tracker", name: "GALAXY TRACKER", desc: "Live sector radar. Probe drops. Threat heat. Sighting log.", num: "01", Icon: Radar },
    { id: "dossiers", name: "WANTED DOSSIERS", desc: "Nine original Jedi targets. Psychoprofiles. Printable warrants.", num: "02", Icon: FileText },
    { id: "ops", name: "OPERATIONS", desc: "Kanban hunt dispatch. Squad assignment. Priority tiers.", num: "03", Icon: Swords },
    { id: "intel", name: "INTELLIGENCE", desc: "Probe & ISB feed. Redaction. Escalation to ops.", num: "04", Icon: Eye },
    { id: "interdiction", name: "INTERDICTION", desc: "Propaganda studio. Counter-recruitment broadcasts.", num: "05", Icon: Megaphone },
    { id: "comms", name: "INQUISITOR UPLINK", desc: "Encrypted channel. Six Inquisitor operatives online.", num: "06", Icon: MessageSquare },
    { id: "archive", name: "IMPERIAL ARCHIVE", desc: "Directive 66. Doctrine. Classified records.", num: "07", Icon: Archive },
    { id: "terminal", name: "TERMINAL", desc: "Direct console access to the OBSIDIAN mainframe.", num: "08", Icon: TerminalSquare },
    { id: "manifesto", name: "MANIFESTO", desc: "The Emperor's case against the Order. Read it.", num: "09", Icon: ScrollText },
    { id: "metrics", name: "HUNT METRICS", desc: "Purge completion. Sector indices. Kill counts.", num: "10", Icon: BarChart3 },
    { id: "standards", name: "IMPERIAL STANDARDS", desc: "The design system behind the network.", num: "11", Icon: Ruler },
  ];
  return (
    <>
      <div className="hero">
        <div className="hero-hud">
          <div className="hh-l">
            <span><b style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--red2)", boxShadow: "0 0 8px var(--red2)", marginRight: 8, animation: "pulse 2s infinite" }} />SYS.OPERATIONAL</span>
            <span>SECTORS: 10 · GARRISONS: 8</span>
            <span id="hudMem">MEM_ALLOC: 0.00 GB</span>
          </div>
          <div className="hh-r">
            <span>NODE: OBSIDIAN_PRIME</span>
            <span>CLEARANCE: ALPHA-7</span>
            <span>OPERATIVE: {OPS_OP}</span>
          </div>
        </div>
        <div className="hero-title" ref={titleRef} style={{ perspective: 1000 }}>
          <div className="outline hero-word" style={{ fontSize: "clamp(40px,6vw,84px)" }}>THE JEDI ARE</div>
          <div className="solid red hero-word" style={{ fontSize: "clamp(52px,8.5vw,120px)" }}>SCATTERED.</div>
          <div className="solid hero-word" style={{ fontSize: "clamp(28px,4.2vw,58px)", letterSpacing: ".06em" }}>BUT NOT <span className="red">HIDDEN.</span></div>
        </div>
        <motion.div className="hero-scroll" initial={{ opacity: 0 }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2.6 }}>
          ▼ SCROLL TO INITIATE SEQUENCE ▼
        </motion.div>
      </div>

      <motion.section initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mani-preview">
        <div className="mp-grid">
          <div>
            <div className="mp-head">THE OLD<br />ORDER IS<br /><span className="red">DEAD.</span></div>
          </div>
          <div className="mp-body">
            <p className="big">The Jedi promised to protect the galaxy. Instead they hoarded its power — and when the Emperor spoke, they scattered like cowards.</p>
            <p>OBSIDIAN is the answer. A classified network that turns a thousand hiding places into one hunting ground. Every sector, every probe, every citizen — a sensor in the Emperor's hand.</p>
            <p>The hunt is not a campaign. It is a condition of existence.</p>
            <div className="mp-cta">
              <Magnetic>
                <button className="btn btn-red" onClick={() => { audio.click(); go("manifesto"); }}>READ THE MANIFESTO</button>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.section>

      <section style={{ padding: "60px 0 20px" }}>
        <motion.div className="eco-head" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          THE ECOSYSTEM.
        </motion.div>
        <div className="eco-grid">
          {eco.map((f, i) => (
            <Tilt key={f.id} className="eco-tilt">
              <button className="eco-card" onClick={() => { audio.click(); go(f.id); }}>
                <div className="eco-glow" /><div className="eco-sweep" />
                <span className="eco-num">MODULE_{f.num}</span>
                <h3><f.Icon size={15} style={{ marginRight: 8, color: "var(--red2)" }} />{f.name}</h3>
                <p>{f.desc}</p>
                <span className="eco-init">Initialize <ArrowUpRight size={13} /></span>
              </button>
            </Tilt>
          ))}
        </div>
      </section>

      <section style={{ padding: "40px 0 60px" }}>
        <motion.div className="eco-head" style={{ fontSize: "clamp(30px,4vw,54px)" }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          HUNT METRICS.
        </motion.div>
        <div className="stat-blocks">
          {[{ v: 9, l: "JEDI TARGETS", d: "Prioritized & psychoprofiled" }, { v: 10, l: "SECTORS COVERED", d: "Live threat indices" }, { v: 6, l: "INQUISITORS ONLINE", d: "Encrypted uplink" }, { v: activeOps, l: "ACTIVE HUNTS", d: "In the field right now" }].map((b, i) => (
            <motion.div key={i} className="stat-block" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}>
              <div className="sb-line" /><div className="sb-glow" />
              <div className="sb-val"><CountUp value={b.v} /></div>
              <span className="sb-label">{b.l}</span>
              <p>{b.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="ticker mb" style={{ marginTop: 20 }}>
        <div className="ticker-inner">{[...TICKER_LINES, ...TICKER_LINES].map((l, i) => <span key={i}>{esc(l)}</span>)}</div>
      </div>
    </>
  );
}
const OPS_OP = "N-771";

/* ═══════════ GALAXY TRACKER ═══════════ */
export function GalaxyTracker() {
  const sightings = useObsidian((s) => s.sightings);
  const pushSighting = useObsidian((s) => s.pushSighting);
  const [sel, setSel] = useState(null); // {type:'sighting'|'sector', id}
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ sector: "torvane", target: "kade", status: "CONFIRMED", when: "JUST NOW" });
  const rnd = mulberry32(42);
  const W = 1200, H = 700;
  const stars = [];
  for (let i = 0; i < 420; i++) stars.push({ x: rnd() * W, y: rnd() * H, r: rnd() < 0.85 ? 0.6 : 1.3, c: rnd() < 0.7 ? "#2c2c3a" : "#3f3f52", o: 0.25 + rnd() * 0.55 });
  const galaxy = [];
  for (let i = 0; i < 300; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * W * 0.34; galaxy.push({ x: W / 2 + Math.cos(a) * r + (rnd() - .5) * 60, y: H / 2 + Math.sin(a) * r * 0.42 + (rnd() - .5) * 40, r: .4 + rnd() * .9, c: rnd() < .5 ? "#4a4a62" : "#5a4a5a", o: .3 + rnd() * .5 }); }
  const pos = { torvane: [382, 235], myrrah: [560, 200], velaros: [430, 390], ostrak: [210, 430], hearth: [620, 330], kess: [720, 360], bellhaven: [800, 150], nyxaris: [920, 300], dorn: [150, 180], valdris: [1040, 520] };
  const submit = () => {
    pushSighting({ id: uid("s"), sector: form.sector, target: form.target, when: form.when || "JUST NOW", status: form.status, x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.6 });
    setModal(false); toast("SIGHTING FILED — PROBE GRID UPDATED");
  };
  const seed = () => {
    const t = TARGETS.find((x) => x.status.startsWith("PRIORITY")) || TARGETS[0];
    const s = SECTORS[Math.floor(Math.random() * SECTORS.length)];
    pushSighting({ id: uid("s"), sector: s.id, target: t.id, when: "JUST NOW", status: Math.random() > 0.5 ? "CONFIRMED" : "SUSPECTED", x: Math.random(), y: Math.random() });
    toast(`PROBE DROP: SIGNATURE MATCHES ${t.name} IN ${s.name}`);
  };
  const selS = sel && sel.type === "sighting" ? sightings.find((x) => x.id === sel.id) : null;
  const selSec = sel && sel.type === "sector" ? SECTORS.find((x) => x.id === sel.id) : null;
  const selT = selS ? targetById(selS.target) : null;
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Galaxy <span className="accent">Tracker</span></h1><div className="page-sub">Live surveillance grid · Probe network · Sector command</div></div>
        <div className="actions">
          <button className="btn btn-red" onClick={() => setModal(true)}><Plus size={14} /> LOG SIGHTING</button>
          <button className="btn" onClick={seed}><RotateCw size={14} /> SIMULATE PROBE DROP</button>
        </div>
      </div>

      <div className="map-wrap" style={{ maxHeight: 640 }}>
        <div className="map-legend"><b>■</b> CONFIRMED &nbsp;<b style={{ color: "var(--amber)" }}>■</b> SUSPECTED &nbsp;<b style={{ color: "var(--dim)" }}>■</b> DISPUTED<br />CLICK A BLIP FOR DETAILS · CLICK A SECTOR TO SELECT</div>
        <AnimatePresence>
          {(selS || selSec) && (
            <motion.div className="map-info show" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {selS && selT && (
                <>
                  <h4 style={{ color: "var(--red2)" }}>{selT.name} — {selT.epithet}</h4>
                  <div className="mi-row"><b>SECTOR</b> {sectorById(selS.sector)?.name} · {sectorById(selS.sector)?.garrison}</div>
                  <div className="mi-row"><b>REPORTED</b> {selS.when}</div>
                  <div className="mi-row"><b>STATUS</b> {selS.status}</div>
                  <div className="mi-row"><b>REWARD</b> <span style={{ color: "var(--amber)" }}>{selT.reward} CREDITS</span></div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn btn-red btn-sm" onClick={() => { setSel(null); openDossierGlobal(selT.id); }}>DOSSIER</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSel(null)}>DISMISS</button>
                  </div>
                </>
              )}
              {selSec && (
                <>
                  <h4>{selSec.name} <span className={`badge ${selSec.status === "HOT" ? "badge-red" : selSec.status === "WATCH" ? "badge-amber" : "badge"}`}>{selSec.status}</span></h4>
                  <div className="mi-row"><b>GARRISON</b> {selSec.garrison}</div>
                  <div className="mi-row"><b>THREAT INDEX</b> {selSec.threat}/100</div>
                  <div className="mi-row"><b>INTEL</b> {selSec.note}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn btn-red btn-sm" onClick={() => { setSel(null); setModal(true); }}>＋ LOG SIGHTING</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSel(null)}>DISMISS</button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ minHeight: 560, display: "block", width: "100%" }}>
          <defs><radialGradient id="heatGrad"><stop offset="0" stopColor="#e01e37" /><stop offset="1" stopColor="rgba(224,30,55,0)" /></radialGradient></defs>
          {stars.map((s, i) => <circle key={"s" + i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />)}
          {galaxy.map((s, i) => <circle key={"g" + i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />)}
          {SECTORS.map((s) => {
            const [x, y] = pos[s.id];
            return <circle key={s.id} cx={x} cy={y} r={60 + s.threat * 0.5} fill="url(#heatGrad)" opacity={s.threat / 130} />;
          })}
          <g className="sweep"><path d="M600 350 L600 60 A290 290 0 0 1 856 179 Z" fill="rgba(224,30,55,.10)" /></g>
          {SECTORS.map((s) => {
            const [x, y] = pos[s.id];
            return (
              <g key={s.id} className="sector" style={{ cursor: "pointer" }} onClick={() => setSel({ type: "sector", id: s.id })}>
                <polygon points={`${x-9},${y} ${x-4.5},${y-8} ${x+4.5},${y-8} ${x+9},${y} ${x+4.5},${y+8} ${x-4.5},${y+8}`} fill="none" stroke={s.status === "HOT" ? "#e01e37" : "#2a2a3e"} strokeWidth="1.2" />
                <text x={x} y={y + 26} textAnchor="middle" fontFamily="monospace" fontSize="10" letterSpacing="2" fill={s.status === "HOT" ? "var(--red2)" : s.status === "WATCH" ? "var(--amber)" : "var(--dim)"}>{s.name}</text>
              </g>
            );
          })}
          {sightings.map((s) => {
            const t = targetById(s.target); const [x, y] = pos[s.sector] || [600, 350];
            const bx = x + (s.x - 0.5) * 240, by = y + (s.y - 0.5) * 160;
            const col = s.status === "CONFIRMED" ? "#ff2a44" : s.status === "SUSPECTED" ? "#f4a300" : "#8a8a94";
            return (
              <g key={s.id} className="blip" style={{ cursor: "pointer" }} transform={`translate(${bx} ${by})`} onClick={() => setSel({ type: "sighting", id: s.id })}>
                <circle className="pulse" r="5" fill={col} opacity=".85" />
                <circle r="4" fill={col} /><circle r="9" fill="none" stroke={col} strokeWidth="1" opacity=".5" />
                <path d="M-14 0H-9M9 0H14M0-14V-9M0 9V14" stroke={col} strokeWidth="1.2" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="panel mt">
        <div className="panel-head"><h3>SIGHTING LOG</h3><span className="tag">{sightings.length} RECORDS</span></div>
        <div className="row-list">
          {[...sightings].reverse().map((s) => {
            const t = targetById(s.target); const sec = sectorById(s.sector);
            return (
              <div className="row" key={s.id}>
                <div className="r-main">
                  <div className="r-title">{t ? t.name : "UNKNOWN"} <span className="dim" style={{ fontWeight: 400 }}>— {t ? t.epithet : ""}</span></div>
                  <div className="r-sub">{sec?.name} · {s.when} · REPORTED BY PROBE GRID</div>
                </div>
                <div className="r-right">
                  <span className={`badge ${s.status === "CONFIRMED" ? "badge-red" : s.status === "SUSPECTED" ? "badge-amber" : "badge"}`}>{s.status}</span>
                  {t && <button className="btn btn-ghost btn-sm" onClick={() => openDossierGlobal(t.id)}>DOSSIER</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="modal" initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
              <div className="modal-head"><h2>LOG SIGHTING</h2><button className="modal-x" onClick={() => setModal(false)}><X size={16} /></button></div>
              <div className="modal-body">
                <div className="field"><label>Sector</label>
                  <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>{SECTORS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                <div className="field"><label>Subject</label>
                  <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}>{TARGETS.filter((t) => t.status.startsWith("PRIORITY")).map((t) => <option key={t.id} value={t.id}>{t.name} — {t.epithet}</option>)}</select></div>
                <div className="field"><label>Classification</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>CONFIRMED</option><option>SUSPECTED</option><option>DISPUTED</option></select></div>
                <div className="field"><label>Time reported</label><input value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} /></div>
              </div>
              <div className="modal-foot"><button className="btn btn-ghost" onClick={() => setModal(false)}>CANCEL</button><button className="btn btn-red" onClick={submit}>FILE REPORT</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════ DOSSIERS ═══════════ */
export function Dossiers() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Wanted <span className="accent">Dossiers</span></h1><div className="page-sub">{TARGETS.filter((t) => t.status.startsWith("PRIORITY")).length} active targets · Imperial Security Bureau</div></div>
        <div className="actions"><button className="btn btn-red" onClick={() => toast("WARRANT PACK EXPORTED — 9 POSTERS")}><Printer size={14} /> EXPORT WANTED POSTERS</button></div>
      </div>
      <div className="poster-grid">
        {TARGETS.map((t) => (
          <motion.div key={t.id} className="poster" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} onClick={() => setOpen(t)}>
            <div className="p-img">
              <span className={`badge ${t.threatN >= 4 ? "badge-red" : t.threatN === 3 ? "badge-amber" : "badge"} p-threat`}>{t.threat}</span>
              <span dangerouslySetInnerHTML={{ __html: sigilMark(t.sigil, t.color) }} />
              <div className="p-loc">{t.lastSeen}</div>
            </div>
            <div className="p-name">{t.name}</div>
            <div className="p-epithet">{t.epithet}</div>
            <div className="p-reward">◈ {t.reward} CREDITS</div>
          </motion.div>
        ))}
      </div>
      <div className="empty-state mt" style={{ border: "1px dashed var(--line)", borderRadius: 2 }}>
        <span className="es-icon">◈</span>REWARD VALID UPON DELIVERY — DEAD OR ALIVE. THE EMPEROR DECIDES.
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
            <motion.div className="modal" initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
              <div className="modal-head"><h2>TARGET DOSSIER — {open.status}</h2><button className="modal-x" onClick={() => setOpen(null)}><X size={16} /></button></div>
              <div className="modal-body">
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center", flexShrink: 0, margin: "0 auto" }}>
                    <span dangerouslySetInnerHTML={{ __html: sigilMark(open.sigil, open.color, 120) }} />
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: ".14em", marginTop: 10 }}>{open.name}</div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: ".24em", color: open.color, marginTop: 4 }}>{open.epithet}</div>
                    <div style={{ marginTop: 10 }}><span className={`badge ${open.threatN >= 4 ? "badge-red" : open.threatN === 3 ? "badge-amber" : "badge"}`}>THREAT: {open.threat}</span></div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--amber)", marginTop: 10 }}>◈ {open.reward} CREDITS</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div className="mi-row"><b>LAST SEEN</b><br />{open.lastSeen}</div>
                    <div className="mi-row"><b>KNOWN ABILITIES</b><br />{open.abilities.map((a) => "▸ " + a).join("<br />")}</div>
                    <div className="mi-row"><b>KNOWN ASSOCIATES</b><br />{open.associates.map((a) => "▸ " + a).join("<br />")}</div>
                    <div className="mi-row"><b>OPERATIONAL NOTES</b><br />{open.notes}</div>
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button className="btn btn-ghost" onClick={() => setOpen(null)}>CLOSE</button>
                <button className="btn btn-red" onClick={() => { setOpen(null); toast(`OPERATION CREATED — TARGET ${open.name}`); }}>FILE TO OPERATIONS</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════ INTEL FEED ═══════════ */
export function IntelFeed() {
  const intel = useObsidian((s) => s.intel);
  const pushIntel = useObsidian((s) => s.pushIntel);
  const updateIntel = useObsidian((s) => s.updateIntel);
  const drop = () => {
    const tpl = INTEL_TEMPLATES[Math.floor(Math.random() * INTEL_TEMPLATES.length)];
    const sec = SECTORS[Math.floor(Math.random() * SECTORS.length)];
    const tgt = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    const txt = tpl.txt.replace(/\{sector\}/g, sec.name).replace(/\{subject\}/g, tgt.name + " (" + tgt.epithet + ")").replace(/\{conf\}/g, ["MODERATE", "HIGH", "HIGH", "LOW"][Math.floor(Math.random() * 4)]);
    pushIntel({ id: uid("i"), src: tpl.src, time: "JUST NOW", status: "UNVERIFIED", txt });
    toast("PROBE DROP RECEIVED");
  };
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Intelligence <span className="accent">Feed</span></h1><div className="page-sub">Probe droid network · ISB assets · Signal intercepts</div></div>
        <div className="actions"><button className="btn btn-red" onClick={drop}><RotateCw size={14} /> SIMULATE PROBE DROP</button></div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>INCOMING REPORTS</h3><span className="tag">{intel.length} RECORDS · AUTO-UPDATING</span></div>
        <div className="row-list">
          {[...intel].reverse().map((i) => (
            <motion.div key={i.id} className={`row intel-item ${i.status === "CONFIRMED" ? "confirmed" : ""}`} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
              <div className="r-main">
                <div className="i-head">
                  <span className="i-src">◈ {i.src}</span><span className="i-time">{i.time}</span>
                  <span className={`badge ${i.status === "CONFIRMED" ? "badge-red" : i.status === "DISPUTED" ? "badge-amber" : i.status === "UNVERIFIED" ? "badge" : "badge-ice"}`}>{i.status}</span>
                </div>
                <div className="i-body">{i.txt}</div>
                <div className="i-foot">
                  <button className="btn btn-ghost btn-sm" onClick={() => { pushOpFromIntel(); toast("REPORT ESCALATED — OPERATION CREATED"); }}>▲ ESCALATE TO OPERATIONS</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { updateIntel(i.id, { status: "CONFIRMED" }); toast("REPORT MARKED CONFIRMED"); }}>✓ MARK CONFIRMED</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { updateIntel(i.id, { status: "DISCREDITED" }); toast("REPORT DISCREDITED"); }}>✕ DISMISS</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
let pushOpFromIntel = null;
export function setIntelEscalate(fn) { pushOpFromIntel = fn; }

/* ═══════════ OPS BOARD ═══════════ */
export function OpsBoard() {
  const ops = useObsidian((s) => s.ops);
  const moveOp = useObsidian((s) => s.moveOp);
  const delOp = useObsidian((s) => s.delOp);
  const pushOp = useObsidian((s) => s.pushOp);
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: opName(), target: TARGETS[0].id, sector: SECTORS[0].id, squad: SQUADS[0], pri: "2", note: "" });
  const cols = ["PLANNING", "ACTIVE", "CONTAINED", "FAILED"];
  const submit = () => {
    pushOp({ id: uid("o"), name: form.name || opName(), target: form.target, sector: form.sector, squad: form.squad, pri: +form.pri, status: "PLANNING", note: form.note || "No additional notes." });
    setModal(false); toast("OPERATION AUTHORIZED");
  };
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Operations <span className="accent">Board</span></h1><div className="page-sub">Hunt dispatch · Squad assignment · Purge coordination</div></div>
        <div className="actions"><button className="btn btn-red" onClick={() => setModal(true)}><Plus size={14} /> NEW OPERATION</button></div>
      </div>
      <div className="kanban">
        {cols.map((c) => (
          <div key={c} className={`kan-col ${over === c ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOver(c); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => { e.preventDefault(); if (dragId) { moveOp(dragId, c); toast(`OPERATION MOVED TO ${c}`); } setDragId(null); setOver(null); }}>
            <div className="kan-head"><span className="k-name">{c}</span><span className="k-count">{ops.filter((o) => o.status === c).length}</span></div>
            <div className="kan-body">
              {ops.filter((o) => o.status === c).map((o) => {
                const t = targetById(o.target);
                return (
                  <motion.div key={o.id} layout className={`kan-card pri-${o.pri} ${dragId === o.id ? "dragging" : ""}`} draggable
                    onDragStart={() => setDragId(o.id)} onDragEnd={() => { setDragId(null); setOver(null); }}>
                    <button className="kc-del" onClick={() => { delOp(o.id); toast("OPERATION DELETED"); }}><X size={12} /></button>
                    <div className="kc-name">{o.name}</div>
                    <div className="kc-sub">TGT: {t ? t.name : "—"}<br />SEC: {sectorById(o.sector)?.name || "—"} · {o.squad}<br />{o.note || ""}</div>
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                      <span className={`badge ${o.pri === 1 ? "badge-red" : o.pri === 2 ? "badge-amber" : "badge"}`}>P{o.pri}</span>
                      {t && <button className="btn btn-ghost btn-sm" onClick={() => openDossierGlobal(t.id)}>FILE</button>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {modal && (
          <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="modal" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="modal-head"><h2>NEW HUNT OPERATION</h2><button className="modal-x" onClick={() => setModal(false)}><X size={16} /></button></div>
              <div className="modal-body">
                <div className="field"><label>Codename</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="field"><label>Target</label><select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}>{TARGETS.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.epithet}</option>)}</select></div>
                <div className="field"><label>Sector</label><select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>{SECTORS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                <div className="field"><label>Squad</label><select value={form.squad} onChange={(e) => setForm({ ...form, squad: e.target.value })}>{SQUADS.map((s) => <option key={s}>{s}</option>)}</select></div>
                <div className="field"><label>Priority</label><select value={form.pri} onChange={(e) => setForm({ ...form, pri: e.target.value })}><option value="1">1 — CRITICAL</option><option value="2">2 — HIGH</option><option value="3">3 — STANDARD</option></select></div>
                <div className="field"><label>Notes</label><textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Operational notes…" /></div>
              </div>
              <div className="modal-foot"><button className="btn btn-ghost" onClick={() => setModal(false)}>CANCEL</button><button className="btn btn-red" onClick={submit}>AUTHORIZE OPERATION</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* global dossier opener (shared) */
let openDossierGlobal = () => {};
export function setDossierOpener(fn) { openDossierGlobal = fn; }
