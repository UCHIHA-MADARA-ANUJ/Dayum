#!/usr/bin/env python3
"""OBSIDIAN pitch deck — 15 slides, 16:9, NO screenshots.
Vector wireframes + 3D renders + design system graphics only."""
import os, math
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "..", "deliverables", "deck")
os.makedirs(OUT, exist_ok=True)
REND = os.path.join(BASE, "..", "deliverables", "renders")

BLACK = RGBColor(0x05,0x05,0x07)
PANEL = RGBColor(0x0b,0x0b,0x12)
PANEL2 = RGBColor(0x10,0x10,0x1a)
LINE = RGBColor(0x1e,0x1e,0x2e)
LINE2 = RGBColor(0x2a,0x2a,0x3e)
RED = RGBColor(0xe0,0x1e,0x37)
RED2 = RGBColor(0xff,0x2a,0x44)
BONE = RGBColor(0xe8,0xe4,0xd8)
STEEL = RGBColor(0x8a,0x8a,0x94)
DIM = RGBColor(0x5a,0x5a,0x66)
AMBER = RGBColor(0xf4,0xa3,0x00)
GREEN = RGBColor(0x3d,0xdc,0x84)
ICE = RGBColor(0x9f,0xb4,0xd8)

SW, SH = Inches(13.333), Inches(7.5)
DISPLAY = "Georgia"
MONO = "Consolas"

prs = Presentation()
prs.slide_width = SW; prs.slide_height = SH
blank = prs.slide_layouts[6]

def slide():
    s = prs.slides.add_slide(blank)
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    bg.fill.solid(); bg.fill.fore_color.rgb = BLACK; bg.line.fill.background()
    bg.shadow.inherit = False
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

def line(s, x1, y1, x2, y2, color=RED, w=1.0):
    ln = s.shapes.add_connector(1, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.line.color.rgb = color; ln.line.width = Pt(w)
    ln.shadow.inherit = False
    return ln

def txt(s, x, y, w, h, text, size=14, color=BONE, bold=False, font=DISPLAY, align=PP_ALIGN.LEFT, spacing=1.0, italic=False):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True; tf.vertical_anchor = MSO_ANCHOR.TOP
    for i, ln in enumerate(text.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align; p.line_spacing = spacing
        r = p.add_run(); r.text = ln
        r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
        r.font.color.rgb = color; r.font.name = font
    return tb

def bar(s, x, y, w, color=RED, h=0.035):
    rect(s, x, y, w, h, fill=color)

def head(s, kicker, title, accent):
    bar(s, 0.9, 0.62, 0.55)
    txt(s, 0.9, 0.75, 11.5, 0.35, kicker, 10, DIM, False, MONO, spacing=1.0)
    txt(s, 0.9, 1.05, 11.5, 0.75, title, 30, BONE, True, DISPLAY)
    txt(s, 0.9, 1.42, 11.5, 0.5, accent, 30, RED2, True, DISPLAY)
    line(s, 0.9, 1.95, 12.43, 1.95, LINE, 1)

def sigil(s, cx, cy, size, fill=RED):
    st = s.shapes.add_shape(MSO_SHAPE.STAR_16_POINT, Inches(cx - size/2), Inches(cy - size/2), Inches(size), Inches(size))
    st.fill.solid(); st.fill.fore_color.rgb = fill; st.line.color.rgb = RED; st.line.width = Pt(1.2)
    st.shadow.inherit = False
    oc = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(cx - size*0.14), Inches(cy - size*0.14), Inches(size*0.28), Inches(size*0.28))
    oc.fill.background(); oc.line.color.rgb = BONE; oc.line.width = Pt(1.5); oc.shadow.inherit = False
    dc = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(cx - size*0.045), Inches(cy - size*0.045), Inches(size*0.09), Inches(size*0.09))
    dc.fill.solid(); dc.fill.fore_color.rgb = RED2; dc.line.fill.background(); dc.shadow.inherit = False

