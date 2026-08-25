import React from 'react'
import { ACCENTS, Bolt } from './Decor.jsx'
import PosedFigure from './figure.jsx'
import * as upper from './poses/upper.jsx'
import * as lower from './poses/lower.jsx'
import * as arms from './poses/arms.jsx'
import { MUSCLE_LABELS } from '../../data/exercises.js'
import { MUSCLE_NAMES, MUSCLE_ORDER } from '../../data/anatomy.js'

/* ---------------------------------------------------------------------------
   ExerciseInfographic — one exercise as a gym wall chart: hero figure with the
   worked muscles shaded on the body, a named legend beside it, the other phase
   and a front view inset below, and a plain-English explanation.

   WHY THIS IS ONE SVG AND NOT A TAILWIND GRID.
   The brief is that this same artifact ships in the app AND gets exported as a
   standalone image. The repo's export path renders a component with
   renderToStaticMarkup and rasterises it through sharp, and sharp goes through
   librsvg, which does not run CSS — a Tailwind class rasterises as *nothing*.
   So the entire chart is SVG presentation attributes inside one fixed viewBox.
   Tailwind is used for exactly what the house rules give it, the outer layout
   box, and `className` still lets a caller size and place the chart. The payoff
   is that "fixed aspect ratio and scales cleanly" is free rather than defended:
   one viewBox, no reflow, no font-size breakpoints, and the exported PNG is the
   same composition the member sees on their phone.

   Consequences worth knowing before editing:
     * SVG has no text wrapping. `wrap()` below breaks the HOW IT WORKS
       paragraph into tspans against a character budget. Change a font size and
       the budget must change with it.
     * Fonts are declared as stacks ending in a generic family. In the app the
       first name resolves to the site's display face; under librsvg it falls
       through to whatever the exporting machine has. Nothing about the layout
       depends on which one wins.

   THE FIGURE STAGE STAYS DARK IN BOTH THEMES — deliberate, and the one thing
   `forExport` does NOT invert. Two reasons. The muscle shades are tuned to sit
   on a dark body, so flipping the stage would change what the colours look like
   and the legend dot would stop matching the muscle. And the brief asks for the
   exported image and the in-app view to be recognisably the same artifact: the
   chrome turns light for print, the anatomy does not move.

   PHASE CONVENTION — inherited from src/data/exercises.js and ExerciseArt.jsx,
   and load-bearing here because the cues are printed verbatim under the
   drawings:

     start = where the working rep BEGINS — stretched, loaded, bottom position
     end   = where it FINISHES — contracted and locked out

   The hero shows `start`, the bottom-left inset shows `end`. Swapping them
   without swapping the captions turns both labels into lies.

   TRUTH POLICY (see the header of src/data/site.js). Every word of prose on
   this chart is either a fixed heading or a verbatim field from the exercise's
   own data. The HOW IT WORKS paragraph is assembled from `level`, `equipment`,
   `group`, `steps[0]` and the muscle names — there is no authored copy in this
   file describing an exercise, and no number, credential or claim about the
   gym. Add a sentence here only if the data already says it.
   --------------------------------------------------------------------------- */

/* Same three-table merge ExerciseArt.jsx does, and for the same reason: a
   region file exporting its table as a default instead of `POSES` would take
   the bundle down. Duplicated rather than imported because ExerciseArt keeps
   its merged table private — if a third caller ever needs it, that is the
   moment to promote this to poses/index.js rather than copy it again. */
const POSES = Object.assign(
  {},
  upper.POSES || upper.default,
  lower.POSES || lower.default,
  arms.POSES || arms.default,
)

/* An unknown art key is a data typo. The rig draws its own neutral standing
   body from an empty pose, so the chart still comes out whole. */
const STANDING = {}

/* Mirrors `groupAccent` in ExerciseGuide.jsx so an exercise is tinted the same
   colour here as on its card. That map is local to the component, hence the
   copy; the accent only tints the floor line and the trim, never a muscle. */
const GROUP_ACCENT = {
  chest: 'rage',
  back: 'titan',
  legs: 'volt',
  shoulders: 'volt',
  arms: 'rage',
  core: 'titan',
}

/* ---------------------------------------------------------------------------
   MUSCLE COLOUR ENCODING — fixed by the product spec. These are the same two
   ramps and the same three opacities ExerciseArt.jsx paints with, so a muscle
   is the same shade on the card and on the chart.

   Tier is the HUE FAMILY: primary red, secondary orange. The individual muscle
   is a SHADE inside its family, which is the only reason a legend can name Lats
   and Upper Back apart while both still read as "primary" at a glance. Shade
   comes from the muscle's index in its own tier list, so the same exercise
   shades identically on every render.
   --------------------------------------------------------------------------- */
