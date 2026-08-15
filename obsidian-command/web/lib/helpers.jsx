export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const uid = (p) => p + Math.random().toString(36).slice(2, 9);

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PATHS = {
  flame: (s, c) => `<path d="M${s*.5} ${s*.12}C${s*.62} ${s*.34} ${s*.74} ${s*.46} ${s*.72} ${s*.62}C${s*.7} ${s*.78} ${s*.58} ${s*.88} ${s*.5} ${s*.88}C${s*.42} ${s*.88} ${s*.3} ${s*.78} ${s*.28} ${s*.62}C${s*.26} ${s*.46} ${s*.38} ${s*.34} ${s*.5} ${s*.12}Z" fill="${c}" opacity=".85"/><path d="M${s*.5} ${s*.44}C${s*.56} ${s*.52} ${s*.6} ${s*.6} ${s*.58} ${s*.68}C${s*.56} ${s*.76} ${s*.5} ${s*.8} ${s*.5} ${s*.8}C${s*.5} ${s*.8} ${s*.44} ${s*.76} ${s*.42} ${s*.68}C${s*.4} ${s*.6} ${s*.44} ${s*.52} ${s*.5} ${s*.44}Z" fill="#050507"/>`,
  shield: (s, c) => `<path d="M${s*.5} ${s*.1} L${s*.84} ${s*.22} V${s*.52} Q${s*.84} ${s*.78} ${s*.5} ${s*.9} Q${s*.16} ${s*.78} ${s*.16} ${s*.52} V${s*.22} Z" fill="none" stroke="${c}" stroke-width="${s*.06}"/><path d="M${s*.5} ${s*.22} V${s*.78}" stroke="${c}" stroke-width="${s*.04}"/><path d="M${s*.34} ${s*.34} H${s*.66} M${s*.34} ${s*.46} H${s*.66} M${s*.34} ${s*.58} H${s*.6}" stroke="${c}" stroke-width="${s*.035}" stroke-linecap="round"/>`,
  wind: (s, c) => `<path d="M${s*.14} ${s*.4} H${s*.6} Q${s*.78} ${s*.4} ${s*.78} ${s*.5} Q${s*.78} ${s*.6} ${s*.6} ${s*.6} H${s*.3}" fill="none" stroke="${c}" stroke-width="${s*.05}" stroke-linecap="round"/><path d="M${s*.22} ${s*.62} H${s*.52} Q${s*.68} ${s*.62} ${s*.68} ${s*.7} Q${s*.68} ${s*.78} ${s*.52} ${s*.78} H${s*.36}" fill="none" stroke="${c}" stroke-width="${s*.05}" stroke-linecap="round"/><circle cx="${s*.62}" cy="${s*.32}" r="${s*.07}" fill="${c}"/>`,
  scroll: (s, c) => `<rect x="${s*.28}" y="${s*.14}" width="${s*.44}" height="${s*.72}" fill="none" stroke="${c}" stroke-width="${s*.05}"/><path d="M${s*.28} ${s*.22} H${s*.72} M${s*.28} ${s*.34} H${s*.72} M${s*.28} ${s*.46} H${s*.72} M${s*.28} ${s*.58} H${s*.6}" stroke="${c}" stroke-width="${s*.035}" stroke-linecap="round"/><circle cx="${s*.7}" cy="${s*.72}" r="${s*.05}" fill="${c}"/>`,
  bolt: (s, c) => `<path d="M${s*.56} ${s*.12} L${s*.34} ${s*.54} H${s*.48} L${s*.42} ${s*.88} L${s*.66} ${s*.44} H${s*.52} Z" fill="${c}"/>`,
  shade: (s, c) => `<circle cx="${s*.5}" cy="${s*.5}" r="${s*.34}" fill="none" stroke="${c}" stroke-width="${s*.05}"/><path d="M${s*.5} ${s*.16} A${s*.34} ${s*.34} 0 0 0 ${s*.5} ${s*.84} Z" fill="${c}" opacity=".7"/><circle cx="${s*.5}" cy="${s*.44}" r="${s*.05}" fill="#050507"/>`,
  staff: (s, c) => `<path d="M${s*.36} ${s*.14} V${s*.86}" stroke="${c}" stroke-width="${s*.05}" stroke-linecap="round"/><circle cx="${s*.36}" cy="${s*.26}" r="${s*.09}" fill="${c}"/><path d="M${s*.44} ${s*.78} H${s*.6} V${s*.66} H${s*.44} Z" fill="${c}"/><path d="M${s*.5} ${s*.86} H${s*.66} V${s*.74} H${s*.5} Z" fill="${c}" opacity=".6"/>`,
  eye: (s, c) => `<path d="M${s*.14} ${s*.5} Q${s*.5} ${s*.26} ${s*.86} ${s*.5} Q${s*.5} ${s*.74} ${s*.14} ${s*.5} Z" fill="none" stroke="${c}" stroke-width="${s*.05}"/><circle cx="${s*.5}" cy="${s*.5}" r="${s*.12}" fill="${c}"/><circle cx="${s*.5}" cy="${s*.5}" r="${s*.045}" fill="#050507"/>`,
  blade: (s, c) => `<path d="M${s*.5} ${s*.12} L${s*.56} ${s*.5} L${s*.5} ${s*.88} L${s*.44} ${s*.5} Z" fill="${c}"/><path d="M${s*.24} ${s*.6} L${s*.4} ${s*.56} M${s*.76} ${s*.6} L${s*.6} ${s*.56}" stroke="${c}" stroke-width="${s*.04}" stroke-linecap="round"/>`,
};

