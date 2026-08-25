import React from 'react'
import { Barbell, CableStack, PullUpBar, Mat } from './kit.jsx'
import { move, sideArms, sideLegs, LEFT, RIGHT } from './limbs.js'

/* ---------------------------------------------------------------------------
   Arm and core poses: curl, triceps pushdown, plank, hanging knee raise.

   Same contract as the other two tables — joints in a 0..200 x 0..150 plate,
   floor at y=132, two phases matching the cues in src/data/exercises.js.

   THE PLANK IS AN ISOMETRIC HOLD, and it is handled honestly. Its two cues,
   'Forearms down, hips level' and 'Braced hold, glutes squeezed', describe the
   SAME position — so both phases point at one shared pose object rather than
   two near-identical ones. That is deliberate on two counts: it cannot drift
   out of step with itself, and the infographic generator detects the identical
   render and captions it as a hold instead of printing the same picture twice
   under a start-and-end heading it does not have.

   THE PUSHDOWN FACES THE OTHER WAY. Every other side view here faces screen
   left; a cable pushdown has to face its stack, and the stack is drawn on the
   right, so this one pose is facing: -1. A lifter with their back to the cable
   would be doing a different exercise.
   --------------------------------------------------------------------------- */

const CurlBar = ({ pose, c }) => <Barbell pose={pose} c={c} half={40} r={10} />

/* Standing, facing screen left — shared by both curl phases, since a curl moves
   the forearm and nothing else. */
const standing = {
  facing: 1,
  head: [100, 28],
  neck: [100, 40],
  hip: [100, 78],
  legs: sideLegs({ hip: [100, 78], knee: [100, 104], ankle: [100, 129], toe: [88, 130] }),
}

/* Spelling the fixed half out once is what makes 'elbows fixed' checkable: the
   elbow is literally the same coordinate in both curl phases. */
const CURL_ELBOW = [98, 64]
const curlArm = (wrist) => ({ shoulder: [100, 45], elbow: CURL_ELBOW, wrist })

/* Facing right, toward the cable stack. */
const facingStack = {
  facing: -1,
  head: [86, 28],
  neck: [86, 40],
  hip: [86, 78],
  legs: sideLegs({ hip: [86, 78], knee: [86, 104], ankle: [86, 129], toe: [98, 130] }),
}

const PUSH_ELBOW = [90, 64]
const pushArm = (wrist) => ({ shoulder: [88, 45], elbow: PUSH_ELBOW, wrist })

/* One pose, two cues. See the note at the top of the file.

   The plank places its own limbs rather than using sideArms: the front of this
   body points at the floor, so pushing an arm "toward the front" would push it
   through the mat. The helper is for upright side views. */
const plankArm = { shoulder: [84, 100], elbow: [78, 124], wrist: [58, 128] }
const plankLeg = { hip: [122, 104], knee: [144, 114], ankle: [156, 126], toe: [164, 131] }
const plankHold = {
  facing: 1,
  head: [68, 96],
  neck: [80, 100],
  hip: [122, 104],
  arms: [{ ...move(plankArm, 4, 2), far: true }, plankArm],
  legs: [{ ...move(plankLeg, 2, -2), far: true }, plankLeg],
}

/* Arms above the head point the opposite way to a hanging arm, so the anterior
   side has to be named rather than derived. Same constant as poses/upper.jsx. */
const OVERHEAD = 1
const hangArm = { shoulder: [100, 50], elbow: [99, 31], wrist: [98, 12], front: OVERHEAD }
const hanging = {
  facing: 1,
  head: [100, 33],
  neck: [100, 45],
  hip: [100, 83],
  arms: [{ ...move(hangArm, 4, 2), far: true }, hangArm],
}

export const POSES = {
  curl: {
    Equipment: CurlBar,
    // 'Bar at the thighs, arms long'
    start: { ...standing, arms: sideArms(curlArm([96, 82]), LEFT) },
    // 'Bar at chest, elbows fixed' — only the wrist moves, which is the instruction.
    end: { ...standing, arms: sideArms(curlArm([88, 50]), LEFT) },
  },

  pushdown: {
    Equipment: ({ pose, c }) => <CableStack pose={pose} c={c} />,
    // 'Bar at chest, elbows tucked'
    start: { ...facingStack, arms: sideArms(pushArm([102, 56]), RIGHT) },
    // 'Arms straight, knuckles down' — same elbow, forearm swung to vertical.
    end: { ...facingStack, arms: sideArms(pushArm([96, 82]), RIGHT) },
  },

  plank: {
    Equipment: () => <Mat x1={44} x2={176} />,
    // 'Forearms down, hips level'
    start: plankHold,
    // 'Braced hold, glutes squeezed' — the same position, by design.
    end: plankHold,
  },

  kneeraise: {
    Equipment: ({ pose, c }) => <PullUpBar pose={pose} c={c} />,
    /* 'Hanging long, legs straight' — straight means straight, so the feet end
       up close to the floor line. That is what this looks like on a bar at
       normal gym height, and shortening the legs to buy clearance would draw a
       body that cannot exist. */
    start: {
      ...hanging,
      legs: sideLegs({ hip: [100, 83], knee: [98, 107], ankle: [94, 129], toe: [84, 132] }),
    },
    // 'Knees at chest, pelvis tucked' — knees driven up in front of the torso.
    end: {
      ...hanging,
      legs: sideLegs({ hip: [100, 83], knee: [78, 74], ankle: [74, 94], toe: [64, 98] }),
    },
  },
}

export default POSES
