#!/usr/bin/env python3
"""OBSIDIAN PITCH DECK v3 — investor-grade narrative structure.
Problem → Solution → Why Now → Product → Proof → Competition → Craft → Team → Roadmap → Close.
13 slides, one idea per slide, no screenshots."""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "..", "deliverables", "deck")
os.makedirs(OUT, exist_ok=True)
REND = os.path.join(BASE, "..", "deliverables", "renders")

# ── palette (60-30-10: black surfaces, bone text, red accent) ──
BLACK = RGBColor(0x06, 0x06, 0x0a)
INK = RGBColor(0x0b, 0x0b, 0x12)      # panel
INK2 = RGBColor(0x11, 0x11, 0x1c)     # panel raised
HAIR = RGBColor(0x22, 0x22, 0x34)     # hairline
HAIR2 = RGBColor(0x33, 0x33, 0x4a)
RED = RGBColor(0xe0, 0x1e, 0x37)
RED2 = RGBColor(0xff, 0x2a, 0x44)
BONE = RGBColor(0xea, 0xe6, 0xda)
STEEL = RGBColor(0x94, 0x94, 0xa2)
DIM = RGBColor(0x5e, 0x5e, 0x6e)
FAINT = RGBColor(0x3a, 0x3a, 0x4a)
AMBER = RGBColor(0xf4, 0xa3, 0x00)
GREEN = RGBColor(0x3d, 0xdc, 0x84)
ICE = RGBColor(0x9f, 0xb4, 0xd8)

SERIF = "Georgia"
MONO = "Consolas"

SW, SH = Inches(13.333), Inches(7.5)
M = 0.9  # margin inches

prs = Presentation()
prs.slide_width = SW
prs.slide_height = SH
blank = prs.slide_layouts[6]

PAGE = [0]

def slide():
    PAGE[0] += 1
    s = prs.slides.add_slide(blank)
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    bg.fill.solid(); bg.fill.fore_color.rgb = BLACK
    bg.line.fill.background(); bg.shadow.inherit = False
    return s

def rect(s, x, y, w, h, fill=None, line=None, lw=0.75):
    r = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill: r.fill.solid(); r.fill.fore_color.rgb = fill
    else: r.fill.background()
    if line: r.line.color.rgb = line; r.line.width = Pt(lw)
    else: r.line.fill.background()
    r.shadow.inherit = False
    return r

def oval(s, x, y, w, h, fill=None, line=None, lw=0.75):
    r = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill: r.fill.solid(); r.fill.fore_color.rgb = fill
    else: r.fill.background()
    if line: r.line.color.rgb = line; r.line.width = Pt(lw)
    else: r.line.fill.background()
    r.shadow.inherit = False
    return r

