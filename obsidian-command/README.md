# ⬡ OBSIDIAN — Imperial Security Network

**TS '26 Creative Prelims · Path 2: The Empire**

OBSIDIAN is a classified Imperial command portal that turns the post-Order-66 purge into a single hunting organism — galaxy-wide tracking, planning, and communication, plus a counter-recruitment propaganda apparatus.

> **Demo passphrase:** `FOR THE EMPIRE`

---

## 📦 Deliverables

| # | Deliverable | Where |
|---|---|---|
| 1 | Write-up (3 options, ≤100 words) | `deliverables/writeup/WRITEUP-options.md` |
| 2 | **Product** — OBSIDIAN web app | **`web/` — Next.js 15 + React 19 + Framer Motion + GSAP + Lenis + Three.js + Zustand + Sonner** (primary, deploy to Vercel) · `app/` — zero-dependency vanilla fallback |
| 3 | Pitch deck (14 slides, editable) | `deliverables/deck/OBSIDIAN-PITCH-DECK.pptx` |
| 4 | UI/UX — "Iron Protocol" design system | inside the app → **Standards** section |
| 5 | Promo film (62s) | `deliverables/video/OBSIDIAN-PROMO.mp4` |
| 6 | 3D models/renders (6 scenes, custom raytracer) | `deliverables/renders/*.png` |
| 🎁 | Bonus: showcase/portfolio website | `deliverables/portfolio/index.html` |
| 🎁 | Bonus: promotional poster + banner | `deliverables/promo/poster.png` · `banner.png` |

---

## 🖥️ The Product — 9 command modules

1. **Command Deck** — live threat index, ticker, Order 66 status
2. **Galaxy Tracker** — 10-sector radar map, probe drops, sighting log
3. **Wanted Dossiers** — 9 original Jedi targets, psychoprofiles, printable warrants
4. **Intelligence** — probe/ISB feed, redactions, escalate-to-ops
5. **Operations** — kanban dispatch board with drag & drop
6. **Interdiction** — propaganda broadcast studio (counter-recruitment)
7. **Inquisitor Comms** — encrypted chat with 6 original Inquisitors
8. **Archive** — 7 original lore documents (Directive 66, doctrine…)
9. **Standards** — the in-app design system (colors, type, motion)

**Boot:** passphrase `FOR THE EMPIRE` (clearance ALPHA-7).

## 🧰 How everything was made (100% original)

- **App:** vanilla HTML/CSS/JS, offline-first, self-hosted fonts, zero external calls
- **3D:** custom vectorized Python raytracer (`tools/render.py`) — spheres, boxes, cylinders, glow shells, reflections
- **Film:** 62s trailer assembled with ffmpeg from 3D renders + real app footage (recorded via headless Chrome) + title cards + original synthesized score & SFX (`tools/audio.js`) + voiceover
- **Deck:** generated with python-pptx (`tools/deck.py`)
- **Poster/banner:** rendered via headless Chrome (`tools/promo_art.js`)

## 🚀 Run it

```bash
# Next.js app (primary)
cd web && npm install && npm run dev
# open http://localhost:8080 — passphrase: FOR THE EMPIRE

# Zero-dependency fallback
cd app && python3 -m http.server 8080
```

**Stack:** Next.js 15 · React 19 · Framer Motion · GSAP · Lenis smooth scroll · Three.js WebGL galaxy · Zustand · Sonner · Tailwind · Lucide — 13 libraries.
**Crew:** Anuj Phulera · Aarav Choudhary · Jeehaan Kwatra
