import React from 'react'
import { useT } from '../../i18n/context.js'

/* ---------------------------------------------------------------------------
   MuscleMap — the canonical anatomical chart for "what does this exercise work".

   One accurate body diagram, reused by all 16 exercises, is both higher quality
   and consistent by construction: the pose figures show HOW a lift moves, this
   shows WHAT it loads.

   How it is built
   ---------------
   * Every figure is drawn as ONE authored half body (x >= 100 in a 200x480 box)
     rendered twice — once straight, once through matrix(-1 0 0 1 200 0). Perfect
     left/right symmetry, half the path data, and it is anatomically honest:
     every region in the vocabulary is a paired muscle, so each side genuinely is
     its own <path>. A region therefore appears twice in the DOM (left + right),
     both carrying the same data-region and the same fill.
   * Volume does NOT come from per-muscle gradients (that would need ~20 gradient
     defs per figure and would seam at the mirror line). Instead: flat muscle
     fills, then a single full-width shading gradient clipped to the silhouette,
     then a rim light stroked along the outer left contour. Because the shade
     layer is one un-mirrored element there is no visible seam, and highlighted
     muscles get shaded exactly like neutral ones.
   * Zero dependencies, zero raster assets, no external URLs. Pure inline SVG.

   Motion policy: the only thing that animates is `fill` / `fill-opacity` on the
   region paths (~200ms). Both are compositor-cheap paint properties on an
   element that never moves, nothing reflows, and the global
   prefers-reduced-motion rule in styles/index.css collapses the duration to 0.

   Photo escape hatch: pass `photo` (a src, or { front, back }) and that view
   renders the owner's real image in the same frame instead of the drawing — so
   generated or photographed anatomy can be dropped in later with no refactor.
   --------------------------------------------------------------------------- */

/* Canonical region vocabulary. Exported so callers can validate their data. */
export const MUSCLE_REGION_IDS = [
  'chest',
  'upper-chest',
  'lats',
  'upper-back',
  'traps',
  'lower-back',
  'front-delts',
  'side-delts',
  'rear-delts',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'obliques',
  'glutes',
  'quads',
  'hamstrings',
  'adductors',
  'calves',
]

const MUSCLE_LABELS = {
  chest: 'Chest',
  'upper-chest': 'Upper Chest',
  lats: 'Lats',
  'upper-back': 'Upper Back',
  traps: 'Traps',
  'lower-back': 'Lower Back',
  'front-delts': 'Front Delts',
  'side-delts': 'Side Delts',
  'rear-delts': 'Rear Delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  glutes: 'Glutes',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  adductors: 'Adductors',
  calves: 'Calves',
}

/* Highlight colours are fixed by the product spec — do not substitute. */
const PRIMARY_FILL = '#ef4444'
const PRIMARY_OPACITY = 0.78
const SECONDARY_FILL = '#f97316'
const SECONDARY_OPACITY = 0.62
const NEUTRAL_FILL = '#1f2937'
const BASE_FILL = '#151d28' /* the body under the muscles = inter-muscle shadow */
const SEPARATION = '#334155'

/* Shared style object (one reference, reused by every region path). */
const FADE = { transition: 'fill 200ms linear, fill-opacity 200ms linear' }

const MIRROR = 'matrix(-1 0 0 1 200 0)'

/* ---------------------------------------------------------------------------
   The silhouette. Half a standing figure on 8-head proportions inside a
   200 x 480 box: crown y=19, chin y=72, nipple line y=128, navel y=205,
   crotch y=242, knee y=347, sole y=458. Head unit ~55px, shoulder span 2.5
   head widths, waist 1.5 — a lifter's V-taper without cartoon exaggeration.
   Arms are held ~15 deg away from the torso, which is what keeps the lats,
   obliques and triceps readable on a chart.

   The outline runs: crown -> temple -> jaw -> neck -> clavicle/trap slope ->
   deltoid cap -> outer arm -> hand -> inner arm -> armpit -> ribs -> waist ->
   iliac crest -> hip -> outer thigh -> knee -> calf -> ankle -> sole ->
   inner ankle -> inner calf -> inner thigh -> crotch, then Z closes it straight
   up the midline. Front and back share it: a standing body's two silhouettes
   differ only in the foot and hand, which are carried by the detail strokes.
   --------------------------------------------------------------------------- */
