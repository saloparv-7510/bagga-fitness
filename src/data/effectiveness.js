/* ---------------------------------------------------------------------------
   EFFECTIVENESS RANKING — for each body part, which of OUR exercises builds it
   best, and how the rest line up behind it.

   Read the TRUTH POLICY at the top of src/data/site.js first. This file lives
   under it, and the paragraph below is the part of that rule which applies to
   training claims rather than business facts.

   WHAT A RANKING HERE IS ALLOWED TO REST ON
   Only mechanics a coach can point at on the floor, in five words or fewer:
     loadable range     how much weight the movement can carry, and how finely
                        that weight can be increased
     span               how much of the target muscle the movement actually
                        moves, rather than holds still
     stretch under load whether the muscle is loaded at its long length
     stability cost     how much of your effort goes into staying balanced
                        instead of into the muscle
     scalability        whether it still works after a year of getting stronger
   Nothing else. Where two exercises are genuinely close, the one that keeps
   working for longer wins, because that is the difference a member feels.

   NO NUMBERS. THE HARD RULE, DO NOT BREAK IT.
     no EMG figures, no "activates X percent", no percentages of any kind, no
     study citations, no "research shows", no invented rep or load thresholds.
   A ranking argument that needs a number to stand up is either written
   qualitatively or the exercise is ranked lower. This is a gym website, not a
   paper, and a fabricated statistic is the fastest way to lose a reader who
   knows better.

   FIELD NOTES
     - Order IS the rank. `rank` is derived from array position, so reordering
       the array is the only edit needed to change a ranking.
     - `best` is derived from ranked[0].id — never typed twice, so the headline
       and the list cannot disagree with each other.
     - `bodyPart` labels are read from `muscleGroups` in exercises.js, so a
       label change there flows through here instead of drifting apart.
     - `role` is one of five card tags: Primary builder, Heavy compound,
       Isolation, Accessory, Stability. Keep the vocabulary closed — the tags
       are only useful if they mean the same thing on every card.
     - `note` says what THIS exercise contributes that the one directly above
       it does not. Rank 1 has nothing above it, so its note states the
       standard it sets for the group instead. That is the whole value of the
       list: a reader who already benches wants to know why the incline is
       there, not to be told the bench is good.
     - `accent` must be one of volt | titan | rage | silver — the keys of
       ACCENTS in src/components/art/Decor.jsx.

   ADDING A 17TH EXERCISE: rank it here as well, or the guard below says so.
   --------------------------------------------------------------------------- */

import { exercises, muscleGroups } from './exercises.js'

/* Authored source of the rankings. Deliberately holds no labels, no ranks and
   no exercise names — everything derivable is derived further down, so this
   array only carries the judgement calls a coach would actually argue about. */
