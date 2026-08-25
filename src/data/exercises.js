/* ---------------------------------------------------------------------------
   Exercise library. Each exercise's `art` key maps to an original inline-SVG
   illustration in components/art/ExerciseArt.jsx (copyright-safe, no downloads).
   `body` is the primary targeted body part shown on the card.

   Coaching + anatomy fields (added for the illustrated guide):

     muscles      { primary, secondary } — arrays of ids from the canonical muscle
                  vocabulary below. `primary` is rendered RED on the anatomical
                  muscle map, `secondary` ORANGE. A muscle never appears in both.
     breathing    One sentence naming the concentric and eccentric phase of THIS
                  lift, so the reader knows exactly when to inhale and exhale.
     mistakes     Exactly 3 strings. Each names the error and the consequence it
                  causes — lost tension, a joint loaded off its hinge, and so on.
     safety       Exactly 2 strings. Setup, bail-out and scaling advice: what to
                  set before you start, when to stop a set, who should regress.
     startCue     Short label (<= 32 chars) for the START-position figure.
     endCue       Short label (<= 32 chars) for the END-position figure.
                  CONVENTION, matched by ExerciseArt: START = the stretched /
                  bottom position where the working phase begins, END = the
                  finished / contracted position. Isometric holds (plank) use
                  START = set-up, END = the braced hold.
     photo        Optional real photograph, `/images/exercises/<id>.webp`.
     photoStart   Optional real photograph of the start position.
     photoEnd     Optional real photograph of the end position.
                  All three are null today — every visual currently shipped is
                  original inline SVG. The keys exist so a real photo can be
                  dropped in later with no refactor of the components.

   Canonical muscle vocabulary (19 ids, also the keys of MUSCLE_LABELS):
     chest, upper-chest, lats, upper-back, traps, lower-back,
     front-delts, side-delts, rear-delts, biceps, triceps, forearms,
     abs, obliques, glutes, quads, hamstrings, adductors, calves
   --------------------------------------------------------------------------- */

export const muscleGroups = [
  { id: 'all', label: 'All' },
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' },
]