const SILHOUETTE = [
  'M100 19',
  'C112 19 121.5 30 121.5 44',
  'C121.5 58 117 68.5 112 72.5',
  'C112 79 112.5 85 115.5 90',
  'C128 92.5 140 98 150 108',
  'C157.5 116 160 127 158 139',
  'C162.5 155 166.5 170 168 185',
  'C172 205 175.5 228 177 247',
  'C178.5 259 177.5 269.5 173.5 275.5',
  'C169.5 281 163.5 281 160.5 275',
  'C157.5 268 157.5 258 158.5 247',
  'C156.5 228 152.5 206 148.5 187',
  'C144.5 168 141.5 152 138.5 139',
  'C137 131 135 124 133.5 120',
  'C136.5 131 137.5 141.5 136.5 154',
  'C135 168 130.5 177 128.5 189',
  'C130.5 200.5 134 208.5 137 216.5',
  'C140 224.5 142 232.5 142 242.5',
  'C144 254 144.5 264 143.5 274.5',
  'C141.5 296.5 136.5 320 130.5 340.5',
  'C128.5 347 127.5 350.5 128.5 356.5',
  'C131.5 366.5 132.5 376.5 131.5 388.5',
  'C129.5 404.5 124.5 418 122.5 430.5',
  'C124.5 440 126.5 447.5 127.5 452',
  'C128.5 456 126.5 458.5 122.5 458.5',
  'L106.5 458.5',
  'C103 458.5 101.5 456 102.5 452',
  'C104.5 444 107.5 436.5 109.5 430.5',
  'C107.5 414 105.5 400 105.5 386.5',
  'C105.5 372.5 107.5 362 109.5 352.5',
  'C110.5 340 110 320 107 300',
  'C104.5 283 102.5 262 101.5 250',
  'L100 243',
  'Z',
].join(' ')

/* ---------------------------------------------------------------------------
   FRONT regions — [regionId, path]. Order = paint order.
   chest, upper-chest, front-delts, side-delts, biceps, forearms, abs,
   obliques, quads, adductors, calves.
   --------------------------------------------------------------------------- */
