import React from 'react'
import { Barbell, Bench, RackUprights, DumbbellPair, PullUpBar, Mat } from './kit.jsx'
import { move, sideArms, sideLegs, LEFT } from './limbs.js'

/* ---------------------------------------------------------------------------
   Upper-body poses: chest, back and shoulders.

   Every pose is joint coordinates in the 0..200 x 0..150 plate, floor at y=132.
   The two phases per exercise are not decoration — they are the lesson, and
   they are captioned by `startCue` / `endCue` in src/data/exercises.js, so the
   drawing has to match the sentence printed under it. Each pose below carries
   its cue as a comment for exactly that reason.

   VIEW. These are side and three-quarter views, which is what an exercise
   illustration uses: a side view shows the joint angles that make a lift right
   or wrong, and it gives the rig one coherent front-of-body direction to shade
   against. The one exception is the lateral raise, noted where it happens.

   FORESHORTENING is real and deliberate. A flared upper arm on a bench press
   points partly into the screen, so it draws SHORTER than the same arm hanging
   at the side. Bone lengths are therefore not constant between poses, and
   should not be — matching them would mean drawing an arm that cannot exist.

   WHERE THE BAR DECIDES. Only the upright poses use sideArms to push the near
   arm clear of the ribs. Everywhere a hand is on a loaded bar — benching,
   hinging, rowing, pulling from the floor — the arms are placed by hand, because
   the bar's position is part of the instruction: 'bar on shins' has to be drawn
   with the bar on the shins, and legibility does not get to overrule that.
   --------------------------------------------------------------------------- */

/* [far, near] for the poses that place their own arms: one authored limb plus a
   dimmed copy a few units behind it. */
const pair = (limb, dx = 4, dy = 3) => [{ ...move(limb, dx, dy), far: true }, limb]

/* ---- BENCH PRESS ------------------------------------------------------- */
const benchKit = ({ pose, c }) => (
  <g>
    <RackUprights x={74} top={54} />
    <Bench top={104} x1={70} x2={140} />
    <Barbell pose={pose} c={c} half={46} r={11} />
  </g>
)

const benchStartArm = { shoulder: [84, 92], elbow: [97, 101], wrist: [93, 80] }
const benchEndArm = { shoulder: [84, 92], elbow: [88, 76], wrist: [92, 60] }
const benchBody = {
  facing: -1,
  head: [66, 90],
  neck: [80, 92],
  hip: [118, 95],
  legs: [
    { hip: [122, 96], knee: [137, 107], ankle: [143, 129], toe: [153, 131], far: true },
    { hip: [118, 95], knee: [141, 104], ankle: [147, 128], toe: [157, 130] },
  ],
}

/* ---- INCLINE DUMBBELL PRESS -------------------------------------------- */
const inclineKit = ({ pose, c }) => (
  <g>
    <Bench top={112} rise={-22} x1={68} x2={142} />
    <DumbbellPair pose={pose} c={c} angle={[1, 0.2]} />
  </g>
)

const inclineBody = {
  facing: -1,
  head: [72, 76],
  neck: [84, 84],
  hip: [116, 100],
  legs: [
    { hip: [120, 101], knee: [132, 112], ankle: [142, 130], toe: [152, 131], far: true },
    { hip: [116, 100], knee: [136, 109], ankle: [146, 129], toe: [156, 130] },
  ],
}

/* ---- PUSH-UP -----------------------------------------------------------
   The chest genuinely faces the floor here, so the chest shading renders on the
   underside of the torso and only its upper half is visible. Flipping `facing`
   would light it up beautifully and put the lats on the wrong side of the body,
   so it stays as it is: a partly-hidden correct answer beats a clear wrong one. */
const pushupKit = () => <Mat x1={40} x2={172} />

/* ---- PULL-UP / HANGING --------------------------------------------------
   Arms above the head are the case `front` exists for: the bone now points up
   instead of down, so the default derivation puts the biceps behind the arm. */
const OVERHEAD = 1

