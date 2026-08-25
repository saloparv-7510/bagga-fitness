import React from 'react'
import { sub, add, mul, norm, mag, n } from '../figure.jsx'

/* ---------------------------------------------------------------------------
   Equipment for the exercise poses.

   THE RULE THAT MATTERS: kit is positioned from the pose's own joints, never
   from typed-in coordinates. A barbell reads its position from the wrists that
   are gripping it, a bench from the hip that is lying on it. So when a pose is
   nudged — and every pose gets nudged — the bar comes with it instead of
   floating a few units off the hands, which is the single most obvious way an
   exercise illustration goes wrong.

   Each component takes `{ pose, phase, c }`. `c` is the accent from
   ACCENTS in Decor.jsx, so a chest exercise's bar picks up the same red the
   rest of that card uses. Equipment draws BEFORE the body, which is why a
   gripped bar still reads as gripped: the hand lands on top of it.
   --------------------------------------------------------------------------- */

const STEEL = '#94a3b8'
const STEEL_DARK = '#475569'
const FRAME = '#334155'

/* The near hand — the last arm in the list is the one closest to the viewer, so
   it is the one kit should line up with. */
const grip = (pose, i) => {
  const arms = pose.arms || []
  const arm = i == null ? arms[arms.length - 1] : arms[i]
  return arm?.wrist || [100, 80]
}

/* A loaded bar seen end-on across the drawing: the shaft plus a plate at each
   end. `axis` is the direction the shaft runs, defaulting to horizontal. */
export const Barbell = ({ pose, c, at, half = 46, r = 11, axis = [1, 0] }) => {
  const centre = at || grip(pose)
  const u = norm(axis)
  const a = sub(centre, mul(u, half))
  const b = add(centre, mul(u, half))
  return (
    <g>
      <line
        x1={n(a[0])}
        y1={n(a[1])}
        x2={n(b[0])}
        y2={n(b[1])}
        stroke={STEEL}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {[a, b].map((p, i) => (
        <g key={i}>
          <circle cx={n(p[0])} cy={n(p[1])} r={r} fill={STEEL_DARK} />
          <circle cx={n(p[0])} cy={n(p[1])} r={r} fill="none" stroke={c.main} strokeOpacity=".55" strokeWidth="1.6" />
          <circle cx={n(p[0])} cy={n(p[1])} r={r * 0.42} fill={FRAME} />
        </g>
      ))}
    </g>
  )
}

/* A dumbbell, drawn as its own thing rather than a short barbell. A lifter
   reads a bar where a bell belongs as a mistake in the instruction. */
export const Dumbbell = ({ pose, c, at, armIndex, angle = [1, 0] }) => {
  const centre = at || grip(pose, armIndex)
  const u = norm(angle)
  const a = sub(centre, mul(u, 9))
  const b = add(centre, mul(u, 9))
  return (
    <g>
      <line
        x1={n(a[0])}
        y1={n(a[1])}
        x2={n(b[0])}
        y2={n(b[1])}
        stroke={STEEL}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[a, b].map((p, i) => (
        <g key={i}>
          <circle cx={n(p[0])} cy={n(p[1])} r="6.2" fill={STEEL_DARK} />
          <circle cx={n(p[0])} cy={n(p[1])} r="6.2" fill="none" stroke={c.main} strokeOpacity=".5" strokeWidth="1.4" />
        </g>
      ))}
    </g>
  )
}

/* Both hands on one bell, for a two-handed dumbbell hold. */
export const DumbbellPair = ({ pose, c, angle }) => (
  <g>
    {(pose.arms || []).map((_, i) => (
      <Dumbbell key={i} pose={pose} c={c} armIndex={i} angle={angle} />
    ))}
  </g>
)

/* A flat or inclined bench. `top` is where the pad surface sits under the body;
   `rise` tilts it, so the incline press gets a real incline rather than a flat
   bench with the lifter drawn at an angle. */
