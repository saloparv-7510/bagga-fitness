# BAGGA FITNESS

A premium, fully responsive gym & fitness website built with **React + Vite + Tailwind CSS**.
Dark, powerful, superhero-inspired theme (Thor lightning / Hulk strength / Spider-web calendar) —
all visuals are **original, copyright-safe SVG art**, so the site is fast, offline-friendly and
depends on zero licensed images.

> Gym: **BAGGA FITNESS**, Prahladpur, Uttar Pradesh – 221112, India

## Features

- **Sticky responsive navbar** with scroll-spy active states, smooth scrolling and a mobile hamburger drawer
- **Hero** — animated lightning, superhero-inspired figures, live-counting stats
- **About the gym** — facilities, coaching and membership cards
- **BMI / Ideal Weight calculator** — male & female, cm or ft/in input, healthy range, BMI scale, recommendation
- **7-day workout planner** — Beginner / Intermediate / Experienced levels via tabs
- **Exercise guide** — filterable by body part, per-exercise illustration, targeted muscles, step-by-step form + coach tip (modal)
- **Protein calculator** — goal-based daily target with a plate-equivalent breakdown
- **Protein foods** — veg & non-veg sources with per-100 g protein bars
- **Supplements** — honest what / who / how breakdown
- **Training calendar** — the weekly split mapped onto a real month, on an original web-lattice background
- **Gallery** — original gym-scene artwork with a lightbox
- **Contact / Visit Us** — address, embedded map, opening hours, WhatsApp enquiry form and FAQ

## Getting started

```bash
npm install
npm run dev      # http://localhost:5180
```

```bash
npm run build    # production build to /dist
npm run preview  # preview the production build
```

## Editing content

Almost everything the gym owner needs to change lives in `src/data/`:

- `site.js` — **gym name, address, phone, email, WhatsApp, socials, opening hours, membership, FAQ.**
  Values marked `PLACEHOLDER` (phone, email, prices, social URLs) should be replaced with the real ones.
- `workouts.js` — the weekly split and the three level plans
- `exercises.js` — the exercise library
- `nutrition.js` — protein foods and supplements

### Using real photos later

Every image is an original SVG component (`src/components/art/`). To swap in real gym photos,
drop files into `public/images/` and reference them — the data files already leave room for a
`photo:` key on gallery items.

## Performance notes

Tuned for smooth ~60 fps scrolling on phones:

- Animations use **only `opacity` + `transform`** (compositor-friendly)
- Decorative glows use a **radial mask (`.bloom`)**, never `filter: blur()` on large surfaces
- `backdrop-filter` is **disabled on touch devices** via a coarse-pointer media query (opaque fallback)
- Respects `prefers-reduced-motion`

## Tech

React 18 · Vite 5 · Tailwind CSS 3 · lucide-react icons · Inter + Oswald (self-hosted via fontsource)

---

_Ideal-weight and protein figures are general estimates for healthy adults and do not replace
professional medical advice._
