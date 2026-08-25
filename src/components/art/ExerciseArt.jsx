import React from 'react'
import { ACCENTS } from './Decor.jsx'
import PosedFigure from './figure.jsx'
import * as upper from './poses/upper.jsx'
import * as lower from './poses/lower.jsx'
import * as arms from './poses/arms.jsx'

/* ---------------------------------------------------------------------------
   ExerciseArt — the composer. It owns the plate an exercise is drawn on and
   nothing else: the anatomy lives in figure.jsx, and each exercise's two poses
   live in poses/upper.jsx, poses/lower.jsx and poses/arms.jsx. Splitting it
   that way is what let the stick figures go: a card can now show a shaded body
   in a real position instead of a line drawing, and adding an exercise means
   adding a pose, not editing this file.

   DRAWING SPACE — 0..200 x 0..150, floor line at y=132. Every pose in poses/*
   is authored against that box, so it is a contract, not a preference: change
   it here and sixteen exercises drift off the floor at once.

   PHASE CONVENTION — unchanged, and still load-bearing. It matches the head of
   ExerciseGuide.jsx and `startCue` / `endCue` in src/data/exercises.js:

     start = where the working rep BEGINS — stretched, loaded, bottom position
     end   = where it FINISHES — contracted and locked out

   Those cues ARE the captions printed under these drawings, so swapping the
   two here silently turns every caption into a lie.

   MUSCLE SHADING. `muscles` is optional. Given it, the worked muscles are
   shaded on the posed body itself, which is the whole reason the rig exists —
   a lifter sees where the effort goes in the position they will be in, not on
   a separate chart. Left out, every region resolves to the neutral tone, so a
   grid of cards stays calm and only the opened exercise lights up.

   Photo escape hatch: a non-empty `photo` wins outright, so the owner's real
   photographs can replace the drawings later by filling in `photo` /
   `photoStart` / `photoEnd` in src/data/exercises.js, with no code change.
   --------------------------------------------------------------------------- */

/* Namespace imports rather than `{ POSES }`: three region files are authored
   against one contract, and one of them exporting its table as the module
   default would otherwise take the entire bundle down at build time. */
const TABLES = [
  ['upper', upper.POSES || upper.default],
  ['lower', lower.POSES || lower.default],
  ['arms', arms.POSES || arms.default],
]
const POSES = Object.assign({}, ...TABLES.map(([, table]) => table || {}))

const PLATE_W = 200
const PLATE_H = 150
const FLOOR = 132

/* ---------------------------------------------------------------------------
   MUSCLE COLOUR ENCODING — fixed by the product spec, do not substitute.

   Tier is carried by the HUE FAMILY: primary is red, secondary is orange. The
   individual muscle is a SHADE inside its family, which is what lets a legend
   name Lats and Upper Back apart while both still read as "primary" at a
   glance. Shade comes from the muscle's index in its own tier list, so an
   exercise shades identically on every render and across every card it appears
   in — a colour that moved between the card and the modal would read as a
   rendering fault.
   --------------------------------------------------------------------------- */
const PRIMARY_RAMP = ['#ef4444', '#dc2626', '#f87171', '#b91c1c']
const SECONDARY_RAMP = ['#f97316', '#fb923c', '#ea580c', '#d97706']

/* Both spellings of the same number: SVG-facing code reads `fillOpacity`,
   MuscleMap's region paths read `opacity`. One source, so they cannot drift. */
const tone = (fill, opacity) => ({ fill, opacity, fillOpacity: opacity })

/* Opacity 0, and that is the intended value, not a disabled feature. An
   unworked region is drawn as plain body: nineteen faint grey ellipses on one
   figure reads as camouflage and competes with the two or three regions the
   drawing exists to point at. PosedFigure skips a patch this transparent
   outright, so this also means a card with no `muscles` prop costs nothing.
   MuscleMap keeps its own visible neutral — there, the whole body IS the
   subject and the unworked regions are what give it a shape. */
const NEUTRAL_TONE = tone('#6b7280', 0)
const PRIMARY_OPACITY = 0.92
const SECONDARY_OPACITY = 0.85