def line(s, x1, y1, x2, y2, color=HAIR, w=1.0):
    ln = s.shapes.add_connector(1, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.line.color.rgb = color; ln.line.width = Pt(w)
    ln.shadow.inherit = False
    return ln

def txt(s, x, y, w, h, text, size=14, color=BONE, bold=False, font=SERIF, align=PP_ALIGN.LEFT, spacing=1.0, italic=False):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True; tf.vertical_anchor = MSO_ANCHOR.TOP
    for i, ln in enumerate(text.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align; p.line_spacing = spacing
        r = p.add_run(); r.text = ln
        r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
        r.font.color.rgb = color; r.font.name = font
    return tb

def kicker(s, text):
    txt(s, M, 0.55, 8, 0.3, text.upper(), 10, RED2, True, MONO, spacing=1.0)
    line(s, M, 1.0, M + 0.55, 1.0, RED, 2)

def title(s, text, accent=None):
    txt(s, M, 1.15, 11.5, 0.8, text, 34, BONE, True, SERIF)
    if accent:
        txt(s, M, 1.75, 11.5, 0.6, accent, 34, RED2, True, SERIF)

def foot(s, section):
    line(s, M, 7.05, 12.43, 7.05, HAIR, 0.75)
    txt(s, M, 7.12, 6, 0.25, "OBSIDIAN · " + section.upper(), 7.5, FAINT, False, MONO)
    txt(s, 11.3, 7.12, 1.13, 0.25, f"{PAGE[0]:02d}", 8, DIM, False, MONO, PP_ALIGN.RIGHT)

def chip(s, x, y, w, h, label, accent=False, size=8.5, fill=None):
    rect(s, x, y, w, h, fill=fill or (RGBColor(0x16,0x0a,0x10) if accent else INK), line=RED if accent else HAIR2, lw=0.75)
    txt(s, x, y + h/2 - 0.12, w, 0.3, label, size, BONE if accent else STEEL, False, MONO, PP_ALIGN.CENTER)

def icon_sigil(s, cx, cy, d, fill=RED):
    st = s.shapes.add_shape(MSO_SHAPE.STAR_16_POINT, Inches(cx - d/2), Inches(cy - d/2), Inches(d), Inches(d))
    st.fill.solid(); st.fill.fore_color.rgb = fill; st.line.color.rgb = RED; st.line.width = Pt(1)
    st.shadow.inherit = False
    oval(s, cx - d*0.13, cy - d*0.13, d*0.26, d*0.26, fill=None, line=BONE, lw=1.2)
    oval(s, cx - d*0.04, cy - d*0.04, d*0.08, d*0.08, fill=RED2)

def arrow(s, x1, y1, x2, y2, color=RED, w=1.5):
    ln = s.shapes.add_connector(1, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.line.color.rgb = color; ln.line.width = Pt(w)
    ln.shadow.inherit = False
    # arrowhead
    import math
    ang = math.atan2(y2 - y1, x2 - x1)
    hx, hy = x2 - 0.12 * math.cos(ang), y2 - 0.12 * math.sin(ang)
    a1 = s.shapes.add_shape(MSO_SHAPE.ISOCELES_TRIANGLE, Inches(hx - 0.05), Inches(hy - 0.045), Inches(0.12), Inches(0.09))
    a1.rotation = math.degrees(ang) + 90
    a1.fill.solid(); a1.fill.fore_color.rgb = color; a1.line.fill.background(); a1.shadow.inherit = False

def fit_img(path, x, y, maxw, maxh):
    iw, ih = Image.open(path).size
    r = min(maxw / iw, maxh / ih)
    return path, x + (maxw - iw * r) / 2, y + (maxh - ih * r) / 2, iw * r, ih * r

def bg_render(s, path, alpha=0.28):
    iw, ih = Image.open(path).size
    r = max(13.333 / iw, 7.5 / ih)
    s.shapes.add_picture(path, (13.333 - iw * r) / 2, (7.5 - ih * r) / 2, iw * r, ih * r)
    v = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    v.fill.solid(); v.fill.fore_color.rgb = BLACK
    v.line.fill.background(); v.shadow.inherit = False
    v.fill.transparency = int((1 - alpha) * 100)

# ═══════════ WIREFRAMES (clean, flat, professional) ═══════════
def wf_shell(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x07, 0x07, 0x0d), line=HAIR2, lw=1)
    rect(s, x, y, w * 0.16, h, fill=RGBColor(0x0a, 0x0a, 0x12), line=HAIR, lw=0.5)
    rect(s, x, y, w, h * 0.075, fill=RGBColor(0x0a, 0x0a, 0x12), line=HAIR, lw=0.5)
    txt(s, x + w * 0.02, y + h * 0.012, w * 0.3, h * 0.05, "OBSIDIAN", 7, BONE, True, SERIF)
    for i in range(4):
        ny = y + h * (0.105 + i * 0.085)
        rect(s, x + w * 0.014, ny, w * 0.13, h * 0.06, fill=RGBColor(0x18, 0x0c, 0x12) if i == 0 else None, line=RED if i == 0 else HAIR, lw=0.5)
    txt(s, x + w * 0.19, y + h * 0.045, w * 0.6, h * 0.08, "PAGE TITLE", 10, BONE, True, SERIF)

def wf_radar(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x06, 0x06, 0x0c), line=HAIR2, lw=1)
    for (cx, cy, cr, c) in [(0.30, 0.32, 0.11, RED), (0.48, 0.22, 0.09, RED), (0.34, 0.62, 0.08, AMBER), (0.62, 0.58, 0.08, AMBER), (0.76, 0.34, 0.07, RGBColor(0x3a, 0x3a, 0x46))]:
        g = oval(s, x + w * cx, y + h * cy, w * cr * 2, w * cr * 2, fill=c)
        g.fill.transparency = 80
    line(s, x + w * 0.5, y + h * 0.5, x + w * 0.5, y + h * 0.08, RED2, 1.2)
    for (bx, by, c) in [(0.36, 0.38, RED2), (0.52, 0.27, RED2), (0.40, 0.66, AMBER), (0.68, 0.62, AMBER)]:
        oval(s, x + w * bx - 0.04, y + h * by - 0.04, 0.08, 0.08, fill=c)
        oval(s, x + w * bx - 0.04, y + h * by - 0.04, 0.08, 0.08, fill=None, line=c, lw=0.5)
    rect(s, x + w * 0.7, y + h * 0.07, w * 0.27, h * 0.28, fill=RGBColor(0x0a, 0x0a, 0x12), line=HAIR2, lw=0.5)
    txt(s, x + w * 0.72, y + h * 0.09, w * 0.22, h * 0.05, "SIGHTING", 6.5, RED2, True, SERIF)
    for i in range(3):
        rect(s, x + w * 0.72, y + h * (0.16 + i * 0.055), w * 0.2, h * 0.03, fill=None, line=HAIR, lw=0.5)
    txt(s, x + w * 0.03, y + h * 0.9, w * 0.5, h * 0.06, "RADAR SWEEP · LIVE", 6, FAINT, False, MONO)

def wf_kanban(s, x, y, w, h):
    gap = w * 0.025
    cw = (w - gap * 3) / 4
    for i in range(4):
        cx = x + i * (cw + gap)
        rect(s, cx, y, cw, h, fill=RGBColor(0x08, 0x08, 0x0e), line=HAIR, lw=0.75)
        txt(s, cx + cw * 0.1, y + h * 0.05, cw * 0.8, h * 0.06, ["PLANNING", "ACTIVE", "CONTAINED", "FAILED"][i], 6, STEEL, False, MONO)
        for j in range(2 if i < 3 else 1):
            cy = y + h * (0.16 + j * 0.26)
            rect(s, cx + cw * 0.1, cy, cw * 0.8, h * 0.19, fill=RGBColor(0x0e, 0x0e, 0x16), line=HAIR2, lw=0.5)
            bar = rect(s, cx + cw * 0.1, cy, 0.04, h * 0.19, fill=RED if i == 1 else (AMBER if i == 0 else (GREEN if i == 2 else STEEL)))

def wf_term(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x04, 0x04, 0x0a), line=HAIR2, lw=1)
    txt(s, x + w * 0.04, y + h * 0.05, w * 0.6, h * 0.06, "OBSIDIAN MAINFRAME", 7, BONE, True, SERIF)
    for i, (t, c) in enumerate([("MOUNTING SECTOR MAPS ........ OK", GREEN), ("DECRYPTING CHANNELS ......... OK", GREEN), ("LOADING DOSSIERS ........... [9]", AMBER), ("OBSIDIAN:/home> cat targets.log", RED2), ("Kade.exe -> HUNTING [TORVANE]", STEEL)]):
        txt(s, x + w * 0.04, y + h * (0.17 + i * 0.12), w * 0.9, h * 0.1, t, 6.5, c, False, MONO)

