import React from 'react'

/* ---------------------------------------------------------------------------
   Original, copyright-safe superhero-INSPIRED decorative artwork.
   None of these depict or copy Marvel characters — they are generic archetypes
   (a lightning warrior, a green strongman, a web lattice) rendered as our own
   line/gradient art. Pure SVG: sharp at any size, tiny payload, offline-safe.
   All decorative — always aria-hidden and pointer-events:none via the caller.
   --------------------------------------------------------------------------- */

export const ACCENTS = {
  volt: { main: '#38bdf8', light: '#7dd3fc', deep: '#0ea5e9', glow: 'rgba(56,189,248,' },
  titan: { main: '#22c55e', light: '#86efac', deep: '#16a34a', glow: 'rgba(34,197,94,' },
  rage: { main: '#ef4444', light: '#fca5a5', deep: '#b91c1c', glow: 'rgba(239,68,68,' },
  silver: { main: '#c7d0de', light: '#f4f7fb', deep: '#94a3b8', glow: 'rgba(199,208,222,' },
}

let uid = 0
const nextId = () => `bf${(uid += 1)}`

/* A single jagged lightning bolt. */
export function Bolt({ className = '', stroke = '#7dd3fc', ...rest }) {
  return (
    <svg viewBox="0 0 40 100" className={className} fill="none" aria-hidden="true" {...rest}>
      <path
        d="M24 2 8 52h12L14 98l22-58H22L30 2H24Z"
        fill={stroke}
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* Thin electric arcs used behind the hero heading. Animated via className. */
export function LightningField({ className = '', accent = 'volt' }) {
  const c = ACCENTS[accent] || ACCENTS.volt
  const id = nextId()
  return (
    <svg viewBox="0 0 600 400" className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="600" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.light} stopOpacity="0" />
          <stop offset=".5" stopColor={c.main} stopOpacity=".9" />
          <stop offset="1" stopColor={c.deep} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id}a)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 20 120 150 90 165 200 300" />
        <path d="M560 40 470 170 505 185 400 330" />
        <path d="M300 -10 320 90 290 100 340 210" opacity=".6" />
      </g>
    </svg>
  )
}

/* THOR-INSPIRED: a heroic warrior silhouette braced with a raised hammer,
   charged with lightning. Fully original geometry. */
export function LightningWarrior({ className = '', accent = 'volt' }) {
  const c = ACCENTS[accent] || ACCENTS.volt
  const id = nextId()
  return (
    <svg viewBox="0 0 260 360" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.light} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor={c.light} />
          <stop offset="1" stopColor={c.deep} />
        </radialGradient>
      </defs>

      {/* bolts crackling around the figure */}
      <g stroke={c.light} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity=".85">
        <path d="M196 30 176 74 190 78 168 120" />
        <path d="M60 40 78 84 64 88 84 128" />
      </g>

      {/* raised hammer */}
      <g>
        <rect x="182" y="16" width="52" height="40" rx="8" fill={`url(#${id}h)`} />
        <rect x="200" y="52" width="10" height="70" rx="5" fill={c.deep} />
      </g>

      {/* heroic body — a bold muscular silhouette */}
      <g fill={`url(#${id}f)`}>
        <circle cx="118" cy="60" r="26" />
        {/* torso / cape wedge */}
        <path d="M78 96c14-14 66-14 80 0 10 10 14 40 10 78-4 30-12 44-12 44H80s-8-16-12-46c-4-34 0-66 10-76Z" />
        {/* raised arm to hammer */}
        <path d="M150 104c20-8 44-30 56-46 8 8 12 14 12 22-12 16-34 38-56 46-6-6-10-14-12-22Z" />
        {/* braced arm */}
        <path d="M84 110c-16 4-34 22-42 42 6 6 14 8 22 6 12-16 24-30 32-36-4-4-8-8-12-12Z" />
        {/* legs in a power stance */}
        <path d="M92 214c-2 34-16 66-34 96 10 6 22 6 30 2 16-28 26-56 30-84Z" />
        <path d="M148 214c2 34 16 66 34 96-10 6-22 6-30 2-16-28-26-56-30-84Z" />
      </g>
      {/* chest emblem — a bolt, not any real logo */}
      <path d="M126 120 112 152h12l-8 34 24-40h-14l10-26Z" fill={c.deep} opacity=".8" />
    </svg>
  )
}

