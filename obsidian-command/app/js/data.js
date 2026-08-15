/* ═══════════════════════════════════════════════════════════
   OBSIDIAN — data core
   All persons, places, and records are original creations of
   the OBSIDIAN universe. No canon characters are referenced.
   ═══════════════════════════════════════════════════════════ */
"use strict";

const OBS = {
  version: "1.0.0",
  passphrase: "FOR THE EMPIRE",
  operative: "N-771",
  clearance: "ALPHA-7"
};

/* ── SECTORS ─────────────────────────────────────────── */
const SECTORS = [
  { id:"torvane",  name:"TORVANE",   status:"HOT",      garrison:"12TH LEGION",  threat:92, note:"Jedi activity confirmed. Urban sprawl provides ideal cover. Sector sealed at checkpoints 4-9." },
  { id:"myrrah",   name:"MYRRAH",    status:"HOT",      garrison:"7TH LEGION",   threat:84, note:"Trade route nexus. Recruit smuggling suspected through dock district." },
  { id:"velaros",  name:"VELAROS",   status:"WATCH",    garrison:"3RD LEGION",   threat:61, note:"Mining colony. Signal anomalies reported near ridge settlements." },
  { id:"ostrak",   name:"OSTRAK",    status:"WATCH",    garrison:"19TH LEGION",  threat:58, note:"Archive world. Temple records partially intact — priority recovery." },
  { id:"hearth",   name:"HEARTH",    status:"SCAN",     garrison:"5TH LEGION",   threat:44, note:"Agricultural world. Low traffic. Probe coverage at 60%." },
  { id:"kess",     name:"KESS",      status:"HOT",      garrison:"2ND LEGION",   threat:79, note:"Moon of Ostrak. Dense shadow-side settlements. Inquisitor presence recommended." },
  { id:"bellhaven",name:"BELLHAVEN", status:"SCAN",     garrison:"9TH LEGION",   threat:37, note:"Medical world. Refugee processing centers active. Vet all arrivals." },
  { id:"nyxaris",  name:"NYXARIS",   status:"WATCH",    garrison:"14TH LEGION",  threat:55, note:"Orbital habitat ring. Difficult to patrol. Customs compromised twice." },
  { id:"dorn",     name:"DORN",      status:"CLEAN",    garrison:"22ND LEGION",  threat:18, note:"Fortress world. Loyalist population. Routine sweeps only." },
  { id:"valdris",  name:"VALDRIS",   status:"HOT",      garrison:"8TH LEGION",   threat:88, note:"Hive world. Criminal networks shelter fugitives for profit. Root them out." }
];