const FRONT_REGIONS = [
  /* upper trapezius ridge is visible from the front too, but the front view
     deliberately does not own `traps` — the back view does, so a traps
     highlight never reads as two different muscles. */

  /* Deltoid: anterior head (medial, clavicular) then the lateral cap. */
  [
    'front-delts',
    'M128.5 97.5 C136 100.5 143 105.5 148 112.5 C151 118 152 126 150.5 134 C145.5 133 140 127 136.5 119.5 C132.5 111 130 104 128.5 97.5 Z',
  ],
  [
    'side-delts',
    'M146.5 105.5 C153.5 112 158.5 121.5 158.5 133 C158.5 141 156.5 148 153 152.5 C149 149 146.5 141.5 146 132.5 C145.5 122 145.5 112.5 146.5 105.5 Z',
  ],

  /* Pectoralis major: clavicular band above, sternal mass below. Wide medial
     attachment at the sternum, converging out to the humerus.

     BOTH HEADS FAN — tall at the sternum, narrow at the lateral tip. That taper
     is the whole reason a pec reads as a pec: drawn as a rectangle of even
     height it comes out as a bandeau across the ribs, which is what these two
     paths used to do. The lower border therefore RISES as it goes outward,
     sweeping up to the armpit rather than running level.

     The lateral tip stops at x≈135. SILHOUETTE puts the torso's own edge at
     x=133.5 (the armpit notch, y=120) widening to 136.5 by y=154, and the arm
     is a separate lobe from x=148 out. Reaching past that lands the muscle in
     the gap BETWEEN torso and arm, where it reads as a red band floating
     clear of the shoulder. */
  [
    'upper-chest',
    'M101 98 C112 97.5 122 100 129 104.5 C133 107.5 135 112 134.5 117 C131 113 125.5 110.5 118 109.5 C111 108.5 105 108.5 101 108.5 Z',
  ],
  [
    'chest',
    'M101 109.5 C112 109.5 122 112 129.5 116.5 C133.5 119 135.5 122.5 135 126.5 C134 131 130 135.5 124 139.5 C116 145 108.5 148.5 101 150 Z',
  ],

  /* Upper arm, anterior. Same envelope as the triceps on the back view — it is
     the same humerus seen from the other side. */
  [
    'biceps',
    'M139 138 C146 134 154 135 158.5 141 C163 152 167 166 168 182 C168.5 188 164.5 191 158.5 190.5 C152.5 190 149 186.5 148 180 C145.5 165 142 150 139 138 Z',
  ],
  [
    'forearms',
    'M149.5 190 C157 186.5 165 188 169 194 C172.5 212 175 230 176 246 C176.5 252 173 255 167 254.5 C161 254 157.5 250 156.5 243 C154.5 226 152 207 149.5 190 Z',
  ],

  /* Rectus abdominis: one column per side of the linea alba, widest at the
     ribs and narrowing to the pubis. */
  [
    'abs',
    'M101 146 C110.5 146 119 148.5 124 153 C127 157.5 127.5 168 126.5 180 C125.5 193 123 205 119 215 C116 222 112 227 108 229 L101 231 Z',
  ],
  /* External oblique: the flank crescent from the lower ribs to the crest. */
  [
    'obliques',
    'M125 150 C131 154 135.5 161 137 170.5 C138 181 136 191.5 132 201 C129 208 125 214.5 120.5 219 C118 221 116 220 117 217 C121 208 124.5 196 126 182 C127 170 127 158.5 125 150 Z',
  ],

  /* Quadriceps (three visible heads, split by the detail strokes) and the
     adductor column medial to them. */
  [
    'quads',
    'M111 247 C120 244 130 244 137.5 247 C142 249 143.5 254.5 143 262.5 C142 284 137.5 310 131 333 C129 340 125.5 342 121 341 C116.5 340 114 336 113.5 330 C112.5 312 112.5 294 112 276 C111.5 262 111 253 111 247 Z',
  ],
  [
    'adductors',
    'M101 245 C105 246 108.5 248 110.5 251 C111.5 258 111 268 110 280 C109 293 107.5 306 106 316 C105 322 103 324 102 321 C101 306 101 280 101 245 Z',
  ],

  /* Lower leg, front: the tibia is subcutaneous down the middle, so the calf
     reads as two flanking strips (medial + lateral gastrocnemius) rather than
     one solid shin. */
  [
    'calves',
    'M111 356 C107.5 364 105.5 374 105.5 386 C105.5 400 108 414 111.5 426 C113.5 428.5 116 429 117 426.5 C114 414 112 400 112 386 C112 374 113 364 115 357 Z',
  ],
  [
    'calves',
    'M127.5 358 C130.5 365 132 375 131 387 C129.5 401 126 414 122.5 426 C120.5 428.5 118.5 428 118.5 425.5 C121.5 413 123.5 400 124 387 C124.5 375 124 365 122.5 357.5 Z',
  ],
]

/* Front detail: joint definition, tendinous lines, fingers, toes. Neutral
   stroke only — these never light up. */
const FRONT_DETAIL = [
  'M100 70.5 C106.5 70 110.5 67 112.5 62.5', // jaw
  'M104 78 C106 84 110 88 115 90', // sternocleidomastoid
  'M101 96 C112 97 124 99 133 104', // clavicle
  'M141 116 C143 122 144 128 144 134', // pec / deltoid groove
  'M101 147 L101 231', // linea alba
  'M101 164 C108 164.5 116 166 122.5 169', // tendinous inscriptions
  'M101 183 C107.5 183.5 114.5 185 120.5 188',
  'M101 202 C106.5 202.5 112 204 117 206.5',
  'M101 205 C103.5 205.5 104 208.5 102 210', // navel
  'M129 148 C132 152 134 157 135 162', // serratus
  'M132 156 C134.5 160 136 164 136.5 168',
  'M148 150 C152 162 155 174 156 184', // biceps groove
  'M149 188 C155 185 163 186 167 190', // elbow crease
  'M158 200 C161 216 164 232 165 246', // forearm mass
  'M158 250 C164 248.5 170 249 175 251', // wrist
  'M164 265 L165 274', // fingers
  'M170 264 L170 273',
  'M124 252 C128 274 129 300 127 330', // rectus femoris / vastus lateralis
  'M115 300 C118 315 119 328 118 336', // vastus medialis
  'M112 344 C118 341 125 342 129 346', // patella
  'M118 358 C118 380 118 404 117 424', // tibial crest
  'M110 442 C116 440 122 441 126 444', // ankle
  'M113 452 L113 458', // toes
  'M119 452 L119 458',
]