def wf_chat(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x07, 0x07, 0x0d), line=HAIR2, lw=1)
    txt(s, x + w * 0.04, y + h * 0.05, w * 0.6, h * 0.06, "INQUISITOR UPLINK", 7, BONE, True, SERIF)
    for i, (mx, mw, mine) in enumerate([(0.05, 0.52, False), (0.43, 0.52, True), (0.05, 0.58, False)]):
        my = y + h * (0.17 + i * 0.17)
        m = rect(s, x + w * mx, my, w * mw, h * 0.11, fill=RGBColor(0x0e, 0x0e, 0x16), line=HAIR2, lw=0.5)
        if mine: m.line.color.rgb = RGBColor(0x5a, 0x10, 0x1c)
    rect(s, x + w * 0.04, y + h * 0.76, w * 0.92, h * 0.12, fill=RGBColor(0x0a, 0x0a, 0x12), line=HAIR2, lw=0.5)
    txt(s, x + w * 0.06, y + h * 0.79, w * 0.5, h * 0.06, "TYPE TRANSMISSION…", 6, FAINT, False, MONO)

def wf_broadcast(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x07, 0x07, 0x0d), line=HAIR2, lw=1)
    txt(s, x + w * 0.04, y + h * 0.05, w * 0.6, h * 0.06, "BROADCAST STUDIO", 7, BONE, True, SERIF)
    rect(s, x + w * 0.04, y + h * 0.16, w * 0.92, h * 0.5, fill=RGBColor(0x0b, 0x0b, 0x12), line=HAIR, lw=0.5)
    txt(s, x + w * 0.08, y + h * 0.23, w * 0.8, h * 0.3, "Citizens of Torvane:\nthe war is over.\nThe Emperor brings order.", 8, STEEL, False, MONO)
    rect(s, x + w * 0.3, y + h * 0.76, w * 0.4, h * 0.13, fill=RGBColor(0x1c, 0x0c, 0x12), line=RED, lw=0.75)
    txt(s, x + w * 0.3, y + h * 0.785, w * 0.4, h * 0.08, "TRANSMIT", 7, BONE, True, SERIF, PP_ALIGN.CENTER)