export function sigilMark(type, color, size = 88) {
  const s = size, c = color;
  const d = PATHS[type] || PATHS.flame;
  const ring = `<circle cx="${s/2}" cy="${s/2}" r="${s*.42}" fill="none" stroke="#2a2a3e" stroke-width="${s*.03}"/>`;
  return `<svg class="p-sigil" viewBox="0 0 ${s} ${s}" aria-hidden="true">${ring}${d(s, c)}</svg>`;
}

export function posterSVG(t, { huge = false } = {}) {
  const w = huge ? 620 : 215, h = huge ? 820 : 300;
  const sig = sigilMark(t.sigil, t.color, huge ? 180 : 90);
  const stars = [];
  const rnd = mulberry32(t.id.length * 97 + 13);
  for (let i = 0; i < 40; i++) stars.push(`<circle cx="${rnd()*w}" cy="${rnd()*h}" r="1" fill="#3a3a46" opacity="${.2+rnd()*.5}"/>`);
  const rot = t.sigil === "bolt" ? 0 : (t.id.length % 5) * 7 - 14;
  return `<svg class="print-poster" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="background:radial-gradient(ellipse at 50% 28%,#141420,#07070c)">
    <defs><linearGradient id="lg${t.id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e01e37"/><stop offset="1" stop-color="#7a0e1e"/></linearGradient></defs>
    ${stars.join("")}
    <rect x="${w*.04}" y="${h*.04}" width="${w*.92}" height="${h*.92}" fill="none" stroke="#2a2a3e" stroke-width="2"/>
    <rect x="${w*.055}" y="${h*.055}" width="${w*.89}" height="${h*.89}" fill="none" stroke="#1e1e2e" stroke-width="1"/>
    <text x="${w/2}" y="${h*.13}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?34:13}" font-weight="900" letter-spacing="${huge?10:4}" fill="#e8e4d8">WANTED</text>
    <text x="${w/2}" y="${h*.175}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?11:4.5}" letter-spacing="${huge?5:2}" fill="#8a8a94">IMPERIAL SECURITY BUREAU — SECTOR WARRANT</text>
    <g transform="translate(${w/2} ${h*.29}) rotate(${rot})" opacity=".96">${sig.replace('class="p-sigil"', "")}</g>
    <text x="${w/2}" y="${h*.47}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?30:11.5}" font-weight="700" letter-spacing="${huge?8:3}" fill="#e8e4d8">${t.name}</text>
    <text x="${w/2}" y="${h*.505}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?15:6}" letter-spacing="${huge?6:2.5}" fill="${t.color}">${t.epithet}</text>
    <line x1="${w*.2}" y1="${h*.545}" x2="${w*.8}" y2="${h*.545}" stroke="url(#lg${t.id})" stroke-width="${huge?3:1}"/>
    <text x="${w/2}" y="${h*.595}" text-anchor="middle" font-family="monospace" font-size="${huge?14:5.5}" fill="#f4a300">REWARD ${t.reward} CREDITS</text>
    <text x="${w/2}" y="${h*.635}" text-anchor="middle" font-family="monospace" font-size="${huge?10:4}" letter-spacing="${huge?3:1}" fill="#8a8a94">LAST SEEN: ${t.lastSeen}</text>
    <text x="${w/2}" y="${h*.665}" text-anchor="middle" font-family="monospace" font-size="${huge?10:4}" letter-spacing="${huge?3:1}" fill="#8a8a94">THREAT LEVEL: ${t.threat}</text>
    <rect x="${w*.3}" y="${h*.7}" width="${w*.4}" height="${huge?26:10}" fill="none" stroke="#e01e37" stroke-width="${huge?2:1}"/>
    <text x="${w/2}" y="${h*.718}" text-anchor="middle" font-family="monospace" font-size="${huge?9:3.6}" fill="#e01e37" letter-spacing="${huge?2:1}">${t.status}</text>
    <text x="${w/2}" y="${h*.78}" text-anchor="middle" font-family="monospace" font-size="${huge?8:3.2}" fill="#5a5a66" letter-spacing="${huge?2:1}">DEAD OR ALIVE — THE EMPEROR DECIDES</text>
    <text x="${w/2}" y="${h*.92}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?13:5}" letter-spacing="${huge?6:2.5}" fill="#3a3a46">OBSIDIAN · IMPERIAL SECURITY NETWORK</text>
  </svg>`;
}