const RANKINGS = [
  {
    group: 'chest',
    accent: 'rage',
    why: 'It carries the heaviest load of the three while the bench does the balancing for you, so the chest gets pushed hard and then progressed in small, repeatable jumps for years.',
    ranked: [
      {
        id: 'bench-press',
        role: 'Heavy compound',
        note: 'Sets the standard for the group — with the torso supported, almost all of your effort goes into the load instead of into holding yourself steady.',
      },
      {
        id: 'incline-db-press',
        role: 'Primary builder',
        note: 'Adds the upper chest and a deeper bottom stretch than a straight bar allows, and loads each arm on its own so the stronger side cannot quietly carry the weaker one.',
      },
      {
        id: 'pushup',
        role: 'Accessory',
        note: 'Adds a braced, moving torso in place of a fixed bench, and scales down far enough to be a first chest exercise — or the only one available on a day without a gym.',
      },
    ],
  },
  {
    group: 'back',
    accent: 'volt',
    why: 'It takes the lats from a full overhead stretch to a full contraction against your whole bodyweight, and nothing else here moves that much lat range with nothing to lean on.',
    ranked: [
      {
        id: 'pullup',
        role: 'Primary builder',
        note: 'Sets the standard for lat range — a loaded stretch at the top of the hang that no rowing angle in this list reaches.',
      },
      {
        id: 'bent-row',
        role: 'Heavy compound',
        note: 'Adds a horizontal pull the shoulder blades can fully retract into, on a load you can set from light, so it works long before a first pull-up and keeps working after.',
      },
      /* Third, and the ranking is not a slight — this is the heaviest lift in
         the library. It sits here because the question this file answers is
         which exercise BUILDS the back, and the lats and mid-back hold
         position under a deadlift rather than travelling through range. The
         note says so out loud so the placement reads as a reason, not a
         low opinion of the lift. */
      {
        id: 'deadlift',
        role: 'Heavy compound',
        note: 'Adds far more load than either pull, straight into the spinal erectors, traps and grip — but the lats hold position here instead of moving, which is why it ranks below two exercises it out-loads.',
      },
    ],
  },
  {
    group: 'legs',
    accent: 'titan',
    why: 'It drives a heavy bar through the deepest loaded knee and hip range of anything here, and a barbell is the easiest thing in the gym to add a little more weight to each week.',
    ranked: [
      {
        id: 'squat',
        role: 'Heavy compound',
        note: 'Sets the standard for the group — deep loaded range on the quads and glutes at the same time, with plate-by-plate progression that keeps paying off for years.',
      },
      {
        id: 'rdl',
        role: 'Heavy compound',
        note: 'Adds load at the far end of the hamstrings, which stay short through a squat, and teaches the hip hinge the squat pattern only half covers.',
      },
      {
        id: 'lunge',
        role: 'Accessory',
        note: 'Adds one leg at a time under the weight, so a side that has been coasting behind the other has to hold its own balance and finish its own rep.',
      },
      {
        id: 'calf-raise',
        role: 'Isolation',
        note: 'Adds the only stretch-to-squeeze work the calves get here — every lift above stands on them, and none takes the ankle through its range under load.',
      },
    ],
  },
  {
    group: 'shoulders',
    accent: 'volt',
    why: 'It is the heaviest overhead load in the library and the only shoulder movement here that presses through a full range while the whole body works to keep the ribs stacked.',
    ranked: [
      {
        id: 'ohp',
        role: 'Heavy compound',
        note: 'Sets the standard — a full lockout you can keep adding weight to, with the trunk and glutes paying to keep the bar over the mid-foot.',
      },
      {
        id: 'lateral-raise',
        role: 'Isolation',
        note: 'Adds the sideways line the press rides straight past, so the side delt that gives a shoulder its width is loaded directly rather than left to hope.',
      },
    ],
  },
  {
    group: 'arms',
    accent: 'rage',
    why: 'It loads the biceps from a fully straight arm to a hard squeeze on a bar you can add plates to, so arm work progresses the same way the big lifts do.',
    ranked: [
      {
        id: 'curl',
        role: 'Primary builder',
        note: 'Sets the standard for the group — free-weight load you can raise in small steps, through the whole range from a long arm to a full squeeze.',
      },
      {
        id: 'triceps-pushdown',
        role: 'Isolation',
        note: 'Adds the triceps, the bigger of the two upper-arm muscles, under cable tension a bar cannot hold at the bottom — though with the upper arm pinned to the ribs, the long head is never loaded at full length.',
      },
    ],
  },
  {
    group: 'core',
    accent: 'silver',
    why: 'The abs genuinely shorten here against a lever that gets harder as the knees straighten, so there is always a next step — a hold can only ever get longer.',
    ranked: [
      {
        id: 'hanging-raise',
        role: 'Primary builder',
        note: 'Sets the standard — the abs work through a range against a lever you can lengthen, so the exercise has somewhere to go once it stops being hard.',
      },
      {
        id: 'plank',
        role: 'Stability',
        note: 'Adds the opposite job — resisting the spine extending rather than bending it, which is exactly what the abs do under a squat or an overhead press, and it needs no bar, no grip and no skill to start.',
      },
    ],
  },
]

