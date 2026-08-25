import React from 'react'
import { Barbell, CalfBlock } from './kit.jsx'
import { move, sideArms, sideLegs, LEFT } from './limbs.js'

/* ---------------------------------------------------------------------------
   Lower-body poses: squat, Romanian deadlift, lunge, calf raise.

   Same contract as poses/upper.jsx — joints in a 0..200 x 0..150 plate with the
   floor at y=132, two phases per exercise, each matching the cue printed under
   it from src/data/exercises.js.

   The squat is the one that has to be drawn honestly. Its cue says 'hips below
   the knee crease', so the hip joint sits at a LOWER y than the knee joint in
   the start pose. That is the difference between a drawing that teaches depth
   and a drawing that claims it in a caption while showing a half squat.

   WHERE sideArms IS AND IS NOT USED. Upright poses get it: an arm hanging from a
   standing torso can be pushed clear of the ribs with no cost to accuracy, and
   that is what stops the figure reading as a slab. Hinged and loaded poses place
   their arms by hand instead, because there the bar decides where the hands go —
   an RDL's bar has to sit against the shin, and pushing the arm forward for
   legibility would move the bar somewhere the exercise never puts it.
   --------------------------------------------------------------------------- */

/* A bar on the upper back rides with the torso, so it is positioned from the
   neck joint. Both squat phases share this one component and the bar tracks the
   body up out of the hole for free. */
const BackBar = ({ pose, c }) => (
  <Barbell pose={pose} c={c} at={[pose.neck[0] + 5, pose.neck[1] + 2]} half={48} r={12} />
)

const HandBar = ({ pose, c }) => <Barbell pose={pose} c={c} half={44} r={11} />

/* Hands reaching back and up to a bar on the traps — the one arm position in
   this file that points behind the body, which is why it is placed by hand. */
const rackArm = (arm) => [{ ...move(arm, 4, 2), far: true }, arm]

export const POSES = {
  squat: {
    Equipment: BackBar,
    /* 'Hips below the knee crease' — hip y 102 against knee y 96. The depth is
       drawn, so a reader can check it rather than take the caption's word. */
    start: {
      facing: 1,
      head: [88, 62],
      neck: [96, 72],
      hip: [104, 102],
      arms: rackArm({ shoulder: [98, 77], elbow: [110, 85], wrist: [104, 72] }),
      legs: sideLegs({ hip: [104, 102], knee: [86, 96], ankle: [96, 130], toe: [82, 131] }),
    },
    // 'Standing tall, knees locked'
    end: {
      facing: 1,
      head: [100, 28],
      neck: [100, 40],
      hip: [100, 78],
      arms: rackArm({ shoulder: [100, 45], elbow: [112, 52], wrist: [106, 40] }),
      legs: sideLegs({ hip: [100, 78], knee: [100, 104], ankle: [100, 129], toe: [88, 130] }),
    },
  },

  rdl: {
    Equipment: HandBar,
    /* 'Bar at mid-shin, hips back' — a hinge, not a squat: the knee stays soft
       and the hip travels backwards, which is why the hip is the furthest-right
       point of the body here. The arms hang vertically and the shin is drawn just
       behind the bar, because on a real RDL the bar stays in contact with the leg
       the whole way down. */
    start: {
      facing: 1,
      head: [76, 58],
      neck: [88, 66],
      hip: [116, 82],
      arms: [
        { ...move({ shoulder: [97, 72], elbow: [97, 92], wrist: [97, 112] }, 3, 2), far: true },
        { shoulder: [97, 72], elbow: [97, 92], wrist: [97, 112] },
      ],
      legs: sideLegs({ hip: [116, 82], knee: [104, 106], ankle: [100, 130], toe: [88, 131] }),
    },
    // 'Standing tall, hips forward'
    end: {
      facing: 1,
      head: [100, 28],
      neck: [100, 40],
      hip: [100, 78],
      arms: sideArms({ shoulder: [100, 45], elbow: [98, 64], wrist: [96, 82] }, LEFT),
      legs: sideLegs({ hip: [100, 78], knee: [100, 104], ankle: [100, 129], toe: [88, 130] }),
    },
  },

  lunge: {
    /* Bodyweight, hands at the hips. The exercise's own data lists no equipment
       and adding a bar here would quietly change which lift is being taught. */
    /* 'Back knee just off floor' — the back knee is the lowest joint on the
       body and the front shin is vertical. Both are the things that go wrong. */
    start: {
      facing: 1,
      head: [100, 38],
      neck: [102, 50],
      hip: [104, 84],
      arms: sideArms({ shoulder: [102, 55], elbow: [102, 74], wrist: [100, 90] }, LEFT),
      /* Genuinely staggered, so no helper: the two legs of a lunge are different
         legs doing different jobs, not one leg drawn twice. */
      legs: [
        // Back leg, behind the body: knee dropped, ball of the foot down.
        { hip: [108, 85], knee: [124, 124], ankle: [142, 126], toe: [150, 131], far: true },
        // Front leg: shin vertical, knee stacked over the ankle.
        { hip: [102, 84], knee: [80, 98], ankle: [78, 130], toe: [66, 131] },
      ],
    },
    // 'Standing tall on front leg'
    end: {
      facing: 1,
      head: [100, 28],
      neck: [100, 40],
      hip: [100, 78],
      arms: sideArms({ shoulder: [100, 45], elbow: [100, 64], wrist: [98, 82] }, LEFT),
      legs: [
        // Trailing leg still off the floor — the rep is not over until it is down.
        { hip: [104, 79], knee: [110, 102], ankle: [116, 124], toe: [124, 128], far: true },
        { hip: [98, 78], knee: [96, 104], ankle: [94, 130], toe: [82, 131] },
      ],
    },
  },

  calf: {
    /* Block top at y=116, which is what the heel drops below and the toes press
       against. The two numbers have to agree or the stretch is drawn in mid-air. */
    Equipment: () => <CalfBlock x={84} w={42} h={16} />,
    /* 'Heels dropped below toes' — the ankle sits 8 units BELOW the block's top
       edge, which is the stretch the exercise is for and the half most people
       skip. The foot points up and back: that is dorsiflexion, drawn. */
    start: {
      facing: 1,
      head: [100, 24],
      neck: [100, 36],
      hip: [100, 74],
      arms: sideArms({ shoulder: [100, 41], elbow: [98, 60], wrist: [96, 79] }, LEFT),
      legs: sideLegs({ hip: [100, 74], knee: [100, 98], ankle: [102, 124], toe: [88, 116] }),
    },
    /* 'Up on the toes, calves tight' — the whole body rises 12 units and the
       ankle travels 14, so the two phases cannot be mistaken for each other. */
    end: {
      facing: 1,
      head: [100, 12],
      neck: [100, 24],
      hip: [100, 62],
      arms: sideArms({ shoulder: [100, 29], elbow: [98, 48], wrist: [96, 67] }, LEFT),
      legs: sideLegs({ hip: [100, 62], knee: [100, 86], ankle: [100, 110], toe: [88, 116] }),
    },
  },
}

export default POSES
