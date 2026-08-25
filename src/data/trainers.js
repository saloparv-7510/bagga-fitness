/* ---------------------------------------------------------------------------
   BAGGA FITNESS — the coaching roster.

   Kept out of site.js on purpose: the owner edits the roster far more often
   than the gym details, and a name change should never put phone numbers or
   prices at risk. Read the TRUTH POLICY at the top of src/data/site.js first —
   this file lives under the same rule, and the paragraph below is the part of
   it that applies to named human beings.

   WHAT IS CONFIRMED
     - The composition: 5 coaches, 3 male and 2 female. (`rosterFact` states it,
       counted from the array so it cannot drift.)
     - The three male names, supplied by the owner: Siddharth Maurya,
       Deepak Maurya, Parv Maurya. They are VERBATIM. Do not tidy the spelling.

   WHAT IS A PLACEHOLDER
     - Entries 4 and 5 — 'Female Trainer 1' and 'Female Trainer 2'. The owner
       chose to ship the roster with the two female slots unnamed rather than
       invent names. Both carry `placeholderName: true`; the UI keys off that
       flag to mark the card as awaiting a name. When the real names arrive,
       replace `name`, regenerate `id` as the kebab-case slug, and set
       `placeholderName: false`. Nothing else needs to change.

   NO INVENTED CREDENTIALS — the hard rule, do not break it.
     These are real people at a real gym on a live site. A `bio` here must not
     assert anything a visitor could check and find false:
       no certifications (NASM / ACE / CSCS / diplomas), no years of
       experience, no competition placings, no client or transformation counts,
       no former gyms or employers, no named athletes coached, no medical or
       physiotherapy qualifications.
     Write about METHOD and FIT instead — how the coach runs a session, what
     they emphasise, and who benefits from training with them. That is true on
     day one and stays true, and it is more useful to a visitor than a badge.
     The two placeholder bios describe the ROLE on the floor, never a person.

   FIELD NOTES
     - `accent` must be one of volt | titan | rage | silver. Those are the keys
       of ACCENTS in src/components/art/Decor.jsx and the badge-* classes in
       src/styles/index.css. Any other value has no colour behind it.
     - `photo` is null until real images exist. Drop a file at
       /public/images/trainers/<id>.webp and set
       photo: '/images/trainers/<id>.webp' — the card swaps the illustration
       for the photograph with no code change.
     - `specializations` are 3-4 short tags, rendered as chips. Keep them to
       areas of focus. A tag is not a qualification, so it must not read like
       one ('Powerlifting' is a focus; 'Certified Powerlifting Coach' is a
       claim).
   --------------------------------------------------------------------------- */

export const trainers = [
  {
    id: 'siddharth-maurya',
    name: 'Siddharth Maurya',
    role: 'Head Strength Coach',
    specializations: ['Powerlifting', 'Hypertrophy', 'Squat & Deadlift Technique'],
    bio: 'Builds sessions around the three main barbell lifts, with position and bracing sorted out before the load goes up. A good fit if you want to train heavy but have never been shown how to set up a squat or a pull properly.',
    gender: 'male',
    accent: 'rage',
    photo: null,
    placeholderName: false,
  },
  {
    id: 'deepak-maurya',
    name: 'Deepak Maurya',
    role: 'Conditioning Coach',
    specializations: ['Fat Loss', 'Conditioning', 'Interval Design'],
    bio: 'Treats conditioning as a dose, not a punishment — intervals and circuits sized to what you can repeat next week instead of what wrecks you today. Suits anyone chasing fat loss who has bounced off crash routines before.',
    gender: 'male',
    accent: 'volt',
    photo: null,
    placeholderName: false,
  },
  {
    id: 'parv-maurya',
    name: 'Parv Maurya',
    role: 'Mobility & Movement Coach',
    specializations: ['Mobility', 'Warm-Up Design', 'Beginner Technique'],
    bio: 'Starts with how you move, then loads it: warm-ups, positional drills and rep ranges picked so the joints keep pace with the muscle. A good fit for first-timers and for anyone coming back after a long gap away from training.',
    gender: 'male',
    accent: 'titan',
    photo: null,
    placeholderName: false,
  },
  {
    /* PLACEHOLDER NAME — awaiting the real name from the owner.
       The bio below describes the slot on the floor, not a person. */
    id: 'female-trainer-1',
    name: 'Female Trainer 1',
    role: 'Women’s Strength Coach',
    specializations: ['Barbell Basics', 'Upper-Body Strength', 'Confident Lifting'],
    bio: 'The women’s strength slot on the roster: the barbell lifts taught from the setup up, with upper-body progressions for lifters who have only ever been pointed at machines. Ask for this coach if you want to learn to lift properly.',
    gender: 'female',
    accent: 'silver',
    photo: null,
    placeholderName: true,
  },
  {
    /* PLACEHOLDER NAME — awaiting the real name from the owner.
       The bio below describes the slot on the floor, not a person. */
    id: 'female-trainer-2',
    name: 'Female Trainer 2',
    role: 'Group Training Coach',
    specializations: ['Circuits', 'Group Classes', 'Mixed-Ability Pacing'],
    bio: 'The group and circuit slot: sessions written so a first-timer and a regular can work the same round at their own weight and their own pace. Suits anyone who trains better with a set time, a set plan and other people in the room.',
    gender: 'female',
    accent: 'volt',
    photo: null,
    placeholderName: true,
  },
]

/* Counted from the array above, never typed. If the roster changes, this
   sentence changes with it — which is the whole point of deriving it. */
const maleCount = trainers.filter((t) => t.gender === 'male').length
const femaleCount = trainers.filter((t) => t.gender === 'female').length

/* CONFIRMED composition. Safe to render as a fact. */
export const rosterFact = `${trainers.length} coaches on the floor — ${maleCount} male and ${femaleCount} female.`

/* Shown once under the section. Points at WhatsApp rather than promising a
   pairing this page cannot arrange on its own. */
export const trainersNote =
  'Message us on WhatsApp with your goal and the days you can come in, and we will tell you which of these coaches is the right fit for you.'
