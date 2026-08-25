import React from 'react'

/* ---------------------------------------------------------------------------
   PosedFigure — the anatomy rig every exercise drawing is built on.

   WHAT IT REPLACES. The exercise art used to be line-drawn stick figures, which
   cannot do the one job the product needs: show a lifter where the effort goes.
   A stick has no chest to shade. So the body is now a real silhouette with
   shadeable muscle regions, and a "pose" is nothing but a set of joint
   positions — which means adding an exercise is authoring coordinates, not
   drawing SVG by hand.

   THE POSE CONTRACT. A pose is plain data. Everything is optional; anything
   left out falls back to a neutral standing body, so a half-authored pose is
   still a figure rather than a hole in a card.

     {
       facing: 1 | -1,     // which perpendicular of the torso counts as front
       head:  [x, y],      // centre of the skull
       neck:  [x, y],
       hip:   [x, y],      // centre of the pelvis; torso axis is hip → neck
       headR: 8.5,
       widths: { ... },    // override any half-width in WIDTHS below
       arms: [ { shoulder, elbow, wrist, far?, front? }, ... ],
       legs: [ { hip, knee, ankle, toe,  far?, front? }, ... ],
       Equipment: Component // optional, drawn under the body
     }

   Limbs are a LIST, and order is depth order: the first entry is furthest from
   the viewer. `far: true` dims a limb so a side view reads as a body with two
   arms rather than a body with a spare one.

   `front` flips which side of a bone counts as anterior. It is almost never
   needed — the default derives the front from the bone direction and `facing`,
   which is correct for a hanging arm, a bent knee and everything in between.
   It exists for the overhead positions, where an arm above the head has
   rotated past the point where that derivation still holds: a hanging arm and a
   raised one point opposite ways, so the same sign lands the biceps on opposite
   faces. `front: facing` is the fix, and the two pull-from-overhead exercises
   are the only places that need it.

   Note the default is `-facing`, not `facing`. The torso axis runs hip → neck,
   i.e. UP the body, while a limb bone runs DOWN the limb — opposite directions
   through the same perpendicular, so the sign has to invert or every biceps
   renders on the back of the arm.

   HOW A MUSCLE ENDS UP IN THE RIGHT PLACE. Regions are not drawn at fixed
   coordinates — they are placed in a frame built from the joints themselves.
   The torso frame runs along hip → neck with its width tapering between the two
   ends; each bone gets the same treatment. So a chest patch stays on the chest
   whether the lifter is standing, lying on a bench or hinged over a barbell,
   and nothing has to be re-drawn per pose.

   Patches are clipped to the body part they belong to, which is what keeps a
   generous patch from bleeding outside the silhouette in an extreme pose.

   WHY THE OUTLINE IS DRAWN BY UNDERPRINTING. The body is a chain of overlapping
   quads and circles. Stroking each one draws every internal seam — the figure
   comes out looking like a diagram of itself. So the whole set is drawn twice:
   once fattened in the rim colour, then again on top in the body colour. The
   union gets a clean rim and the seams are covered. It is one extra pass and it
   is the whole reason the figure reads as a body.

   The catch is that it hides EVERY boundary, including the ones a reader needs —
   an arm crossing the chest becomes invisible. So the trick is applied per layer
   rather than to the figure as a whole; see the layer list further down.

   DRAWING SPACE — 0..200 x 0..150, floor at y=132. Set by ExerciseArt.jsx.
   --------------------------------------------------------------------------- */

/* ---- vector helpers ---------------------------------------------------- */
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, k) => [a[0] * k, a[1] * k]
const mag = (a) => Math.hypot(a[0], a[1]) || 1e-6
const norm = (a) => mul(a, 1 / mag(a))
const lerpP = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const mix = (p, q, t) => p + (q - p) * t
const n = (v) => Math.round(v * 100) / 100
const degOf = (v) => (Math.atan2(v[1], v[0]) * 180) / Math.PI

/* The anterior normal of a bone: its direction turned a quarter turn, then
   flipped by `facing`. This one line is why the same patch table works for a
   standing squat and a bench press lying on its side. */
const antOf = (u, facing) => [u[1] * facing, -u[0] * facing]

/* ---- body tones -------------------------------------------------------- */
/* Deliberately monochrome. Muscle colour is the only hue on the body, so a
   shaded region is unmissable and an unshaded one recedes; a tinted body would
   compete with the very thing it is meant to show. */
