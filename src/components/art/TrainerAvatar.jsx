import React from 'react'
import { ACCENTS } from './Decor.jsx'

/* ---------------------------------------------------------------------------
   TRAINER AVATAR — a deliberately stylised head-and-shoulders bust.

   WHY IT IS NOT A FACE.
   The coaching roster is made of REAL employees. We have no photographs of
   them, and no AI-generated face is honest here: rendering a synthetic face
   under a real person's name (or, as the roster stands, under a real job
   title) would show the visitor somebody who does not exist and imply that is
   the coach they will meet on the floor. So this is an obviously-illustrated
   bust — accent gradient, no eyes, no nose, no mouth — carrying the trainer's
   initials. It reads as "portrait pending", which is the truth.

   The `photo` prop is the drop-in for later: pass a real, consented photograph
   (or an image the owner has approved) and the same frame renders an <img>
   instead, with no change at the call site.

   Rendering budget: pure SVG, no filters, no animation. Nothing here paints on
   a scroll path, so the repo's "never animate a paint property" rule is safe by
   construction — there is nothing to animate, and prefers-reduced-motion has
   nothing to switch off.
   --------------------------------------------------------------------------- */

const CX = 60 // centre line of the 120x120 viewBox
const HEAD_CY = 29 // vertical centre of the cranium
const NECK_TOP = 42 // hidden behind the skull
const NECK_BASE = 63 // where the trapezius takes over

/* Build parameters. The two gendered builds differ ONLY in shoulder width,
   shoulder-to-chest taper, neck thickness, skull size and hair mass — the
   neutral differences you would read in a silhouette across a room. Both are
   drawn square-shouldered and upright: same posture, same framing, no waist
   emphasis, and the female build is not made smaller overall, only
   proportioned differently.

   `sh` is the half-width at the deltoid, `hem` the half-width at the bottom
   crop. sh > hem on purpose: the taper from shoulder to chest is what makes a
   bust read as trained rather than as a blob. */
const BUILDS = {
  male: { sh: 39, shY: 90, hem: 29, neck: 8.4, skullW: 15.6, skullH: 16.2, jaw: 9.6 },
  female: { sh: 33.5, shY: 92, hem: 23, neck: 6.9, skullW: 14.4, skullH: 15.4, jaw: 8.2 },
  neutral: { sh: 36.5, shY: 91, hem: 26, neck: 7.6, skullW: 15, skullH: 15.8, jaw: 8.9 },
}

/* Hair masses. Hand-authored per build: each is a closed outline whose OUTER
   edge runs left ear -> crown -> right ear and whose INNER edge comes back
   across the hairline, leaving the forehead open. The mass sits a few units
   proud of the skull so it reads as hair with volume rather than paint on the
   scalp, and the hairline has the temples cut back with a shallow central peak
   — a flat band across the forehead is what makes SVG hair look like a cap. */
const HAIR = {
  /* Short crop, carried to the ear. */
  male:
    'M44.6 31C42.9 22.5 44.2 13.4 49.9 10.6C53.5 9 66.5 9 70.1 10.6' +
    'C75.8 13.4 77.1 22.5 75.4 31C74.4 26.4 73.4 23.2 71.8 22' +
    'C69 20.6 65 23 60 23C55 23 51 20.6 48.2 22' +
    'C46.6 23.2 45.6 26.4 44.6 31Z',
  /* Fuller mass falling past the jaw and tapering out, with a tied-back volume
     (drawn separately, behind the skull) lifting the crown. */
  female:
    'M47.2 47C44.4 39 43.4 23 46 15C48.9 9.8 53.6 7.8 60 7.8' +
    'C66.4 7.8 71.1 9.8 74 15C76.6 23 75.6 39 72.8 47' +
    'C71.8 44 71 38 70.8 31C70.7 27.6 70.6 25.4 70.6 24.2' +
    'C68.2 21.4 64.6 22.8 60 22.8C55.4 22.8 51.8 21.4 49.4 24.2' +
    'C49.4 25.4 49.3 27.6 49.2 31C49 38 48.2 44 47.2 47Z',
  /* Between the two — a fuller crop carried to the jaw line. */
  neutral:
    'M44.8 34C43 24 44.2 13 50 10.2C53.6 8.6 66.4 8.6 70 10.2' +
    'C75.8 13 77 24 75.2 34C74.2 28 73.3 23 71.7 21.8' +
    'C69 20.4 65 22.9 60 22.9C55 22.9 51 20.4 48.3 21.8' +
    'C46.7 23 45.8 28 44.8 34Z',
}

