# BAGGA FITNESS

A premium, fully responsive gym & fitness website built with **React + Vite + Tailwind CSS**.
Dark, powerful, superhero-inspired theme (Thor lightning / Hulk strength / Spider-web motifs) —
all visuals are **original, copyright-safe SVG art**, so the site is fast, offline-friendly and
depends on zero licensed images.

> Gym: **BAGGA FITNESS**, Prahladpur, Uttar Pradesh – 221112, India

## Features

- **Sticky responsive navbar** with scroll-spy active states, smooth scrolling and a mobile hamburger drawer
- **Hero** — animated lightning, superhero-inspired figures, live-counting stats
- **About the gym** — facilities, coaching and four duration-based membership cards (1 / 3 / 6 / 12
  months) whose Join Now and WhatsApp buttons open a chat prefilled with the plan that was clicked
- **BMI / Ideal Weight calculator** — male & female, cm or ft/in input, healthy range, BMI scale, recommendation
- **7-day workout planner** — Beginner / Intermediate / Experienced levels via tabs
- **Legend Protocols** — two motivational templates: a high-volume mass block citing Ronnie Coleman
  as a documented training *influence* (with an explicit not-affiliated disclaimer, and no likeness
  or photograph), and a women's strength programme fronted by an openly labelled illustrated
  persona. See the attribution rules at the top of `src/data/legends.js` before editing either.
- **Exercise guide** — filterable by body part, per-exercise illustration, targeted muscles, step-by-step form + coach tip (modal)
- **Protein calculator** — goal-based daily target with a plate-equivalent breakdown
- **Protein foods** — veg & non-veg sources with per-100 g protein bars
- **Supplements** — honest what / who / how breakdown
- **Training calendar** — the weekly split mapped onto a real month, on an original web-lattice background
- **Gallery** — original gym-scene artwork with a lightbox
- **Feedback / Complaint / Requirement form** — builds the message, shows the member the exact text
  before it is sent, then hands off to the owner's WhatsApp. No server and no database, and the form
  says so — along with the fact that it is not anonymous.
- **Contact / Visit Us** — address, embedded map, call / WhatsApp / email links,
  Instagram + YouTube follow buttons, WhatsApp enquiry form and FAQ

## Content truthfulness

This is a live business site, so it does not state facts about the gym that nobody has confirmed.
Read the **TRUTH POLICY** header in `src/data/site.js` before adding content. In short: opening
hours, member counts, floor area and equipment inventories are deliberately absent, and the UI asks
the visitor to message for them instead of guessing. Every number in the hero stat strip is *counted*
from data in this repo rather than typed in.

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

- `site.js` — **gym name, address, phone, WhatsApp, email, Instagram, YouTube, membership prices,
  coach roster, FAQ.** All contact details hold the gym's real values. `email` and `youtube` are
  optional — set either one to `null` and the UI hides its button instead of rendering a dead link.
  Every WhatsApp action on the site is built by the `waLink(message)` helper in this file, so the
  number only ever needs changing in one place. Opening hours live here too, as the `timings` block
  that asks the visitor to message — replace it with a real table once the owner confirms one, and
  add `openingHoursSpecification` back to the JSON-LD in `index.html` at the same time.
- `legends.js` — the two Legend Protocols. **Read the attribution rules at the top first.**
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