# ═══════════════════════════ SLIDES ═══════════════════════════
# ── 01 COVER ──
s = slide()
bg_render(s, os.path.join(REND, "sigil.png"), 0.30)
icon_sigil(s, 6.667, 2.15, 1.2)
txt(s, 1, 3.05, 11.33, 1.0, "OBSIDIAN", 60, BONE, True, SERIF, PP_ALIGN.CENTER)
txt(s, 1, 4.05, 11.33, 0.4, "THE EMPIRE'S NERVOUS SYSTEM", 15, RED2, True, MONO, PP_ALIGN.CENTER)
line(s, 4.6, 4.75, 8.73, 4.75, RGBColor(0x5a, 0x10, 0x1c), 1)
txt(s, 1, 4.95, 11.33, 0.4, "A classified command portal for the post-Order-66 hunt", 12, STEEL, False, MONO, PP_ALIGN.CENTER)
txt(s, 1, 5.85, 11.33, 0.8, "ANUJ PHULERA · AARAV CHOUDHARY · JEEHAAN KWATRA\nTS '26 CREATIVE PRELIMS · PATH 2 — THE EMPIRE", 10.5, DIM, False, MONO, PP_ALIGN.CENTER, spacing=1.6)

# ── 02 PROBLEM ──
s = slide()
kicker(s, "The Problem")
title(s, "The galaxy is", "scattered.")
foot(s, "Problem")
txt(s, M, 2.35, 6.6, 1.2, "Order 66 fell. Hundreds of Jedi survive across a thousand worlds — rebuilding, recruiting, learning to vanish.", 14, STEEL, False, MONO, spacing=1.5)
txt(s, M, 3.25, 6.6, 0.6, "The Empire has legions — but no eyes.", 15, BONE, False, SERIF)
cards = [("FRAGMENTED INTEL", "reports filed into a void"), ("ISOLATED HUNTERS", "six Inquisitors, six hunts"), ("NO RECRUIT DEFENSE", "the Order recruits freely"), ("NO DECISION LAYER", "intel never becomes action")]
for i, (t, d) in enumerate(cards):
    col = i % 2; row = i // 2
    x = M + col * 2.95; y = 4.0 + row * 1.35
    rect(s, x, y, 2.8, 1.15, fill=INK, line=HAIR2, lw=0.75)
    bar = rect(s, x, y, 0.07, 1.15, fill=RED)
    txt(s, x + 0.22, y + 0.16, 2.5, 0.35, t, 11, BONE, True, SERIF)
    txt(s, x + 0.22, y + 0.58, 2.5, 0.45, d, 8.5, STEEL, False, MONO, spacing=1.3)
txt(s, 7.9, 2.45, 4.5, 0.4, "EVERY TARGET IN THE FIELD", 8.5, DIM, False, MONO)
for i, (dx, dy, c) in enumerate([(8.1, 2.95, RED2), (8.9, 3.35, RED2), (9.7, 2.85, AMBER), (8.5, 3.85, AMBER), (10.4, 3.3, RED2), (9.2, 4.35, STEEL), (10.9, 2.95, STEEL), (8.1, 4.25, AMBER)]):
    oval(s, dx, dy, 0.15, 0.15, fill=c)
txt(s, 7.9, 4.9, 4.5, 0.5, "9 targets · 10 sectors · 6 hunters\nzero coordination", 9, DIM, False, MONO, spacing=1.5)