/* ── JEDI TARGETS ────────────────────────────────────── */
const TARGETS = [
  {
    id:"kade", name:"SOLENNE KADE", epithet:"THE EMBER", threat:"EXTREME", threatN:5,
    reward:"500,000", lastSeen:"TORVANE — 6 DAYS AGO", status:"PRIORITY 1",
    abilities:["Thermal projection","Blade ignition from ambient heat","Berserk states under grief"],
    associates:["Kaelen Rook (deceased)","Unnamed initiates, believed dead"],
    notes:"Former master of the Torvane enclave. Sustained two burns during the purge and fled with an armory crate. Psychoprofile predicts she will fight to the death rather than surrender. Approach with heavy support.",
    sigil:"flame", color:"#ff2a44"
  },
  {
    id:"voss", name:"DRAYVEN VOSS", epithet:"THE UNBROKEN", threat:"HIGH", threatN:4,
    reward:"350,000", lastSeen:"MYRRAH — 12 DAYS AGO", status:"PRIORITY 1",
    abilities:["Battle meditation","Blade deflection mastery","Pain suppression"],
    associates:["Mira Elluin (confirmed)","Dock workers' union, Myrrah"],
    notes:"Knight who shielded an enclave evacuation alone. Multiple confirmed kills of stormtrooper squads. Revered by survivors — his capture would be a propaganda victory of the highest order.",
    sigil:"shield", color:"#f4a300"
  },
  {
    id:"elluin", name:"MIRA ELLUIN", epithet:"THE WHISPER", threat:"MODERATE", threatN:3,
    reward:"200,000", lastSeen:"VELAROS — 4 DAYS AGO", status:"PRIORITY 2",
    abilities:["Invisibility of presence","Lock manipulation","Voice mimicry"],
    associates:["Drayven Voss (confirmed)","Unknown courier network"],
    notes:"Padawan who disappeared during the first wave. Small, fast, and nearly impossible to track by conventional means. Recruit intelligence suggests she moves refugees — intercept the routes, intercept her.",
    sigil:"wind", color:"#9fb4d8"
  },
  {
    id:"vale", name:"IDRIS VALE", epithet:"THE ARCHIVIST", threat:"HIGH", threatN:4,
    reward:"450,000", lastSeen:"OSTRAK — 21 DAYS AGO", status:"PRIORITY 1",
    abilities:["Precognitive flashes","Memory transference","Old-language encryption"],
    associates:["Seraphine Nyx (suspected)","Temple record keepers"],
    notes:"Master who emptied the enclave archives before the purge. The records he carries could identify every surviving lineage. The Emperor has taken a personal interest. Do not kill. Capture intact.",
    sigil:"scroll", color:"#f4a300"
  },
  {
    id:"rook", name:"KAELEN ROOK", epithet:"THE STORMCALLER", threat:"EXTREME", threatN:5,
    reward:"400,000", lastSeen:"HEARTH — 30 DAYS AGO", status:"DECEASED — CONFIRMED",
    abilities:["Electrokinesis","Weather sense","Twin-blade form"],
    associates:["Solenne Kade (former master)"],
    notes:"Killed by Inquisitor Marrow in the Hearth grain fields. Body recovered and displayed at sector capital. Morale impact on survivors: severe. Further sightings are impostors or ghosts.",
    sigil:"bolt", color:"#ff2a44"
  },
  {
    id:"nyx", name:"SERAPHINE NYX", epithet:"THE SHADE", threat:"HIGH", threatN:4,
    reward:"500,000", lastSeen:"KESS — 2 DAYS AGO", status:"PRIORITY 1",
    abilities:["Shadow melding","Silent movement","Fear projection"],
    associates:["Idris Vale (suspected)","Kess shadow settlements"],
    notes:"Knight who has killed two Inquisitors. Do not engage solo below squad strength. Her pattern suggests she is gathering a cell — this is our highest-priority disruption target.",
    sigil:"shade", color:"#ff2a44"
  },
  {
    id:"thorne", name:"ALDOUS THORNE", epithet:"THE SHEPHERD", threat:"MODERATE", threatN:3,
    reward:"350,000", lastSeen:"BELLHAVEN — 8 DAYS AGO", status:"PRIORITY 2",
    abilities:["Healing trance","Contagion immunity","Calming aura"],
    associates:["Refugee convoy operators"],
    notes:"Master healer working openly under a false identity in refugee camps. His capture would demonstrate Imperial mercy — staged trial, then public loyalty oath. Handlers to coordinate with ISB propaganda division.",
    sigil:"staff", color:"#9fb4d8"
  },
  {
    id:"varro", name:"TAMSIN VARRO", epithet:"THE PHANTOM", threat:"LOW", threatN:2,
    reward:"250,000", lastSeen:"NYXARIS — 16 DAYS AGO", status:"PRIORITY 3",
    abilities:["Premonition","Object telekinesis (minor)","Crisis intuition"],
    associates:["Unknown — believed orphaned"],
    notes:"Padawan, approximately sixteen standard years. Her premonition gift has kept her ahead of every sweep. Capture for indoctrination; the psychological division believes she can be turned.",
    sigil:"eye", color:"#f4a300"
  },
  {
    id:"merrik", name:"CASSIAN MERRIK", epithet:"THE RECLAIMER", threat:"HIGH", threatN:4,
    reward:"300,000", lastSeen:"DORN — 3 DAYS AGO", status:"PRIORITY 1",
    abilities:["Temple guard combat doctrine","Weapon mastery","Strategic planning"],
    associates:["Former temple guard cells","Dorn loyalist underground"],
    notes:"Former temple guard who turned on his oath. Understands Imperial tactics from the inside. His cell attempted to free prisoners at the Dorn processing center — nine died. Hunt without mercy.",
    sigil:"blade", color:"#ff2a44"
  }
];