const BODY_FILL = '#1e293b'
const BODY_RIM = '#64748b'
const RIM_WIDTH = 2.6
const FAR_OPACITY = 0.5

const NEUTRAL = { fill: '#6b7280', fillOpacity: 0 }

/* Below this, a patch is not drawn at all. An unworked region has to be
   genuinely invisible, not faint: nineteen faint grey ellipses on one body reads
   as camouflage, and it competes with the two or three that are the whole point
   of the drawing. The reference infographics colour only the muscles being
   worked and leave the rest as plain skin, which is the right answer. */
const MIN_VISIBLE = 0.02

/* Half-widths, in drawing units, at each end of each bone. A standing figure is
   about 112 units tall with a 17-unit head, which is the seven-and-a-bit head
   canon used for athletic figures — short enough to look like a person, not so
   long it looks stylised.

   `waist` is not cosmetic. A torso that tapers straight from hip to shoulder
   has no waist, and without one the standing poses come out as a rectangular
   slab with a head — no amount of correct joint positions rescues that. */
const WIDTHS = {
  hip: 8.2,
  waist: 7,
  shoulder: 12.6,
  neck: 2.7,
  upperArm: [4.2, 3.4],
  forearm: [3.2, 2.5],
  hand: 2.8,
  thigh: 6.8, // at the hip
  knee: 4.5,
  shin: 4.2,
  ankle: 2.8,
  foot: 2.2,
}

/* Where the waist sits along hip → neck. Also the hinge in the width taper, so
   the two have to be the same number — hence one constant. */
const WAIST_AT = 0.38

/* ---- shape builders ---------------------------------------------------- */
/* A tapered quad from a to b. Joints carry their own circles, so a chain of
   these reads as one smooth limb instead of a run of separate planks. */
const bone = (a, b, wa, wb) => {
  const u = norm(sub(b, a))
  const p = [-u[1], u[0]]
  const A1 = add(a, mul(p, wa))
  const A2 = sub(a, mul(p, wa))
  const B1 = add(b, mul(p, wb))
  const B2 = sub(b, mul(p, wb))
  return {
    t: 'p',
    d: `M${n(A1[0])} ${n(A1[1])}L${n(B1[0])} ${n(B1[1])}L${n(B2[0])} ${n(B2[1])}L${n(A2[0])} ${n(A2[1])}Z`,
  }
}
const ball = (c, r) => ({ t: 'c', c, r })

/* ---- muscle patch tables ----------------------------------------------- */
/* TORSO, in the frame described at the top: `a` runs 0 at the pelvis to 1 at
   the neck, `b` runs -1 (back) to +1 (front) as a fraction of the half-width at
   that height. Reading the table top to bottom is reading the body head to
   pelvis, front column then back column.

   `b` stays inside ±1 on purpose. The patch is clipped to the silhouette, and
   the silhouette edge IS b = ±1 — so a region reaching to -1.15 to look generous
   loses most of itself to the clip and renders as a crescent along the outline
   instead of a muscle. Spans are sized to the muscle and kept in bounds.

   Some spans overlap, which is correct: the pec sits over the top of the ribs
   the lats wrap around, and the obliques run alongside the abs. Later rows paint
   over earlier ones where they meet. */
const TORSO_PATCHES = [
  { region: 'traps', a: [0.82, 1.02], b: [-0.55, 0.35] },
  { region: 'upper-chest', a: [0.7, 0.9], b: [0.1, 0.95] },
  { region: 'chest', a: [0.46, 0.8], b: [0.0, 0.98] },
  { region: 'abs', a: [0.14, 0.54], b: [0.05, 0.88] },
  /* The flank. In the three-quarter views these drawings use, the obliques are
     the strip between the abs and the silhouette edge — so that is where they
     are, rather than at a front-view position no pose here actually shows. */
  { region: 'obliques', a: [0.12, 0.52], b: [-0.3, 0.18] },
  { region: 'upper-back', a: [0.6, 0.88], b: [-0.95, -0.15] },
  { region: 'lats', a: [0.34, 0.76], b: [-0.98, -0.08] },
  { region: 'lower-back', a: [0.08, 0.44], b: [-0.92, -0.2] },
]

/* Glutes hang off the bottom of the pelvis, behind the hip joint — below a=0,
   which is why they are separate from the table above rather than another row
   in it. */