def fit_img(path, x, y, maxw, maxh):
    iw, ih = Image.open(path).size
    r = min(maxw / iw, maxh / ih)
    return path, x + (maxw - iw * r) / 2, y + (maxh - ih * r) / 2, iw * r, ih * r

def render_bg(s, path, alpha=0.35):
    iw, ih = Image.open(path).size
    r = max(SW / iw, SH / ih)
    p = s.shapes.add_picture(path, (SW - iw * r) / 2, (SH - ih * r) / 2, iw * r, ih * r)
    veil = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    veil.fill.solid(); veil.fill.fore_color.rgb = BLACK
    veil.line.fill.background(); veil.shadow.inherit = False
    veil.fill.transparency = int((1 - alpha) * 100)

# ── WIREFRAME MOCKUPS (vector, not screenshots) ──────────
def wf_shell(s, x, y, w, h):
    """draw an app-shell mockup frame"""
    rect(s, x, y, w, h, fill=RGBColor(0x07,0x07,0x0d), line=LINE2, lw=1)
    rect(s, x, y, w*0.18, h, fill=RGBColor(0x0a,0x0a,0x12), line=LINE)
    rect(s, x, y, w, h*0.07, fill=RGBColor(0x0a,0x0a,0x12), line=LINE)
    txt(s, x + w*0.02, y + h*0.012, w*0.3, h*0.05, "OBSIDIAN", 7, BONE, True, DISPLAY)
    # nav items
    for i in range(5):
        ny = y + h*0.10 + i * h*0.075
        if i == 0: rect(s, x + w*0.012, ny, w*0.155, h*0.055, fill=RGBColor(0x1a,0x0a,0x10), line=RED, lw=0.75)
        else: rect(s, x + w*0.012, ny, w*0.155, h*0.055, fill=None, line=LINE, lw=0.5)
    # content area
    txt(s, x + w*0.21, y + h*0.05, w*0.7, h*0.09, "PAGE TITLE", 10, BONE, True, DISPLAY)

def wf_map(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x06,0x06,0x0c), line=LINE2, lw=1)
    # heat zones
    for (hx, hy, hr, c) in [(0.25,0.3,0.13,RED),(0.45,0.2,0.11,RED),(0.3,0.6,0.10,AMBER),(0.6,0.55,0.09,AMBER),(0.75,0.3,0.08,RGBColor(0x3a,0x3a,0x46))]:
        g = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x + w*hx), Inches(y + w*hy), Inches(w*hr*2), Inches(w*hr*2))
        g.fill.solid(); g.fill.fore_color.rgb = c; g.line.fill.background()
        g.shadow.inherit = False
        g.fill.transparency = 78
    # sweep wedge
    line(s, x + w*0.5, y + h*0.5, x + w*0.5, y + h*0.06, RED2, 1.2)
    # blips
    for (bx, by, c) in [(0.32,0.36,RED2),(0.5,0.24,RED2),(0.36,0.64,AMBER),(0.66,0.6,AMBER),(0.78,0.34,STEEL)]:
        oval(s, x + w*bx - 0.045, y + h*by - 0.045, 0.09, 0.09, fill=c)
        oval(s, x + w*bx - 0.045, y + h*by - 0.045, 0.09, 0.09, fill=None, line=c, lw=0.75)
    # side info panel
    rect(s, x + w*0.72, y + h*0.06, w*0.26, h*0.3, fill=RGBColor(0x0a,0x0a,0x12), line=LINE2, lw=0.75)
    txt(s, x + w*0.74, y + h*0.08, w*0.22, h*0.05, "SIGHTING", 7, RED2, True, DISPLAY)
    for i in range(3):
        rect(s, x + w*0.74, y + h*(0.16 + i*0.055), w*0.2, h*0.028, fill=None, line=LINE, lw=0.5)
    txt(s, x + w*0.03, y + h*0.88, w*0.5, h*0.06, "RADAR SWEEP · LIVE", 6.5, DIM, False, MONO)