/* ── INQUISITORS ─────────────────────────────────────── */
const INQUISITORS = [
  {
    id:"vex", name:"INQUISITOR VEX", callsign:"THE HOUND",
    bio:"Relentless tracker. Has not failed a hunt in three years.",
    replies:["The trail is still warm. Divert two squads to Torvane grid nine.","Her scent is all over the dock district. I want every cargo manifest for the last cycle.","Do not engage. Follow. I will be there within the hour.","The Ember fights alone now. Grief makes her predictable.","Patch me the survivor interviews. Somewhere in them is a lie."]
  },
  {
    id:"marrow", name:"INQUISITOR MARROW", callsign:"THE SURGEON",
    bio:"Interrogation specialist. Extracts confessions from stone.",
    replies:["Send me the next prisoner. I will have the truth by dawn.","The whisperer is not at Velaros. She left a decoy — we were meant to chase it.","My methods are efficient. Question them, not me.","Keep the cell quiet. I work best in silence.","The boy knows more than he says. Bring him to my chamber."]
  },
  {
    id:"cael", name:"INQUISITOR CAEL", callsign:"THE ZEALOT",
    bio:"Fanatically loyal. Leads purges from the front line.",
    replies:["The Force is a lie. Burn it out of them.","I will not rest until the last of them kneels or dies.","Give me Kess. I will deliver Nyx's head before the week ends.","Order the blockade. Let them starve in the shadows.","Every civilian who shelters a Jedi is an enemy of the Empire."]
  },
  {
    id:"nyxi", name:"INQUISITOR NYXI", callsign:"THE WHISPER",
    bio:"Former Jedi. Knows their every trick.",
    replies:["I know how they think. They will run to the shadows — so we cut the shadows.","Their signals are quieter than you think. Listen.","The Ember will return to Torvane. It is where her students died.","Trust nothing you see. They are masters of misdirection.","Leave the bait in the open. They cannot resist a rescue."]
  },
  {
    id:"dorn", name:"INQUISITOR DORN", callsign:"THE HAMMER",
    bio:"Direct, brutal, effective.",
    replies:["No subtlety. I find them, I break them.","Send coordinates. Squad strength: maximum.","The Reclaimer fights like a soldier. I will treat him like one.","Finished the raid. Seven dead, one captured. Reports follow.","I do not need your strategy. I need your firepower."]
  },
  {
    id:"silas", name:"INQUISITOR SILAS", callsign:"THE CALCULATOR",
    bio:"Predicts Jedi movement with probability models.",
    replies:["Model 7-B: the Archivist will surface within two cycles at Ostrak. Probability 0.82.","The Shade's pattern indicates three safehouses. I have triangulated two.","Send me the census data for Kess shadow settlements.","Random patrols are wasted effort. I will tell you where to stand.","Emotion is their weakness. Statistics are mine."]
  }
];

/* ── OPERATION CODED NAMES ───────────────────────────── */
const OP_NAMES = ["IRON HARVEST","COLD EMBER","NIGHTGLASS","BLACK LEDGER","SHATTERPOINT","VOIDWALK","CINDERFALL","LONG REACH","DEAD DROP","GRAVESIGHT","ASHENDALE","PALE FIRE","STATIC CROWN","HOLLOW CROWN","RED HARBOR","SILENT DOCTRINE"];

const SQUADS = ["1ST INQUISITORIAL","2ND INQUISITORIAL","7TH LEGION RAPID","12TH LEGION RAPID","ISB SHADOW CELL","PURGE COMMANDO","NIGHT WATCH","DORN GARRISON"];