# ── 03 SOLUTION ──
s = slide()
kicker(s, "The Solution")
title(s, "One nervous", "system.")
foot(s, "Solution")
txt(s, M, 2.3, 11.5, 0.8, "OBSIDIAN turns a disorganized purge into a single hunting organism — every sector, probe and citizen a sensor in the Emperor's hand.", 14, STEEL, False, MONO, spacing=1.5)
pillars = [("TRACK", "radar, probes, sightings — one grid", 0), ("PLAN", "intel becomes dispatch in one board", 1), ("COMMAND", "every Inquisitor on one channel", 2), ("DISRUPT", "counter-recruitment at broadcast scale", 3)]
for i, (t, d, _) in enumerate(pillars):
    x = M + i * 2.95
    rect(s, x, 3.5, 2.8, 2.6, fill=INK, line=HAIR2, lw=0.75)
    bar = rect(s, x, 3.5, 2.8, 0.06, fill=RED)
    txt(s, x + 0.25, 3.85, 2.4, 0.5, t, 22, RED2, True, SERIF)
    txt(s, x + 0.25, 4.55, 2.35, 1.3, d, 9.5, STEEL, False, MONO, spacing=1.5)
txt(s, M, 6.45, 11.5, 0.4, "PASSPHRASE GATE → TYPED BOOT → CLEARANCE ALPHA-7 → FULL NETWORK", 9, AMBER, False, MONO, PP_ALIGN.CENTER)

# ── 04 WHY NOW ──
s = slide()
kicker(s, "Why Now · The Moment")
title(s, "The window is", "open.")
foot(s, "Why Now")
txt(s, M, 2.3, 6.4, 1.4, "The brief hands us the moment: post-Order 66, survivors scattered, Empire uncoordinated. Whoever builds the nervous system first, wins the galaxy.", 13.5, STEEL, False, MONO, spacing=1.5)
# TAM/SAM/SOM adapted
rows = [("THE GALAXY", "a thousand worlds, unchecked", "TAM", RED2), ("THE EMPIRE", "ten sectors, eight legions", "SAM", AMBER), ("THE HUNT", "nine classified targets, now", "SOM", BONE)]
for i, (t, d, tag, c) in enumerate(rows):
    y = 3.9 + i * 0.95
    rect(s, M, y, 6.4, 0.8, fill=INK, line=HAIR2, lw=0.75)
    chip(s, M + 0.2, y + 0.2, 0.85, 0.4, tag, accent=(tag == "TAM"))
    txt(s, M + 1.25, y + 0.14, 3.0, 0.4, t, 14, c, True, SERIF)
    txt(s, M + 1.25, y + 0.5, 4.9, 0.3, d, 8.5, STEEL, False, MONO)
txt(s, 7.8, 2.4, 4.6, 0.4, "WHY OBSIDIAN WINS THE WINDOW", 9, DIM, False, MONO)
for i, d in enumerate(["Demoable live — judges operate it", "Original — nothing canon, nothing borrowed", "Complete — app, deck, film, 3D, design system", "Offline-first — runs anywhere, forever"]):
    rect(s, 7.8, 2.95 + i * 0.85, 4.6, 0.68, fill=INK, line=HAIR2, lw=0.6)
    txt(s, 8.0, 3.1 + i * 0.85, 0.4, 0.4, "✓", 12, GREEN, True, MONO)
    txt(s, 8.45, 3.1 + i * 0.85, 3.85, 0.5, d, 9.5, STEEL, False, MONO, spacing=1.3)

# ── 05 PRODUCT — ECOSYSTEM ──
s = slide()
kicker(s, "The Product")
title(s, "Twelve modules.", "One hunt.")
foot(s, "Product")
mods = [("COMMAND DECK", "hero status board"), ("GALAXY TRACKER", "radar + probe drops"), ("WANTED DOSSIERS", "9 psychoprofiled targets"), ("INTELLIGENCE", "probe/ISB feed"), ("OPERATIONS", "kanban dispatch"), ("INTERDICTION", "propaganda studio"), ("INQUISITOR UPLINK", "encrypted comms"), ("IMPERIAL ARCHIVE", "7 lore documents"), ("TERMINAL", "working mainframe shell"), ("MANIFESTO", "the Emperor's case"), ("HUNT METRICS", "purge completion"), ("STANDARDS", "in-app design system")]
for i, (t, d) in enumerate(mods):
    col = i % 3; row = i // 3
    x = M + col * 3.92; y = 2.35 + row * 1.45
    rect(s, x, y, 3.75, 1.28, fill=INK, line=HAIR2, lw=0.6)
    txt(s, x + 0.22, y + 0.14, 3.3, 0.35, f"0{i+1:02d}  {t}", 10.5, RED2 if col == 0 else BONE, True, SERIF)
    txt(s, x + 0.22, y + 0.62, 3.35, 0.5, d, 8.5, STEEL, False, MONO)
