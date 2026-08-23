import React from 'react'
import { ACCENTS } from './Decor.jsx'

/* Original food icons — clean, flat, recognisable. 0..64 box on a soft disc. */

let n = 0
const uid = () => `fd${(n += 1)}`

function Disc({ accent, children }) {
  const c = ACCENTS[accent] || ACCENTS.volt
  const id = uid()
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}d`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={`${c.glow}0.22)`} />
          <stop offset="1" stopColor="rgba(11,14,23,0)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${id}d)`} />
      {children(c)}
    </svg>
  )
}

const S = (props) => <path strokeLinecap="round" strokeLinejoin="round" fill="none" {...props} />

const ART = {
  chicken: (c) => (
    <g>
      <path d="M22 44c-6-4-8-14-2-20s18-6 24 2c4 6 2 12-2 15l4 6-8 1-2 5-4-5-6 3-2-6-6 4Z" fill={c.main} />
      <circle cx="26" cy="26" r="2" fill="#0b0e17" />
    </g>
  ),
  egg: (c) => (
    <g>
      <path d="M32 12c8 0 14 14 14 24a14 14 0 01-28 0c0-10 6-24 14-24Z" fill="#f4f7fb" />
      <circle cx="32" cy="38" r="8" fill={c.main} />
    </g>
  ),
  fish: (c) => (
    <g>
      <path d="M12 32c8-12 28-14 36-6 4 4 4 8 0 12-8 8-28 6-36-6Z" fill={c.main} />
      <path d="M48 26l8-6v24l-8-6Z" fill={c.deep} />
      <circle cx="22" cy="30" r="2.4" fill="#0b0e17" />
    </g>
  ),
  paneer: (c) => (
    <g>
      <path d="M14 40 34 22l18 12-18 12Z" fill="#f4f7fb" />
      <path d="M34 22v18l18-6V34Z" fill={c.light} />
      <path d="M14 40v-4l20-18v4Z" fill={c.main} />
    </g>
  ),
  yogurt: (c) => (
    <g>
      <path d="M20 22h24l-3 26a5 5 0 01-5 4H28a5 5 0 01-5-4Z" fill="#f4f7fb" />
      <rect x="18" y="16" width="28" height="8" rx="3" fill={c.main} />
    </g>
  ),
  milk: (c) => (
    <g>
      <path d="M24 16h16v8l4 8v18a4 4 0 01-4 4H24a4 4 0 01-4-4V32l4-8Z" fill="#f4f7fb" />
      <rect x="20" y="34" width="24" height="10" fill={c.main} />
    </g>
  ),
  soya: (c) => (
    <g>
      <circle cx="24" cy="28" r="8" fill={c.main} />
      <circle cx="40" cy="26" r="7" fill={c.light} />
      <circle cx="32" cy="42" r="8" fill={c.deep} />
    </g>
  ),
  lentil: (c) => (
    <g>
      {[
        [22, 30],
        [32, 26],
        [42, 30],
        [27, 38],
        [37, 38],
        [32, 46],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="3.4" fill={i % 2 ? c.light : c.main} />
      ))}
    </g>
  ),
  chickpea: (c) => (
    <g>
      <circle cx="26" cy="30" r="7" fill={c.light} />
      <circle cx="40" cy="30" r="7" fill={c.main} />
      <circle cx="33" cy="42" r="7" fill={c.deep} />
    </g>
  ),
  rajma: (c) => (
    <g>
      {[
        [26, 28],
        [38, 32],
        [30, 42],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y}c-6 0-9 5-6 9 3 3 10 3 12-2 2-5-1-7-6-7Z`} fill={i === 1 ? c.deep : c.main} />
      ))}
    </g>
  ),
  peanut: (c) => (
    <g>
      <path d="M22 24c6-4 12 2 12 8s6 12 0 16-14-2-14-10c0-4-4-6-4-10s2-6 6-4Z" fill={c.main} />
      <circle cx="24" cy="30" r="2" fill={c.deep} />
      <circle cx="28" cy="42" r="2" fill={c.deep} />
    </g>
  ),
  almond: (c) => (
    <g>
      <path d="M32 14c8 6 12 22 0 36-12-14-8-30 0-36Z" fill={c.main} />
      <path d="M32 20v24" stroke={c.deep} strokeWidth="1.5" />
    </g>
  ),
  tofu: (c) => (
    <g>
      <path d="M16 38 32 28l16 10-16 10Z" fill="#f4f7fb" />
      <path d="M32 28v20l16-10V28Z" fill={c.light} />
      <path d="M16 38v-4l16-10v4Z" fill={c.main} />
    </g>
  ),
  whey: (c) => (
    <g>
      <rect x="22" y="18" width="20" height="30" rx="4" fill={c.main} />
      <rect x="24" y="12" width="16" height="8" rx="3" fill={c.deep} />
      <rect x="25" y="28" width="14" height="10" rx="2" fill="#0b0e17" opacity=".35" />
    </g>
  ),
  oats: (c) => (
    <g>
      <path d="M16 34h32l-3 14a4 4 0 01-4 3H23a4 4 0 01-4-3Z" fill="#f4f7fb" />
      <path d="M16 34c0-6 8-8 16-8s16 2 16 8Z" fill={c.main} />
      <circle cx="28" cy="42" r="2" fill={c.deep} />
      <circle cx="36" cy="44" r="2" fill={c.deep} />
    </g>
  ),
}

export default function FoodArt({ name, accent = 'titan', className = '' }) {
  const draw = ART[name] || ART.egg
  return (
    <span className={className}>
      <Disc accent={accent}>{draw}</Disc>
    </span>
  )
}

/* Supplement icons live here too, same disc system. */
const SUP = {
  tub: (c) => (
    <g>
      <rect x="20" y="20" width="24" height="30" rx="5" fill={c.main} />
      <rect x="22" y="12" width="20" height="10" rx="3" fill={c.deep} />
      <rect x="24" y="30" width="16" height="12" rx="2" fill="#0b0e17" opacity=".35" />
    </g>
  ),
  scoop: (c) => (
    <g>
      <path d="M18 40a12 12 0 0124 0Z" fill={c.main} />
      <rect x="38" y="16" width="6" height="24" rx="3" fill={c.deep} transform="rotate(18 41 28)" />
    </g>
  ),
  pill: (c) => (
    <g>
      <rect x="14" y="26" width="36" height="14" rx="7" fill={c.main} transform="rotate(-20 32 33)" />
      <rect x="14" y="26" width="18" height="14" rx="7" fill={c.light} transform="rotate(-20 32 33)" />
    </g>
  ),
  softgel: (c) => (
    <g>
      <ellipse cx="32" cy="32" rx="12" ry="16" fill={c.main} transform="rotate(24 32 32)" />
      <ellipse cx="28" cy="26" rx="3" ry="5" fill="#f4f7fb" opacity=".6" transform="rotate(24 28 26)" />
    </g>
  ),
  shaker: (c) => (
    <g>
      <path d="M22 22h20v22a6 6 0 01-6 6H28a6 6 0 01-6-6Z" fill={c.main} />
      <rect x="22" y="14" width="20" height="8" rx="3" fill={c.deep} />
      <rect x="24" y="30" width="16" height="3" fill="#0b0e17" opacity=".3" />
      <rect x="24" y="36" width="16" height="3" fill="#0b0e17" opacity=".3" />
    </g>
  ),
}

export function SupplementArt({ name, accent = 'volt', className = '' }) {
  const draw = SUP[name] || SUP.tub
  return (
    <span className={className}>
      <Disc accent={accent}>{draw}</Disc>
    </span>
  )
}