/* ── INTEL TEMPLATES ─────────────────────────────────── */
const INTEL_TEMPLATES = [
  { src:"PROBE-9", txt:"Thermal signature detected in {sector} maintenance tunnels. {subject} believed present. Confidence: {conf}." },
  { src:"ISB AGENT", txt:"Source confirms {subject} receiving supplies from {sector} dock workers. Payments made in Imperial scrip — trace the serials." },
  { src:"INTERCEPT", txt:"Encrypted transmission intercepted near {sector}. Code matches old temple ciphers. {subject} may be coordinating with unknown cell." },
  { src:"CITIZEN REPORT", txt:"Anonymous report: {subject} seen aiding refugees at {sector} processing center. Verify before action." },
  { src:"PROBE-9", txt:"Movement anomaly in {sector} ridge region. Five heat signatures, one irregular gait — possible injured fugitive." },
  { src:"ISB AGENT", txt:"{subject} reportedly seeking passage off {sector}. All departures grounded for inspection." },
  { src:"INTERCEPT", txt:"Fragment recovered: '...the enclave is gone, but the children...' — origin {sector}. Indicates survivor network." },
  { src:"PROBE-9", txt:"Scorched ground and blade marks found at {sector} outpost. Combat within last 48 hours. {subject} suspected." },
  { src:"CITIZEN REPORT", txt:"Strange lights and 'humming' reported at {sector} ruins. Locals refuse to approach. Investigate." },
  { src:"ISB AGENT", txt:"Informant within {sector} refugee council reports secret meetings. Attendees leave with covered cargo." },
  { src:"INTERCEPT", txt:"Loyalty check message: 'The shepherds still watch the flock.' Sent from {sector}. Code phrase matches Jedi contact protocol." },
  { src:"PROBE-9", txt:"Atmospheric disturbance in {sector} — possible energy weapon discharge. Grid pattern suggests trained wielder." }
];

const INTEL_CONF = ["UNVERIFIED","POSSIBLE","LIKELY","CONFIRMED"];

/* ── PROPAGANDA TEMPLATES ────────────────────────────── */
const PROP_TEMPLATES = [
  { id:"pledge", name:"LOYALTY PLEDGE DRIVE", text:"Citizens of {sector}: the war is over. The Jedi Order was a lie — a conspiracy of sorcerers who hoarded power while your children starved. The Emperor brings order. The Emperor brings peace. Sign the loyalty pledge at your sector hall and receive full amnesty. Those who shelter traitors will share their fate. Choose wisely. Choose the Empire." },
  { id:"amnesty", name:"AMNESTY PROCLAMATION", text:"To any former Jedi hearing this broadcast: the Emperor is merciful. Surrender yourself at any Imperial installation and your life will be spared. Remain in hiding, and you will be hunted to the ends of the galaxy. The choice is yours. The hunt is ours." },
  { id:"suspicion", name:"SUSPICION CAMPAIGN", text:"Neighbors of {sector}: look closer. The family next door. The quiet one at the market. The stranger who asks too many questions. Jedi hide among you — and those who hide them are traitors too. Report suspicions to the nearest garrison. Silence is complicity. The Empire is watching." },
  { id:"order", name:"ORDER & PROSPERITY", text:"Since the purge, crime in {sector} has fallen 40%. Food lines are shorter. The stars burn brighter. This is the peace the Emperor promised — the peace the Jedi denied you. Protect it. Report the fugitives. Build the future." },
  { id:"children", name:"FOR THE CHILDREN", text:"Parents of {sector}: the Jedi stole children. They tore infants from their families and raised them as weapons. Every Jedi in hiding is a reminder of that theft. Help us bring them to justice — for your children, and for the galaxy's future." },
  { id:"final", name:"FINAL WARNING", text:"This is the final warning for {sector}. Harboring Jedi is high treason. Harboring Jedi is death. The legions are at your gates. The Inquisition walks your streets. Surrender the fugitives and live. The clock is ticking." }
];

const PROP_SLOGANS = ["ORDER IS PEACE.","LOYALTY IS SURVIVAL.","THE EMPEROR SEES ALL.","THE HUNT NEVER ENDS.","REPORT. PROTECT. PROSPER.","THE JEDI LIED.","ONE EMPIRE. ONE WILL.","SILENCE IS COMLICITY."];

