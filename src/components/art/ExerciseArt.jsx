import React from 'react'
import { ACCENTS } from './Decor.jsx'

/* ---------------------------------------------------------------------------
   ExerciseArt — original inline-SVG illustrations, one per exercise `art` key.
   A consistent visual system: a dark plate, faint floor line, and a stylized
   athlete (accent-gradient body) shown mid-movement with the key equipment.
   Recognisable, copyright-safe, and razor-sharp at any card size.
   --------------------------------------------------------------------------- */

let n = 0
const uid = () => `ex${(n += 1)}`

// Shared frame: gradient defs + backdrop. Children draw in a 0..200 x 0..150 box.
// `label` decides the a11y treatment: named image when the drawing carries
// meaning on its own, hidden when the surrounding text already says it.
function Frame({ accent, label, children }) {
  const c = ACCENTS[accent] || ACCENTS.volt
  const id = uid()
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true', focusable: 'false' })}
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.light} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <radialGradient id={`${id}bg`} cx="0.5" cy="0.28" r="0.8">
          <stop offset="0" stopColor={`${c.glow}0.16)`} />
          <stop offset="1" stopColor="rgba(7,9,16,0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill="#0b0e17" />
      <rect width="200" height="150" fill={`url(#${id}bg)`} />
      <line x1="16" y1="132" x2="184" y2="132" stroke={c.main} strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
      {/* pass the resolved ids + colour to children */}
      {children({ fig: `url(#${id}g)`, c })}
    </svg>
  )
}