/* HULK-INSPIRED: a massive green strongman mid-flex. Original geometry. */
export function GreenTitan({ className = '', accent = 'titan' }) {
  const c = ACCENTS[accent] || ACCENTS.titan
  const id = nextId()
  return (
    <svg viewBox="0 0 300 340" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.light} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
      </defs>
      <g fill={`url(#${id}b)`}>
        {/* small head on huge traps */}
        <circle cx="150" cy="52" r="22" />
        {/* enormous traps + shoulders */}
        <path d="M96 92c18-20 90-20 108 0 8 8 16 26 20 44-18-10-34-14-34-14s-16-8-40-8-40 8-40 8-16 4-34 14c4-18 12-36 20-44Z" />
        {/* double-biceps flex — both arms up */}
        <path d="M96 108c-26 6-52 2-74-14-4 10-2 20 4 28 22 12 44 14 66 10-2 22 6 40 22 52-10-24-12-52-18-76Z" />
        <path d="M204 108c26 6 52 2 74-14 4 10 2 20-4 28-22 12-44 14-66 10 2 22-6 40-22 52 10-24 12-52 18-76Z" />
        {/* torso wide taper */}
        <path d="M104 150c8 40 12 70 12 70h68s4-30 12-70c-14 10-30 14-46 14s-32-4-46-14Z" />
        {/* tree-trunk legs */}
        <path d="M118 220c-6 40-4 78 0 108 12 4 24 4 34 0-2-36-2-72-2-108Z" />
        <path d="M182 220c6 40 4 78 0 108-12 4-24 4-34 0 2-36 2-72 2-108Z" />
      </g>
      {/* impact cracks radiating from the fists */}
      <g stroke={c.deep} strokeWidth="2" strokeLinecap="round" opacity=".55">
        <path d="M40 92 20 80M44 104 22 104M262 92l20-12M258 104l22 0" />
      </g>
    </svg>
  )
}

/* SPIDER-INSPIRED web lattice for the calendar background. Original geometry,
   parametric so it fills any box. Very cheap to render (all strokes). */
export function WebPattern({ className = '', accent = 'silver', opacity = 0.5 }) {
  const c = ACCENTS[accent] || ACCENTS.silver
  const rings = [40, 90, 150, 220, 300]
  const spokes = 12
  const cx = 200
  const cy = 40
  const R = 340
  const radial = Array.from({ length: spokes }, (_, i) => {
    const a = (Math.PI * i) / (spokes - 1) // half fan from a top-corner anchor
    return { x2: cx + Math.cos(a) * R, y2: cy + Math.sin(a) * R }
  })
  return (
    <svg
      viewBox="0 0 400 340"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
    >
      <g stroke={c.main} strokeWidth="0.9" strokeLinecap="round">
        {radial.map((r, i) => (
          <line key={i} x1={cx} y1={cy} x2={r.x2} y2={r.y2} />
        ))}
        {rings.map((rr, ri) => {
          // arc chords connecting adjacent spokes at radius rr
          const pts = radial.map((_, i) => {
            const a = (Math.PI * i) / (spokes - 1)
            return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`
          })
          return <polyline key={ri} points={pts.join(' ')} strokeWidth={ri % 2 ? 0.7 : 1} />
        })}
      </g>
    </svg>
  )
}

/* Soft corner web accent (small), for cards. */
export function WebCorner({ className = '', accent = 'volt' }) {
  const c = ACCENTS[accent] || ACCENTS.volt
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <g stroke={c.main} strokeWidth="1" strokeLinecap="round" opacity=".8">
        <path d="M0 0 40 40M0 0 60 20M0 0 20 60M0 0 52 8M0 0 8 52" />
        <path d="M14 14q10 6 18 0M22 22q14 8 26 0M32 32q18 10 34 0" fill="none" />
      </g>
    </svg>
  )
}

/* Abstract muscle/anatomy silhouette used as a faint watermark. */
export function TorsoMark({ className = '', accent = 'silver' }) {
  const c = ACCENTS[accent] || ACCENTS.silver
  return (
    <svg viewBox="0 0 200 240" className={className} fill="none" aria-hidden="true">
      <g stroke={c.main} strokeWidth="1.4" opacity=".8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 20a20 20 0 100 40 20 20 0 000-40Z" />
        <path d="M60 78c12-12 68-12 80 0 8 8 12 22 12 22s-24 6-24 22c0 20 6 40 6 40s-30 8-34 8-34-8-34-8 6-20 6-40c0-16-24-22-24-22s4-14 12-22Z" />
        <path d="M100 100v70M74 120c8 6 44 6 52 0M80 156c6 4 34 4 40 0" />
      </g>
    </svg>
  )
}