const PRIMARY_RAMP = ['#ef4444', '#dc2626', '#f87171', '#b91c1c']
const SECONDARY_RAMP = ['#f97316', '#fb923c', '#ea580c', '#d97706']

const NEUTRAL_FILL = '#6b7280'
/* Zero on purpose. An unworked region is drawn as plain body — nineteen faint
   grey ellipses reads as camouflage and competes with the handful of regions
   this whole chart exists to point at. PosedFigure skips a patch this
   transparent outright. The fill is still named because the legend borrows it
   for a swatch outline. */
const NEUTRAL_OPACITY = 0
const PRIMARY_OPACITY = 0.92
const SECONDARY_OPACITY = 0.85

/* Both spellings of one number: PosedFigure's paths read `fillOpacity`,
   MuscleMap-style region paths read `opacity`. One source, so they cannot
   drift apart. */
const tone = (fill, opacity) => ({ fill, opacity, fillOpacity: opacity })
const NEUTRAL_TONE = tone(NEUTRAL_FILL, NEUTRAL_OPACITY)

/* ---------------------------------------------------------------------------
   GEOMETRY. One 1200x806 box — roughly 3:2, the proportion a wall chart is
   printed at. Every number below is absolute inside that box, which is what
   makes the layout identical at 320px and at poster size.
   --------------------------------------------------------------------------- */
const W = 1200
const H = 806

const LEFT_X = 34
const LEFT_W = 576
const RIGHT_X = 636
const RIGHT_W = 530

const HERO_Y = 148
const HERO_H = 432

const LEGEND_Y = 148
const LEGEND_H = 380

const INSET_Y = 548
const INSET_W = 257
const INSET_H = 223
const INSET_GAP = 16

const HOW_Y = 596
const HOW_H = 175

const BAR_H = 40 /* legend header bar */
const INSET_BAR_H = 30
const ROW_PAD = 12 /* breathing room above and below a panel's rows */

/* The pose rig authors every exercise against 0..200 x 0..150 with the floor at
   y=132 (the contract at the head of ExerciseArt.jsx). Scaling that box is how
   one pose serves both a 576px hero and a 257px inset. */
const POSE_W = 200
const POSE_H = 150
const POSE_FLOOR = 132

const DISPLAY = "'Oswald Variable', Oswald, Impact, 'Arial Narrow', sans-serif"
const BODY = "'Inter Variable', Inter, 'Segoe UI', Arial, Helvetica, sans-serif"

/* The two prescribed legend bars. They keep their colours in both themes: they
   are the chart's identity, and a red bar that turned pink on export would read
   as a different document. */
const PRIMARY_BAR = '#7f1d1d'
const SECONDARY_BAR = '#1e293b'
const BAR_INK = '#f8fafc'

/* Only the chrome switches. `stage` is absent on purpose — see the header. */
const THEMES = {
  dark: {
    page: '#05070d',
    panel: '#0b0f18',
    edge: '#1e293b',
    ink: '#f4f7fb',
    muted: '#94a3b8',
    dim: '#707c8e',
  },
  light: {
    page: '#f4f6fa',
    panel: '#ffffff',
    edge: '#d3dae5',
    ink: '#0b1220',
    muted: '#475569',
    dim: '#64748b',
  },
}

const STAGE = '#0b0e17'

/* Greedy break against a character budget. Deliberately an estimate rather
   than a measurement: measuring text needs a DOM, and this component has to
   render identically under renderToStaticMarkup where there is none. */
function wrap(text, maxChars) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

/* A sans face averages about half its point size per character. Good enough to
   keep a paragraph inside its box; it is never asked to align to anything. */
const budget = (width, size) => Math.max(8, Math.floor(width / (size * 0.5)))

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

/* Keep only ids the vocabulary knows, drop duplicates, and let primary win over
   secondary so no muscle is ever shaded or named twice. Order is preserved
   because the RAMP INDEX depends on it. */
function tierIds(list, taken) {
  const out = []
  for (const id of Array.isArray(list) ? list : []) {
    if (typeof id !== 'string') continue
    if (!MUSCLE_LABELS[id]) continue
    if (taken.has(id) || out.includes(id)) continue
    out.push(id)
  }
  return out
}

