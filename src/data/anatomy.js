/* ---------------------------------------------------------------------------
   ANATOMICAL NAMES for the 19 muscle regions the muscle map can light up.

   WHY THIS FILE EXISTS.
   MuscleMap.jsx already knows every region by a short gym name — 'Chest',
   'Lats', 'Rear Delts' — and that is the right label on a phone card. An
   exercise infographic is read differently: it is a chart someone studies, and
   a chart earns trust by naming the muscle the way an anatomy text does and
   then translating it. So each region carries both, and the legend row renders
   as "Pectoralis Major (Chest)".

   WHAT IS SAFE HERE, AND WHAT IS NOT.
   These are textbook anatomical names, so unlike the gym facts governed by the
   TRUTH POLICY at the head of src/data/site.js, they are checkable by anyone
   with a reference — nothing here is a claim about this business.

   Two of them are deliberately NOT Latin, and that is the honest choice:
   'hamstrings' and 'forearms' each cover a group of muscles rather than one, so
   naming a single head ('Biceps Femoris') would be precise about the wrong
   thing — the region drawn on the map is the whole mass. They get the correct
   grouping term instead. 'adductors' is the same case; its plain name is 'Inner
   Thigh' because that is what a member calls it, even though the map and the
   exercise data both key it as 'adductors'.

   ORDER MATTERS. The keys run head-to-toe, which is the order a legend panel
   renders in — so a reader meets the muscles down the body rather than in
   whatever sequence an exercise's data happened to list them.

   KEEPING IT IN STEP WITH THE MAP.
   MuscleMap.jsx owns the region GEOMETRY and its own `MUSCLE_REGION_IDS`; the
   ids below must match that list exactly or a muscle either never gets named or
   gets named but never lights up — and neither failure throws. `assertInStep()`
   is that check, exported rather than run on import so the data layer stays
   free of a dependency on a component. Anything generating a chart should call
   it once at the top.
   --------------------------------------------------------------------------- */

export const MUSCLE_NAMES = {
  traps: { anatomical: 'Trapezius (Upper Fibres)', plain: 'Traps' },
  'front-delts': { anatomical: 'Anterior Deltoid', plain: 'Front Delts' },
  'side-delts': { anatomical: 'Lateral Deltoid', plain: 'Side Delts' },
  'rear-delts': { anatomical: 'Posterior Deltoid', plain: 'Rear Delts' },
  'upper-chest': { anatomical: 'Pectoralis Major (Clavicular)', plain: 'Upper Chest' },
  chest: { anatomical: 'Pectoralis Major', plain: 'Chest' },
  'upper-back': { anatomical: 'Rhomboids & Mid-Trapezius', plain: 'Upper Back' },
  lats: { anatomical: 'Latissimus Dorsi', plain: 'Lats' },
  biceps: { anatomical: 'Biceps Brachii', plain: 'Biceps' },
  triceps: { anatomical: 'Triceps Brachii', plain: 'Triceps' },
  forearms: { anatomical: 'Wrist Flexors & Extensors', plain: 'Forearms' },
  abs: { anatomical: 'Rectus Abdominis', plain: 'Abs' },
  obliques: { anatomical: 'External & Internal Obliques', plain: 'Obliques' },
  'lower-back': { anatomical: 'Erector Spinae', plain: 'Lower Back' },
  glutes: { anatomical: 'Gluteus Maximus', plain: 'Glutes' },
  adductors: { anatomical: 'Adductor Group', plain: 'Inner Thigh' },
  quads: { anatomical: 'Quadriceps Femoris', plain: 'Quads' },
  hamstrings: { anatomical: 'Hamstring Group', plain: 'Hamstrings' },
  calves: { anatomical: 'Gastrocnemius & Soleus', plain: 'Calves' },
}

/* Head-to-toe, taken from the key order above so there is one list, not two. */
export const MUSCLE_ORDER = Object.keys(MUSCLE_NAMES)

/* "Pectoralis Major (Chest)" — one legend row, built in one place. Falls back to
   the raw id rather than rendering an empty row, so an unknown region is
   visible on the chart instead of silently blank. */
export const muscleLabel = (id) => {
  const m = MUSCLE_NAMES[id]
  if (!m) return id
  return m.anatomical === m.plain ? m.anatomical : `${m.anatomical} (${m.plain})`
}

/* Sort any list of region ids head-to-toe and drop anything unknown. */
export const orderMuscles = (ids) =>
  MUSCLE_ORDER.filter((id) => (Array.isArray(ids) ? ids : [ids]).includes(id))

/* Throws with the exact difference rather than returning false — a chart
   generator should stop and be fixed, not quietly emit an incomplete legend.
   Pass MuscleMap's MUSCLE_REGION_IDS. */
export function assertInStep(regionIds) {
  const mine = new Set(MUSCLE_ORDER)
  const theirs = new Set(regionIds)
  const unnamed = [...theirs].filter((id) => !mine.has(id))
  const undrawn = [...mine].filter((id) => !theirs.has(id))
  if (unnamed.length || undrawn.length) {
    throw new Error(
      `anatomy.js is out of step with MuscleMap.jsx — ` +
        `${unnamed.length ? `drawn but unnamed: ${unnamed.join(', ')}. ` : ''}` +
        `${undrawn.length ? `named but never drawn: ${undrawn.join(', ')}.` : ''}`,
    )
  }
  return true
}