export const Bench = ({ top = 108, rise = 0, x1 = 46, x2 = 152 }) => {
  const yL = top + rise
  const yR = top
  const legs = [
    [x1 + 10, yL],
    [x2 - 10, yR],
  ]
  return (
    <g>
      <path
        d={`M${x1} ${n(yL)}L${x2} ${n(yR)}L${x2} ${n(yR + 9)}L${x1} ${n(yL + 9)}Z`}
        fill={FRAME}
      />
      <path d={`M${x1} ${n(yL)}L${x2} ${n(yR)}`} stroke={STEEL_DARK} strokeWidth="2" />
      {legs.map((p, i) => (
        <rect key={i} x={n(p[0])} y={n(p[1] + 9)} width="7" height={n(132 - p[1] - 9)} fill={FRAME} />
      ))}
    </g>
  )
}

/* Rack uprights behind a bench press, so the lift reads as happening in a rack
   rather than in mid-air. */
export const RackUprights = ({ x = 74, top = 62 }) => (
  <g fill={FRAME}>
    <rect x={n(x)} y={n(top)} width="6.5" height={n(132 - top)} />
    <rect x={n(x - 5)} y={n(top)} width="16" height="5" rx="2" />
  </g>
)

/* A fixed overhead bar — pull-ups and hanging raises. Drawn to the grip so the
   hands are on it, with the frame carried up out of the plate. */
export const PullUpBar = ({ pose, c }) => {
  const g = grip(pose)
  const y = g[1] - 1
  return (
    <g>
      <line x1="34" y1={n(y)} x2="166" y2={n(y)} stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1={n(y)} x2="166" y2={n(y)} stroke={c.main} strokeOpacity=".35" strokeWidth="1.4" />
      <rect x="36" y="6" width="6" height={n(y - 6)} fill={FRAME} />
      <rect x="158" y="6" width="6" height={n(y - 6)} fill={FRAME} />
    </g>
  )
}

/* A cable stack with the cable running to the hands. The cable is the reason
   this exists as its own component: a pushdown drawn with a free weight is a
   different exercise.

   The column is deliberately narrow. Drawn at any real proportion it is a slab
   taller than the lifter, and the eye goes to the machine instead of the body —
   which is backwards for a drawing whose subject is the muscle. */
export const CableStack = ({ pose, c }) => {
  const g = grip(pose)
  const pulley = [160, 34]
  return (
    <g>
      <rect x="153" y="26" width="14" height={n(132 - 26)} rx="4" fill={FRAME} />
      <circle cx={n(pulley[0])} cy={n(pulley[1])} r="4.6" fill={STEEL_DARK} stroke={c.main} strokeOpacity=".5" strokeWidth="1.4" />
      <path
        d={`M${n(pulley[0])} ${n(pulley[1])}L${n(pulley[0] - 11)} ${n(pulley[1] + 2)}L${n(g[0] + 4)} ${n(g[1] - 2)}`}
        fill="none"
        stroke={STEEL}
        strokeWidth="1.6"
      />
      {/* Straight bar attachment, across the hands. */}
      <line
        x1={n(g[0] - 13)}
        y1={n(g[1])}
        x2={n(g[0] + 13)}
        y2={n(g[1])}
        stroke={STEEL}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </g>
  )
}

/* A raised step for the calf raise, so the stretch at the bottom has something
   to be a stretch against. */
export const CalfBlock = ({ x = 82, w = 40, h = 16 }) => (
  <g>
    <rect x={n(x)} y={n(132 - h)} width={n(w)} height={n(h)} rx="2" fill={FRAME} />
    <rect x={n(x)} y={n(132 - h)} width={n(w)} height="3" rx="1.5" fill={STEEL_DARK} />
  </g>
)

/* Loaded plates resting on the floor, for the pulls that start from the floor.
   Positioned from the grip so the bar is on the ground under the hands. */
export const FloorBar = ({ pose, c, y }) => {
  const g = grip(pose)
  return <Barbell pose={pose} c={c} at={[g[0], y ?? g[1]]} half={44} r={13} />
}

/* Nothing in the hands — used where a pose needs no kit but the table still
   wants an explicit answer, so a missing key reads as an oversight. */
export const Bodyweight = () => null

/* Floor contact mat, for the plank. Reads as "on the floor" without adding a
   second horizon line next to the plate's own. */
export const Mat = ({ x1 = 34, x2 = 172 }) => (
  <rect x={n(x1)} y="128" width={n(x2 - x1)} height="5" rx="2.5" fill={FRAME} />
)

export const gripOf = grip
export const measure = { mag, norm }