/* ---- LATERAL RAISE ----------------------------------------------------
   The only front-on drawing in the set, and it has to be: a lateral raise moves
   the arms straight out to the sides, which in a side view projects to almost
   nothing — the finished position would look identical to the start. Front-on,
   the whole movement is visible.

   The muscles still land correctly because all three of this lift's regions
   (side delts primary, traps and front delts secondary) are placed by angle
   around the shoulder joint rather than in the torso frame, so they follow the
   arm rather than depending on a front-or-back reading of the chest. */
const lateralKit = ({ pose, c, phase }) => (
  <DumbbellPair pose={pose} c={c} angle={phase === 'end' ? [0, 1] : [1, 0]} />
)

const lateralLegs = [
  { hip: [94, 78], knee: [92, 104], ankle: [90, 130], toe: [82, 131] },
  { hip: [106, 78], knee: [108, 104], ankle: [110, 130], toe: [118, 131] },
]

/* Upright, facing screen left. Shared by every standing pose in this file so a
   lockout is the same body each time and only the arms change. */
const standing = {
  facing: 1,
  head: [100, 28],
  neck: [100, 40],
  hip: [100, 78],
  legs: sideLegs({ hip: [100, 78], knee: [100, 104], ankle: [100, 129], toe: [88, 130] }),
}