const GLUTE_PATCH = { region: 'glutes', a: [-0.18, 0.12], b: [-1.0, -0.22] }

/* LIMBS. `t` is the span along the bone (0 at its root), `side` is +1 anterior,
   -1 posterior, 0 wrapped around it, and `w` scales the patch against the local
   half-width. */
const ARM_PATCHES = {
  upper: [
    { region: 'biceps', t: [0.18, 0.82], side: 1, w: 0.95 },
    { region: 'triceps', t: [0.1, 0.78], side: -1, w: 0.95 },
  ],
  fore: [{ region: 'forearms', t: [0.06, 0.62], side: 0, w: 1.15 }],
}
const LEG_PATCHES = {
  upper: [
    { region: 'quads', t: [0.16, 0.92], side: 1, w: 1.0 },
    { region: 'hamstrings', t: [0.12, 0.86], side: -1, w: 0.95 },
    /* Inner thigh: high on the femur and toward the midline, so it sits near
       the hip and wrapped around the bone rather than out on either face. */
    { region: 'adductors', t: [0.02, 0.38], side: 0.35, w: 0.7 },
  ],
  fore: [{ region: 'calves', t: [0.04, 0.52], side: -1, w: 1.15 }],
}

/* The three deltoids ring the shoulder joint, so they are placed by angle
   around it instead of along a bone: front toward the chest, side over the cap,
   rear behind. `along` pushes a patch down the arm, away from the neck.

   They are clipped to the shoulder ball, so SHOULDER_CAP below has to be big
   enough to be a shoulder. At the arm's own half-width the ball is barely wider
   than the bone and all three delts come out as dots on a pinched joint. */
const DELT_PATCHES = [
  { region: 'front-delts', ant: 0.5, along: 0.24 },
  { region: 'side-delts', ant: 0.0, along: 0.55 },
  { region: 'rear-delts', ant: -0.5, along: 0.24 },
]
const SHOULDER_CAP = 1.45 // multiple of the upper arm's half-width at the shoulder
const DELT_R = 0.58 // patch radius as a fraction of the cap

/* ---- rendering --------------------------------------------------------- */
const Shapes = ({ shapes, ...props }) =>
  shapes.map((s, i) =>
    s.t === 'c' ? (
      <circle key={i} cx={n(s.c[0])} cy={n(s.c[1])} r={n(s.r)} {...props} />
    ) : (
      <path key={i} d={s.d} {...props} />
    ),
  )

const Patch = ({ p, toneOf }) => {
  const tone = toneOf(p.region) || NEUTRAL
  const o = tone.fillOpacity ?? tone.opacity ?? 0
  if (o <= MIN_VISIBLE) return null
  return (
    <ellipse
      cx={n(p.cx)}
      cy={n(p.cy)}
      rx={n(p.rx)}
      ry={n(p.ry)}
      fill={tone.fill}
      fillOpacity={o}
      transform={`rotate(${n(p.rot)} ${n(p.cx)} ${n(p.cy)})`}
    />
  )
}

/* One ellipse laid along a bone. The ellipse's own x-axis is the across-body
   direction, so `rot` is the anterior normal's angle and the patch turns with
   the limb for free.

   The 0.30 offset is a compromise found by looking at renders. A biceps really
   does sit on the front HALF of the arm, but pushing the patch out by half the
   half-width puts most of it past the silhouette, where the clip removes it and
   leaves a crescent hugging the outline. Just under a third reads as "on the front
   of the arm" and survives the clip.

   `rx` deliberately comes out WIDER than the limb. The clip then trims it to the
   limb's own edge, so the muscle fills the width of the segment and takes the
   silhouette's contour — which is how an anatomy chart draws a muscle. Sizing the
   ellipse to fit inside instead leaves a lozenge floating in the middle of the
   arm with body colour showing around it. */
const alongBone = (region, a, b, hwA, hwB, span, side, w) => {
  const u = norm(sub(b, a))
  const ant = [u[1], -u[0]]
  const tm = (span[0] + span[1]) / 2
  const hw = mix(hwA, hwB, tm)
  const centre = add(lerpP(a, b, tm), mul(ant, side * hw * 0.3))
  return {
    region,
    cx: centre[0],
    cy: centre[1],
    rx: hw * w * 1.15,
    ry: (mag(sub(b, a)) * (span[1] - span[0])) / 2,
    rot: degOf(ant),
  }
}