def wf_cards(s, x, y, w, h, n=3):
    gap = w * 0.03
    cw = (w - gap * (n - 1)) / n
    for i in range(n):
        cx = x + i * (cw + gap)
        rect(s, cx, y, cw, h, fill=RGBColor(0x0b,0x0b,0x12), line=LINE2, lw=0.75)
        rect(s, cx + cw*0.06, y + h*0.07, cw*0.88, h*0.34, fill=RGBColor(0x10,0x10,0x1a), line=LINE, lw=0.5)
        txt(s, cx + cw*0.06, y + h*0.46, cw*0.88, h*0.1, "TARGET NAME", 7.5, BONE, True, DISPLAY)
        for j in range(2):
            rect(s, cx + cw*0.06, y + h*(0.58 + j*0.09), cw*0.8, h*0.05, fill=None, line=LINE, lw=0.5)
        rect(s, cx + cw*0.06, y + h*0.8, cw*0.4, h*0.07, fill=RGBColor(0x1c,0x0c,0x12), line=RED3 if False else RED, lw=0.5)

def wf_kanban(s, x, y, w, h):
    gap = w * 0.025
    cw = (w - gap * 3) / 4
    labels = ["PLANNING", "ACTIVE", "CONTAINED", "FAILED"]
    for i in range(4):
        cx = x + i * (cw + gap)
        rect(s, cx, y, cw, h, fill=RGBColor(0x08,0x08,0x0e), line=LINE, lw=0.75)
        txt(s, cx + cw*0.08, y + h*0.04, cw*0.8, h*0.06, labels[i], 6.5, STEEL, False, MONO)
        for j in range(2 if i < 3 else 1):
            card = rect(s, cx + cw*0.08, y + h*(0.14 + j*0.24), cw*0.84, h*0.18, fill=RGBColor(0x0e,0x0e,0x16), line=LINE2, lw=0.5)
            ln = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(cx + cw*0.08), Inches(y + h*(0.14 + j*0.24)), Inches(0.045), Inches(h*0.18))
            ln.fill.solid(); ln.fill.fore_color.rgb = RED if i == 1 else (AMBER if i == 0 else (GREEN if i == 2 else STEEL))
            ln.line.fill.background(); ln.shadow.inherit = False

def wf_chat(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x07,0x07,0x0d), line=LINE2, lw=1)
    txt(s, x + w*0.04, y + h*0.05, w*0.5, h*0.06, "INQUISITOR UPLINK", 7, BONE, True, DISPLAY)
    for i, (mx, mw, mine) in enumerate([(0.06,0.5,False),(0.44,0.5,True),(0.06,0.55,False)]):
        my = y + h*(0.16 + i*0.16)
        m = rect(s, x + w*mx, my, w*mw, h*0.1, fill=RGBColor(0x0e,0x0e,0x16), line=LINE2, lw=0.5)
        if mine:
            m.line.color.rgb = RGBColor(0x5a,0x10,0x1c)
    rect(s, x + w*0.04, y + h*0.72, w*0.92, h*0.12, fill=RGBColor(0x0a,0x0a,0x12), line=LINE2, lw=0.5)
    txt(s, x + w*0.06, y + h*0.75, w*0.5, h*0.06, "TYPE TRANSMISSION…", 6.5, DIM, False, MONO)

def wf_terminal(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x04,0x04,0x0a), line=LINE2, lw=1)
    txt(s, x + w*0.04, y + h*0.05, w*0.6, h*0.06, "OBSIDIAN MAINFRAME", 7, BONE, True, DISPLAY)
    lines = ["MOUNTING SECTOR MAPS ........ OK", "DECRYPTING CHANNELS ......... OK", "LOADING DOSSIERS ........... [9]", "OBSIDIAN:/home> cat targets.log", "Kade.exe -> HUNTING [TORVANE]"]
    for i, l in enumerate(lines):
        c = GREEN if "OK" in l else (RED2 if "cat" in l or "HUNTING" in l else STEEL)
        txt(s, x + w*0.04, y + h*(0.16 + i*0.1), w*0.9, h*0.08, l, 6.5, c, False, MONO)