/* "Pectoralis Major (Chest)" — the anatomical half comes from src/data/anatomy.js
   and the plain half from MUSCLE_LABELS in src/data/exercises.js, which is the
   list every other screen already renders. Neither is retyped here, so a rename
   in either file lands on this chart with no edit. The two files disagree today
   on `adductors` ('Inner Thigh' vs 'Adductors'); MUSCLE_LABELS wins, because it
   is what the exercise cards say. */
const anatomicalOf = (id) => MUSCLE_NAMES[id]?.anatomical || MUSCLE_LABELS[id] || id
const plainOf = (id) => MUSCLE_LABELS[id] || id

/* Head-to-toe, so a reader meets the muscles down the body rather than in
   whatever sequence the exercise data happened to list them. Colour is looked
   up by id, never by row position, which is what lets the rows be reordered
   without the dots drifting off the figure. */
const headToToe = (ids) => MUSCLE_ORDER.filter((id) => ids.includes(id))

const article = (word) => (/^[aeiou]/i.test(String(word || '')) ? 'an' : 'a')

const sentenceCase = (s) => {
  const t = String(s || '').trim()
  return t ? t[0].toUpperCase() + t.slice(1) : ''
}

/* Joins names for prose: "A", "A and B", "A, B and C". */
const listWords = (names) => {
  if (names.length <= 1) return names[0] || ''
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/* ---------------------------------------------------------------------------
   Small SVG text helpers. They exist so a font stack, a fill and a tracking
   value are stated once each instead of on forty elements.
   --------------------------------------------------------------------------- */
function T({ x, y, size, fill, weight = 400, family = BODY, tracking, anchor, children }) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={family}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      {...(tracking ? { letterSpacing: tracking } : {})}
      {...(anchor ? { textAnchor: anchor } : {})}
    >
      {children}
    </text>
  )
}

/* A panel header bar: the coloured strip plus its uppercase caption. */
function BarHeading({ x, y, w, h, bg, label, size = 15, radius = 8 }) {
  return (
    <g>
      {/* Square off the bottom corners so the bar sits on its panel rather than
          floating above it — two rects is cheaper than an authored path. */}
      <rect x={x} y={y} width={w} height={h} rx={radius} fill={bg} />
      <rect x={x} y={y + h - radius} width={w} height={radius} fill={bg} />
      <T
        x={x + 16}
        y={y + h / 2 + size * 0.36}
        size={size}
        fill={BAR_INK}
        weight={700}
        family={DISPLAY}
        tracking="1.6"
      >
        {label}
      </T>
    </g>
  )
}

/* ---------------------------------------------------------------------------
   PoseStage — the drawing surface for one figure, composed in the same order
   ExerciseArt.jsx composes it: dark plate, floor line, then equipment BEFORE
   the body (a bench pad drawn over the lifter is unreadable, while a bar the
   athlete grips still reads as gripped because the hand lands on top of it).

   `view` is passed through to the rig so the front-view inset can show the same
   shaded anatomy from the front. Everything else is a straight scale of the
   200x150 pose box.
   --------------------------------------------------------------------------- */
function PoseStage({
  x,
  y,
  w,
  h,
  pose,
  Equipment,
  phase,
  view,
  toneOf,
  accent,
  c,
  uid,
  glow,
  radius = 10,
}) {
  const scale = Math.min(w / POSE_W, h / POSE_H)
  /* Centre the scaled pose box in the panel, so a hero and a 1.3x-smaller inset
     frame the athlete the same way. */
  const dx = x + (w - POSE_W * scale) / 2
  const dy = y + (h - POSE_H * scale) / 2

  return (
    <g>
      <clipPath id={`${uid}clip`}>
        <rect x={x} y={y} width={w} height={h} rx={radius} />
      </clipPath>
      <g clipPath={`url(#${uid}clip)`}>
        <rect x={x} y={y} width={w} height={h} fill={STAGE} />
        <rect x={x} y={y} width={w} height={h} fill={`url(#${glow})`} />
        <g transform={`translate(${dx} ${dy}) scale(${scale})`}>
          <line
            x1="16"
            y1={POSE_FLOOR}
            x2="184"
            y2={POSE_FLOOR}
            stroke={c.main}
            strokeOpacity="0.28"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {Equipment ? (
            <Equipment pose={pose} phase={phase} accent={accent} c={c} uid={`${uid}kit`} />
          ) : null}
          <PosedFigure
            pose={pose}
            view={view}
            toneOf={toneOf}
            accent={accent}
            c={c}
            uid={`${uid}fig`}
          />
        </g>
      </g>
    </g>
  )
}