const rampMap = (list, ramp, opacity) => {
  const map = new Map()
  if (Array.isArray(list)) {
    list.forEach((id, i) => {
      if (typeof id === 'string') map.set(id, tone(ramp[i % ramp.length], opacity))
    })
  }
  return map
}

/* An unknown art key is a data typo, not a reason to punch a hole in a card.
   An empty pose carries no joint overrides, so the rig draws its own neutral
   standing body and the exercise still gets a plate. */
const STANDING = {}

/* Three tables merged into one namespace, so a key defined twice would lose
   whichever file spreads first and one exercise would quietly wear another's
   pose — a symptom that reads like bad data rather than a collision. */
if (import.meta.env?.DEV) {
  const seen = new Map()
  for (const [file, table] of TABLES) {
    for (const key of Object.keys(table || {})) {
      if (seen.has(key)) {
        console.error(
          `ExerciseArt: pose "${key}" is defined in both poses/${seen.get(key)}.jsx and poses/${file}.jsx.`,
        )
      } else {
        seen.set(key, file)
      }
    }
  }
  for (const [key, entry] of Object.entries(POSES)) {
    if (!entry?.start || !entry?.end) {
      console.error(`ExerciseArt: pose "${key}" is missing a start or end phase.`)
    }
  }
}

export default function ExerciseArt({
  name,
  phase = 'start',
  accent = 'volt',
  muscles,
  photo,
  label,
  className = '',
}) {
  /* Ahead of the photo shortcut, because hooks cannot sit behind a return.
     A dozen of these mount on the exercises page and each one defines its own
     gradients — sharing an id cross-wires the fills between cards, which looks
     like a rendering bug and gets debugged as one. */
  const uid = `ex${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`

  /* An empty string or a null in the data means "no photo yet", not "render a
     broken image". */
  if (typeof photo === 'string' && photo.trim()) {
    return (
      <span className={className}>
        <img
          src={photo}
          /* Empty alt where the drawing is decorative: the surrounding text
             already says it, and a filename read aloud is worse than silence. */
          alt={label || ''}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </span>
    )
  }

  const c = ACCENTS[accent] || ACCENTS.volt

  const entry = POSES[name]
  const pose = entry?.[phase] || entry?.start || STANDING
  /* Equipment usually moves with the phase (bar on the chest, then locked out),
     so the pose's own kit wins; an entry-level Equipment covers the exercises
     whose kit never moves — a bench, a pull-up bar, a cable stack. */
  const Equipment = pose.Equipment || entry?.Equipment

  const primary = rampMap(muscles?.primary, PRIMARY_RAMP, PRIMARY_OPACITY)
  const secondary = rampMap(muscles?.secondary, SECONDARY_RAMP, SECONDARY_OPACITY)
  /* Primary is tested first, so a muscle listed in both tiers is red once
     rather than coloured twice. With no `muscles`, both maps are empty and
     every region falls through to neutral. */
  const toneOf = (region) => primary.get(region) || secondary.get(region) || NEUTRAL_TONE

  return (
    <span className={className}>
      <svg
        viewBox={`0 0 ${PLATE_W} ${PLATE_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        {...(label
          ? { role: 'img', 'aria-label': label }
          : { 'aria-hidden': 'true', focusable: 'false' })}
      >
        <defs>
          <radialGradient id={`${uid}bg`} cx="0.5" cy="0.28" r="0.8">
            <stop offset="0" stopColor={`${c.glow}0.16)`} />
            <stop offset="1" stopColor="rgba(7,9,16,0)" />
          </radialGradient>
        </defs>
        <rect width={PLATE_W} height={PLATE_H} fill="#0b0e17" />
        <rect width={PLATE_W} height={PLATE_H} fill={`url(#${uid}bg)`} />
        <line
          x1="16"
          y1={FLOOR}
          x2="184"
          y2={FLOOR}
          stroke={c.main}
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Kit goes down before the body: a bench pad or a rack upright drawn
            over the lifter is unreadable, while a bar the athlete is gripping
            still reads as gripped because the hand lands on top of it. */}
        {Equipment ? <Equipment pose={pose} phase={phase} accent={accent} c={c} uid={uid} /> : null}

        <PosedFigure pose={pose} toneOf={toneOf} accent={accent} c={c} uid={uid} />
      </svg>
    </span>
  )
}