def wf_broadcast(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x07,0x07,0x0d), line=LINE2, lw=1)
    txt(s, x + w*0.04, y + h*0.05, w*0.6, h*0.06, "BROADCAST STUDIO", 7, BONE, True, DISPLAY)
    rect(s, x + w*0.04, y + h*0.16, w*0.92, h*0.5, fill=RGBColor(0x0b,0x0b,0x12), line=LINE, lw=0.5)
    txt(s, x + w*0.08, y + h*0.22, w*0.8, h*0.3, "Citizens of Torvane:\nthe war is over.\nThe Emperor brings order.", 8, STEEL, False, MONO)
    rect(s, x + w*0.3, y + h*0.74, w*0.4, h*0.12, fill=RGBColor(0x1c,0x0c,0x12), line=RED, lw=0.75)
    txt(s, x + w*0.3, y + h*0.76, w*0.4, h*0.08, "TRANSMIT", 7, BONE, True, DISPLAY, PP_ALIGN.CENTER)

def wf_metrics(s, x, y, w, h):
    rect(s, x, y, w, h, fill=RGBColor(0x07,0x07,0x0d), line=LINE2, lw=1)
    for i in range(4):
        cx = x + w*0.04 + i * w*0.24
        rect(s, cx, y + h*0.12, w*0.2, h*0.55, fill=RGBColor(0x0b,0x0b,0x12), line=LINE, lw=0.5)
        txt(s, cx + w*0.02, y + h*0.22, w*0.16, h*0.2, ["9","10","6","11"][i], 18, RED2, True, DISPLAY, PP_ALIGN.CENTER)
        txt(s, cx + w*0.02, y + h*0.5, w*0.16, h*0.14, ["TARGETS","SECTORS","INQUISITORS","MODULES"][i], 5.5, DIM, False, MONO, PP_ALIGN.CENTER)

# ─────────────────────────── SLIDES ───────────────────────────
# 1 TITLE
s = slide()
render_bg(s, os.path.join(REND, "sigil.png"), 0.30)
sigil(s, 6.667, 2.35, 1.5)
txt(s, 1, 3.35, 11.33, 1.1, "OBSIDIAN", 66, BONE, True, DISPLAY, PP_ALIGN.CENTER)
txt(s, 1, 4.4, 11.33, 0.4, "IMPERIAL SECURITY NETWORK", 16, RED2, False, MONO, PP_ALIGN.CENTER, spacing=1.0)
txt(s, 1, 4.85, 11.33, 0.4, "JEDI APPREHENSION DIVISION · TS '26 CREATIVE PRELIMS", 11, STEEL, False, MONO, PP_ALIGN.CENTER)
line(s, 4.5, 5.5, 8.83, 5.5, RGBColor(0x5a,0x10,0x1c), 1)
txt(s, 1, 5.75, 11.33, 0.9, "ANUJ PHULERA · AARAV CHOUDHARY · JEEHAAN KWATRA\nSCHOOL ______", 12, DIM, False, MONO, PP_ALIGN.CENTER, spacing=1.4)

# 2 PROBLEM
s = slide(); head(s, "THE BRIEF · PATH 2", "THE GALAXY IS", "SCATTERED.")
txt(s, 0.9, 2.25, 6.4, 1.6, "Order 66 fell. Survivors hide across a thousand worlds — rebuilding, recruiting, learning to vanish.", 16, STEEL, False, MONO, spacing=1.5)
txt(s, 0.9, 3.2, 6.4, 1.4, "The Empire has legions but no eyes:\nfragmented intel · isolated Inquisitors · unprotected recruitment lanes · no decision layer.", 13, BONE, False, MONO, spacing=1.5)
# scattered dots graphic
for (dx, dy, c) in [(7.6,2.3,RED2),(8.5,2.9,RED2),(9.4,2.2,AMBER),(8.0,3.9,AMBER),(9.9,3.3,RED2),(8.9,4.4,STEEL),(10.6,2.7,STEEL),(10.1,4.2,AMBER),(7.3,3.2,STEEL)]:
    oval(s, dx, dy, 0.16, 0.16, fill=c)
