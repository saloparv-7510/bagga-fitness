/* ---------------------------------------------------------------------------
   Turning one authored limb into the near/far pair a side view needs.

   WHY THIS EXISTS. A side-view figure has two arms and two legs, and the naive
   thing — author one and copy it a few units across — puts the near arm straight
   down the middle of the torso. That is wrong twice over: it reads as a stripe
   painted on the body rather than a limb hanging beside it, and it covers
   exactly the region the muscle shading is trying to show. On a deadlift it hid
   the entire posterior chain, which is the only thing that exercise is about.

   So both arms get pushed toward the FRONT of the body, because that is where
   arms hang, and the far one sits a couple of units behind the near one, which
   is the whole depth cue a side view gets to use.

   `front` is a screen-space direction — the way the chest points — as a rough
   unit vector: [-1, 0] for a figure facing screen left, [0, -1] for one lying
   on its back. It is passed in rather than derived from `facing` because these
   are drawings, and the author placing the joints is the one who knows.
   --------------------------------------------------------------------------- */

const JOINTS = ['shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle', 'toe']

/* Every joint the limb actually has, moved by (dx, dy). Missing joints stay
   missing — a leg with no `toe` is a leg drawn without a foot, not a crash. */
export const move = (limb, dx, dy) => {
  const out = { ...limb }
  for (const k of JOINTS) {
    if (limb[k]) out[k] = [limb[k][0] + dx, limb[k][1] + dy]
  }
  return out
}

/* [far, near]. Order matters: the rig paints the list in order, so the far copy
   has to come first.

   The near arm clears the torso by 7 units, which is more than a real side view
   would show — a true side view has the arm overlapping the ribs. That is a
   deliberate illustrator's cheat: this drawing exists to show which muscles are
   working, and a technically-correct arm that covers the lats defeats it. */
export const sideArms = (arm, front, depth = [2.5, 2]) => [
  { ...move(arm, front[0] * 4 + depth[0], front[1] * 4 + depth[1]), far: true },
  move(arm, front[0] * 7, front[1] * 7),
]

/* Legs get a much smaller offset than arms and no front push at all: in a side
   view the far leg is almost directly behind the near one. Separating them by an
   arm's worth of space makes two legs into a block wider than the pelvis, which
   is the other half of why the standing poses used to read as slabs. */
export const sideLegs = (leg, depth = [1.5, 1]) => [
  { ...move(leg, depth[0], depth[1]), far: true },
  leg,
]

/* Common front directions, named so a pose reads as a sentence rather than a
   pair of magic numbers. */
export const LEFT = [-1, 0] // figure facing screen left — most of the side views
export const RIGHT = [1, 0] // the cable pushdown, which has to face its stack
export const UP = [0, -1] // lying on a bench, chest toward the ceiling
