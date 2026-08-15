# OBSIDIAN — 3D Renders

All 8 scenes rendered with our **custom vectorized numpy raytracer** (no external 3D software).
Each render: **1920×1080 · 6 samples · tonemapped + vignette graded**.

## The Scenes

| File | Scene | Notes |
|---|---|---|
| `sigil.png` | **The Sigil** — twelve blades around the all-seeing core | Used on cover, boot, posters |
| `warship.png` | **Warship** — Imperial strike cruiser | Red beacon engines, starfield |
| `helmet.png` | **Helmet** — The Hound's war-mask | Glossy black + crimson crest |
| `planet.png` | **Ringed Planet** — a subdued world | Dust rings, orbiting moon |
| `probe.png` | **Probe** — the all-seeing eye | Six sensor vanes, twin optics |
| `throne.png` | **Throne** — the Emperor's seat | Red spires, beacon crown |
| `blade.png` | **The Blade** — a hunter's weapon | Dual glow shells, steel hilt |
| `citadel.png` | **The Citadel** — seat of command | Stepped pyramid, red core |

## Why it matters
- 100% original code: `tools/render.py` (spheres, boxes, cylinders, glow shells, reflections, starfields)
- No Blender, no Maya, no stock — every pixel computed by our engine
- Same renders power the pitch deck, the dossier and the promo film

## Add your own
Drop any additional renders into this folder — they'll be picked up by the showcase site automatically.