txt(s, 7.6, 4.9, 3.4, 0.4, "NINE CLASSIFIED TARGETS", 8, DIM, False, MONO)
txt(s, 7.6, 5.25, 3.4, 0.4, "IN THE FIELD, RIGHT NOW", 8, DIM, False, MONO)

# 3 OPPORTUNITY
s = slide(); head(s, "THE OPPORTUNITY", "ONE NERVOUS", "SYSTEM.")
txt(s, 0.9, 2.3, 11.5, 1.2, "The brief grants total creative freedom. We built the infrastructure the Empire never had:", 15, STEEL, False, MONO, spacing=1.5)
for i, (t, d) in enumerate([("TRACK", "every sector, probe and sighting in one grid"), ("PLAN", "intel that becomes dispatch in one board"), ("COMMAND", "every Inquisitor on one encrypted channel"), ("DISRUPT", "counter-recruitment at broadcast scale")]):
    y = 3.6 + i * 0.82
    rect(s, 0.9, y, 11.5, 0.66, fill=PANEL, line=LINE2, lw=0.75)
    txt(s, 1.15, y + 0.1, 2.2, 0.4, t, 15, RED2, True, DISPLAY)
    txt(s, 3.4, y + 0.14, 8.8, 0.4, d, 12, STEEL, False, MONO)

# 4 SOLUTION
s = slide(); head(s, "THE SOLUTION", "OBSIDIAN", "THE HUNT, COORDINATED.")
txt(s, 0.9, 2.2, 11.5, 0.8, "A classified Imperial command portal. One login. Twelve modules. One hunting organism.", 14, STEEL, False, MONO, spacing=1.4)
for i, (t, d) in enumerate([("GATE & BOOT", "passphrase FOR THE EMPIRE · clearance ALPHA-7"), ("LIVE TELEMETRY", "radar, threat indices, sighting logs, count-ups"), ("IN-UNIVERSE", "nine original Jedi · six Inquisitors · seven doctrines"), ("OFFLINE-FIRST", "Next.js build + zero-dependency vanilla fallback")]):
    col = i % 2; row = i // 2
    x = 0.9 + col * 5.95; y = 3.15 + row * 1.55
    rect(s, x, y, 5.7, 1.3, fill=PANEL, line=LINE2, lw=0.75)
    bar(s, x, y, 0.09, RED, 1.3)
    txt(s, x + 0.3, y + 0.16, 5.2, 0.4, t, 14, BONE, True, DISPLAY)
    txt(s, x + 0.3, y + 0.62, 5.2, 0.5, d, 10.5, STEEL, False, MONO)

# 5 PRODUCT — 12 modules
s = slide(); head(s, "THE PRODUCT", "TWELVE MODULES.", "ONE HUNT.")
mods = [("COMMAND DECK","hero status board"),("GALAXY TRACKER","radar + probe drops"),("WANTED DOSSIERS","9 psychoprofiled targets"),("INTELLIGENCE","probe/ISB feed"),("OPERATIONS","kanban dispatch"),("INTERDICTION","propaganda studio"),("INQUISITOR UPLINK","encrypted comms"),("ARCHIVE","7 lore documents"),("TERMINAL","working mainframe shell"),("MANIFESTO","the Emperor's case"),("HUNT METRICS","purge completion"),("STANDARDS","in-app design system")]
for i, (t, d) in enumerate(mods):
    col = i % 3; row = i // 3
    x = 0.9 + col * 3.92; y = 2.25 + row * 1.22
    rect(s, x, y, 3.7, 1.02, fill=PANEL, line=LINE2, lw=0.6)
    txt(s, x + 0.2, y + 0.12, 3.3, 0.3, f"0{i+1:02d} · {t}", 10.5, RED2 if i % 3 == 0 else BONE, True, DISPLAY)
    txt(s, x + 0.2, y + 0.55, 3.3, 0.35, d, 9, STEEL, False, MONO)