/* Every id above has to exist in exercises.js AND sit in the group it is
   ranked under, or a card renders a blank row that nobody notices for months.
   The check is one pass at import and silent when the data is right — it turns
   a typo or a newly added exercise into a message instead of a hole in the UI. */
const groupById = new Map(exercises.map((ex) => [ex.id, ex.group]))
const rankedIds = RANKINGS.flatMap((g) => g.ranked.map((e) => e.id))
const drift = [
  ...rankedIds.filter((id) => !groupById.has(id)).map((id) => `unknown id "${id}"`),
  ...RANKINGS.flatMap((g) =>
    g.ranked
      .filter((e) => groupById.has(e.id) && groupById.get(e.id) !== g.group)
      .map((e) => `"${e.id}" is a ${groupById.get(e.id)} exercise but is ranked under ${g.group}`),
  ),
  ...exercises.filter((ex) => !rankedIds.includes(ex.id)).map((ex) => `"${ex.id}" is not ranked anywhere`),
]
if (drift.length) {
  console.warn(`[effectiveness] out of sync with exercises.js — ${drift.join('; ')}`)
}

const labelByGroup = new Map(muscleGroups.map((g) => [g.id, g.label]))
const nameById = new Map(exercises.map((ex) => [ex.id, ex.name]))

/* Keyed by group id so a card can look up its own ranking in one hit. */
export const effectiveness = Object.fromEntries(
  RANKINGS.map((g) => [
    g.group,
    {
      bodyPart: labelByGroup.get(g.group) || g.group,
      accent: g.accent,
      best: g.ranked[0].id,
      why: g.why,
      ranked: g.ranked.map((e, i) => ({ id: e.id, rank: i + 1, role: e.role, note: e.note })),
    },
  ]),
)

/* Flat and ordered for rendering. The order comes from `muscleGroups`, which is
   the order the filter chips in the Exercise Guide already use — so a reader
   meets the body parts in the same sequence in both places. The 'all' chip has
   no ranking, and the filter drops it rather than needing a special case. */
export const bestPerBodyPart = muscleGroups
  .filter((g) => effectiveness[g.id])
  .map((g) => {
    const entry = effectiveness[g.id]
    return {
      group: g.id,
      bodyPart: entry.bodyPart,
      accent: entry.accent,
      id: entry.best,
      name: nameById.get(entry.best) || entry.best,
      role: entry.ranked[0].role,
      why: entry.why,
      /* Counted, so a card can honestly say "best of 4" without anyone
         maintaining the 4. */
      total: entry.ranked.length,
    }
  })

/* Where one exercise sits, for a badge on its own card. Returns null rather
   than a zero rank for anything unranked, so a caller has to handle the
   absence instead of accidentally rendering "#0". */
export function rankOf(exerciseId) {
  for (const entry of Object.values(effectiveness)) {
    const hit = entry.ranked.find((e) => e.id === exerciseId)
    if (hit) return { bodyPart: entry.bodyPart, rank: hit.rank, best: entry.best }
  }
  return null
}

/* Truthy only for the six top-ranked exercises, and it returns the label the
   badge needs ("Best for Chest") so the caller never rebuilds that string. */
export function isBestFor(exerciseId) {
  const top = bestPerBodyPart.find((b) => b.id === exerciseId)
  return top ? top.bodyPart : null
}

/* The honest limit on everything above, and it is not small print. A ranking
   like this is read as a verdict unless it says plainly that it is not one. */
export const effectivenessNote =
  'Best on paper is not always best for you. Which exercise builds a body part fastest depends on your build, your injury history and how much of the movement you already own — someone who cannot yet hold a flat back under load will get more from the exercise ranked third than from the one ranked first. Treat this as a starting point for a conversation, not a verdict: ask a coach on the floor before you rebuild your session around it.'