/* One legend row: the dot, the anatomical name, the plain name in parentheses.
   The dot carries the muscle's fill AND its fill-opacity, because the opacity is
   half of what the shade looks like on the body — a fully opaque dot would name
   a colour the figure never wears. */
function LegendRow({ x, y, id, tone: t, theme, size }) {
  return (
    <g>
      <circle cx={x + 14} cy={y} r={size * 0.42} fill={t.fill} fillOpacity={t.fillOpacity} />
      <text
        x={x + 14 + size * 0.42 + 14}
        y={y + size * 0.36}
        fontFamily={BODY}
        fontSize={size}
        fill={theme.ink}
      >
        <tspan fontWeight="700">{anatomicalOf(id)}</tspan>
        <tspan fill={theme.dim} fontWeight="400">
          {` (${plainOf(id)})`}
        </tspan>
      </text>
    </g>
  )
}

export default function ExerciseInfographic({ exercise, className = '', forExport = false }) {
  /* Several of these can mount at once (a print sheet renders sixteen). Sharing
     a gradient or clip id across them cross-wires the fills between charts,
     which looks like a rendering bug and gets debugged as one. */
  const uid = `eig${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`

  const ex = exercise || {}
  const theme = THEMES[forExport ? 'light' : 'dark']
  const accent = ex.accent || GROUP_ACCENT[ex.group] || 'volt'
  const c = ACCENTS[accent] || ACCENTS.volt

  /* Primary first, so a muscle listed in both tiers is red once. */
  const primaryIds = tierIds(ex.muscles?.primary, new Set())
  const secondaryIds = tierIds(ex.muscles?.secondary, new Set(primaryIds))

  /* Index within the tier IS the shade, so this map is built from the data's own
     order even though the legend renders head-to-toe. */
  const shades = new Map()
  primaryIds.forEach((id, i) =>
    shades.set(id, tone(PRIMARY_RAMP[i % PRIMARY_RAMP.length], PRIMARY_OPACITY)),
  )
  secondaryIds.forEach((id, i) =>
    shades.set(id, tone(SECONDARY_RAMP[i % SECONDARY_RAMP.length], SECONDARY_OPACITY)),
  )
  const toneOf = (region) => shades.get(region) || NEUTRAL_TONE

  const entry = POSES[ex.art]
  const startPose = entry?.start || STANDING
  const endPose = entry?.end || entry?.start || STANDING
  /* Equipment usually moves with the phase (bar on the chest, then locked out),
     so a pose's own kit wins; the entry-level one covers the exercises whose kit
     never moves — a bench, a pull-up bar, a cable stack. */
  const kitFor = (pose) => pose.Equipment || entry?.Equipment

  const primaryRows = headToToe(primaryIds)
  const secondaryRows = headToToe(secondaryIds)

  /* Row height flexes so seven muscles fit the same band as three and neither
     overflows into the insets. Clamped at both ends: unbounded growth would
     leave three rows floating in a tall panel, and unbounded shrink would set
     the names smaller than the fine print. */
  const rowCount = Math.max(1, primaryRows.length + secondaryRows.length)
  const chrome = 2 * BAR_H + 4 * ROW_PAD + 18 /* both bars, both paddings, the gap */
  const rowH = clamp((LEGEND_H - chrome) / rowCount, 28, 42)
  const rowSize = clamp(rowH * 0.44, 13, 17)

  const panelH = (n) => BAR_H + 2 * ROW_PAD + Math.max(n, 1) * rowH
  const primaryPanelH = panelH(primaryRows.length)
  const secondaryY = LEGEND_Y + primaryPanelH + 18

  /* Every sentence below is data or a fixed connective — see TRUTH POLICY in the
     header. A missing field drops its sentence rather than inventing a filler. */
  const groupLabel = sentenceCase(ex.group)
  const what =
    ex.level && ex.equipment && groupLabel
      ? `${ex.name} is ${article(ex.level)} ${String(ex.level).toLowerCase()} ${String(
          ex.equipment,
        ).toLowerCase()} exercise for ${groupLabel.toLowerCase()}.`
      : ''
  const how = Array.isArray(ex.steps) && ex.steps[0] ? String(ex.steps[0]) : ''
  const trains = primaryRows.length
    ? `It loads ${listWords(primaryRows.map(plainOf).map((s) => s.toLowerCase()))} as the prime ${
        primaryRows.length > 1 ? 'movers' : 'mover'
      }${
        secondaryRows.length
          ? `, with ${listWords(
              secondaryRows.map(plainOf).map((s) => s.toLowerCase()),
            )} assisting`
          : ''
      }.`
    : ''
  const howText = [what, how, trains].filter(Boolean).join(' ')

  /* The shading is the whole content of this graphic and a screen reader gets
     nothing from it, so the label carries the muscles by name in both
     vocabularies rather than pointing at a picture. */
  const nameList = (ids) => ids.map((id) => `${anatomicalOf(id)} (${plainOf(id)})`).join(', ')
  const ariaLabel = [
    `Anatomical chart for ${ex.name || 'this exercise'}: targeted muscles.`,
    primaryRows.length ? `Primary muscles: ${nameList(primaryRows)}.` : 'No primary muscles listed.',
    secondaryRows.length ? `Secondary muscles: ${nameList(secondaryRows)}.` : '',
    ex.startCue && ex.endCue
      ? `The rep starts at "${ex.startCue}" and finishes at "${ex.endCue}".`
      : '',
    howText,
  ]
    .filter(Boolean)
    .join(' ')

  const insetBX = RIGHT_X + INSET_W + INSET_GAP

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          {/* One glow, reused by all three stages. The figure panels are the
              only place the accent appears at strength. */}
          <radialGradient id={`${uid}glow`} cx="0.5" cy="0.26" r="0.82">
            <stop offset="0" stopColor={`${c.glow}0.16)`} />
            <stop offset="1" stopColor="rgba(7,9,16,0)" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill={theme.page} />

        {/* ---- title block ---- */}
        <T x={LEFT_X} y={80} size={46} fill={theme.ink} weight={700} family={DISPLAY} tracking="0.5">
          {ex.name || 'Exercise'}
        </T>
        <T x={LEFT_X + 2} y={108} size={16} fill={c.main} weight={600} tracking="4.2">
          TARGETED MUSCLES
        </T>
        <line
          x1={LEFT_X}
          y1={126}
          x2={W - LEFT_X}
          y2={126}
          stroke={theme.edge}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ---- hero figure ---- */}
        <PoseStage
          x={LEFT_X}
          y={HERO_Y}
          w={LEFT_W}
          h={HERO_H}
          pose={startPose}
          Equipment={kitFor(startPose)}
          phase="start"
          toneOf={toneOf}
          accent={accent}
          c={c}
          uid={`${uid}hero`}
            glow={`${uid}glow`}
          radius={14}
        />
        {/* The cue printed verbatim on the stage, because the pose and its
            caption are one claim — see PHASE CONVENTION in the header. */}
        {ex.startCue ? (
          <g>
            <T
              x={LEFT_X + 20}
              y={HERO_Y + HERO_H - 42}
              size={12}
              fill={c.main}
              weight={700}
              tracking="2.4"
            >
              START POSITION
            </T>
            <T x={LEFT_X + 20} y={HERO_Y + HERO_H - 20} size={17} fill="#e2e8f0" weight={500}>
              {ex.startCue}
            </T>
          </g>
        ) : null}

        {/* ---- legend: primary ---- */}
        <g>
          <rect
            x={RIGHT_X}
            y={LEGEND_Y}
            width={RIGHT_W}
            height={primaryPanelH}
            rx={10}
            fill={theme.panel}
            stroke={theme.edge}
            strokeWidth="1.5"
          />
          <BarHeading
            x={RIGHT_X}
            y={LEGEND_Y}
            w={RIGHT_W}
            h={BAR_H}
            bg={PRIMARY_BAR}
            label="PRIMARY MUSCLES"
          />
          {primaryRows.length ? (
            primaryRows.map((id, i) => (
              <LegendRow
                key={id}
                x={RIGHT_X + 8}
                y={LEGEND_Y + BAR_H + ROW_PAD + rowH * (i + 0.5)}
                id={id}
                tone={toneOf(id)}
                theme={theme}
                size={rowSize}
              />
            ))
          ) : (
            <T
              x={RIGHT_X + 22}
              y={LEGEND_Y + BAR_H + ROW_PAD + rowH * 0.5 + rowSize * 0.36}
              size={rowSize}
              fill={theme.dim}
            >
              Not listed
            </T>
          )}
        </g>

        {/* ---- legend: secondary ---- */}
        <g>
          <rect
            x={RIGHT_X}
            y={secondaryY}
            width={RIGHT_W}
            height={panelH(secondaryRows.length)}
            rx={10}
            fill={theme.panel}
            stroke={theme.edge}
            strokeWidth="1.5"
          />
          <BarHeading
            x={RIGHT_X}
            y={secondaryY}
            w={RIGHT_W}
            h={BAR_H}
            bg={SECONDARY_BAR}
            label="SECONDARY MUSCLES"
          />
          {secondaryRows.length ? (
            secondaryRows.map((id, i) => (
              <LegendRow
                key={id}
                x={RIGHT_X + 8}
                y={secondaryY + BAR_H + ROW_PAD + rowH * (i + 0.5)}
                id={id}
                tone={toneOf(id)}
                theme={theme}
                size={rowSize}
              />
            ))
          ) : (
            <T
              x={RIGHT_X + 22}
              y={secondaryY + BAR_H + ROW_PAD + rowH * 0.5 + rowSize * 0.36}
              size={rowSize}
              fill={theme.dim}
            >
              Not listed
            </T>
          )}
        </g>

        {/* ---- inset A: the other phase ---- */}
        <g>
          <rect
            x={RIGHT_X}
            y={INSET_Y}
            width={INSET_W}
            height={INSET_H}
            rx={10}
            fill={theme.panel}
            stroke={theme.edge}
            strokeWidth="1.5"
          />
          <BarHeading
            x={RIGHT_X}
            y={INSET_Y}
            w={INSET_W}
            h={INSET_BAR_H}
            bg={SECONDARY_BAR}
            label="FINISH POSITION"
            size={12}
          />
          <PoseStage
            x={RIGHT_X + 1}
            y={INSET_Y + INSET_BAR_H}
            w={INSET_W - 2}
            h={INSET_H - INSET_BAR_H - 1}
            pose={endPose}
            Equipment={kitFor(endPose)}
            phase="end"
            toneOf={toneOf}
            accent={accent}
            c={c}
            uid={`${uid}end`}
            glow={`${uid}glow`}
            radius={9}
          />
          {ex.endCue ? (
            <T x={RIGHT_X + 14} y={INSET_Y + INSET_H - 14} size={12.5} fill="#cbd5e1" weight={500}>
              {ex.endCue}
            </T>
          ) : null}
        </g>

        {/* ---- inset B: front view ---- */}
        <g>
          <rect
            x={insetBX}
            y={INSET_Y}
            width={INSET_W}
            height={INSET_H}
            rx={10}
            fill={theme.panel}
            stroke={theme.edge}
            strokeWidth="1.5"
          />
          <BarHeading
            x={insetBX}
            y={INSET_Y}
            w={INSET_W}
            h={INSET_BAR_H}
            bg={SECONDARY_BAR}
            label="FRONT VIEW (MUSCLE FOCUS)"
            size={12}
          />
          {/* An empty pose on purpose: the rig draws its own neutral standing
              body, which is what a muscle-focus panel wants — the shading is
              the subject, not the position. */}
          <PoseStage
            x={insetBX + 1}
            y={INSET_Y + INSET_BAR_H}
            w={INSET_W - 2}
            h={INSET_H - INSET_BAR_H - 1}
            pose={STANDING}
            phase="start"
            view="front"
            toneOf={toneOf}
            accent={accent}
            c={c}
            uid={`${uid}front`}
            glow={`${uid}glow`}
            radius={9}
          />
        </g>

        {/* ---- how it works ---- */}
        <g>
          <rect
            x={LEFT_X}
            y={HOW_Y}
            width={LEFT_W}
            height={HOW_H}
            rx={12}
            fill={theme.panel}
            stroke={theme.edge}
            strokeWidth="1.5"
          />
          {/* Reusing Decor's Bolt as a nested <svg> rather than redrawing it —
              it already scales from a viewBox and is already aria-hidden. */}
          <Bolt x={LEFT_X + 22} y={HOW_Y + 22} width={16} height={40} stroke={c.main} />
          <T
            x={LEFT_X + 52}
            y={HOW_Y + 44}
            size={20}
            fill={theme.ink}
            weight={700}
            family={DISPLAY}
            tracking="2.2"
          >
            HOW IT WORKS
          </T>
          <text
            x={LEFT_X + 24}
            y={HOW_Y + 84}
            fontFamily={BODY}
            fontSize={15.5}
            fill={theme.muted}
          >
            {wrap(howText, budget(LEFT_W - 48, 15.5)).map((line, i) => (
              <tspan key={i} x={LEFT_X + 24} dy={i === 0 ? 0 : 22}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      </svg>
    </div>
  )
}