# 6 TRACKER WIREFRAME
s = slide(); head(s, "MODULE 02", "GALAXY", "TRACKER.")
wf_shell(s, 0.9, 2.2, 7.4, 4.9)
wf_map(s, 1.35, 2.75, 4.4, 3.9)
txt(s, 8.6, 2.35, 4.0, 0.6, "LIVE SURVEILLANCE GRID", 13, BONE, True, DISPLAY)
txt(s, 8.6, 2.95, 4.0, 2.0, "Radar sweep over ten sectors.\nThreat heat zones.\nClick a blip → dossier.\nLog sightings · simulate probe drops.\nConfirmed / suspected / disputed.", 11, STEEL, False, MONO, spacing=1.6)

# 7 DOSSIERS + OPS
s = slide(); head(s, "MODULES 02-05", "DOSSIERS &", "OPERATIONS.")
wf_cards(s, 0.9, 2.25, 5.8, 2.2, 3)
txt(s, 0.9, 4.6, 5.8, 0.4, "NINE ORIGINAL JEDI · PSYCHOPROFILES · WARRANTS", 9, DIM, False, MONO)
wf_kanban(s, 0.9, 5.1, 5.8, 1.9)
txt(s, 7.0, 2.35, 5.3, 0.6, "INTEL → ACTION", 13, BONE, True, DISPLAY)
txt(s, 7.0, 2.95, 5.3, 2.6, "Sightings escalate into operations.\nCards move PLANNING → ACTIVE → CONTAINED.\nSquads, sectors, priorities — one board.\nEvery hunt leaves a paper trail.", 11, STEEL, False, MONO, spacing=1.6)

# 8 INTEL + INTERDICTION
s = slide(); head(s, "MODULES 04-06", "INTEL &", "INTERDICTION.")
rect(s, 0.9, 2.25, 5.8, 2.15, fill=PANEL, line=LINE2, lw=0.75)
txt(s, 1.1, 2.4, 5.4, 0.4, "INTELLIGENCE FEED", 12, BONE, True, DISPLAY)
for i, (src, st) in enumerate([("PROBE-9","CONFIRMED"),("ISB AGENT","LIKELY"),("INTERCEPT","POSSIBLE")]):
    rect(s, 1.1, 2.85 + i * 0.45, 5.4, 0.36, fill=RGBColor(0x0d,0x0d,0x15), line=LINE, lw=0.5)
    txt(s, 1.25, 2.92 + i * 0.45, 2.5, 0.3, src, 9, ICE, False, MONO)
    txt(s, 5.3, 2.92 + i * 0.45, 1.1, 0.3, st, 8, RED2 if st == "CONFIRMED" else AMBER, False, MONO)
wf_broadcast(s, 0.9, 4.6, 5.8, 2.45)
txt(s, 7.0, 2.35, 5.3, 0.6, "RECRUITMENT DISRUPTION", 13, BONE, True, DISPLAY)
txt(s, 7.0, 2.95, 5.3, 2.6, "Compose sector-wide propaganda.\nSix templates: amnesty, suspicion, loyalty, order.\nTransmit → log → citizen tips rise.\nThe Jedi cannot recruit what they cannot reach.", 11, STEEL, False, MONO, spacing=1.6)

# 9 COMMS + TERMINAL
s = slide(); head(s, "MODULES 07-09", "COMMS &", "TERMINAL.")
wf_chat(s, 0.9, 2.25, 5.8, 2.35)
txt(s, 0.9, 4.75, 5.8, 0.4, "SIX INQUISITORS · IN-CHARACTER REPLIES", 9, DIM, False, MONO)
wf_terminal(s, 0.9, 5.2, 5.8, 1.85)
txt(s, 7.0, 2.35, 5.3, 0.6, "TALK TO THE HUNT", 13, BONE, True, DISPLAY)
txt(s, 7.0, 2.95, 5.3, 2.6, "Encrypted uplink with the Inquisitor council.\nMessage The Hound — he answers.\nThen open the mainframe: help, ls, cd, cat,\nscan, locate, ping. A real filesystem,\nwith our founders inside it.", 11, STEEL, False, MONO, spacing=1.6)