// Reusable primitives ------------------------------------------------------
const Bar = ({ x1, y1, x2, y2, c, w = 5 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.main} strokeWidth={w} strokeLinecap="round" />
)
const Plate = ({ x, y, c, r = 12 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={c.deep} />
    <circle cx={x} cy={y} r={r * 0.45} fill={c.main} />
  </g>
)
const Head = ({ x, y, fig, r = 9 }) => <circle cx={x} cy={y} r={r} fill={fig} />
const Limb = ({ d, fig, w = 8 }) => (
  <path d={d} stroke={fig} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
)

/* Each drawing is a function of {fig, c}. Keyed by the exercise's `art`. */
const ART = {
  // ---- CHEST ----
  bench: ({ fig, c }) => (
    <g>
      <rect x="52" y="96" width="96" height="10" rx="4" fill={c.deep} opacity=".7" />
      <rect x="60" y="106" width="8" height="24" fill={c.deep} opacity=".7" />
      <rect x="132" y="106" width="8" height="24" fill={c.deep} opacity=".7" />
      <Limb d="M70 96 118 96" fig={fig} w={11} />
      <Head x={64} y={92} fig={fig} />
      <Limb d="M96 92 96 66" fig={fig} />
      <Limb d="M110 92 110 66" fig={fig} />
      <Bar x1="80" y1="60" x2="126" y2="60" c={c} />
      <Plate x={80} y={60} c={c} />
      <Plate x={126} y={60} c={c} />
      <Limb d="M118 96 140 108 150 96" fig={fig} />
    </g>
  ),
  incline: ({ fig, c }) => (
    <g>
      <path d="M56 128 56 96 130 72" stroke={c.deep} strokeOpacity=".7" strokeWidth="9" fill="none" strokeLinecap="round" />
      <Limb d="M70 108 118 84" fig={fig} w={11} />
      <Head x={66} y={104} fig={fig} />
      <Limb d="M104 92 118 66" fig={fig} />
      <Limb d="M112 96 128 70" fig={fig} />
      <Bar x1="106" y1="60" x2="140" y2="60" c={c} />
      <Plate x={106} y={60} c={c} r={10} />
      <Plate x={140} y={60} c={c} r={10} />
    </g>
  ),
  pushup: ({ fig, c }) => (
    <g>
      <Limb d="M46 110 150 96" fig={fig} w={11} />
      <Head x={150} y={92} fig={fig} />
      <Limb d="M64 110 62 128" fig={fig} />
      <Limb d="M132 100 130 128" fig={fig} />
      <Limb d="M46 110 40 128 54 128" fig={fig} />
    </g>
  ),
  // ---- BACK ----
  deadlift: ({ fig, c }) => (
    <g>
      <Bar x1="60" y1="112" x2="140" y2="112" c={c} />
      <Plate x={60} y={112} c={c} />
      <Plate x={140} y={112} c={c} />
      <Head x={112} y={64} fig={fig} />
      <Limb d="M108 72 92 104" fig={fig} w={11} />
      <Limb d="M96 84 78 112" fig={fig} />
      <Limb d="M108 84 126 112" fig={fig} />
      <Limb d="M92 104 84 130" fig={fig} />
      <Limb d="M100 104 108 130" fig={fig} />
    </g>
  ),
  pullup: ({ fig, c }) => (
    <g>
      <Bar x1="48" y1="30" x2="152" y2="30" c={c} w={6} />
      <Limb d="M86 34 92 60" fig={fig} />
      <Limb d="M114 34 108 60" fig={fig} />
      <Head x={100} y={54} fig={fig} />
      <Limb d="M100 62 100 98" fig={fig} w={11} />
      <Limb d="M96 98 88 126" fig={fig} />
      <Limb d="M104 98 112 126" fig={fig} />
    </g>
  ),
  row: ({ fig, c }) => (
    <g>
      <Head x={70} y={62} fig={fig} />
      <Limb d="M76 68 120 92" fig={fig} w={11} />
      <Limb d="M120 92 122 116" fig={fig} />
      <Limb d="M120 92 100 118" fig={fig} />
      <Limb d="M96 84 100 60" fig={fig} />
      <Bar x1="86" y1="54" x2="118" y2="54" c={c} />
      <Plate x={86} y={54} c={c} r={10} />
      <Plate x={118} y={54} c={c} r={10} />
    </g>
  ),
  // ---- LEGS ----
  squat: ({ fig, c }) => (
    <g>
      <Bar x1="70" y1="52" x2="130" y2="52" c={c} />
      <Plate x={70} y={52} c={c} />
      <Plate x={130} y={52} c={c} />
      <Limb d="M84 54 116 54" fig={fig} w={11} />
      <Head x={100} y={44} fig={fig} r={8} />
      <Limb d="M100 60 100 92" fig={fig} w={11} />
      <Limb d="M100 92 80 104 82 128" fig={fig} />
      <Limb d="M100 92 120 104 118 128" fig={fig} />
    </g>
  ),
  rdl: ({ fig, c }) => (
    <g>
      <Head x={78} y={58} fig={fig} />
      <Limb d="M84 64 120 84" fig={fig} w={11} />
      <Limb d="M120 84 122 128" fig={fig} />
      <Limb d="M104 78 108 108 100 128" fig={fig} />
      <Bar x1="92" y1="98" x2="128" y2="98" c={c} />
      <Plate x={92} y={98} c={c} r={12} />
      <Plate x={128} y={98} c={c} r={12} />
    </g>
  ),
  lunge: ({ fig, c }) => (
    <g>
      <Head x={100} y={50} fig={fig} />
      <Limb d="M100 58 100 92" fig={fig} w={11} />
      <Limb d="M100 92 74 106 74 128" fig={fig} />
      <Limb d="M100 92 128 110 132 128" fig={fig} />
      <Limb d="M92 74 88 100" fig={fig} />
      <Limb d="M108 74 112 100" fig={fig} />
      <Plate x={86} y={100} c={c} r={8} />
      <Plate x={114} y={100} c={c} r={8} />
    </g>
  ),
  calf: ({ fig, c }) => (
    <g>
      <Head x={100} y={44} fig={fig} />
      <Limb d="M100 52 100 96" fig={fig} w={11} />
      <Limb d="M100 96 92 122" fig={fig} />
      <Limb d="M100 96 108 122" fig={fig} />
      <rect x="80" y="122" width="40" height="8" rx="3" fill={c.deep} opacity=".8" />
      <Limb d="M86 60 78 84" fig={fig} />
      <Limb d="M114 60 122 84" fig={fig} />
    </g>
  ),
  // ---- SHOULDERS ----
  ohp: ({ fig, c }) => (
    <g>
      <Bar x1="72" y1="42" x2="128" y2="42" c={c} />
      <Plate x={72} y={42} c={c} />
      <Plate x={128} y={42} c={c} />
      <Limb d="M90 60 100 46" fig={fig} />
      <Limb d="M110 60 100 46" fig={fig} />
      <Head x={100} y={62} fig={fig} />
      <Limb d="M100 70 100 100" fig={fig} w={11} />
      <Limb d="M100 100 90 128" fig={fig} />
      <Limb d="M100 100 110 128" fig={fig} />
    </g>
  ),
  lateral: ({ fig, c }) => (
    <g>
      <Head x={100} y={52} fig={fig} />
      <Limb d="M100 60 100 100" fig={fig} w={11} />
      <Limb d="M100 72 66 74" fig={fig} />
      <Limb d="M100 72 134 74" fig={fig} />
      <Plate x={60} y={74} c={c} r={9} />
      <Plate x={140} y={74} c={c} r={9} />
      <Limb d="M96 100 88 128" fig={fig} />
      <Limb d="M104 100 112 128" fig={fig} />
    </g>
  ),
  // ---- ARMS ----
  curl: ({ fig, c }) => (
    <g>
      <Head x={100} y={50} fig={fig} />
      <Limb d="M100 58 100 100" fig={fig} w={11} />
      <Limb d="M92 78 82 92 96 84" fig={fig} />
      <Limb d="M108 78 118 92 104 84" fig={fig} />
      <Bar x1="80" y1="84" x2="120" y2="84" c={c} />
      <Plate x={80} y={84} c={c} r={9} />
      <Plate x={120} y={84} c={c} r={9} />
      <Limb d="M96 100 90 128" fig={fig} />
      <Limb d="M104 100 110 128" fig={fig} />
    </g>
  ),
  pushdown: ({ fig, c }) => (
    <g>
      <line x1="100" y1="24" x2="100" y2="70" stroke={c.deep} strokeWidth="4" opacity=".7" />
      <Head x={92} y={58} fig={fig} />
      <Limb d="M96 66 96 104" fig={fig} w={11} />
      <Limb d="M100 74 100 92" fig={fig} />
      <Bar x1="90" y1="94" x2="110" y2="94" c={c} w={4} />
      <Limb d="M92 104 86 128" fig={fig} />
      <Limb d="M100 104 108 128" fig={fig} />
    </g>
  ),
  // ---- CORE ----
  plank: ({ fig, c }) => (
    <g>
      <Limb d="M52 112 150 96" fig={fig} w={11} />
      <Head x={150} y={92} fig={fig} />
      <Limb d="M60 112 58 130" fig={fig} />
      <Limb d="M132 100 132 130" fig={fig} />
      <Limb d="M52 112 62 126" fig={fig} />
    </g>
  ),
  kneeraise: ({ fig, c }) => (
    <g>
      <Bar x1="52" y1="28" x2="148" y2="28" c={c} w={6} />
      <Limb d="M92 32 98 56" fig={fig} />
      <Limb d="M108 32 102 56" fig={fig} />
      <Head x={100} y={50} fig={fig} />
      <Limb d="M100 58 100 86" fig={fig} w={11} />
      <Limb d="M100 86 128 86 130 108" fig={fig} />
      <Limb d="M100 86 124 96 126 116" fig={fig} />
    </g>
  ),
}

export default function ExerciseArt({ name, accent = 'volt', className = '', label }) {
  const draw = ART[name] || ART.pushup
  return (
    <span className={className}>
      <Frame accent={accent} label={label}>
        {draw}
      </Frame>
    </span>
  )
}