txt(s, M, 6.8, 11.5, 0.35, "EVERY MODULE IS LIVE AND OPERABLE — NOT A MOCKUP", 9, DIM, False, MONO, PP_ALIGN.CENTER)

# ── 06 PRODUCT — THE FLOW ──
s = slide()
kicker(s, "The Product · Journey")
title(s, "Three minutes to", "demonstrate it all.")
foot(s, "Product")
wf_shell(s, M, 2.3, 6.9, 4.5)
wf_radar(s, M + 0.35, 2.75, 4.1, 3.6)
steps = [("GATE", "click to initialize"), ("BOOT", "typed sequence, beeps"), ("PASSPHRASE", "FOR THE EMPIRE"), ("DECK", "giant hero + HUD"), ("TRACKER", "click a blip → dossier"), ("OPS", "drag card to ACTIVE"), ("TERMINAL", "cat targets.log"), ("STANDARDS", "the design system")]
for i, (t, d) in enumerate(steps):
    col = i % 2; row = i // 2
    x = 8.15 + col * 2.35; y = 2.35 + row * 1.12
    rect(s, x, y, 2.2, 0.92, fill=INK, line=HAIR2, lw=0.6)
    txt(s, x + 0.15, y + 0.12, 1.9, 0.3, f"{i+1:02d}  {t}", 10, RED2, True, SERIF)
    txt(s, x + 0.15, y + 0.48, 1.95, 0.35, d, 7.5, STEEL, False, MONO, spacing=1.2)
txt(s, 8.15, 6.85, 4.7, 0.35, "9-STEP DEMO · ~3 MINUTES", 8.5, DIM, False, MONO)

# ── 07 PROOF ──
s = slide()
kicker(s, "Proof · Traction")
title(s, "Built,", "not promised.")
foot(s, "Proof")
stats = [("12", "working modules", "one login"), ("9", "original Jedi", "psychoprofiled"), ("8", "3D scenes", "custom raytracer"), ("62s", "promo film", "original score"), ("100+", "intel reports", "generated live"), ("0", "external assets", "everything in-house")]
for i, (v, l, d) in enumerate(stats):
    col = i % 3; row = i // 3
    x = M + col * 3.92; y = 2.5 + row * 2.0
    rect(s, x, y, 3.75, 1.8, fill=INK, line=HAIR2, lw=0.75)
    txt(s, x, y + 0.3, 3.75, 0.8, v, 40, RED2, True, SERIF, PP_ALIGN.CENTER)
    txt(s, x + 0.2, y + 1.15, 3.35, 0.3, l, 10.5, BONE, True, SERIF, PP_ALIGN.CENTER)
    txt(s, x + 0.2, y + 1.48, 3.35, 0.3, d, 8, DIM, False, MONO, PP_ALIGN.CENTER)
txt(s, M, 6.6, 11.5, 0.4, "THE TERMINAL RUNS A REAL FILESYSTEM · THE INQUISITORS REPLY IN-CHARACTER · THE BOARD DRAGS", 8.5, AMBER, False, MONO, PP_ALIGN.CENTER)

# ── 08 COMPETITION ──
s = slide()
kicker(s, "Competitive Landscape")
title(s, "The old way", "vs. the network.")
foot(s, "Competition")
rect(s, M, 2.3, 5.7, 4.3, fill=INK, line=HAIR2, lw=0.75)
txt(s, M + 0.3, 2.55, 5.2, 0.4, "THE OLD EMPIRE", 13, STEEL, True, SERIF)
old = [("✗", "reports vanish into ledgers"), ("✗", "six hunters, six separate hunts"), ("✗", "recruitment lanes wide open"), ("✗", "sightings never become strikes")]
for i, (m, d) in enumerate(old):
    y = 3.15 + i * 0.82
    txt(s, M + 0.3, y, 0.4, 0.4, m, 13, DIM, True, MONO)
    txt(s, M + 0.8, y + 0.02, 4.7, 0.6, d, 10.5, STEEL, False, MONO, spacing=1.3)
