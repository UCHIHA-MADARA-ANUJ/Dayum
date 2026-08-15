"use client";
import { create } from "zustand";
import { SEED_SIGHTINGS, SEED_INTEL, SEED_OPS, SEED_BROADCASTS } from "./data";

const load = (k, d) => {
  if (typeof window === "undefined") return d;
  try { const v = localStorage.getItem("obsidian." + k); return v ? JSON.parse(v) : d; } catch { return d; }
};
const save = (k, v) => { try { localStorage.setItem("obsidian." + k, JSON.stringify(v)); } catch {} };

const SYS_MSG = [{ who: "sys", text: "UPLINK ESTABLISHED — INQUISITOR CHANNEL SECURE. MESSAGES ARE ENCRYPTED END-TO-END." }];

export const useObsidian = create((set) => ({
  phase: "gate", // gate | boot | app
  view: "command",
  session: load("session", false),
  sightings: load("sightings", SEED_SIGHTINGS),
  intel: load("intel", SEED_INTEL),
  ops: load("ops", SEED_OPS),
  broadcasts: load("broadcasts", SEED_BROADCASTS),
  comms: load("comms", SYS_MSG),
  setPhase: (p) => set({ phase: p }),
  setView: (v) => set({ view: v }),
  setSession: (s) => { save("session", s); set({ session: s }); },
  pushSighting: (s) => set((st) => { const sightings = [...st.sightings, s]; save("sightings", sightings); return { sightings }; }),
  pushIntel: (i) => set((st) => { const intel = [...st.intel, i]; save("intel", intel); return { intel }; }),
  updateIntel: (id, patch) => set((st) => { const intel = st.intel.map((x) => (x.id === id ? { ...x, ...patch } : x)); save("intel", intel); return { intel }; }),
  pushOp: (o) => set((st) => { const ops = [...st.ops, o]; save("ops", ops); return { ops }; }),
  moveOp: (id, status) => set((st) => { const ops = st.ops.map((o) => (o.id === id ? { ...o, status } : o)); save("ops", ops); return { ops }; }),
  delOp: (id) => set((st) => { const ops = st.ops.filter((o) => o.id !== id); save("ops", ops); return { ops }; }),
  pushBroadcast: (b) => set((st) => { const broadcasts = [...st.broadcasts, b]; save("broadcasts", broadcasts); return { broadcasts }; }),
  pushMsg: (m) => set((st) => { const comms = [...st.comms, m]; save("comms", comms); return { comms }; }),
  resetAll: () => {
    ["sightings", "intel", "ops", "broadcasts", "comms", "session"].forEach((k) => localStorage.removeItem("obsidian." + k));
    set({ sightings: SEED_SIGHTINGS, intel: SEED_INTEL, ops: SEED_OPS, broadcasts: SEED_BROADCASTS, comms: SYS_MSG, session: false, phase: "gate", view: "command" });
  },
}));