export default function PosedFigure({ pose = {}, toneOf = () => NEUTRAL, uid = 'fig' }) {
  const facing = pose.facing ?? 1
  const W = { ...WIDTHS, ...(pose.widths || {}) }
  const head = pose.head || [100, 28]
  const neck = pose.neck || [100, 39]
  const hip = pose.hip || [100, 78]
  const headR = pose.headR ?? 8.5

  const arms = pose.arms?.length
    ? pose.arms
    : [{ shoulder: [100, 44], elbow: [100, 63], wrist: [100, 81] }]
  const legs = pose.legs?.length
    ? pose.legs
    : [{ hip: [100, 78], knee: [100, 104], ankle: [100, 130], toe: [110, 131] }]

  /* ---- torso frame, and the patches that live in it ---- */
  const up = norm(sub(neck, hip))
  const torsoAnt = antOf(up, facing)
  const torsoLen = mag(sub(neck, hip))
  /* Piecewise, so the width follows the same waist the silhouette has. A patch
     placed against a straight taper would sit outside the body at the waist. */
  const hwAt = (a) => {
    const t = Math.max(0, Math.min(1, a))
    return t < WAIST_AT
      ? mix(W.hip, W.waist, t / WAIST_AT)
      : mix(W.waist, W.shoulder, (t - WAIST_AT) / (1 - WAIST_AT))
  }
  const torsoPt = (a, b) => add(add(hip, mul(up, a * torsoLen)), mul(torsoAnt, b * hwAt(a)))

  const torsoPatch = ({ region, a, b }) => {
    const am = (a[0] + a[1]) / 2
    const bm = (b[0] + b[1]) / 2
    const centre = torsoPt(am, bm)
    return {
      region,
      cx: centre[0],
      cy: centre[1],
      rx: ((b[1] - b[0]) / 2) * hwAt(am),
      ry: ((a[1] - a[0]) / 2) * torsoLen,
      rot: degOf(torsoAnt),
    }
  }

  const waist = add(hip, mul(up, WAIST_AT * torsoLen))
  const torsoShapes = [
    bone(hip, waist, W.hip, W.waist),
    bone(waist, neck, W.waist, W.shoulder),
    ball(hip, W.hip),
    bone(neck, head, W.neck * 1.3, W.neck),
  ]
  const torsoPatches = [...TORSO_PATCHES, GLUTE_PATCH].map(torsoPatch)

  /* ---- limbs ---- */
  const buildArm = (arm, i) => {
    const { shoulder, elbow, wrist } = arm
    const front = arm.front ?? -facing
    const cap = W.upperArm[0] * SHOULDER_CAP
    const shapes = [
      bone(shoulder, elbow, W.upperArm[0], W.upperArm[1]),
      bone(elbow, wrist, W.forearm[0], W.forearm[1]),
      ball(shoulder, cap),
      ball(elbow, W.upperArm[1]),
      ball(wrist, W.hand),
    ]
    /* Deltoids are placed around the joint using the upper-arm direction, so a
       raised arm carries its shoulder cap up with it. */
    const u = norm(sub(elbow, shoulder))
    const ant = antOf(u, front)
    const patches = [
      ...DELT_PATCHES.map((d) => {
        const centre = add(add(shoulder, mul(ant, d.ant * cap)), mul(u, d.along * cap))
        return {
          region: d.region,
          cx: centre[0],
          cy: centre[1],
          rx: cap * DELT_R,
          ry: cap * DELT_R,
          rot: 0,
        }
      }),
      /* `alongBone` offsets against the bone's raw perpendicular, so the sign
         handed to it has to carry the facing — hence `p.side * front` and not
         `p.side`. Get this wrong and every biceps renders on the triceps. */
      ...ARM_PATCHES.upper.map((p) =>
        alongBone(
          p.region,
          shoulder,
          elbow,
          W.upperArm[0],
          W.upperArm[1],
          p.t,
          p.side * front,
          p.w,
        ),
      ),
      ...ARM_PATCHES.fore.map((p) =>
        alongBone(p.region, elbow, wrist, W.forearm[0], W.forearm[1], p.t, p.side, p.w),
      ),
    ]
    return { id: `a${i}`, far: !!arm.far, shapes, patches }
  }

  const buildLeg = (leg, i) => {
    const root = leg.hip || hip
    const { knee, ankle, toe } = leg
    const front = leg.front ?? -facing
    const shapes = [
      bone(root, knee, W.thigh, W.knee),
      bone(knee, ankle, W.shin, W.ankle),
      ball(root, W.thigh * 0.92),
      ball(knee, W.knee),
      ball(ankle, W.ankle),
    ]
    if (toe) shapes.push(bone(ankle, toe, W.ankle * 0.9, W.foot), ball(toe, W.foot))
    const patches = [
      ...LEG_PATCHES.upper.map((p) =>
        alongBone(p.region, root, knee, W.thigh, W.knee, p.t, p.side * front, p.w),
      ),
      ...LEG_PATCHES.fore.map((p) =>
        alongBone(p.region, knee, ankle, W.shin, W.ankle, p.t, p.side * front, p.w),
      ),
    ]
    return { id: `l${i}`, far: !!leg.far, shapes, patches }
  }

  /* The head goes in its own part with no patches: nothing in the muscle data
     names a facial muscle, and a shaded face reads as an injury. */
  const face = add(head, mul(torsoAnt, headR * 0.5))
  const headPart = {
    id: 'h',
    far: false,
    shapes: [ball(head, headR), ball(face, headR * 0.62)],
    patches: [],
  }

  /* Built before the split so the ids stay unique — the filtered halves would
     each start their numbering at zero and two parts would share a clip path. */
  const armParts = arms.map(buildArm)
  const legParts = legs.map(buildLeg)

  const torsoPart = { id: 't', far: false, shapes: torsoShapes, patches: torsoPatches }

  /* LAYERS, painted back to front, and this is load-bearing twice over.

     DEPTH: everything on the far side goes down first, then the torso, then the
     near limbs ON TOP — because in a side view the near arm hangs in front of
     the ribs and the near leg in front of the pelvis. Draw the limbs before the
     torso and they are buried inside it; the figure comes out a slab with a head.

     CONTOUR: each layer is underprinted on its own, so parts WITHIN a layer
     merge seamlessly while a layer drawn over another keeps its rim against it.
     That distinction is the entire difference between a near arm that reads as an
     arm and one that vanishes into the chest. The torso, neck and head SHOULD
     merge into one silhouette. An arm crossing that silhouette must not — with
     no contour line it is the same colour as what it is in front of, and the
     figure loses its arms even though they were drawn. */
  const layers = [
    { o: FAR_OPACITY, parts: [...armParts.filter((p) => p.far), ...legParts.filter((p) => p.far)] },
    { o: 1, parts: [torsoPart, headPart] },
    { o: 1, parts: legParts.filter((p) => !p.far) },
    { o: 1, parts: armParts.filter((p) => !p.far) },
  ]
  const parts = [...layers.flatMap((l) => l.parts)]

  /* One layer, underprinted: every part's rim goes down, then every part's fill
     covers the seams between them, then the shading. Sorted rather than
     interleaved so a dimmed far limb sits fully behind what follows instead of
     showing its rim through it. */
  const draw = (group, opacity, key) =>
    group.length === 0 ? null : (
      <g key={key} opacity={opacity}>
        {group.map((part) => (
          <Shapes
            key={`rim${part.id}`}
            shapes={part.shapes}
            fill={BODY_RIM}
            stroke={BODY_RIM}
            strokeWidth={RIM_WIDTH}
            strokeLinejoin="round"
          />
        ))}
        {group.map((part) => (
          <Shapes key={`fill${part.id}`} shapes={part.shapes} fill={BODY_FILL} />
        ))}
        {group.map((part) =>
          part.patches.length === 0 ? null : (
            <g key={`sh${part.id}`} clipPath={`url(#${uid}${part.id})`}>
              {part.patches.map((p, i) => (
                <Patch key={i} p={p} toneOf={toneOf} />
              ))}
            </g>
          ),
        )}
      </g>
    )

  return (
    <g>
      <defs>
        {parts.map((part) => (
          <clipPath key={part.id} id={`${uid}${part.id}`}>
            <Shapes shapes={part.shapes} />
          </clipPath>
        ))}
      </defs>
      {layers.map((l, i) => draw(l.parts, l.o, i))}
    </g>
  )
}

/* Exported for the pose files: equipment has to be positioned from the joints
   it is held by, or it detaches from the hands the moment a pose is tuned. */
export { WIDTHS, norm, sub, add, mul, mag, lerpP, degOf, antOf, n }
