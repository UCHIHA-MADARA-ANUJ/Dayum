#!/usr/bin/env python3
"""OBSIDIAN pitch deck generator — 14-slide .pptx in the Iron Protocol design system."""
import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "..", "deliverables", "deck")
os.makedirs(OUT, exist_ok=True)
REND = os.path.join(BASE, "..", "deliverables", "renders")
PROMO = os.path.join(BASE, "..", "deliverables", "promo")
VID = os.path.join(BASE, "..", "deliverables", "video")

BLACK = RGBColor(0x05,0x05,0x07)
PANEL = RGBColor(0x0b,0x0b,0x12)
RED = RGBColor(0xe0,0x1e,0x37)
RED2 = RGBColor(0xff,0x2a,0x44)
BONE = RGBColor(0xe8,0xe4,0xd8)
STEEL = RGBColor(0x8a,0x8a,0x94)
DIM = RGBColor(0x5a,0x5a,0x66)
AMBER = RGBColor(0xf4,0xa3,0x00)
GREEN = RGBColor(0x3d,0xdc,0x84)
ICE = RGBColor(0x9f,0xb4,0xd8)

SW = Inches(13.333); SH = Inches(7.5)

def new_prs():
    prs = Presentation()
    prs.slide_width = SW; prs.slide_height = SH
    return prs

def add_bg(slide, color=BLACK):
    bg = slide.shapes.add_shape(1, 0, 0, SW, SH)
    bg.fill.solid(); bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    bg.shadow.inherit = False
    return bg

def add_red_bar(slide, x, y, w, h=Inches(0.045)):
    bar = slide.shapes.add_shape(1, x, y, w, h)
    bar.fill.solid(); bar.fill.fore_color.rgb = RED
    bar.line.fill.background(); bar.shadow.inherit = False
    return bar

def textbox(slide, x, y, w, h, text, size=18, color=BONE, bold=False, font="Cinzel",
            align=PP_ALIGN.LEFT, spacing=1.0, anchor=MSO_ANCHOR.TOP, italic=False):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame; tf.word_wrap = True
    tf.vertical_anchor = anchor
    lines = text.split("\n")
    for i, ln in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(4)
        p.line_spacing = spacing
        r = p.add_run(); r.text = ln
        r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
        r.font.color.rgb = color
        r.font.name = font
    return tb

def add_image(slide, path, x, y, w=None, h=None):
    im = slide.shapes.add_picture(path, x, y, w, h)
    return im

def fit_img(path, x, y, maxw, maxh):
    iw, ih = Image.open(path).size
    r = min(maxw/iw, maxh/ih)
    return path, x + (maxw - iw*r)/2, y + (maxh - ih*r)/2, iw*r, ih*r

def render_bg_img(slide, path):
    """crop-cover background image"""
    iw, ih = Image.open(path).size
    r = max(SW/iw, SH/ih)
    add_image(slide, path, (SW - iw*r)/2, (SH - ih*r)/2, iw*r, ih*r)

def veil(slide, alpha=0.55):
    v = slide.shapes.add_shape(1, 0, 0, SW, SH)
    v.fill.solid()
    # simulate veil with dark translucent look: solid near-black
    v.fill.fore_color.rgb = BLACK
    v.line.fill.background(); v.shadow.inherit = False
    v.fill.transparency = int((1 - alpha) * 100)
    return v

# ─────────────────────────── slides ───────────────────────────
prs = new_prs()
blank = prs.slide_layouts[6]

def s_title():
    s = prs.slides.add_slide(blank)
    render_bg_img(s, os.path.join(REND, "sigil.png")); veil(s, 0.42)
    add_red_bar(s, Inches(5.37), Inches(2.55), Inches(2.6))
    textbox(s, Inches(1), Inches(2.9), Inches(11.33), Inches(1.6), "OBSIDIAN", 72, BONE, True, "Cinzel", PP_ALIGN.CENTER)
    textbox(s, Inches(1), Inches(4.05), Inches(11.33), Inches(0.5), "IMPERIAL SECURITY NETWORK", 20, RED2, False, "Cinzel", PP_ALIGN.CENTER)
    textbox(s, Inches(1), Inches(4.6), Inches(11.33), Inches(0.5), "JEDI APPREHENSION DIVISION · TS '26 CREATIVE PRELIMS", 12, STEEL, False, "Consolas", PP_ALIGN.CENTER)
    textbox(s, Inches(1), Inches(6.5), Inches(11.33), Inches(0.8), "ANUJ PHULERA · AARAV CHOUDHARY · JEEHAAN KWATRA\nSCHOOL ______ · TS '26 CREATIVE PRELIMS", 13, DIM, False, "Consolas", PP_ALIGN.CENTER)
    return s