# 10 UI/UX
s = slide(); head(s, "UI/UX", "IRON", "PROTOCOL.")
sw = [("#050507","BASE"),("#0b0b12","PANEL"),("#10101a","RAISED"),("#1e1e2e","HAIRLINE"),("#2a2a3e","HAIR HI"),("#e8e4d8","BONE"),("#8a8a94","STEEL"),("#5a5a66","DIM"),("#e01e37","ACTION"),("#ff2a44","ALERT"),("#7a0e1e","DEEP"),("#f4a300","WARN"),("#3ddc84","POS"),("#9fb4d8","DATA")]
for i, (c, l) in enumerate(sw):
    col = i % 7; row = i // 7
    x = 0.9 + col * 1.66; y = 2.25 + row * 1.25
    rect(s, x, y, 1.5, 0.85, fill=RGBColor(int(c[1:3],16),int(c[3:5],16),int(c[5:7],16)), line=LINE2, lw=0.5)
    txt(s, x + 0.06, y + 0.55, 1.4, 0.25, c, 7, BONE, False, MONO)
    txt(s, x + 0.06, y + 0.72, 1.4, 0.2, l, 5.5, DIM, False, MONO)
txt(s, 0.9, 4.85, 11.5, 0.4, "TYPOGRAPHY — CINZEL COMMANDS · RAJDHANI OPERATES · PLEXMONO REPORTS", 9, DIM, False, MONO)
txt(s, 0.9, 5.3, 11.5, 0.8, "ORDER IS PEACE", 30, BONE, True, DISPLAY)
txt(s, 0.9, 6.1, 11.5, 0.5, "SIGHTING LOG // SECTOR 9 // 02:41:07 · AUTHENTICATE · DISPATCH · HUNT", 10.5, STEEL, False, MONO)
txt(s, 0.9, 6.55, 11.5, 0.4, "MOTION: scramble titles · magnetic buttons · count-ups · radar sweep · WebAudio UI sounds", 9, DIM, False, MONO)

# 11 3D RENDERS
s = slide(); head(s, "VISUAL IDENTITY", "3D — CUSTOM", "RAYTRACER.")
txt(s, 0.9, 2.05, 11.5, 0.5, "Eight scenes rendered by a vectorized numpy raytracer written from scratch — no external 3D software.", 11, STEEL, False, MONO)
scenes = ["sigil","warship","helmet","planet","probe","throne","blade","citadel"]
for i, n in enumerate(scenes):
    col = i % 4; row = i // 4
    x = 0.9 + col * 2.92; y = 2.7 + row * 2.2
    p = os.path.join(REND, n + ".png")
    if os.path.exists(p):
        pth, px, py, pw, ph = fit_img(p, x, y, 2.75, 2.0)
        s.shapes.add_picture(pth, Inches(px), Inches(py), Inches(pw), Inches(ph))

# 12 SECURITY & ORIGINALITY
s = slide(); head(s, "WHY IT'S OURS", "SECURITY &", "ORIGINALITY.")
for i, (t, d) in enumerate([("ORIGINAL UNIVERSE","nine Jedi · ten sectors · six Inquisitors · seven doctrines — zero canon"),("NO TEMPLATES","code, glyphs, sigils, posters and sounds all built in-house"),("THREAT THEATER","passphrase gate · boot sequence · incident logging — the UI is the fiction"),("OFFLINE-FIRST","self-hosted fonts, zero external calls, runs from a single folder")]):
    col = i % 2; row = i // 2
    x = 0.9 + col * 5.95; y = 2.3 + row * 1.9
    rect(s, x, y, 5.7, 1.65, fill=PANEL, line=LINE2, lw=0.75)
    bar(s, x, y, 0.09, RED, 1.65)
    txt(s, x + 0.3, y + 0.2, 5.2, 0.4, t, 14, BONE, True, DISPLAY)
    txt(s, x + 0.3, y + 0.7, 5.2, 0.8, d, 11, STEEL, False, MONO, spacing=1.5)

