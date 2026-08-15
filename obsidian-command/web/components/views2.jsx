"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Send, Play, X, FileText, TerminalSquare } from "lucide-react";
import { useObsidian } from "../lib/store";
import { INQUISITORS, DOCS, PROP_TEMPLATES, PROP_SLOGANS, SECTORS, TARGETS, OBS_FS } from "../lib/data";
import { esc, uid, bcastPoster } from "../lib/helpers";
import { Scramble, CountUp } from "./core";
import { audio } from "../lib/audio";

const sectorById = (id) => SECTORS.find((s) => s.id === id);
const targetById = (id) => TARGETS.find((t) => t.id === id);

/* ═══════════ INTERDICTION ═══════════ */
export function Interdiction() {
  const broadcasts = useObsidian((s) => s.broadcasts);
  const pushBroadcast = useObsidian((s) => s.pushBroadcast);
  const [tplId, setTplId] = useState(PROP_TEMPLATES[0].id);
  const [sec, setSec] = useState(SECTORS[0].name);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [poster, setPoster] = useState("");
  const [canSend, setCanSend] = useState(false);
  const compose = () => {
    const tpl = PROP_TEMPLATES.find((t) => t.id === tplId);
    const text = tpl.text.replace(/\{sector\}/g, sec);
    setComposing(true); setDraft(""); setCanSend(false);
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setDraft(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setComposing(false); setCanSend(true); }
    }, 8);
    setPoster(bcastPoster(PROP_SLOGANS[Math.floor(Math.random() * PROP_SLOGANS.length)], sec));
  };
  const transmit = () => {
    if (!canSend) return;
    pushBroadcast({ id: uid("b"), t: "CYCLE " + (2 + Math.floor(Math.random() * 8)) + " — " + Math.floor(Math.random() * 24) + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0"), txt: PROP_TEMPLATES.find((t) => t.id === tplId).name + " transmitted to " + sec + "." });
    toast(`TRANSMISSION SENT — SECTOR ${sec} NOW RECEIVING`);
    setDraft(""); setCanSend(false); setPoster("");
  };
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Interdiction <span className="accent">Division</span></h1><div className="page-sub">Counter-recruitment · Propaganda broadcast · Loyalty enforcement</div></div>
      </div>
      <div className="grid g-2 mb">
        <div className="panel">
          <div className="panel-head"><h3>BROADCAST STUDIO</h3><span className="tag badge badge-red">RECRUITMENT DISRUPTION</span></div>
          <div className="panel-body">
            <div className="field"><label>Propaganda template</label>
              <select value={tplId} onChange={(e) => { setTplId(e.target.value); setCanSend(false); setDraft(""); }}>
                {PROP_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select></div>
            <div className="field"><label>Target sector</label>
              <select value={sec} onChange={(e) => { setSec(e.target.value); setCanSend(false); setDraft(""); }}>
                {SECTORS.map((s) => <option key={s.id}>{s.name}</option>)}
              </select></div>
            <button className="btn btn-red" onClick={compose}><FileText size={14} /> COMPOSE TRANSMISSION</button>
            <div className="bcast-out mt">{draft || "SELECT A TEMPLATE AND SECTOR TO COMPOSE A SECTOR-WIDE TRANSMISSION."}{composing && <span className="typing-cursor" />}</div>
            {poster && <div className="mt" style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: poster }} />}
            <div className="mt" style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn" disabled={!canSend} onClick={transmit}><Play size={14} /> TRANSMIT TO {sec}</button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="panel">
            <div className="panel-head"><h3>BROADCAST LOG</h3><span className="tag">{broadcasts.length} TRANSMISSIONS</span></div>
            <div className="panel-body" style={{ maxHeight: 240, overflowY: "auto" }}>
              {[...broadcasts].reverse().map((b) => <div className="log-item" key={b.id}><span className="t">{b.t}</span> — {b.txt}</div>)}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><h3>RECRUITMENT INTERCEPTS</h3><span className="tag badge badge-green">NET PROTECTED</span></div>
            <div className="panel-body">
              <div className="grid g-4" style={{ marginBottom: 14 }}>
                {[{ v: 160, l: "INTERCEPTS" }, { v: 45, l: "TURNED AWAY" }, { v: 3000, l: "CITIZEN TIPS" }, { v: 14, l: "CELLS DESTROYED" }].map((s, i) => (
                  <div className="stat" key={i}><div className="stat-label">{s.l}</div><div className="stat-value" style={{ fontSize: 28 }}><CountUp value={s.v} /></div></div>
                ))}
              </div>
              <div className="log-item"><b>HIGHLIGHT:</b> Pledge drive on <b>TORVANE</b> produced 312 citizen reports in one cycle. Three suspected recruiters detained. The net holds.</div>
              <div className="log-item"><b>HIGHLIGHT:</b> Shadow Cell safehouse exposed via loyalty pledge cross-referencing. Two operatives captured.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════ COMMS ═══════════ */
export function Comms() {
  const comms = useObsidian((s) => s.comms);
  const pushMsg = useObsidian((s) => s.pushMsg);
  const [inqId, setInqId] = useState(INQUISITORS[0].id);
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [comms, typing]);
  const send = () => {
    const v = msg.trim(); if (!v) return;
    pushMsg({ who: "me", mine: true, text: v });
    setMsg(""); setTyping(true);
    setTimeout(() => {
      const inq = INQUISITORS.find((i) => i.id === inqId);
      pushMsg({ who: inqId, text: inq.replies[Math.floor(Math.random() * inq.replies.length)] });
      setTyping(false);
    }, 1100 + Math.random() * 900);
  };
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Inquisitor <span className="accent">Uplink</span></h1><div className="page-sub">Encrypted channel · End-to-end classified</div></div>
      </div>
      <div className="panel chat">
        <div className="panel-head">
          <h3>CHANNEL: INQUISITOR COUNCIL</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select value={inqId} onChange={(e) => setInqId(e.target.value)} style={{ background: "var(--bg2)", border: "1px solid var(--line2)", color: "var(--bone)", fontFamily: "var(--font-mono)", fontSize: 10, padding: "6px 10px", outline: "none" }}>
              {INQUISITORS.map((i) => <option key={i.id} value={i.id}>{i.name} — {i.callsign}</option>)}
            </select>
            <span className="badge badge-red">● ENCRYPTED</span>
          </div>
        </div>
        <div className="chat-log" ref={logRef}>
          {comms.map((m, i) => {
            if (m.who === "sys") return <div className="msg sys" key={i}>◈ {m.text}</div>;
            const inq = INQUISITORS.find((x) => x.id === m.who);
            return (
              <motion.div key={i} className={`msg ${m.mine ? "mine" : "them"}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="m-meta">{m.mine ? "YOU — OPERATIVE N-771" : (inq ? inq.name : "UNKNOWN") + " · " + (inq ? inq.callsign : "")}</div>
                {m.text}
              </motion.div>
            );
          })}
          {typing && <div className="msg sys typing">◈ INQUISITOR IS TYPING…</div>}
        </div>
        <div className="chat-input">
          <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="TYPE TRANSMISSION…" autoComplete="off" onKeyDown={(e) => e.key === "Enter" && send()} />
          <button className="btn btn-red" onClick={send}><Send size={14} /> SEND</button>
        </div>
      </div>
    </>
  );
}

/* ═══════════ ARCHIVE ═══════════ */
export function Archive() {
  const [docId, setDocId] = useState(DOCS[0].id);
  const d = DOCS.find((x) => x.id === docId);
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Imperial <span className="accent">Archive</span></h1><div className="page-sub">Official records · Restricted documents · Doctrine</div></div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "300px 1fr", gap: 18 }}>
        <div className="panel" style={{ alignSelf: "start" }}>
          <div className="panel-head"><h3>DOCUMENTS</h3><span className="tag">{DOCS.length} FILES</span></div>
          <div className="row-list">
            {DOCS.map((x) => (
              <div key={x.id} className="doc-list-item" onClick={() => setDocId(x.id)}>
                <div className="d-title">{x.title}</div>
                <div className="d-meta">{x.cls} · {x.date}</div>
              </div>
            ))}
          </div>
        </div>
        <motion.div key={docId} className="doc-reader" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          {d.cls === "TOP SECRET" ? <div className="stamp">TOP SECRET</div> : d.cls === "RESTRICTED" ? <div className="stamp" style={{ color: "var(--amber)", borderColor: "var(--amber)" }}>RESTRICTED</div> : null}
          <h2>{d.title}</h2>
          <div className="dr-meta">CLASSIFICATION: {d.cls} · ISSUED: {d.date} · OBSIDIAN RECORDS DIVISION</div>
          {d.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
          <div className="dr-meta" style={{ marginTop: 26 }}>— END OF DOCUMENT — · HUNT CONTINUES</div>
        </motion.div>
      </div>
    </>
  );
}

/* ═══════════ TERMINAL ═══════════ */
const TERM_C = { info: "c-ice", warn: "c-amber", error: "c-red", success: "c-green", dim: "c-dim", text: "c-steel", hi: "c-bone" };
export function TerminalView() {
  const [lines, setLines] = useState([
    { t: "OBSIDIAN MAINFRAME v1.0.0 — REMOTE SHELL OPEN", c: "info" },
    { t: "UPLINK ENCRYPTED · AES-7 · ZERO-KEY PROTOCOL", c: "info" },
    { t: "TYPE 'help' FOR COMMAND LIST · 'clear' TO RESET", c: "dim" },
  ]);
  const [path, setPath] = useState(["home"]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [lines]);
  const print = (t, c = "text") => setLines((l) => [...l, { t, c }]);
  const dir = (p) => { let c = OBS_FS; for (const k of p) c = c?.[k]; return c; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const handle = async (cmd) => {
    const [c0, ...args] = cmd.split(/\s+/);
    const a = args.join(" ");
    print(`OBSIDIAN:/${path.join("/")}> ${cmd}`, "dim");
    switch (c0.toLowerCase()) {
      case "help":
        print("AVAILABLE COMMANDS:", "hi");
        ["help — this list", "ls — list directory", "cd <dir> — change directory", "cat <file> — read a file", "scan <sector> — probe scan", "locate <id> — locate a target (kade, nyx, voss…)", "status — network status", "ping — uplink latency", "whoami — operative identity", "clear — reset console"].forEach((x) => print("  " + x));
        break;
      case "ls": {
        const d = dir(path);
        print(Object.keys(d || {}).map((k) => d[k] && typeof d[k] === "object" ? k + "/" : k).join("   "));
        break;
      }
      case "cd": {
        if (!a || a === "~" || a === "/") { setPath(["home"]); print("→ /home", "dim"); break; }
        const d = dir(path);
        if (d?.[a] && typeof d[a] === "object") { setPath([...path, a]); print("→ /" + [...path, a].join("/"), "dim"); }
        else print("ERROR: no such directory: " + a, "error");
        break;
      }
      case "cat": {
        const d = dir(path);
        if (d?.[a]) print(d[a]);
        else print("ERROR: no such file: " + a, "error");
        break;
      }
      case "scan": {
        const sec = SECTORS.find((s) => s.name.toLowerCase() === (a || "").toLowerCase()) || SECTORS[Math.floor(Math.random() * SECTORS.length)];
        print("SCANNING " + sec.name + "…", "info");
        await sleep(700);
        print("THERMAL SWEEP: " + (3 + Math.floor(Math.random() * 38)) + " SIGNATURES · JEDI MATCH: " + (Math.random() > 0.5 ? "NEGATIVE" : "POSITIVE — ESCALATE"), Math.random() > 0.5 ? "success" : "warn");
        print("PROBE COVERAGE: " + (60 + Math.floor(Math.random() * 39)) + "% · GARRISON: " + sec.garrison + " · THREAT: " + sec.threat + "/100");
        break;
      }
      case "locate": {
        const t = TARGETS.find((x) => x.name.split(" ")[0].toLowerCase() === (a || "").toLowerCase()) || targetById(a) || TARGETS[0];
        print("TARGET: " + t.name + " — " + t.epithet, "hi");
        print("REWARD: " + t.reward + " · THREAT: " + t.threat, "warn");
        print("LAST SEEN: " + t.lastSeen);
        print("STATUS: " + t.status, t.status.startsWith("DECEASED") ? "error" : "success");
        break;
      }
      case "status":
        print("OBSIDIAN NETWORK STATUS", "hi");
        print("  ACTIVE HUNTS ....... " + useObsidian.getState().ops.filter((o) => o.status === "ACTIVE").length);
        print("  SIGHTINGS .......... " + useObsidian.getState().sightings.length);
        print("  HOT SECTORS ........ " + SECTORS.filter((s) => s.status === "HOT").length, "warn");
        print("  INQUISITORS ........ " + INQUISITORS.length + " ONLINE", "success");
        print("  ENCRYPTION .......... AES-7 ACTIVE", "success");
        break;
      case "ping":
        for (let i = 0; i < 4; i++) { await sleep(220); print("probe-" + (1 + Math.floor(Math.random() * 9)) + ": time=" + (8 + Math.floor(Math.random() * 35)) + "ms  TTL=64  OK", "success"); }
        break;
      case "whoami":
        print("OPERATIVE N-771 · CLEARANCE ALPHA-7", "hi");
        print("DIVISION: JEDI APPREHENSION · LOYALTY: ABSOLUTE");
        break;
      case "clear":
        setLines([]);
        break;
      default:
        print("ERROR: unknown command '" + c0 + "'. Type 'help'.", "error");
    }
  };
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Imperial <span className="accent">Terminal</span></h1><div className="page-sub">Direct console access · OBSIDIAN mainframe · Operative N-771</div></div>
      </div>
      <div className="terminal">
        <div className="term-head"><div className="dots"><i /><i /><i /></div><span>OBSIDIAN://N-771</span><span>● SECURE</span></div>
        <div className="term-body" ref={bodyRef}>
          {lines.map((l, i) => <div key={i} className={"term-line " + (TERM_C[l.c] || "c-steel")} style={{ whiteSpace: "pre-wrap" }}>{l.t}</div>)}
          <div className="term-input"><span className="prompt">OBSIDIAN:/{path.join("/")}&gt;</span>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { const v = input.trim(); setInput(""); if (v) handle(v); } }} autoComplete="off" autoFocus spellCheck={false} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════ MANIFESTO ═══════════ */
export function Manifesto() {
  return (
    <div className="manifesto">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        <div className="mani-badge">INTERNAL DOCUMENT // LEVEL 4 CLEARANCE</div>
        <div className="mani-title">THE JEDI<br /><span className="red">LIED.</span></div>
      </motion.div>
      <div className="mani-body">
        <p className="hi"><Scramble text="They called themselves guardians. For a thousand years, the Order whispered into the ears of kings and councils — steering civilization toward its own narrow vision while the galaxy kneeled to their mysticism." /></p>
        <p><Scramble text="They told you the Force was a gift. They told you they served peace. Every word was a leash. Every temple a cage. And when the Emperor finally spoke the truth, they did not fight for the galaxy — they scattered like embers from a fire." /></p>
        <motion.div className="mani-quote" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
          <Scramble text="But embers still burn. And a single spark, left untended, can consume a world. Find the sparks. Stomp them out. And when the galaxy is dark and cold and quiet — only then will you know peace. My peace." />
          <span style={{ display: "block", marginTop: 14, fontSize: 11, letterSpacing: ".3em", color: "var(--red2)" }}>— THE EMPEROR</span>
        </motion.div>
        <p><Scramble text="OBSIDIAN exists because mercy is not a strategy. Every sector is watched. Every citizen is a sensor. Every whisper is a thread we can pull." /></p>
        <p className="hi"><Scramble text="The hunt is not a campaign. It is a condition of existence. The Empire does not stop hunting. The Empire simply is the hunt." /></p>
        <p style={{ color: "var(--dim)", fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase" }}>— END OF DOCUMENT — · THE HUNT NEVER ENDS</p>
      </div>
    </div>
  );
}

/* ═══════════ HUNT METRICS ═══════════ */
export function Metrics() {
  const [purged, setPurged] = useState(false);
  const blocks = [
    { v: 9, label: "JEDI TARGETS", d: "Psychoprofiled. Prioritized. Hunted." },
    { v: 10, label: "SECTORS COVERED", d: "From Torvane to Valdris." },
    { v: 6, label: "INQUISITORS ONLINE", d: "The Hound. The Surgeon. The Zealot." },
    { v: 11, label: "MODULES OPERATIONAL", d: "One nervous system." },
    { v: 100, label: "INTEL REPORTS", d: "Probe drops on demand.", suffix: "+" },
    { v: 0, label: "MERCY", d: "The Emperor decides." },
  ];
  useEffect(() => { const t = setTimeout(() => setPurged(true), 400); return () => clearTimeout(t); }, []);
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Hunt <span className="accent">Metrics</span></h1><div className="page-sub">Purge statistics · Sector indices · Network vitals</div></div>
      </div>
      <div className="stat-blocks" style={{ marginTop: 0 }}>
        {blocks.map((b, i) => (
          <motion.div key={i} className="stat-block" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
            <div className="sb-line" /><div className="sb-glow" />
            <div className="sb-val"><CountUp value={b.v} suffix={b.suffix || ""} /></div>
            <span className="sb-label">{b.label}</span>
            <p>{b.d}</p>
          </motion.div>
        ))}
      </div>
      <div className="panel mt">
        <div className="panel-head"><h3>PURGE COMPLETION</h3><span className="tag badge badge-red">DIRECTIVE 66</span></div>
        <div className="panel-body">
          <div style={{ height: 14, background: "var(--bg2)", border: "1px solid var(--line)", position: "relative", overflow: "hidden" }}>
            <motion.div style={{ height: "100%", background: "linear-gradient(90deg,var(--red3),var(--red2))", boxShadow: "0 0 16px rgba(255,42,68,.6)" }} initial={{ width: "0%" }} animate={{ width: purged ? "11%" : "0%" }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />
          </div>
          <div className="flex spread mt">
            <span className="mono" style={{ fontSize: 10, color: "var(--dim)", letterSpacing: ".2em" }}>CONFIRMED ELIMINATED: 1 OF 9</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--red2)", letterSpacing: ".2em" }}>{purged ? "11%" : "0%"}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════ STANDARDS ═══════════ */
export function Standards() {
  const swatches = [
    ["#050507", "OBSIDIAN BLACK — BASE"], ["#0b0b12", "PANEL"], ["#10101a", "PANEL RAISED"],
    ["#1e1e2e", "HAIRLINE"], ["#2a2a3e", "HAIRLINE HI"], ["#e8e4d8", "BONE — PRIMARY TEXT"],
    ["#8a8a94", "STEEL — SECONDARY"], ["#5a5a66", "DIM — META"], ["#e01e37", "IMPERIAL RED — ACTION"],
    ["#ff2a44", "CRIMSON GLOW — ALERT"], ["#7a0e1e", "RED DEEP — BORDERS"], ["#f4a300", "AMBER — WARNING"],
    ["#3ddc84", "GREEN — POSITIVE"], ["#9fb4d8", "ICE — DATA"],
  ];
  return (
    <>
      <div className="section-head">
        <div><h1 className="page-title">Imperial <span className="accent">Standards</span></h1><div className="page-sub">Design system · Typography · Components — OBSIDIAN v1.0.0</div></div>
      </div>
      <div className="grid g-2 mb">
        <div className="panel">
          <div className="panel-head"><h3>COLOR — THE IRON PROTOCOL</h3><span className="tag">14 TOKENS</span></div>
          <div className="panel-body">
            <div className="grid g-4" style={{ gap: 8 }}>
              {swatches.map(([c, n]) => (
                <div key={c}>
                  <div className="swatch" style={{ background: c, border: "1px solid var(--line2)" }}>{c}</div>
                  <div className="mono" style={{ fontSize: 8.5, color: "var(--dim)", marginTop: 4, lineHeight: 1.4 }}>{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>TYPOGRAPHY</h3><span className="tag">3 FAMILIES</span></div>
          <div className="panel-body">
            <div className="type-spec"><div className="ts-label">CINZEL 900 · DISPLAY · 40PX</div><div style={{ fontSize: 40, letterSpacing: ".1em" }}>ORDER IS PEACE</div></div>
            <div className="type-spec"><div className="ts-label">CINZEL 700 · SECTION TITLES · 15PX</div><div style={{ fontSize: 15, letterSpacing: ".22em" }}>COMMAND DECK</div></div>
            <div className="type-spec"><div className="ts-label">RAJDHANI 600 · UI · 13PX</div><div style={{ fontSize: 15, letterSpacing: ".14em", fontWeight: 600, textTransform: "uppercase" }}>Authenticate · Dispatch · Hunt</div></div>
            <div className="type-spec"><div className="ts-label">PLEX MONO 400 · DATA · 11PX</div><div style={{ fontSize: 11, letterSpacing: ".18em", color: "var(--steel)" }}>SIGHTING LOG // SECTOR 9 // 02:41:07</div></div>
          </div>
        </div>
      </div>
      <div className="grid g-2 mb">
        <div className="panel">
          <div className="panel-head"><h3>COMPONENTS</h3><span className="tag">PRIMARY SET</span></div>
          <div className="panel-body">
            <div className="comp-row"><button className="btn btn-red">PRIMARY ACTION</button><button className="btn">SECONDARY</button><button className="btn btn-ghost">GHOST</button><button className="btn btn-danger">DANGER</button><button className="btn btn-sm">SMALL</button></div>
            <div className="comp-row"><span className="badge badge-red">PRIORITY 1</span><span className="badge badge-amber">WATCH</span><span className="badge badge-green">CONTAINED</span><span className="badge badge-ice">INTEL</span><span className="badge">UNVERIFIED</span></div>
            <div className="comp-row"><div className="stat" style={{ minWidth: 160 }}><div className="stat-label">SAMPLE STAT</div><div className="stat-value red" style={{ fontSize: 30 }}>66</div></div></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>MOTION & TONE</h3><span className="tag">SPEC</span></div>
          <div className="panel-body" style={{ fontSize: 13.5, lineHeight: 1.9, color: "var(--steel)" }}>
            <b style={{ color: "var(--bone)" }}>Motion:</b> boots at 1750ms · blip pulses 1.8s · radar sweep 9s · shutter transitions 700ms · magnetic buttons 200ms spring.<br />
            <b style={{ color: "var(--bone)" }}>Tone:</b> absolute, institutional, merciless. Every screen communicates surveillance, order, and inevitability.<br />
            <b style={{ color: "var(--bone)" }}>Voice:</b> short declarative sentences. Data before adjectives. The Empire does not explain — it commands.<br />
            <b style={{ color: "var(--bone)" }}>Stack:</b> Next.js 15 · React 19 · Framer Motion · GSAP · Lenis · Three.js · Tailwind · Zustand.
          </div>
        </div>
      </div>
    </>
  );
}