rect(s, 7.0, 2.3, 5.43, 4.3, fill=RGBColor(0x10, 0x08, 0x0c), line=RED, lw=1.2)
txt(s, 7.3, 2.55, 5.0, 0.4, "OBSIDIAN", 13, RED2, True, SERIF)
new = [("✓", "one live galactic grid"), ("✓", "one encrypted channel"), ("✓", "counter-recruitment broadcasts"), ("✓", "intel escalates into hunts")]
for i, (m, d) in enumerate(new):
    y = 3.15 + i * 0.82
    txt(s, 7.3, y, 0.4, 0.4, m, 13, GREEN, True, MONO)
    txt(s, 7.8, y + 0.02, 4.4, 0.6, d, 10.5, BONE, False, MONO, spacing=1.3)
txt(s, M, 6.85, 11.5, 0.35, "THE EMPIRE DOES NOT COMPETE WITH BETTER LEGIONS — IT COMPETES WITH BETTER COORDINATION", 8.5, DIM, False, MONO, PP_ALIGN.CENTER)

# ── 09 CRAFT — 3D ──
s = slide()
kicker(s, "Craft · Visual Identity")
title(s, "3D — a raytracer", "we wrote ourselves.")
foot(s, "Craft")
txt(s, M, 2.1, 11.5, 0.5, "Eight scenes, one vectorized numpy raytracer built from scratch — no external 3D software, no stock renders.", 11, STEEL, False, MONO)
scenes = ["sigil", "warship", "helmet", "planet", "probe", "throne", "blade", "citadel"]
for i, n in enumerate(scenes):
    col = i % 4; row = i // 4
    x = M + col * 2.95; y = 2.75 + row * 2.1
    p = os.path.join(REND, n + ".png")
    if os.path.exists(p):
        pth, px, py, pw, ph = fit_img(p, x, y, 2.8, 1.95)
        s.shapes.add_picture(pth, Inches(px), Inches(py), Inches(pw), Inches(ph))
txt(s, M, 6.85, 11.5, 0.35, "SIGIL · WARSHIP · HELMET · PLANET · PROBE · THRONE · BLADE · CITADEL", 8.5, DIM, False, MONO, PP_ALIGN.CENTER)

# ── 10 CRAFT — BRAND ──
s = slide()
kicker(s, "Craft · Iron Protocol")
title(s, "One design", "system.")
foot(s, "Craft")
sw = [("#050507", "BASE"), ("#0b0b12", "PANEL"), ("#1e1e2e", "HAIRLINE"), ("#e8e4d8", "BONE"), ("#8a8a94", "STEEL"), ("#e01e37", "ACTION"), ("#ff2a44", "ALERT"), ("#f4a300", "WARN"), ("#3ddc84", "POS"), ("#9fb4d8", "DATA")]
for i, (c, l) in enumerate(sw):
    col = i % 5; row = i // 5
    x = M + col * 2.34; y = 2.35 + row * 1.15
    rect(s, x, y, 2.18, 0.95, fill=RGBColor(int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16)), line=HAIR2, lw=0.5)
    txt(s, x + 0.08, y + 0.62, 2.0, 0.25, c, 7, BONE if c in ("#050507", "#0b0b12", "#1e1e2e", "#e01e37", "#ff2a44", "#7a0e1e", "#f4a300", "#3ddc84") else RGBColor(0x0b, 0x0b, 0x12), False, MONO)
    txt(s, x + 0.08, y + 0.78, 2.0, 0.2, l, 6, RGBColor(0xea, 0xe6, 0xda), False, MONO)
txt(s, M, 4.85, 11.5, 0.35, "TYPOGRAPHY — CINZEL COMMANDS · RAJDHANI OPERATES · PLEXMONO REPORTS", 8.5, DIM, False, MONO)
txt(s, M, 5.25, 11.5, 0.75, "ORDER IS PEACE", 32, BONE, True, SERIF)
txt(s, M, 6.05, 11.5, 0.35, "SIGHTING LOG // SECTOR 9 // 02:41:07 · AUTHENTICATE · DISPATCH · HUNT", 10, STEEL, False, MONO)
txt(s, M, 6.55, 11.5, 0.35, "MOTION: scramble titles · magnetic buttons · count-ups · radar sweep · WebAudio UI sounds", 8.5, DIM, False, MONO)