export const exercises = [
  // ---------------- CHEST ----------------
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    group: 'chest',
    body: 'Chest · Front Delts · Triceps',
    art: 'bench',
    level: 'Intermediate',
    equipment: 'Barbell',
    sets: '4 × 6–10',
    steps: [
      'Lie flat, eyes under the bar, feet planted and shoulder blades pinched back.',
      'Unrack and lower the bar to mid-chest with elbows at about 45°.',
      'Drive the bar up and slightly back over the shoulders without bouncing.',
    ],
    tip: 'Keep your wrists stacked over your elbows and never flare elbows to 90°.',
    muscles: {
      primary: ['chest'],
      secondary: ['triceps', 'front-delts'],
    },
    breathing:
      'Fill your chest and brace at lockout, inhale as the bar descends to mid-chest, then exhale hard through the press back up.',
    mistakes: [
      'Bouncing the bar off your chest — it dumps the tension the pecs should be absorbing and drives the load straight into the ribs and sternum.',
      'Flaring the elbows out to a flat 90° — it jams the head of the humerus into the front of the shoulder, which is the fastest route to impingement.',
      'Letting the heels lift and the hips come off the bench — you lose leg drive and turn a chest press into a short-range arched shove.',
    ],
    safety: [
      'Use a spotter, or set the rack pins a couple of centimetres below your chest height so a failed rep lands on steel instead of your throat.',
      'Rehearse the unrack path before you load up and end the set the moment the bar stalls or the elbows collapse inward; if a shoulder impingement or AC-joint injury is still symptomatic, press dumbbells on a slight incline instead.',
    ],
    startCue: 'Bar at mid-chest, elbows 45°',
    endCue: 'Locked out over the shoulders',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    group: 'chest',
    body: 'Upper Chest · Front Delts',
    art: 'incline',
    level: 'Beginner',
    equipment: 'Dumbbells',
    sets: '3 × 8–12',
    steps: [
      'Set the bench to about 30°, dumbbells resting on your thighs.',
      'Kick the weights up and press them over your upper chest.',
      'Lower under control until you feel a stretch, then press back up.',
    ],
    tip: 'A steeper bench shifts load to the shoulders — keep it around 30°.',
    muscles: {
      primary: ['upper-chest'],
      secondary: ['front-delts', 'triceps', 'chest'],
    },
    breathing:
      'Inhale as the dumbbells travel down and the upper chest stretches, keep the ribs stacked, then exhale as you press them up over the collarbones.',
    mistakes: [
      'Setting the bench past 45° — the load migrates off the upper chest onto the front delts and you end up doing a seated shoulder press.',
      'Clashing the dumbbells together at the top — the collision robs the last inch of tension and knocks the wrists off their neutral line.',
      'Dropping the elbows far below the bench line hunting for depth — the shoulder capsule absorbs the stretch instead of the pec and the joint is driven forward.',
    ],
    safety: [
      'Kick the dumbbells up from your thighs one at a time and set them down the same way; curling them from the floor to your shoulders is where most incline-press shoulder strains happen.',
      'Stay in a rep range you can finish unassisted because there is no rack to bail into — if an elbow or shoulder issue makes the bottom third painful, shorten the range rather than pushing through it.',
    ],
    startCue: 'Bells at chest, 30° bench',
    endCue: 'Pressed over upper chest',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'pushup',
    name: 'Push-Up',
    group: 'chest',
    body: 'Chest · Core · Triceps',
    art: 'pushup',
    level: 'Beginner',
    equipment: 'Bodyweight',
    sets: '3 × AMRAP',
    steps: [
      'Hands slightly wider than shoulders, body in one straight line.',
      'Lower until your chest is just above the floor, elbows tucked.',
      'Press back up and squeeze your chest at the top.',
    ],
    tip: 'Brace your abs and glutes so your hips never sag.',
    muscles: {
      primary: ['chest'],
      secondary: ['triceps', 'front-delts', 'abs'],
    },
    breathing:
      'Inhale on the way down as the chest approaches the floor, hold the brace at the bottom, then exhale as you push the floor away.',
    mistakes: [
      'Letting the hips sag toward the floor — the lumbar spine carries what the abs should and the chest never properly loads.',
      'Dipping only the head and neck instead of the chest — it fakes depth, hides a half rep and leaves the neck stiff.',
      'Splaying the elbows straight out to the sides — the shoulders roll forward at the bottom and the triceps drop out of the press.',
    ],
    safety: [
      'Keep the wrists stacked directly under the shoulders; if pressing flat-handed pinches the wrist, use push-up handles or a fist position on a mat.',
      'Regress to an incline push-up with your hands on a bench before form breaks — a hips-first push-up trains the exact pattern that aggravates a sore lower back.',
    ],
    startCue: 'Chest an inch off the floor',
    endCue: 'Arms locked, hips in line',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  // ---------------- BACK ----------------
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    group: 'back',
    body: 'Back · Glutes · Hamstrings',
    art: 'deadlift',
    level: 'Experienced',
    equipment: 'Barbell',
    sets: '4 × 3–6',
    steps: [
      'Bar over mid-foot, grip just outside your knees, chest tall.',
      'Take the slack out of the bar, then drive the floor away with your legs.',
      'Lock out with hips and knees together — do not lean back.',
    ],
    tip: 'Keep the bar dragging up your shins; a rounding lower back means drop the weight.',
    muscles: {
      primary: ['glutes', 'hamstrings', 'lower-back'],
      secondary: ['quads', 'traps', 'lats', 'forearms'],
    },
    breathing:
      'Brace a full breath before the pull and hold it through the whole concentric to lockout, then exhale and take a fresh breath at the top before the bar travels back down.',
    mistakes: [
      'Yanking the bar off the floor before the slack is out — the spine gets loaded a fraction of a second before the legs engage and the lower back rounds under it.',
      'Letting the bar drift forward of the mid-foot — every centimetre out front multiplies the load on the erectors and the hips shoot up early.',
      'Hyperextending and leaning back at the top — the lockout is hips and knees together, and the lean-back grinds the lumbar facet joints for no extra muscle.',
    ],
    safety: [
      'Pull from the floor only while you can hold a flat back through the full range; the moment the back rounds, end the set — that is the rep that injures people, not the next one.',
      'Work on a platform with bumper plates so you can set the bar down rather than fight it, and switch to a rack pull or trap-bar deadlift if you have an active disc problem or a lumbar flare-up.',
    ],
    startCue: 'Bar on shins, hips high',
    endCue: 'Standing tall, hips locked',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'pullup',
    name: 'Pull-Up',
    group: 'back',
    body: 'Lats · Biceps · Upper Back',
    art: 'pullup',
    level: 'Intermediate',
    equipment: 'Bodyweight',
    sets: '4 × 5–10',
    steps: [
      'Hang from the bar with an overhand, shoulder-width grip.',
      'Pull your elbows down and back until your chin clears the bar.',
      'Lower all the way down with control before the next rep.',
    ],
    tip: 'Think about driving your elbows to your hips, not just pulling with the arms.',
    muscles: {
      primary: ['lats'],
      secondary: ['upper-back', 'biceps', 'rear-delts', 'forearms'],
    },
    breathing:
      'Exhale as you pull your chest toward the bar and inhale through the controlled descent back to the dead hang.',
    mistakes: [
      'Kipping the hips to generate swing — momentum does the work the lats should, and the shoulders get whipped at the bottom of the arc.',
      'Stopping halfway so the chin never clears the bar — the strongest part of the lat contraction is exactly the range you keep skipping.',
      'Dropping into the bottom with loose, shrugged shoulders — a dead-weight catch strains the biceps tendon and the shoulder capsule.',
    ],
    safety: [
      'Set the shoulder blades down and back before the first pull so you hang from working muscle rather than from the joint capsule.',
      'Use a band or the assisted machine instead of jerking through reps you cannot control, and leave pull-ups out while an elbow tendinopathy or shoulder impingement is painful under load.',
    ],
    startCue: 'Dead hang, shoulders set',
    endCue: 'Chin above the bar',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'bent-row',
    name: 'Barbell Bent-Over Row',
    group: 'back',
    body: 'Mid Back · Lats · Rear Delts',
    art: 'row',
    level: 'Intermediate',
    equipment: 'Barbell',
    sets: '4 × 8–12',
    steps: [
      'Hinge at the hips to about 45°, back flat, bar hanging at the knees.',
      'Row the bar to your lower ribs, squeezing the shoulder blades.',
      'Lower under control without standing up or jerking.',
    ],
    tip: 'Lead with the elbows and keep the neck neutral — no chin tucking or craning.',
    muscles: {
      primary: ['lats', 'upper-back'],
      secondary: ['rear-delts', 'biceps', 'lower-back', 'traps'],
    },
    breathing:
      'Inhale and brace at the hang, exhale as you row the bar into your lower ribs, then breathe in again as you lower it under control.',
    mistakes: [
      'Standing up as the bar comes in — the hinge angle disappears and the legs and lower back finish a rep the lats were meant to own.',
      'Rowing to the sternum with flared elbows — it becomes a rear-delt raise and drags the shoulder blades out of position.',
      'Letting the lower back round to reach the floor between reps — a loaded, flexed spine is the single riskiest position in any rowing pattern.',
    ],
    safety: [
      'Hinge only as far as you can hold a flat back — about 45° is plenty; if your hamstrings cannot hold that position, use a chest-supported row instead.',
      'Keep the load light enough that the torso does not bounce, and choose a supported row if you have a current lumbar injury or you are rowing straight after heavy deadlifts.',
    ],
    startCue: 'Bar at the knees, back flat',
    endCue: 'Bar at the lower ribs',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  // ---------------- LEGS ----------------
  {
    id: 'squat',
    name: 'Barbell Back Squat',
    group: 'legs',
    body: 'Quads · Glutes · Core',
    art: 'squat',
    level: 'Intermediate',
    equipment: 'Barbell',
    sets: '4 × 5–8',
    steps: [
      'Bar on your upper traps, feet shoulder-width, toes slightly out.',
      'Brace hard, break at the hips and knees together, chest up.',
      'Descend to at least parallel, then drive up through mid-foot.',
    ],
    tip: 'Keep your knees tracking over your toes; do not let them cave inward.',
    muscles: {
      primary: ['quads', 'glutes'],
      secondary: ['adductors', 'hamstrings', 'lower-back', 'abs'],
    },
    breathing:
      'Take a full breath and brace before you break at the hips, keep it sealed through the whole descent, then exhale as you drive out of the hole to standing.',
    mistakes: [
      'Letting the knees collapse inward on the way up — the adductors take over from the glutes and the medial knee ligaments get loaded sideways.',
      'Heels rising as the shins dive forward — the load slides onto the toes, the chest folds and the bar path drifts ahead of the mid-foot.',
      'Cutting depth to keep the weight on the bar — a quarter squat trains only the top of the range and skips the glute work you came for.',
    ],
    safety: [
      'Squat inside the rack with the safety bars set just below your bottom position, so a failed rep can be dumped instead of fought.',
      'Warm the hips and ankles up before loading, and reduce depth or switch to a goblet or box squat if a knee or lower-back issue makes the bottom position painful.',
    ],
    startCue: 'Hips below the knee crease',
    endCue: 'Standing tall, knees locked',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'rdl',
    name: 'Romanian Deadlift',
    group: 'legs',
    body: 'Hamstrings · Glutes',
    art: 'rdl',
    level: 'Intermediate',
    equipment: 'Barbell',
    sets: '3 × 8–12',
    steps: [
      'Stand tall holding the bar, knees softly bent.',
      'Push your hips back and slide the bar down your thighs.',
      'Feel the hamstring stretch, then drive your hips forward to stand.',
    ],
    tip: 'The movement is a hip hinge, not a squat — shins stay near vertical.',
    muscles: {
      primary: ['hamstrings', 'glutes'],
      secondary: ['lower-back', 'lats', 'forearms'],
    },
    breathing:
      'Inhale and brace as the hips travel back and the bar slides down the thighs, then exhale as you drive the hips forward to stand tall.',
    mistakes: [
      'Turning it into a squat by bending the knees on the way down — the shins come forward, the hamstrings go slack and the quads steal the lift.',
      'Chasing the floor past the point where the hamstring stretch runs out — the back rounds to buy the extra range and the load moves onto the discs.',
      'Letting the bar swing away from the legs — the lever arm on the lower back grows instantly and the lats lose their grip on the ribcage.',
    ],
    safety: [
      'End each rep where the hamstring stretch ends, not where the floor is; range comes from hip mobility, never from a rounding spine.',
      'Use straps or a lighter bar if your grip fails before your hamstrings do, and leave the barbell version alone while a hamstring tear or lumbar flare-up is still healing.',
    ],
    startCue: 'Bar at mid-shin, hips back',
    endCue: 'Standing tall, hips forward',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'lunge',
    name: 'Walking Lunge',
    group: 'legs',
    body: 'Quads · Glutes · Calves',
    art: 'lunge',
    level: 'Beginner',
    equipment: 'Dumbbells',
    sets: '3 × 10 / leg',
    steps: [
      'Hold dumbbells at your sides, torso tall.',
      'Step forward and drop your back knee toward the floor.',
      'Drive through the front heel to step into the next lunge.',
    ],
    tip: 'Keep your front shin vertical and take a long enough step to protect the knee.',
    muscles: {
      primary: ['quads', 'glutes'],
      secondary: ['hamstrings', 'adductors', 'calves', 'abs'],
    },
    breathing:
      'Inhale as the back knee lowers toward the floor and exhale as you drive through the front heel to stand.',
    mistakes: [
      'Taking too short a step — the front knee travels well past the toes and the joint absorbs the load the glutes should be taking.',
      'Letting the front knee wobble inward on the drive up — the glute is not controlling the femur and the knee tracks off its hinge.',
      'Leaning the torso out over the front thigh — the lower back rounds under the dumbbells and the glute loses its line of pull.',
    ],
    safety: [
      'Learn the pattern with bodyweight and a hand on a rail before adding dumbbells; balance failures, not muscle failures, are what turn lunges into rolled ankles.',
      'Shorten the depth or hold a static split squat instead if a knee issue makes the bottom sharp, and keep the walking path clear of plates and benches.',
    ],
    startCue: 'Back knee just off floor',
    endCue: 'Standing tall on front leg',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raise',
    group: 'legs',
    body: 'Calves',
    art: 'calf',
    level: 'Beginner',
    equipment: 'Machine',
    sets: '4 × 12–20',
    steps: [
      'Balls of your feet on the platform, heels hanging off.',
      'Rise onto your toes as high as possible and pause.',
      'Lower slowly for a deep stretch at the bottom.',
    ],
    tip: 'Full range and a one-second pause beat bouncing heavy partial reps.',
    muscles: {
      primary: ['calves'],
      secondary: ['abs', 'traps'],
    },
    breathing:
      'Exhale as you press up onto the toes and inhale as you lower the heels into the stretch.',
    mistakes: [
      'Bouncing off the bottom — the Achilles gets loaded like a spring with no muscle tension behind it, which is how calf tendinopathy starts.',
      'Halving the range to move a heavier stack — the calves grow through the deep stretch and the full squeeze that partial reps skip.',
      'Bending the knees to help the weight up — the load shifts off the gastrocnemius and the set becomes a shallow leg press.',
    ],
    safety: [
      'Set the shoulder pads so you can stand tall without shrugging, and add weight gradually — the Achilles adapts far more slowly than the muscle above it.',
      'Keep a hand on the frame for balance and stop the set on any sharp pull at the heel; anyone rehabbing an Achilles problem should start with slow bodyweight raises on flat ground.',
    ],
    startCue: 'Heels dropped below toes',
    endCue: 'Up on the toes, calves tight',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  // ---------------- SHOULDERS ----------------
  {
    id: 'ohp',
    name: 'Standing Overhead Press',
    group: 'shoulders',
    body: 'Shoulders · Triceps · Core',
    art: 'ohp',
    level: 'Intermediate',
    equipment: 'Barbell',
    sets: '4 × 5–8',
    steps: [
      'Bar on your front delts, grip just outside the shoulders, glutes tight.',
      'Press straight up, moving your head back slightly to clear the bar.',
      'Lock out overhead with the bar over your mid-foot, then lower.',
    ],
    tip: 'Squeeze your glutes and abs to stop your lower back from arching.',
    muscles: {
      primary: ['front-delts'],
      secondary: ['side-delts', 'triceps', 'traps', 'abs'],
    },
    breathing:
      'Brace a breath at the front-rack position, exhale as the bar drives past your forehead to lockout, then inhale again once it settles back on the delts.',
    mistakes: [
      'Arching the lower back to lever the bar up — the press becomes a standing incline bench and the lumbar spine carries the overhead load.',
      'Pressing around the head instead of moving the head back — the bar finishes forward of the mid-foot and the shoulders end up in front of the joint.',
      'Stopping short of a true lockout with the ribs flared — the triceps never finish the rep and the shoulder blades cannot rotate up under the bar.',
    ],
    safety: [
      'Press inside a rack with the pins at about chin height, or use a load you can lower to the front delts under full control — an overhead bail is the worst failure available.',
      'Squeeze the glutes and abs to keep the ribs stacked over the pelvis, and scale to a seated or landmine press if overhead range is limited or a shoulder is impinging.',
    ],
    startCue: 'Bar on the front delts',
    endCue: 'Locked overhead, ribs down',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'lateral-raise',
    name: 'Dumbbell Lateral Raise',
    group: 'shoulders',
    body: 'Side Delts',
    art: 'lateral',
    level: 'Beginner',
    equipment: 'Dumbbells',
    sets: '3 × 12–15',
    steps: [
      'Stand with dumbbells at your sides, a slight bend in the elbows.',
      'Raise the weights out to the sides until level with your shoulders.',
      'Lower slowly — resist the urge to swing.',
    ],
    tip: 'Lead with your elbows, not your hands, and keep the traps relaxed.',
    muscles: {
      primary: ['side-delts'],
      secondary: ['traps', 'front-delts'],
    },
    breathing:
      'Exhale as the elbows rise to shoulder height and inhale as you lower the dumbbells back to your sides.',
    mistakes: [
      'Swinging the weights up with a hip thrust — momentum carries the load through the only range where the side delt actually works hard.',
      'Shrugging to lift above shoulder level — the upper traps take the rep and the neck stays tight for the rest of the session.',
      'Leading with the hands and turning the palms up — the arm externally rotates, the front delt takes over and the side delt drops out.',
    ],
    safety: [
      'Finish the raise at or just below shoulder height with a soft elbow; grinding past that arc under load is a classic route to shoulder impingement.',
      'Go lighter than your ego suggests — this is a small muscle on a long lever, and a jerked lateral raise irritates the rotator cuff far more often than it builds delts.',
    ],
    startCue: 'Bells at the hips, soft elbow',
    endCue: 'Elbows level with shoulders',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  // ---------------- ARMS ----------------
  {
    id: 'curl',
    name: 'Barbell Biceps Curl',
    group: 'arms',
    body: 'Biceps',
    art: 'curl',
    level: 'Beginner',
    equipment: 'Barbell',
    sets: '3 × 8–12',
    steps: [
      'Stand tall, shoulder-width grip, elbows pinned to your sides.',
      'Curl the bar up by contracting the biceps, not swinging.',
      'Squeeze at the top, then lower under control.',
    ],
    tip: 'Keep your elbows still — if they drift forward, the weight is too heavy.',
    muscles: {
      primary: ['biceps'],
      secondary: ['forearms', 'abs'],
    },
    breathing:
      'Exhale as you curl the bar up to your chest and inhale as you lower it back to full arm extension.',
    mistakes: [
      'Rocking the torso back to start each rep — the lower back swings the weight up and the biceps only feel the top half.',
      'Letting the elbows drift forward — the load slides onto the front delts and the biceps lose tension exactly where they are strongest.',
      'Cutting the descent short of straight arms — the long head never lengthens, and that is the part of the rep that builds it.',
    ],
    safety: [
      'Switch to an EZ bar or dumbbells if a straight bar forces the wrists into a painful extended position; forced supination is a common cause of wrist and elbow pain.',
      'Lower every rep under control instead of dropping it — sudden eccentric loading on a heavy curl is what irritates the biceps and elbow tendons.',
    ],
    startCue: 'Bar at the thighs, arms long',
    endCue: 'Bar at chest, elbows fixed',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'triceps-pushdown',
    name: 'Cable Triceps Pushdown',
    group: 'arms',
    body: 'Triceps',
    art: 'pushdown',
    level: 'Beginner',
    equipment: 'Cable',
    sets: '3 × 10–15',
    steps: [
      'Grip the bar at chest height, elbows tucked to your ribs.',
      'Extend your arms down until they are straight.',
      'Slowly return to the start without letting the elbows flare.',
    ],
    tip: 'Only your forearms move — keep the upper arms locked in place.',
    muscles: {
      primary: ['triceps'],
      secondary: ['forearms', 'abs'],
    },
    breathing:
      'Exhale as you extend the arms down to a locked elbow and inhale as the bar returns to chest height.',
    mistakes: [
      'Letting the elbows flare and travel forward — the movement becomes a shoulder press-down and the triceps stop being the prime mover.',
      'Leaning your bodyweight over the bar to finish reps — the lats and chest push the stack down and the triceps get a fraction of the work.',
      'Stopping halfway back up — the triceps need the stretched position under tension, and short reps only train the easy end.',
    ],
    safety: [
      'Set the pulley high and stand close enough that the cable pulls straight down the line of your upper arm, so the elbow is not levered sideways.',
      'Keep the elbows tucked and the load moderate — snapping into a hard lockout against a heavy stack is a standard trigger for elbow tendinopathy.',
    ],
    startCue: 'Bar at chest, elbows tucked',
    endCue: 'Arms straight, knuckles down',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  // ---------------- CORE ----------------
  {
    id: 'plank',
    name: 'Front Plank',
    group: 'core',
    body: 'Core · Abs',
    art: 'plank',
    level: 'Beginner',
    equipment: 'Bodyweight',
    sets: '3 × 30–60s',
    steps: [
      'Forearms on the floor under your shoulders, body in a straight line.',
      'Brace your abs and squeeze your glutes hard.',
      'Hold without letting your hips rise or sag.',
    ],
    tip: 'Quality over time — stop the set the moment your form breaks.',
    muscles: {
      primary: ['abs'],
      secondary: ['obliques', 'lower-back', 'glutes', 'front-delts'],
    },
    breathing:
      'A plank is isometric, so there is no concentric or eccentric phase to time — hold the brace continuously and take short, quiet breaths through the nose without letting the ribcage flare.',
    mistakes: [
      'Letting the hips drift down as fatigue arrives — the abs hand the load to the lower back and the hold stops training what it is for.',
      'Piking the hips up to make it easier — the position becomes a rest and the abs come off tension entirely.',
      'Holding your breath to stay stiff — you only last as long as the breath does, and abdominal pressure spikes for no benefit.',
    ],
    safety: [
      'End the set the moment the hips sag rather than adding seconds — a sagging plank loads the lumbar spine in exactly the position the exercise is supposed to resist.',
      'Use a mat with the forearms stacked directly under the shoulders, and shorten the hold or drop to a knees-down plank if the lower back aches during it.',
    ],
    startCue: 'Forearms down, hips level',
    endCue: 'Braced hold, glutes squeezed',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
  {
    id: 'hanging-raise',
    name: 'Hanging Knee Raise',
    group: 'core',
    body: 'Lower Abs · Hip Flexors',
    art: 'kneeraise',
    level: 'Intermediate',
    equipment: 'Bodyweight',
    sets: '3 × 10–15',
    steps: [
      'Hang from the bar with a firm grip, shoulders active.',
      'Curl your knees up toward your chest, rolling the pelvis.',
      'Lower slowly and do not swing between reps.',
    ],
    tip: 'Drive with your abs by tucking the pelvis, not just lifting the legs.',
    muscles: {
      primary: ['abs'],
      secondary: ['obliques', 'quads', 'forearms', 'lats'],
    },
    breathing:
      'Exhale as you curl the knees and pelvis up toward your chest and inhale as the legs lower back down to the hang.',
    mistakes: [
      'Swinging between reps — momentum carries the legs up, the abs get almost nothing and the shoulders take the whipping.',
      'Lifting the legs without tucking the pelvis — the hip flexors do the entire rep and the abs never actually shorten.',
      'Dropping the legs fast at the end of the rep — the lower back snaps into extension and the grip gets torn off the bar.',
    ],
    safety: [
      'Set the shoulder blades down before the first rep so you hang from active muscle, and use straps if your grip gives out before your abs do.',
      'Start with bent knees and a slow tempo, and swap to a lying reverse crunch if hanging aggravates a shoulder or the lower back arches out of control.',
    ],
    startCue: 'Hanging long, legs straight',
    endCue: 'Knees at chest, pelvis tucked',
    photo: null,
    photoStart: null,
    photoEnd: null,
  },
]

/* ---------------------------------------------------------------------------
   Human-readable labels for the canonical muscle vocabulary. Keys here are the
   only valid ids for `muscles.primary` / `muscles.secondary` above and for the
   region ids drawn by the anatomical muscle map.
   --------------------------------------------------------------------------- */
export const MUSCLE_LABELS = {
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

/* Maps an exercise to display-ready label arrays. Tolerant of a missing or
   partial `muscles` key and of unknown ids, so it never throws in render. */
export const muscleSummary = (ex) => {
  const muscles = (ex && ex.muscles) || {}
  const toLabels = (ids) =>
    (Array.isArray(ids) ? ids : []).map((id) => MUSCLE_LABELS[id]).filter(Boolean)
  return {
    primary: toLabels(muscles.primary),
    secondary: toLabels(muscles.secondary),
  }
}