/* ── ARCHIVE DOCUMENTS ───────────────────────────────── */
const DOCS = [
  {
    id:"directive66", title:"DIRECTIVE 66 — THE FINAL ORDER", cls:"TOP SECRET", date:"SECTOR 1, CYCLE 19",
    body:`By order of the Emperor, the Jedi Order is declared an enemy of the state. All members, acolytes, sympathizers, and affiliates are subject to immediate apprehension or termination.

The Order has grown arrogant. It believes itself above the law, above the Emperor, above the galaxy itself. For a thousand years it whispered into the ears of kings and councils, steering civilization toward its own narrow vision. No more.

Execute the directive without hesitation. No trial. No appeal. The law of the Empire is the will of the Emperor, and the will of the Emperor is absolute. Those who hesitate will be judged alongside the traitors they fail to stop.

The purge begins today. It ends when the last of them is ash.`
  },
  {
    id:"exile", title:"THE EXILE PROTOCOL", cls:"RESTRICTED", date:"SECTOR 1, CYCLE 21",
    body:`The initial purge has succeeded beyond projections. Survivors number in the hundreds — scattered, broken, and leaderless. Do not mistake their weakness for safety.

Survivors will seek: remote worlds, lawless ports, agricultural colonies, and the ruins of their own temples. They will travel in disguise, in small groups, and alone. They will change names, faces, and loyalties.

The Exile Protocol therefore mandates: (1) seal all major transit hubs; (2) infiltrate refugee networks; (3) offer amnesty as bait — the desperate will bite; (4) publicly execute one captured Jedi per sector per cycle, to remind the galaxy of the cost of resistance.

The hunt is not a campaign. It is a condition of existence. The Empire does not stop hunting. The Empire simply is the hunt.`
  },
  {
    id:"sects", title:"ON THE JEDI SECTS", cls:"RESTRICTED", date:"SECTOR 2, CYCLE 3",
    body:`Intelligence summary on surviving Jedi factions:

THE EMBER CELL — Torvane. Solenne Kade, possibly Kaelen Rook. Aggressive, grief-driven, likely to strike garrisons. Priority: elimination.

THE ARCHIVISTS — Ostrak. Idris Vale. Non-combatants carrying records of all lineages. Priority: capture, intact.

THE SHEPHERDS — Bellhaven corridor. Aldous Thorne. Humanitarian cover network moving through refugee camps. Priority: infiltration and dismantlement.

THE SHADOW CELL — Kess. Seraphine Nyx. Assassins. Two Inquisitors lost. Priority: maximum.

The sects believe themselves hidden. Let them believe. Every whisper they make is a thread we can pull.`
  },
  {
    id:"address", title:"EMPEROR'S ADDRESS TO THE LEGIONS", cls:"PUBLIC RECORD", date:"SECTOR 1, CYCLE 20",
    body:`Soldiers of the Empire. You have done what a thousand years of councils could not. You have freed the galaxy from its secret masters.

They told you the Force was a gift. They told you the Jedi were guardians. They told you many things, and every one of them was a lie that kept you small and them mighty.

Now the galaxy is yours. The stars belong to those who built them. Your children will grow up in an Empire that does not kneel to mystics — an Empire that answers only to order, to strength, to me.

The Jedi thought they were beyond death. Show them otherwise. Hunt them. Break them. And when the last one falls, build a monument to the day the galaxy stood up and said: no more.`
  },
  {
    id:"doctrine", title:"THE OBSIDIAN DOCTRINE", cls:"TOP SECRET", date:"SECTOR 2, CYCLE 7",
    body:`OBSIDIAN is not a tool. It is a doctrine.

Its purpose is total: locate, track, and terminate every remnant of the Jedi Order, and prevent the Order from ever reforming. Recruitment is the Order's lifeblood — therefore recruitment is our first target. A Jedi who cannot recruit is a Jedi who dies alone.

Principles:
I. Information before action. Every strike is guided by intelligence.
II. The net is permanent. Patrols rotate; the hunt does not.
III. Every citizen is a sensor. Propaganda trains them; fear keeps them reporting.
IV. Mercy is a tactic, not a value. Grant it only when it serves the hunt.
V. The hunt ends only when the last ember is cold.

This doctrine is to be applied without exception and without mercy. The Emperor's will is the only law.`
  },
  {
    id:"manual", title:"INQUISITOR'S MANUAL — EXCERPT", cls:"RESTRICTED", date:"SECTOR 2, CYCLE 9",
    body:`On breaking a Jedi:

They are trained to feel. Use it. Show them hope, then take it. Show them a way out, then close it. The grief of capture is their first wound; the second is their doubt.

Interrogation is a conversation you control. The Force gives them glimpses of intent — so keep no intent. Think of weather. Think of ledgers. Think of nothing, and ask the question twice.

Never fight them where they choose. Choose the ground: narrow, loud, bright, without shadows. Their tricks need room to breathe. Deny them room.

And remember — the ones who resist longest are not the strongest. They are the ones who believe someone is still coming to save them. Break the belief. Break the Jedi.`
  },
  {
    id:"psych", title:"PSYCHOPROFILE — THE JEDI MIND", cls:"RESTRICTED", date:"SECTOR 2, CYCLE 11",
    body:`Analysis of captured subjects yields a consistent profile:

Jedi survivors exhibit extreme attachment to identity — they cling to their names, their lineages, their codes. This is their strength and their fault line. Strike at the identity and the will follows.

They will avoid harming civilians even at mortal cost. Exploit this without mercy. Hostages, crowds, and collateral threats are the most effective tools in the hunt.

They believe in redemption. This is the cruelest of their superstitions — and the most useful. A Jedi who believes an enemy can be saved will stay a hand. The Empire has no such belief. Remember this when your blade meets theirs.`
  }
];