def s_agenda():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "THE PROBLEM", 30, BONE, True)
    textbox(s, Inches(0.9), Inches(2.3), Inches(11.5), Inches(4.6),
"""Order 66 has fallen. The Jedi Order is scattered — but not extinct.

Hundreds of survivors hide across a thousand worlds. They are rebuilding. They are recruiting. They are learning to vanish.

The Empire has legions, but no eyes. Reports arrive late. Intel is fragmented. Each Inquisitor hunts alone. Each sector defends its own slice of darkness.

A scattered enemy is still an enemy. And a scattered Empire cannot hunt.

OBSIDIAN exists because the galaxy is vast — and mercy is not.""", 17, STEEL, False, "Consolas", spacing=1.35)
    textbox(s, Inches(0.9), Inches(6.6), Inches(11), Inches(0.4), "THE HUNT NEEDS A NERVOUS SYSTEM.", 14, RED2, True, "Consolas")
    return s

def s_solution():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "OUR SOLUTION", 30, BONE, True)
    textbox(s, Inches(0.9), Inches(2.15), Inches(11.5), Inches(0.9),
            "OBSIDIAN — a unified Imperial command network that turns every sector, probe and citizen into part of one hunting organism.", 17, STEEL, spacing=1.3)
    feats = [
        ("◈ GALAXY TRACKER", "Live sector map · threat heat · probe drops · sighting log"),
        ("◈ WANTED DOSSIERS", "9 original targets · psychoprofiles · printable warrants"),
        ("◈ OPERATIONS BOARD", "Kanban dispatch · squad assignment · priority tiers"),
        ("◈ INTELLIGENCE FEED", "Probe & ISB reports · redaction · escalation to ops"),
        ("◈ INTERDICTION DIVISION", "Propaganda studio · counter-recruitment broadcasts"),
        ("◈ INQUISITOR UPLINK", "Encrypted comms with 6 original Inquisitor characters"),
    ]
    y = Inches(3.1)
    for i, (t, d) in enumerate(feats):
        col = i % 2; row = i // 2
        x = Inches(0.9 + col * 6.0); yy = Inches(3.1 + row * 1.15)
        box = s.shapes.add_shape(1, x, yy, Inches(5.7), Inches(1.0))
        box.fill.solid(); box.fill.fore_color.rgb = PANEL
        box.line.color.rgb = RGBColor(0x2a,0x2a,0x3e); box.line.width = Pt(1)
        box.shadow.inherit = False
        textbox(s, x + Inches(0.25), yy + Inches(0.12), Inches(5.3), Inches(0.4), t, 13, RED2, True, "Consolas")
        textbox(s, x + Inches(0.25), yy + Inches(0.5), Inches(5.3), Inches(0.45), d, 11, STEEL, False, "Consolas")
    return s

def s_tracker():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "GALAXY TRACKER", 30, BONE, True)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-tracker.png"), Inches(0.9), Inches(2.2), Inches(11.5), Inches(5.0))
    add_image(s, p, x, y, w, h)
    return s

def s_dossiers():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "WANTED DOSSIERS", 30, BONE, True)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-dossiers.png"), Inches(0.9), Inches(2.2), Inches(11.5), Inches(5.0))
    add_image(s, p, x, y, w, h)
    return s

def s_ops():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "OPERATIONS BOARD", 30, BONE, True)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-ops.png"), Inches(0.9), Inches(2.2), Inches(11.5), Inches(5.0))
    add_image(s, p, x, y, w, h)
    return s

def s_intel():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "INTELLIGENCE & INTERDICTION", 30, BONE, True)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-intel.png"), Inches(0.9), Inches(2.2), Inches(5.6), Inches(5.0))
    add_image(s, p, x, y, w, h)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-interdiction.png"), Inches(6.8), Inches(2.2), Inches(5.6), Inches(5.0))
    add_image(s, p, x, y, w, h)
    return s

def s_comms():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "INQUISITOR UPLINK", 30, BONE, True)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-comms.png"), Inches(0.9), Inches(2.2), Inches(5.6), Inches(5.0))
    add_image(s, p, x, y, w, h)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-archive.png"), Inches(6.8), Inches(2.2), Inches(5.6), Inches(5.0))
    add_image(s, p, x, y, w, h)
    return s

def s_ux():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "UI/UX — IRON PROTOCOL", 30, BONE, True)
    p, x, y, w, h = fit_img(os.path.join(PROMO, "shot-standards.png"), Inches(0.9), Inches(2.2), Inches(11.5), Inches(5.0))
    add_image(s, p, x, y, w, h)
    return s

def s_3d():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "3D — CUSTOM RAYTRACER", 30, BONE, True)
    textbox(s, Inches(0.9), Inches(2.0), Inches(11.5), Inches(0.5),
            "Six scenes rendered with an original vectorized raytracer written from scratch (spheres, boxes, cylinders, CSG, reflections, glow shells).", 13, STEEL, False, "Consolas")
    imgs = ["sigil.png","warship.png","helmet.png","planet.png","probe.png","throne.png"]
    for i, n in enumerate(imgs):
        col = i % 3; row = i // 3
        x = Inches(0.9 + col * 4.0); y = Inches(2.7 + row * 2.3)
        p, px, py, pw, ph = fit_img(os.path.join(REND, n), x, y, Inches(3.7), Inches(2.1))
        add_image(s, p, px, py, pw, ph)
    return s