export const POSES = {
  bench: {
    Equipment: benchKit,
    // 'Bar at mid-chest, elbows 45°' — elbows dropped past the bench line.
    start: { ...benchBody, arms: pair(benchStartArm) },
    // 'Locked out over the shoulders' — arms extended, bar high over the joint.
    end: { ...benchBody, arms: pair(benchEndArm) },
  },

  incline: {
    Equipment: inclineKit,
    // 'Bells at chest, 30° bench'
    start: { ...inclineBody, arms: pair({ shoulder: [88, 85], elbow: [100, 96], wrist: [96, 76] }) },
    // 'Pressed over upper chest'
    end: { ...inclineBody, arms: pair({ shoulder: [88, 85], elbow: [92, 70], wrist: [98, 54] }) },
  },

  pushup: {
    Equipment: pushupKit,
    /* 'Chest an inch off the floor' — the body stays a straight line and the
       whole difference is how high the shoulders sit, which is the point: a
       push-up that bends at the hip is the mistake this drawing has to make
       visible. */
    start: {
      facing: 1,
      head: [64, 102],
      neck: [76, 104],
      hip: [116, 110],
      arms: pair({ shoulder: [80, 103], elbow: [96, 118], wrist: [82, 128] }),
      legs: [
        { hip: [120, 111], knee: [140, 122], ankle: [154, 130], toe: [162, 132], far: true },
        { hip: [116, 110], knee: [138, 120], ankle: [152, 128], toe: [160, 130] },
      ],
    },
    // 'Arms locked, hips in line'
    end: {
      facing: 1,
      head: [64, 90],
      neck: [76, 92],
      hip: [116, 102],
      arms: pair({ shoulder: [80, 92], elbow: [81, 110], wrist: [82, 128] }),
      legs: [
        { hip: [120, 103], knee: [140, 116], ankle: [154, 128], toe: [162, 131], far: true },
        { hip: [116, 102], knee: [138, 114], ankle: [152, 126], toe: [160, 129] },
      ],
    },
  },

  deadlift: {
    Equipment: ({ pose, c }) => <Barbell pose={pose} c={c} half={44} r={11} />,
    /* 'Bar on shins, hips high' — the hip sits well above the knee, the shoulder
       sits ahead of the bar, and the bar is drawn touching the shin. All three
       are the setup, and all three are checkable in the picture. */
    start: {
      facing: 1,
      head: [78, 66],
      neck: [90, 74],
      hip: [116, 90],
      arms: pair({ shoulder: [96, 80], elbow: [98, 98], wrist: [100, 114] }, 3, 2),
      legs: sideLegs({ hip: [116, 90], knee: [108, 110], ankle: [104, 130], toe: [92, 131] }),
    },
    // 'Standing tall, hips locked' — bar at the front of the thighs.
    end: { ...standing, arms: sideArms({ shoulder: [100, 45], elbow: [98, 64], wrist: [96, 82] }, LEFT) },
  },

  pullup: {
    Equipment: ({ pose, c }) => <PullUpBar pose={pose} c={c} />,
    /* 'Dead hang, shoulders set' — knees bent back to about a right angle, which
       is what anyone hanging from a bar at gym height actually does, and what
       lets the legs be drawn at full length instead of as a stub. */
    start: {
      facing: 1,
      head: [100, 46],
      neck: [100, 58],
      hip: [100, 96],
      arms: pair({ shoulder: [100, 63], elbow: [98, 45], wrist: [96, 27], front: OVERHEAD }, 4, 2),
      legs: sideLegs({ hip: [100, 96], knee: [98, 120], ankle: [72, 116], toe: [62, 112] }),
    },
    /* 'Chin above the bar' — the head clears the hands and the elbows come down
       and forward. The elbow has to swing that far out: with both bones 18 units
       long and the shoulder only 9 from the bar, there is nowhere else it can be. */
    end: {
      facing: 1,
      head: [100, 18],
      neck: [100, 30],
      hip: [100, 68],
      arms: pair({ shoulder: [100, 35], elbow: [84, 40], wrist: [96, 27], front: OVERHEAD }, 4, 2),
      legs: sideLegs({ hip: [100, 68], knee: [98, 92], ankle: [72, 88], toe: [62, 84] }),
    },
  },

  row: {
    Equipment: ({ pose, c }) => <Barbell pose={pose} c={c} half={44} r={11} />,
    // 'Bar at the knees, back flat' — the bar hangs beside the knee, not in front of it.
    start: {
      facing: 1,
      head: [76, 56],
      neck: [88, 64],
      hip: [116, 80],
      arms: pair({ shoulder: [93, 70], elbow: [96, 88], wrist: [99, 104] }, 3, 2),
      legs: sideLegs({ hip: [116, 80], knee: [110, 104], ankle: [106, 130], toe: [94, 131] }),
    },
    /* 'Bar at the lower ribs' — elbow driven back PAST the torso and the bar
       pulled in to the ribs, which is the position, rather than to the chest,
       which is a different exercise. */
    end: {
      facing: 1,
      head: [76, 56],
      neck: [88, 64],
      hip: [116, 80],
      arms: pair({ shoulder: [93, 70], elbow: [113, 86], wrist: [95, 78] }, 3, 2),
      legs: sideLegs({ hip: [116, 80], knee: [110, 104], ankle: [106, 130], toe: [94, 131] }),
    },
  },

  ohp: {
    Equipment: ({ pose, c }) => <Barbell pose={pose} c={c} half={44} r={10} />,
    /* 'Bar on the front delts' — the near arm lands the bar right at the front
       edge of the shoulder, which is what 'on the delts' means, with the elbow
       under it. */
    start: { ...standing, arms: sideArms({ shoulder: [100, 45], elbow: [95, 63], wrist: [94, 45] }, LEFT) },
    /* 'Locked overhead, ribs down' — the bar finishes back over the body, not out
       in front of the face, so the arm leans backwards on its way up. */
    end: {
      ...standing,
      arms: sideArms(
        { shoulder: [100, 44], elbow: [102, 30], wrist: [104, 16], front: OVERHEAD },
        LEFT,
      ),
    },
  },

  lateral: {
    Equipment: lateralKit,
    // 'Bells at the hips, soft elbow'
    start: {
      facing: 1,
      head: [100, 28],
      neck: [100, 40],
      hip: [100, 78],
      arms: [
        { shoulder: [88, 46], elbow: [84, 64], wrist: [82, 82] },
        { shoulder: [112, 46], elbow: [116, 64], wrist: [118, 82] },
      ],
      legs: lateralLegs,
    },
    // 'Elbows level with shoulders'
    end: {
      facing: 1,
      head: [100, 28],
      neck: [100, 40],
      hip: [100, 78],
      arms: [
        { shoulder: [88, 46], elbow: [70, 50], wrist: [54, 54] },
        { shoulder: [112, 46], elbow: [130, 50], wrist: [146, 54] },
      ],
      legs: lateralLegs,
    },
  },
}

export default POSES