/* ---------------------------------------------------------------------------
   BACK regions — lats, upper-back, traps, rear-delts, triceps, lower-back,
   glutes, hamstrings, calves.
   --------------------------------------------------------------------------- */
const BACK_REGIONS = [
  /* Trapezius: the classic diamond half — occiput, out to the acromion, then
     the lower fibres converging back onto the spine. */
  [
    'traps',
    'M101 79 C111 79.5 119 83 126 89 C134 95 143 101 150.5 108.5 C153 111.5 151.5 115.5 147 115 C139 114 131.5 116.5 126 122 C124 134 121.5 147 117 158 C113 167.5 107.5 173.5 101 176 Z',
  ],
  /* The infraspinatus / teres window between the trapezius and the lat — what
     a chart means by "upper back". */
  [
    'upper-back',
    'M126 122 C132 118.5 139 118 143 121 C145.5 126 146 134 144 141 C141.5 148 137 153 131 155 C127 155.5 124.5 153.5 124.5 149.5 C125 141 126 130 126 122 Z',
  ],
  [
    'rear-delts',
    'M146 106 C153 112.5 158.5 122 158.5 133.5 C158.5 141 156.5 148 153 152 C149 148.5 146.5 141 146 132.5 C145.5 122 145 112.5 146 106 Z',
  ],
  /* Latissimus dorsi: apex at the armpit, spreading down to a long spinal
     attachment. This path is the V-taper. */
  [
    'lats',
    'M136.5 125 C141 131 143 141.5 142 152.5 C141 164 137 174.5 131 182.5 C126 188.5 119 192.5 111 195 C107.5 196 104 196.5 101 196.5 L101 172.5 C105.5 170 110.5 164.5 115.5 156.5 C122.5 145.5 129.5 134.5 136.5 125 Z',
  ],
  [
    'triceps',
    'M139 138 C146 134 154 135 158.5 141 C163 152 167 166 168 182 C168.5 188 164.5 191 158.5 190.5 C152.5 190 149 186.5 148 180 C145.5 165 142 150 139 138 Z',
  ],
  [
    'forearms',
    'M149.5 190 C157 186.5 165 188 169 194 C172.5 212 175 230 176 246 C176.5 252 173 255 167 254.5 C161 254 157.5 250 156.5 243 C154.5 226 152 207 149.5 190 Z',
  ],
  /* Erector spinae, lumbar column. */
  [
    'lower-back',
    'M101 196.5 C106 197 110.5 199.5 113.5 203.5 C116 207.5 117 214 116 221.5 C115 229 112 235 108 238 C105.5 239.5 102.5 239.5 101 238.5 Z',
  ],
  [
    'glutes',
    'M101 207 C110.5 205.5 120.5 208 128.5 213.5 C136 219 140.5 227 141.5 236.5 C142 246 138 254 131 258.5 C124 263 115 264.5 107.5 262.5 C103.5 261.5 101 259 101 255.5 Z',
  ],
  [
    'hamstrings',
    'M104 264 C113 262.5 124 262.5 133 265 C139 267 142.5 271.5 142.5 278 C142 298 138 318 131.5 334 C129 340 125 342 120.5 341 C116 340 113.5 336 113 330 C112 312 110 296 106.5 281 C104.5 272 103 267 104 264 Z',
  ],
  /* Back of the lower leg is genuinely one mass (gastrocnemius over soleus),
     so unlike the front it is drawn solid. */
  [
    'calves',
    'M110 355 C116 351.5 123.5 352.5 128 357 C131 363.5 132.5 374 131.5 386.5 C130 401 126 414.5 122.5 426.5 C119.5 429.5 114 429.5 111 426.5 C107.5 414 105 400.5 105 386.5 C105 374 107 363 110 355 Z',
  ],
]