/* Specular running along the lit edge of the hair mass — the one detail that
   stops a dark crop reading as a flat helmet. Clipped to the hair. */
const HAIR_SHEEN = {
  male: 'M46.6 27C46 19.6 49.6 13.2 55.4 11.2',
  female: 'M47.4 34C45.8 24.6 47.2 14.4 53.8 10.6',
  neutral: 'M46.4 30C45.6 21.4 48.8 13.4 54.6 10.8',
}

/* Neck, trapezius, deltoid and the taper to the bottom crop, as one closed
   outline. The top edge is a straight line across the neck, which the skull is
   then drawn over. The trapezius segment is deliberately shallow and the
   deltoid cap tight, so there is a change of direction at the shoulder point
   instead of one continuous dome. */
function bustPath(p) {
  const n = p.neck
  const { sh, shY, hem } = p
  return [
    `M${CX - n} ${NECK_TOP}`,
    `C${CX - n} 53 ${CX - n - 1} 58.5 ${CX - n - 3} ${NECK_BASE}`,
    `C${CX - n - 9} 67 ${CX - sh + 12} 72.5 ${CX - sh + 5} 79.5`,
    `C${CX - sh} 83 ${CX - sh - 1} ${shY - 1} ${CX - sh - 0.4} ${shY + 4}`,
    `C${CX - sh + 3} ${shY + 11} ${CX - hem - 5} 108 ${CX - hem} 120`,
    `L${CX + hem} 120`,
    `C${CX + hem + 5} 108 ${CX + sh - 3} ${shY + 11} ${CX + sh + 0.4} ${shY + 4}`,
    `C${CX + sh + 1} ${shY - 1} ${CX + sh} 83 ${CX + sh - 5} 79.5`,
    `C${CX + sh - 12} 72.5 ${CX + n + 9} 67 ${CX + n + 3} ${NECK_BASE}`,
    `C${CX + n + 1} 58.5 ${CX + n} 53 ${CX + n} ${NECK_TOP}`,
    'Z',
  ].join('')
}

/* Cranium tapering through the cheekbone into a jaw and chin. The jaw is
   implied by this outline and by one soft shadow — there are no features. */
function headPath(p) {
  const w = p.skullW
  const h = p.skullH
  const j = p.jaw
  const cy = HEAD_CY
  return [
    `M${CX} ${cy - h}`,
    `C${CX + w * 0.72} ${cy - h} ${CX + w} ${cy - h * 0.45} ${CX + w} ${cy + h * 0.12}`,
    `C${CX + w} ${cy + h * 0.6} ${CX + j + 1.5} ${cy + h * 0.95} ${CX + j * 0.62} ${cy + h * 1.22}`,
    `C${CX + j * 0.3} ${cy + h * 1.42} ${CX - j * 0.3} ${cy + h * 1.42} ${CX - j * 0.62} ${cy + h * 1.22}`,
    `C${CX - j - 1.5} ${cy + h * 0.95} ${CX - w} ${cy + h * 0.6} ${CX - w} ${cy + h * 0.12}`,
    `C${CX - w} ${cy - h * 0.45} ${CX - w * 0.72} ${cy - h} ${CX} ${cy - h}`,
    'Z',
  ].join('')
}

/* First letter of the first two words. A one-word name yields one letter; an
   empty or whitespace-only name yields '' and the initials are simply not
   drawn (the aria-label still carries the identity). */