export function bcastPoster(slogan, sector) {
  return `<svg class="bcast-poster" viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" style="background:radial-gradient(ellipse at 50% 20%,#161620,#060609)">
    <defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e01e37"/><stop offset="1" stop-color="#7a0e1e"/></linearGradient></defs>
    <rect x="8" y="8" width="464" height="284" fill="none" stroke="#2a2a3e" stroke-width="1.5"/>
    <path d="M240 40 256 72 290 60 278 94 310 108 276 118 268 152 244 124 220 152 212 118 178 108 210 94 198 60 232 72z" fill="#e01e37" opacity=".9"/>
    <text x="240" y="180" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="30" letter-spacing="8" fill="#e8e4d8">${slogan}</text>
    <line x1="120" y1="200" x2="360" y2="200" stroke="url(#bg1)" stroke-width="2"/>
    <text x="240" y="228" text-anchor="middle" font-family="monospace" font-size="13" letter-spacing="4" fill="#8a8a94">IMPERIAL BROADCAST — SECTOR ${sector}</text>
    <text x="240" y="252" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="3" fill="#5a5a66">REPORT SUSPICIOUS ACTIVITY TO YOUR LOCAL GARRISON</text>
    <text x="240" y="278" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="6" fill="#3a3a46">OBSIDIAN · IMPERIAL SECURITY NETWORK</text>
  </svg>`;
}

export const TEAM = [
  { name: "ANUJ PHULERA", role: "DEVELOPER · AI · BACKEND", initials: "AP", bio: "The builder. Architects the engine that powers OBSIDIAN — from zero-latency systems to the AI that makes the hunt computable." },
  { name: "AARAV CHOUDHARY", role: "VISION · MARKETING · IDEAS", initials: "AC", bio: "The strategist. Saw the decay of the old order and decided to burn it down by imagining something absolute." },
  { name: "JEEHAAN KWATRA", role: "DESIGN · MEDIA · PITCH", initials: "JK", bio: "The image-maker. Forges the Empire's aesthetic — every pixel, every frame, every blade of the sigil." },
];
