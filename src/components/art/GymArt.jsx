import React from 'react'
import { ACCENTS } from './Decor.jsx'

/* Gym gallery "photos" as original SVG scenes. Wide 4:3 plates with equipment
   silhouettes, depth shading and an accent glow — a designed set, not stock. */

let n = 0
const uid = () => `gm${(n += 1)}`

/* `label` names the scene for screen readers where it stands alone (the
   lightbox). Left off, the scene is decorative and hidden from the a11y tree —
   the tile caption next to it already carries the same words. */
function Scene({ accent, label, children }) {
  const c = ACCENTS[accent] || ACCENTS.volt
  const id = uid()
  return (
    <svg
      viewBox="0 0 320 240"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true', focusable: 'false' })}
    >
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10141f" />
          <stop offset="1" stopColor="#070910" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="0.5" cy="0.2" r="0.9">
          <stop offset="0" stopColor={`${c.glow}0.28)`} />
          <stop offset="1" stopColor="rgba(7,9,16,0)" />
        </radialGradient>
        <linearGradient id={`${id}floor`} x1="0" y1="170" x2="0" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#141a28" />
          <stop offset="1" stopColor="#0a0d16" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill={`url(#${id}sky)`} />
      <rect width="320" height="240" fill={`url(#${id}glow)`} />
      {/* faint wall panels */}
      <g stroke="#c7d0de" strokeOpacity="0.05" strokeWidth="2">
        <line x1="60" y1="0" x2="60" y2="180" />
        <line x1="160" y1="0" x2="160" y2="180" />
        <line x1="260" y1="0" x2="260" y2="180" />
      </g>
      <rect y="176" width="320" height="64" fill={`url(#${id}floor)`} />
      <line x1="0" y1="176" x2="320" y2="176" stroke={c.main} strokeOpacity="0.3" strokeWidth="2" />
      {children(c)}
    </svg>
  )
}

const F = (col) => ({ fill: col })

const ART = {
  rack: (c) => (
    <g>
      <rect x="70" y="40" width="12" height="140" {...F('#1b2436')} />
      <rect x="238" y="40" width="12" height="140" {...F('#1b2436')} />
      <rect x="70" y="40" width="180" height="10" {...F(c.deep)} />
      <rect x="70" y="150" width="180" height="8" {...F('#232b3d')} />
      <rect x="96" y="86" width="128" height="7" {...F(c.main)} />
      <circle cx="96" cy="90" r="16" {...F(c.deep)} />
      <circle cx="224" cy="90" r="16" {...F(c.deep)} />
    </g>
  ),
  dumbbells: (c) => (
    <g>
      <rect x="40" y="150" width="240" height="26" rx="4" {...F('#141a28')} />
      {[70, 130, 190, 250].map((x, i) => (
        <g key={i}>
          <rect x={x - 22} y={132} width="44" height="10" rx="5" {...F(c.main)} opacity={1 - i * 0.12} />
          <circle cx={x - 22} cy={137} r="9" {...F(c.deep)} />
          <circle cx={x + 22} cy={137} r="9" {...F(c.deep)} />
        </g>
      ))}
    </g>
  ),
  cardio: (c) => (
    <g>
      <path d="M90 176v-40l60-6v46Z" {...F('#1b2436')} />
      <rect x="150" y="70" width="10" height="70" {...F('#232b3d')} />
      <rect x="120" y="66" width="52" height="10" rx="4" {...F(c.main)} />
      <rect x="86" y="168" width="80" height="10" rx="3" {...F(c.deep)} />
      <circle cx="230" cy="120" r="34" fill="none" stroke={c.main} strokeWidth="6" />
      <circle cx="230" cy="120" r="6" {...F(c.deep)} />
    </g>
  ),
  kettlebell: (c) => (
    <g>
      {[110, 170, 226].map((x, i) => (
        <g key={i}>
          <path d={`M${x - 14} 150a14 14 0 0128 0Z`} fill="none" stroke={c.main} strokeWidth="6" />
          <circle cx={x} cy={162} r="18" {...F(i === 1 ? c.deep : '#1b2436')} />
        </g>
      ))}
    </g>
  ),
  bench: (c) => (
    <g>
      <rect x="90" y="120" width="140" height="16" rx="6" {...F('#1b2436')} />
      <rect x="100" y="136" width="10" height="40" {...F('#232b3d')} />
      <rect x="210" y="136" width="10" height="40" {...F('#232b3d')} />
      <rect x="150" y="70" width="120" height="7" {...F(c.main)} />
      <circle cx="270" cy="73" r="15" {...F(c.deep)} />
      <rect x="60" y="60" width="12" height="90" {...F('#1b2436')} />
    </g>
  ),
  cable: (c) => (
    <g>
      <rect x="60" y="30" width="12" height="150" {...F('#1b2436')} />
      <rect x="248" y="30" width="12" height="150" {...F('#1b2436')} />
      <rect x="60" y="30" width="200" height="10" {...F(c.deep)} />
      <path d="M72 40 130 120M248 40 190 120" stroke={c.main} strokeWidth="3" />
      <rect x="122" y="120" width="16" height="8" rx="3" {...F(c.main)} />
      <rect x="182" y="120" width="16" height="8" rx="3" {...F(c.main)} />
    </g>
  ),
  turf: (c) => (
    <g>
      <rect x="30" y="150" width="260" height="26" rx="3" {...F(c.deep)} opacity=".5" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={40 + i * 30} y1="150" x2={40 + i * 30} y2="176" stroke={c.main} strokeOpacity=".4" strokeWidth="2" />
      ))}
      <rect x="120" y="120" width="80" height="14" rx="4" {...F('#1b2436')} />
      <circle cx="120" cy="127" r="12" {...F(c.main)} />
      <circle cx="200" cy="127" r="12" {...F(c.main)} />
    </g>
  ),
  lockers: (c) => (
    <g>
      {[70, 130, 190, 250].map((x, i) => (
        <g key={i}>
          <rect x={x - 26} y="50" width="52" height="126" rx="4" {...F('#141a28')} stroke={c.main} strokeOpacity=".35" />
          <circle cx={x + 14} cy="120" r="3" {...F(c.main)} />
          <line x1={x - 26} y1="112" x2={x + 26} y2="112" stroke="#c7d0de" strokeOpacity=".08" strokeWidth="2" />
        </g>
      ))}
    </g>
  ),
}

export default function GymArt({ name, accent = 'volt', className = '', label }) {
  const draw = ART[name] || ART.rack
  return (
    <span className={className}>
      <Scene accent={accent} label={label}>
        {draw}
      </Scene>
    </span>
  )
}