def s_video():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "PROMO FILM", 30, BONE, True)
    textbox(s, Inches(0.9), Inches(2.0), Inches(11.5), Inches(0.6),
            "OBSIDIAN — 62s cinematic trailer · original score & sound design · voiceover · app footage · 3D renders", 14, STEEL, False, "Consolas")
    p, x, y, w, h = fit_img(os.path.join(VID, "card-obsidian.png"), Inches(0.9), Inches(2.6), Inches(11.5), Inches(4.5))
    add_image(s, p, x, y, w, h)
    textbox(s, Inches(0.9), Inches(6.9), Inches(11.5), Inches(0.4), "FILE: deliverables/video/OBSIDIAN-PROMO.mp4", 11, DIM, False, "Consolas")
    return s

def s_security():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "SECURITY BY DESIGN", 30, BONE, True)
    items = [
        ("CLASSIFIED BOOT", "Passphrase gate (FOR THE EMPIRE) with clearance verification and incident logging on failure."),
        ("THREAT THEATER", "Scanlines, CRT vignette, terminal aesthetic — the interface itself communicates surveillance."),
        ("ORIGINAL UNIVERSE", "All 9 targets, 10 sectors, 6 Inquisitors, doctrines and records are original creations. Zero canon references."),
        ("OFFLINE-FIRST", "Self-hosted fonts, zero external calls. Runs from a single folder or any static host."),
    ]
    y = Inches(2.3)
    for t, d in items:
        box = s.shapes.add_shape(1, Inches(0.9), y, Inches(11.5), Inches(1.0))
        box.fill.solid(); box.fill.fore_color.rgb = PANEL
        box.line.color.rgb = RGBColor(0x2a,0x2a,0x3e); box.line.width = Pt(1); box.shadow.inherit = False
        textbox(s, Inches(1.15), y + Inches(0.1), Inches(10.9), Inches(0.4), t, 14, RED2, True, "Consolas")
        textbox(s, Inches(1.15), y + Inches(0.5), Inches(10.9), Inches(0.45), d, 12, STEEL, False, "Consolas")
        y += Inches(1.12)
    return s

def s_impact():
    s = prs.slides.add_slide(blank); add_bg(s)
    add_red_bar(s, Inches(0.9), Inches(1.15), Inches(2.6))
    textbox(s, Inches(0.9), Inches(1.3), Inches(10), Inches(0.7), "IMPACT", 30, BONE, True)
    stats = [
        ("9", "JEDI TARGETS\nPRIORITIZED"),
        ("10", "SECTORS\nCOVERED"),
        ("6", "INQUISITORS\nONLINE"),
        ("100+", "INTEL REPORTS\nGENERATABLE"),
        ("62s", "CINEMATIC\nTRAILER"),
        ("6", "3D RENDERS\nCUSTOM ENGINE"),
    ]
    for i, (v, l) in enumerate(stats):
        col = i % 3; row = i // 2
        x = Inches(0.9 + col * 4.0); y = Inches(2.4 + row * 2.2)
        box = s.shapes.add_shape(1, x, y, Inches(3.7), Inches(1.9))
        box.fill.solid(); box.fill.fore_color.rgb = PANEL
        box.line.color.rgb = RGBColor(0x2a,0x2a,0x3e); box.line.width = Pt(1); box.shadow.inherit = False
        textbox(s, x, y + Inches(0.3), Inches(3.7), Inches(0.9), v, 40, RED2, True, "Cinzel", PP_ALIGN.CENTER)
        textbox(s, x + Inches(0.2), y + Inches(1.2), Inches(3.3), Inches(0.6), l, 11, STEEL, False, "Consolas", PP_ALIGN.CENTER)
    return s

def s_closing():
    s = prs.slides.add_slide(blank)
    render_bg_img(s, os.path.join(REND, "throne.png")); veil(s, 0.5)
    textbox(s, Inches(1), Inches(2.6), Inches(11.33), Inches(1.2), "THE HUNT NEVER ENDS", 52, BONE, True, "Cinzel", PP_ALIGN.CENTER)
    textbox(s, Inches(1), Inches(3.8), Inches(11.33), Inches(0.6), "UNTIL THE LAST EMBER IS COLD", 18, RED2, False, "Consolas", PP_ALIGN.CENTER)
    textbox(s, Inches(1), Inches(5.7), Inches(11.33), Inches(0.9), "OBSIDIAN · IMPERIAL SECURITY NETWORK · TS '26\nANUJ PHULERA · AARAV CHOUDHARY · JEEHAAN KWATRA", 13, DIM, False, "Consolas", PP_ALIGN.CENTER)
    return s

for fn in [s_title, s_agenda, s_solution, s_tracker, s_dossiers, s_ops, s_intel, s_comms, s_ux, s_3d, s_video, s_security, s_impact, s_closing]:
    fn()

fp = os.path.join(OUT, "OBSIDIAN-PITCH-DECK.pptx")
prs.save(fp)
print("saved", fp, os.path.getsize(fp), "bytes")