/* ── TICKER LINES ────────────────────────────────────── */
const TICKER_LINES = [
  "ORDER IS PEACE — THE EMPEROR HAS BROUGHT PEACE TO THE GALAXY",
  "JEDI TRAITOR SOLENNE KADE REMAINS AT LARGE — REWARD 500,000",
  "SECTOR TORVANE UNDER MILITARY CURFEW — COMPLY OR BE DETAINED",
  "LOYALTY PLEDGE DRIVE EXTENDED IN MYRRAH — AMNESTY FOR THE LOYAL",
  "RECRUITMENT CELL DISMANTLED ON NYXARIS — SEVENTEEN ARRESTED",
  "THE INQUISITION IS WATCHING — REPORT SUSPICIOUS ACTIVITY",
  "SERPENTINE NYX DESIGNATED PRIORITY TARGET — DO NOT ENGAGE ALONE",
  "CITIZENS: THE JEDI LIED. THE EMPIRE DOES NOT.",
  "PROBE NETWORK EXPANDED — NO CORNER OF THE GALAXY IS UNSEEN",
  "TRIAL OF ALDOUS THORNE TO BE BROADCAST SECTOR-WIDE",
  "SURRENDER THE FUGITIVES. SHARE THEIR FATE. THE CHOICE IS YOURS.",
  "GLORY TO THE EMPEROR — GLORY TO THE LEGIONS"
];

/* ── SEED DATA ───────────────────────────────────────── */
const SEED_SIGHTINGS = [
  { id:"s1", sector:"torvane", target:"kade",  when:"2H AGO",  status:"CONFIRMED", x:0.32, y:0.41 },
  { id:"s2", sector:"myrrah",  target:"voss",  when:"9H AGO",  status:"CONFIRMED", x:0.56, y:0.34 },
  { id:"s3", sector:"velaros", target:"elluin",when:"26H AGO", status:"SUSPECTED", x:0.44, y:0.62 },
  { id:"s4", sector:"kess",    target:"nyx",   when:"3H AGO",  status:"CONFIRMED", x:0.68, y:0.55 },
  { id:"s5", sector:"ostrak",  target:"vale",  when:"2D AGO",  status:"SUSPECTED", x:0.22, y:0.68 },
  { id:"s6", sector:"bellhaven",target:"thorne",when:"5D AGO", status:"DISPUTED",  x:0.74, y:0.24 }
];

const SEED_INTEL = [
  { id:"i1", src:"PROBE-9", time:"1H AGO", status:"CONFIRMED", txt:"Thermal signature matched to Solenne Kade in Torvane maintenance tunnels, grid 9. Blade ignition residue confirmed." },
  { id:"i2", src:"ISB AGENT", time:"4H AGO", status:"LIKELY", txt:"Informant reports Drayven Voss negotiating passage with Myrrah dock workers. Payments made in Imperial scrip — serials under trace." },
  { id:"i3", src:"INTERCEPT", time:"7H AGO", status:"POSSIBLE", txt:"Encrypted transmission intercepted near Kess. Cipher fragments match old temple protocols. Possible Shadow Cell coordination." },
  { id:"i4", src:"CITIZEN REPORT", time:"11H AGO", status:"UNVERIFIED", txt:"Anonymous report: hooded figure aiding refugees at Bellhaven processing center. Healer's kit observed. Verify before action." },
  { id:"i5", src:"PROBE-9", time:"16H AGO", status:"DISPUTED", txt:"Movement anomaly in Ostrak archive ruins. Five signatures, one irregular gait. Conflicting scans — possible interference." },
  { id:"i6", src:"ISB AGENT", time:"22H AGO", status:"CONFIRMED", txt:"Recruitment cell dismantled on Nyxaris. Seventeen arrests. One escapee matching Padawan Varro's description." }
];