# ── 11 TEAM ──
s = slide()
kicker(s, "The Team")
title(s, "Three operatives.", "One doctrine.")
foot(s, "Team")
team = [("AP", "ANUJ PHULERA", "DEVELOPER · AI · BACKEND", "Builds the engine — zero-latency systems, the AI that makes the hunt computable."), ("AC", "AARAV CHOUDHARY", "VISION · MARKETING · IDEAS", "Saw the decay of the old order and imagined something absolute."), ("JK", "JEEHAAN KWATRA", "DESIGN · MEDIA · PITCH", "Forges the aesthetic — every pixel, frame and blade of the sigil.")]
for i, (ini, n, r, b) in enumerate(team):
    x = M + i * 3.92
    rect(s, x, 2.45, 3.75, 3.9, fill=INK, line=HAIR2, lw=0.75)
    bar = rect(s, x, 2.45, 3.75, 0.06, fill=RED)
    oval(s, x + 1.375, 2.95, 1.0, 1.0, fill=None, line=RED, lw=1.2)
    txt(s, x + 1.375, 3.28, 1.0, 0.5, ini, 18, RED2, True, SERIF, PP_ALIGN.CENTER)
    txt(s, x + 0.25, 4.2, 3.25, 0.4, n, 13, BONE, True, SERIF, PP_ALIGN.CENTER)
    txt(s, x + 0.25, 4.65, 3.25, 0.35, r, 7.5, RED2, False, MONO, PP_ALIGN.CENTER)
    txt(s, x + 0.4, 5.15, 2.95, 1.0, b, 9, STEEL, False, MONO, PP_ALIGN.CENTER, spacing=1.45)
txt(s, M, 6.6, 11.5, 0.4, "IDEATION · ENGINEERING · DESIGN · FILM · PITCH — ALL IN-HOUSE", 8.5, DIM, False, MONO, PP_ALIGN.CENTER)

# ── 12 ROADMAP ──
s = slide()
kicker(s, "The Road Ahead")
title(s, "The net", "expands.")
foot(s, "Roadmap")
for i, (t, d) in enumerate([("PROBE MESH", "fleet-wide probe telemetry with live alerts"), ("VOICE COMMAND", "talk to the mainframe — the terminal listens"), ("SECTOR SIMULATION", "AI-generated Jedi behavior for training"), ("CITIZEN NETWORK", "anonymous tip portal feeding the grid")]):
    y = 2.4 + i * 1.08
    rect(s, M, y, 11.5, 0.9, fill=INK, line=HAIR2, lw=0.6)
    oval(s, M + 0.2, y + 0.25, 0.4, 0.4, fill=None, line=RED, lw=1.2)
    txt(s, M + 0.2, y + 0.28, 0.4, 0.35, str(i + 2), 11, RED2, True, SERIF, PP_ALIGN.CENTER)
    txt(s, M + 0.85, y + 0.16, 5.0, 0.4, t, 13, BONE, True, SERIF)
    txt(s, M + 0.85, y + 0.55, 10.3, 0.3, d, 9.5, STEEL, False, MONO)

# ── 13 CLOSE ──
s = slide()
bg_render(s, os.path.join(REND, "throne.png"), 0.32)
icon_sigil(s, 6.667, 2.3, 1.0)
txt(s, 1, 3.2, 11.33, 0.9, "THE HUNT NEVER ENDS", 38, BONE, True, SERIF, PP_ALIGN.CENTER)
txt(s, 1, 4.15, 11.33, 0.4, "UNTIL THE LAST EMBER IS COLD", 13, RED2, False, MONO, PP_ALIGN.CENTER)
line(s, 4.8, 4.85, 8.53, 4.85, RGBColor(0x5a, 0x10, 0x1c), 1)
txt(s, 1, 5.1, 11.33, 0.6, "OBSIDIAN · IMPERIAL SECURITY NETWORK\nANUJ PHULERA · AARAV CHOUDHARY · JEEHAAN KWATRA", 10.5, DIM, False, MONO, PP_ALIGN.CENTER, spacing=1.5)
txt(s, 1, 6.35, 11.33, 0.35, "PASSPHRASE: FOR THE EMPIRE — TRY THE DEMO", 9.5, AMBER, False, MONO, PP_ALIGN.CENTER)
txt(s, 1, 6.8, 11.33, 0.3, "TS '26 CREATIVE PRELIMS · SUBMISSION READY", 8, FAINT, False, MONO, PP_ALIGN.CENTER)

fp = os.path.join(OUT, "OBSIDIAN-PITCH-DECK.pptx")
prs.save(fp)
print(f"saved {fp} · {os.path.getsize(fp)} bytes · {PAGE[0]} slides")