# 13 IMPACT
s = slide(); head(s, "THE NUMBERS", "HUNT", "METRICS.")
stats = [("9","JEDI TARGETS","prioritized & psychoprofiled"),("10","SECTORS","live threat indices"),("6","INQUISITORS","online, in-character"),("12","MODULES","one nervous system"),("100+","INTEL REPORTS","probe drops on demand"),("0","MERCY","the Emperor decides")]
for i, (v, l, d) in enumerate(stats):
    col = i % 3; row = i // 3
    x = 0.9 + col * 3.92; y = 2.35 + row * 2.2
    rect(s, x, y, 3.7, 1.95, fill=PANEL, line=LINE2, lw=0.75)
    txt(s, x, y + 0.3, 3.7, 0.8, v, 42, RED2, True, DISPLAY, PP_ALIGN.CENTER)
    txt(s, x + 0.2, y + 1.2, 3.3, 0.35, l, 10, BONE, True, DISPLAY, PP_ALIGN.CENTER)
    txt(s, x + 0.2, y + 1.55, 3.3, 0.3, d, 8, DIM, False, MONO, PP_ALIGN.CENTER)

# 14 ROADMAP
s = slide(); head(s, "THE ROAD AHEAD", "THE NET", "EXPANDS.")
for i, (t, d) in enumerate([("PHASE 2 — PROBE MESH","simulated fleet-wide probe telemetry with live alerts"),("PHASE 3 — VOICE COMMAND","talk to the mainframe; the terminal listens"),("PHASE 4 — SECTOR SIMULATION","AI-generated Jedi behavior patterns for training"),("PHASE 5 — CITIZEN NETWORK","anonymous tip portal feeding the intelligence grid")]):
    y = 2.35 + i * 1.05
    rect(s, 0.9, y, 11.5, 0.85, fill=PANEL, line=LINE2, lw=0.6)
    oval(s, 1.1, y + 0.22, 0.4, 0.4, fill=None, line=RED, lw=1.2)
    txt(s, 1.1, y + 0.25, 0.4, 0.35, str(i + 2), 11, RED2, True, DISPLAY, PP_ALIGN.CENTER)
    txt(s, 1.7, y + 0.14, 5.0, 0.4, t, 13, BONE, True, DISPLAY)
    txt(s, 1.7, y + 0.5, 10.5, 0.3, d, 10, STEEL, False, MONO)

# 15 CLOSING
s = slide()
render_bg(s, os.path.join(REND, "throne.png"), 0.35)
sigil(s, 6.667, 2.5, 1.1)
txt(s, 1, 3.5, 11.33, 0.9, "THE HUNT NEVER ENDS", 40, BONE, True, DISPLAY, PP_ALIGN.CENTER)
txt(s, 1, 4.45, 11.33, 0.4, "UNTIL THE LAST EMBER IS COLD", 14, RED2, False, MONO, PP_ALIGN.CENTER)
line(s, 4.8, 5.15, 8.53, 5.15, RGBColor(0x5a,0x10,0x1c), 1)
txt(s, 1, 5.45, 11.33, 0.9, "OBSIDIAN · IMPERIAL SECURITY NETWORK · TS '26\nANUJ PHULERA · AARAV CHOUDHARY · JEEHAAN KWATRA", 11, DIM, False, MONO, PP_ALIGN.CENTER, spacing=1.5)
txt(s, 1, 6.7, 11.33, 0.35, "PASSPHRASE: FOR THE EMPIRE", 9, AMBER, False, MONO, PP_ALIGN.CENTER)

fp = os.path.join(OUT, "OBSIDIAN-PITCH-DECK.pptx")
prs.save(fp)
print("saved", fp, os.path.getsize(fp), "bytes ·", len(prs.slides.__iter__.__self__._sldIdLst), "slides")