const BACK_DETAIL = [
  'M101 78 C106 78.5 110 80 113 83', // occiput
  'M101 100 L101 238', // spinal groove
  'M105 92 C115 97 128 104 141 111', // upper trap fibres
  'M104 118 C112 124 118 132 121 141', // mid trap fibres
  'M124 120 C128 132 130 143 129 153', // scapular border
  'M139 112 C143 120 145 128 145 136', // rear delt / arm groove
  'M104 186 C112 178 121 164 130 146', // lat fibres
  'M104 194 C111 188 118 178 125 165',
  'M105 205 C109 214 110 226 108 236', // lumbar column
  'M110 212 C114 214 117 217 118 221', // sacral dimple
  'M147 155 C151 162 154 170 156 178', // triceps long head
  'M150 172 C154 176 158 178 163 178', // triceps horseshoe
  'M149 188 C155 185 163 186 167 190', // elbow
  'M158 200 C161 216 164 232 165 246', // forearm mass
  'M158 250 C164 248.5 170 249 175 251', // wrist
  'M123 268 C126 288 127 310 125 332', // hamstring split
  'M112 344 C119 341 126 342 130 345', // knee crease
  'M118 356 C118 372 118 386 117 398', // gastrocnemius heads
  'M114 404 C115 414 116 422 116 428', // achilles
  'M120 404 C120 414 119 422 119 428',
  'M108 448 C112 446 118 446 122 448', // heel
]

const VIEWS = {
  front: { caption: 'Front', regions: FRONT_REGIONS, detail: FRONT_DETAIL },
  back: { caption: 'Back', regions: BACK_REGIONS, detail: BACK_DETAIL },
}

/* One half body: muscle regions, then the neutral definition strokes. */
function Half({ regions, detail, toneOf }) {
  return (
    <g>
      {regions.map(([region, d], i) => {
        const tone = toneOf(region)
        return (
          <path
            key={`${region}-${i}`}
            d={d}
            data-region={region}
            fill={tone.fill}
            fillOpacity={tone.opacity}
            style={FADE}
          />
        )
      })}
      <g
        fill="none"
        stroke={SEPARATION}
        strokeOpacity="0.62"
        strokeWidth="1.05"
        strokeLinecap="round"
      >
        {detail.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </g>
  )
}

function Figure({ view, toneOf, uid, title, ariaLabel, photo }) {
  const t = useT()
  const spec = VIEWS[view]
  const id = `${uid}${view}`

  return (
    <figure className="m-0 flex min-w-0 flex-1 flex-col items-center">
      {photo ? (
        <img
          src={photo}
          alt=""
          loading="lazy"
          decoding="async"
          className="block h-auto w-full rounded-xl object-contain"
          {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel, alt: ariaLabel } : {})}
        />
      ) : (
        <svg
          viewBox="0 0 200 480"
          className="block h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          {...(ariaLabel
            ? { role: 'img', 'aria-label': ariaLabel }
            : { 'aria-hidden': 'true', focusable: 'false' })}
        >
          <title>{title}</title>
          <defs>
            {/* chart panel */}
            <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#101420" stopOpacity="0.9" />
              <stop offset="1" stopColor="#070910" stopOpacity="0.92" />
            </linearGradient>
            {/* the single shading pass, clipped to the body */}
            <linearGradient id={`${id}s`} x1="26" y1="0" x2="184" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.11" />
              <stop offset="0.34" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.6" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="1" stopColor="#000000" stopOpacity="0.44" />
            </linearGradient>
            {/* rim light: transparent at the midline, bright at the outer edge.
                Lives in the mirrored path's local space, so it lands on the
                screen-left contour. */}
            <linearGradient id={`${id}r`} x1="100" y1="0" x2="190" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.55" stopColor="#e2e8f0" stopOpacity="0.12" />
              <stop offset="1" stopColor="#f4f7fb" stopOpacity="0.34" />
            </linearGradient>
            <radialGradient id={`${id}f`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#000000" stopOpacity="0.6" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${id}c`}>
              <path d={SILHOUETTE} />
              <path d={SILHOUETTE} transform={MIRROR} />
            </clipPath>
          </defs>

          <rect width="200" height="480" rx="16" fill={`url(#${id}p)`} />

          {/* contact shadow on the floor */}
          <ellipse cx="100" cy="461" rx="54" ry="10" fill={`url(#${id}f)`} />

          {/* body mass beneath the muscles — reads as the separations */}
          <path d={SILHOUETTE} fill={BASE_FILL} />
          <path d={SILHOUETTE} fill={BASE_FILL} transform={MIRROR} />

          {/* muscles, mirrored */}
          <Half regions={spec.regions} detail={spec.detail} toneOf={toneOf} />
          <g transform={MIRROR}>
            <Half regions={spec.regions} detail={spec.detail} toneOf={toneOf} />
          </g>

          {/* one shading pass over everything, so highlights stay volumetric */}
          <rect
            width="200"
            height="480"
            fill={`url(#${id}s)`}
            clipPath={`url(#${id}c)`}
            pointerEvents="none"
          />

          {/* contour + rim light */}
          <g fill="none" stroke={SEPARATION} strokeOpacity="0.55" strokeWidth="0.9">
            <path d={SILHOUETTE} />
            <path d={SILHOUETTE} transform={MIRROR} />
          </g>
          <path
            d={SILHOUETTE}
            transform={MIRROR}
            fill="none"
            stroke={`url(#${id}r)`}
            strokeWidth="1.4"
            pointerEvents="none"
          />
        </svg>
      )}
      <figcaption className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-silver-500">
        {t(spec.caption)}
      </figcaption>
    </figure>
  )
}