const SEED_OPS = [
  { id:"o1", name:"IRON HARVEST", target:"kade",   sector:"torvane", squad:"1ST INQUISITORIAL", pri:1, status:"ACTIVE",    note:"Stalking protocol active. Awaiting Inquisitor Vex." },
  { id:"o2", name:"NIGHTGLASS",   target:"nyx",    sector:"kess",    squad:"ISB SHADOW CELL",   pri:1, status:"ACTIVE",    note:"Triangulating second safehouse." },
  { id:"o3", name:"BLACK LEDGER", target:"voss",   sector:"myrrah",  squad:"7TH LEGION RAPID",  pri:2, status:"PLANNING",  note:"Dock manifests being traced." },
  { id:"o4", name:"COLD EMBER",   target:"kade",   sector:"torvane", squad:"12TH LEGION RAPID", pri:2, status:"PLANNING",  note:"Grid sweep scheduled next cycle." },
  { id:"o5", name:"SHATTERPOINT", target:"elluin", sector:"velaros", squad:"3RD LEGION",        pri:3, status:"PLANNING",  note:"Ridge settlements to be searched." },
  { id:"o6", name:"RED HARBOR",   target:"merrik", sector:"dorn",    squad:"PURGE COMMANDO",    pri:1, status:"ACTIVE",    note:"Cell located. Strike imminent." },
  { id:"o7", name:"VOIDWALK",     target:"nyx",    sector:"kess",    squad:"2ND LEGION",        pri:2, status:"CONTAINED", note:"Safehouse seized. Target escaped." },
  { id:"o8", name:"PALE FIRE",    target:"rook",   sector:"hearth",  squad:"5TH LEGION",        pri:3, status:"CONTAINED", note:"Target confirmed deceased." }
];

const SEED_BROADCASTS = [
  { id:"b1", t:"CYCLE 2 — 08:00", txt:"Loyalty pledge drive opened across Torvane. 12,000 pledges in the first cycle." },
  { id:"b2", t:"CYCLE 2 — 14:00", txt:"Suspicion campaign aired in Myrrah dock district. Tip line volume up 340%." },
  { id:"b3", t:"CYCLE 3 — 06:00", txt:"Public execution of captured Jedi broadcast sector-wide. Attendance: 98% of eligible citizens." }
];

/* ── HELPERS ─────────────────────────────────────────── */
const R = {
  uid: (p) => p + Math.random().toString(36).slice(2, 9),
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  pickN: (arr, n) => { const c = [...arr]; const out = []; while (out.length < n && c.length) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return out; },
  int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

function targetById(id){ return TARGETS.find(t => t.id === id); }
function sectorById(id){ return SECTORS.find(s => s.id === id); }
function opName(){ let n = R.pick(OP_NAMES); while (OPS.some(o => o.name === n)) n = R.pick(OP_NAMES); return n; }

/* ── STORE ───────────────────────────────────────────── */
const Store = {
  get(k, d){ try { const v = localStorage.getItem("obsidian." + k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("obsidian." + k, JSON.stringify(v)); } catch(e){} }
};

let SIGHTINGS, INTEL, OPS, BROADCASTS, COMMS;
function loadStore(){
  SIGHTINGS = Store.get("sightings", SEED_SIGHTINGS);
  INTEL     = Store.get("intel", SEED_INTEL);
  OPS       = Store.get("ops", SEED_OPS);
  BROADCASTS= Store.get("broadcasts", SEED_BROADCASTS);
  COMMS     = Store.get("comms", [{ who:"sys", text:"UPLINK ESTABLISHED — INQUISITOR CHANNEL SECURE. MESSAGES ARE ENCRYPTED END-TO-END." }]);
  if (!Store.get("booted", false)) { Store.set("booted", true); }
}
function saveStore(){
  Store.set("sightings", SIGHTINGS);
  Store.set("intel", INTEL);
  Store.set("ops", OPS);
  Store.set("broadcasts", BROADCASTS);
  Store.set("comms", COMMS);
}