export function initialsFrom(name) {
  if (typeof name !== 'string') return ''
  return name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function TrainerAvatar({
  name = '',
  initials,
  accent = 'volt',
  gender,
  photo = null,
  className = '',
  size = 96,
}) {
  const c = ACCENTS[accent] || ACCENTS.volt

  /* useId keeps the gradient ids stable across re-renders and distinct across
     however many avatars a page mounts. Colons are legal in an id but awkward
     inside a url(#…) reference, so they are stripped. */
  const id = `ta${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`

  /* An empty name would otherwise announce as " — profile illustration". */
  const label = name.trim() ? `${name} — profile illustration` : 'Trainer profile illustration'

  /* Number -> px, string -> used as given (e.g. '4rem'). Pass size={null} to
     size the avatar from `className` instead. */
  const box = size == null ? null : { width: typeof size === 'number' ? `${size}px` : size }
  const frameStyle = {
    ...box,
    ...(box ? { height: box.width } : null),
    boxShadow: `inset 0 0 0 1px ${c.glow}0.3), 0 18px 40px -26px ${c.glow}0.45)`,
  }

  /* One frame for both branches, so dropping in a real photograph later cannot
     change the card's geometry. `className` comes last so a call site can
     override the radius (e.g. rounded-full) or the size utilities. */
  const frame = `relative block shrink-0 overflow-hidden rounded-2xl bg-ink-900 ${className}`

  if (typeof photo === 'string' && photo.trim().length > 0) {
    return (
      <span className={frame} style={frameStyle}>
        <img
          src={photo}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </span>
    )
  }

  const build = BUILDS[gender] || BUILDS.neutral
  const marks = initials != null && initials !== '' ? String(initials) : initialsFrom(name)
  const bust = bustPath(build)
  const head = headPath(build)
  const hair = HAIR[gender] || HAIR.neutral
  const sheen = HAIR_SHEEN[gender] || HAIR_SHEEN.neutral

  return (
    <span className={frame} style={frameStyle}>
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={label}
        focusable="false"
      >
        <defs>
          {/* --- plate --- */}
          <linearGradient id={`${id}pl`} x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#131a28" />
            <stop offset="1" stopColor="#070910" />
          </linearGradient>
          <radialGradient id={`${id}bl`} cx="0.5" cy="0.32" r="0.72">
            <stop offset="0" stopColor={`${c.glow}0.34)`} />
            <stop offset="0.55" stopColor={`${c.glow}0.09)`} />
            <stop offset="1" stopColor="rgba(4,5,10,0)" />
          </radialGradient>
          <radialGradient id={`${id}vg`} cx="0.5" cy="0.46" r="0.74">
            <stop offset="0.5" stopColor="rgba(4,5,10,0)" />
            <stop offset="1" stopColor="rgba(4,5,10,0.62)" />
          </radialGradient>

          {/* --- figure volume --- */}
          <linearGradient id={`${id}bd`} x1="18" y1="30" x2="100" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={c.light} />
            <stop offset="0.4" stopColor={c.main} />
            <stop offset="1" stopColor={c.deep} />
          </linearGradient>
          {/* The head is a mid-to-deep tone on purpose and never the brightest
              thing in the frame: a bright, featureless face is exactly what
              makes a faceless bust look wrong. One lit cheekbone does the work. */}
          <linearGradient id={`${id}hd`} x1="46" y1="14" x2="76" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={c.main} />
            <stop offset="0.55" stopColor={c.deep} />
            <stop offset="1" stopColor={c.deep} />
          </linearGradient>
          <linearGradient id={`${id}hr`} x1="44" y1="8" x2="78" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={c.deep} />
            <stop offset="1" stopColor="#0b0e17" />
          </linearGradient>

          {/* form shadow down the shadow side */}
          <linearGradient id={`${id}sd`} x1="58" y1="24" x2="118" y2="118" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(4,5,10,0)" />
            <stop offset="1" stopColor="rgba(4,5,10,0.6)" />
          </linearGradient>
          {/* grounds the figure into the plate so the bottom crop is not a line */}
          <linearGradient id={`${id}bt`} x1="0" y1="88" x2="0" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(4,5,10,0)" />
            <stop offset="1" stopColor="rgba(4,5,10,0.5)" />
          </linearGradient>

          {/* Rim light, two axes. The body rim dies before the far shoulder; the
              head rim dies before the chin, because a bright line under the jaw
              reads as a mouth. */}
          <linearGradient id={`${id}rm`} x1="16" y1="44" x2="64" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={c.light} stopOpacity="0.9" />
            <stop offset="0.45" stopColor={c.light} stopOpacity="0.16" />
            <stop offset="0.8" stopColor={c.light} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}rh`} x1="45" y1="10" x2="71" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={c.light} stopOpacity="0.85" />
            <stop offset="0.5" stopColor={c.light} stopOpacity="0.12" />
            <stop offset="0.82" stopColor={c.light} stopOpacity="0" />
          </linearGradient>

          {/* Reusable soft highlight and soft occlusion. objectBoundingBox
              units, so these two definitions serve every ellipse below. */}
          <radialGradient id={`${id}hi`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={c.light} stopOpacity="0.28" />
            <stop offset="1" stopColor={c.light} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}oc`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(4,5,10,0.5)" />
            <stop offset="1" stopColor="rgba(4,5,10,0)" />
          </radialGradient>

          {/* everything painted onto the figure is clipped to the figure */}
          <clipPath id={`${id}cp`}>
            <path d={bust} />
            <path d={head} />
            <path d={hair} />
          </clipPath>
          <clipPath id={`${id}ch`}>
            <path d={hair} />
          </clipPath>
        </defs>

        <rect width="120" height="120" fill={`url(#${id}pl)`} />
        <rect width="120" height="120" fill={`url(#${id}bl)`} />

        {/* one faint ring — a studio backdrop, not a halo */}
        <circle cx="60" cy="44" r="41" fill="none" stroke={c.main} strokeOpacity="0.11" strokeWidth="1" />

        {/* tied-back hair volume, behind the skull (female build only) */}
        {gender === 'female' ? (
          <ellipse cx="60" cy="12" rx="10.5" ry="6.4" fill={`url(#${id}hr)`} />
        ) : null}

        <path d={bust} fill={`url(#${id}bd)`} />
        <path d={head} fill={`url(#${id}hd)`} />
        <path d={hair} fill={`url(#${id}hr)`} />

        <g clipPath={`url(#${id}cp)`}>
          <rect width="120" height="120" fill={`url(#${id}sd)`} />
          <rect width="120" height="120" fill={`url(#${id}bt)`} />

          {/* the shadow the jaw throws onto the neck — kept tight so the neck
              itself stays readable, which is what tells you this is a head */}
          <ellipse cx="60" cy="55" rx="14" ry="7" fill={`url(#${id}oc)`} />
          {/* mandible falling away on the shadow side */}
          <ellipse cx="70" cy="45" rx="7" ry="7.5" fill={`url(#${id}oc)`} />
          {/* armpit occlusion, where the deltoid meets the chest */}
          <ellipse cx="33" cy="96" rx="8" ry="10" fill={`url(#${id}oc)`} />
          <ellipse cx="87" cy="96" rx="8" ry="10" fill={`url(#${id}oc)`} />

          {/* Clavicle, arm separation, sternum groove, sternocleidomastoid. The
              near side is a highlight and the far side a shadow, so the chest
              reads as volume instead of scratched-on lines. */}
          <g fill="none" strokeLinecap="round">
            <path d="M52.5 52C51.5 57 50.5 60.5 49.6 63" stroke={c.light} strokeOpacity="0.14" strokeWidth="1.1" />
            <path d="M50 66.5C43 70 33 75 26.5 81" stroke={c.light} strokeOpacity="0.16" strokeWidth="1.3" />
            <path d="M70 66.5C77 70 87 75 93.5 81" stroke="#04050a" strokeOpacity="0.24" strokeWidth="1.3" />
            <path d="M25.5 85C28 94 31 104 33 113" stroke="#04050a" strokeOpacity="0.16" strokeWidth="1.2" />
            <path d="M94.5 85C92 94 89 104 87 113" stroke="#04050a" strokeOpacity="0.26" strokeWidth="1.2" />
            <path d="M60 74V120" stroke="#04050a" strokeOpacity="0.12" strokeWidth="1.1" />
          </g>

          {/* volume highlights: lit deltoid, lit trapezius, lit cheekbone */}
          <ellipse cx="27" cy="88" rx="11" ry="11" fill={`url(#${id}hi)`} />
          <ellipse cx="42" cy="72" rx="9" ry="7" fill={`url(#${id}hi)`} />
          <ellipse cx="50" cy="35" rx="6.5" ry="9" fill={`url(#${id}hi)`} />
        </g>

        {/* hair specular, clipped to the hair mass alone */}
        <g clipPath={`url(#${id}ch)`}>
          <path
            d={sheen}
            fill="none"
            stroke={c.light}
            strokeOpacity="0.26"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* rim light traced along the lit contours */}
        <g fill="none" strokeLinejoin="round">
          <path d={bust} stroke={`url(#${id}rm)`} strokeWidth="1.6" />
          <path d={head} stroke={`url(#${id}rh)`} strokeWidth="1.1" />
          <path d={hair} stroke={`url(#${id}rh)`} strokeWidth="1.3" />
        </g>

        <rect width="120" height="120" fill={`url(#${id}vg)`} />

        {/* Initials, corner-set. aria-hidden: the aria-label above already
            names the trainer, so a screen reader must not read this twice. */}
        {marks ? (
          <g aria-hidden="true">
            <text
              x="10"
              y="21"
              className="font-display"
              fontSize="13"
              fontWeight="700"
              letterSpacing="1.1"
              fill={c.light}
              fillOpacity="0.62"
            >
              {marks}
            </text>
            <path
              d="M10.5 25.5h15"
              stroke={c.main}
              strokeOpacity="0.5"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        ) : null}
      </svg>
    </span>
  )
}