function Swatch({ color }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]"
      style={{ backgroundColor: color, boxShadow: `0 0 0 1px ${color}55` }}
    />
  )
}

export default function MuscleMap({
  primary = [],
  secondary = [],
  view = 'both',
  className = '',
  label,
  photo,
}) {
  const t = useT()
  /* Normalise: keep only known ids, drop duplicates, and let primary win over
     secondary so no muscle is ever coloured or named twice. */
  const known = (list) =>
    (Array.isArray(list) ? list : [list]).filter((id) => MUSCLE_REGION_IDS.includes(id))

  const primarySet = new Set(known(primary))
  const secondarySet = new Set(known(secondary).filter((id) => !primarySet.has(id)))

  const toneOf = (region) => {
    if (primarySet.has(region)) return { fill: PRIMARY_FILL, opacity: PRIMARY_OPACITY }
    if (secondarySet.has(region)) return { fill: SECONDARY_FILL, opacity: SECONDARY_OPACITY }
    return { fill: NEUTRAL_FILL, opacity: 1 }
  }

  /* Keep the vocabulary's order rather than the caller's, so the legend reads
     top-down the body no matter how the data was written. */
  const order = (set) => MUSCLE_REGION_IDS.filter((id) => set.has(id))
  const primaryNames = order(primarySet).map((id) => t(MUSCLE_LABELS[id]))
  const secondaryNames = order(secondarySet).map((id) => t(MUSCLE_LABELS[id]))

  const sentence =
    primaryNames.length || secondaryNames.length
      ? [
          primaryNames.length ? t('Primary muscles: {list}.', { list: primaryNames.join(', ') }) : '',
          secondaryNames.length ? t('Secondary muscles: {list}.', { list: secondaryNames.join(', ') }) : '',
        ]
          .filter(Boolean)
          .join(' ')
      : t('No muscle groups highlighted.')

  const named = typeof label === 'string' && label.trim() ? label.trim() : ''
  const describe = (caption) => {
    if (!label) return undefined
    return named
      ? t('{caption} view muscle chart for {name}. {sentence}', { caption, name: named, sentence })
      : t('{caption} view muscle chart. {sentence}', { caption, sentence })
  }

  const views = view === 'both' ? ['front', 'back'] : [VIEWS[view] ? view : 'front']

  /* SSR/StrictMode-safe unique prefix for the gradient + clip ids. */
  const uid = `mm${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  const photoFor = (v) => (typeof photo === 'string' ? (v === views[0] ? photo : '') : photo?.[v] || '')

  return (
    <div className={className}>
      <div className="flex items-start justify-center gap-2 sm:gap-3">
        {views.map((v) => (
          <Figure
            key={v}
            view={v}
            toneOf={toneOf}
            uid={uid}
            title={t('{caption} view muscle chart. {sentence}', { caption: t(VIEWS[v].caption), sentence })}
            ariaLabel={describe(t(VIEWS[v].caption))}
            photo={photoFor(v)}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-silver-400">
        <span className="inline-flex items-center gap-1.5">
          <Swatch color={PRIMARY_FILL} />
          {t('Primary')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Swatch color={SECONDARY_FILL} />
          {t('Secondary')}
        </span>
      </div>

      {(primaryNames.length > 0 || secondaryNames.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {primaryNames.map((name) => (
            <span
              key={`p-${name}`}
              className="rounded-full bg-rage-500/15 px-2 py-0.5 text-[11px] font-medium text-rage-300 ring-1 ring-inset ring-rage-500/35"
            >
              {name}
            </span>
          ))}
          {secondaryNames.map((name) => (
            <span
              key={`s-${name}`}
              className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[11px] font-medium text-orange-300 ring-1 ring-inset ring-orange-500/35"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
