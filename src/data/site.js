/* ---------------------------------------------------------------------------
   BAGGA FITNESS — single source of truth for gym details.
   Everything the owner needs to edit (phone, prices, roster) lives here.

   TRUTH POLICY — read before editing.
   This file used to carry invented figures marked PLACEHOLDER (a founding year,
   a member count, a floor area, opening times, equipment inventories). They are
   gone. Nothing here asserts a fact about the business that has not been
   confirmed, because a live gym site that guesses at its own hours or member
   count damages trust the first time a visitor checks.

   What is CONFIRMED and safe to state:
     - `gym`         address, phone, WhatsApp, email, socials
     - `membership`  the four prices and the savings arithmetic between them
     - `brand`       naming and tagline
     - `closedDay`   the gym is CLOSED EVERY SUNDAY (owner-confirmed)
     - `coachSplit`  5 coaches, 3 male and 2 female — counted from
                     src/data/trainers.js, which now holds the roster and the
                     three real names the owner supplied
     - `stats`       every number is COUNTED from data in this repo, never typed

   What we deliberately do NOT claim, and how the UI covers the gap instead:
     - Opening times   → `timings` states the Sunday closure, which IS confirmed,
                         and asks the visitor to message for the rest
     - Member count    → not shown anywhere
     - Floor area      → not shown anywhere
     - Equipment lists → `facilities` describes the training, and
                         `facilitiesNote` invites an equipment question
     - Tier inclusions → `membership[].perks` state price arithmetic and what
                         this site gives; `membershipNote` covers the rest
     - Coach names     → the three male names are owner-confirmed and published.
                         The two female slots are unnamed PLACEHOLDERS by the
                         owner's decision, flagged as such in the UI. See the
                         header of src/data/trainers.js before editing either —
                         in particular the no-invented-credentials rule, which
                         is why nothing here calls a named coach "certified".

   `email` and `youtube` are optional: set either one to null and the UI hides
   its button instead of rendering a dead link.

   Knock-on effect to remember: `index.html` omits `openingHoursSpecification`
   from its JSON-LD on purpose. Search engines render that block as the
   business's real hours, so it stays out until the owner confirms them — the
   confirmed Sunday closure alone is not enough to describe a week.
   --------------------------------------------------------------------------- */

import { exercises } from './exercises.js'
import { week } from './workouts.js'
import { trainers } from './trainers.js'

export const brand = {
  name: 'BAGGA FITNESS',
  first: 'BAGGA',
  second: 'FITNESS',
  tagline: 'Strength. Power. Discipline.',
}

/* `short` is what the desktop nav bar renders — fourteen full labels do not fit
   on a 1280px row. `label` is used everywhere there is room: the mobile drawer,
   the footer columns and aria labels. */
export const nav = [
  { id: 'home', label: 'Home', short: 'Home' },
  { id: 'about', label: 'About Gym', short: 'About' },
  { id: 'trainers', label: 'Our Trainers', short: 'Trainers' },
  { id: 'bmi', label: 'BMI / Ideal Weight', short: 'BMI' },
  { id: 'plans', label: 'Workout Plans', short: 'Plans' },
  { id: 'legends', label: 'Legend Protocols', short: 'Legends' },
  { id: 'exercises', label: 'Exercise Guide', short: 'Exercises' },
  { id: 'protein', label: 'Protein Calculator', short: 'Protein' },
  { id: 'foods', label: 'Protein Foods', short: 'Foods' },
  { id: 'supplements', label: 'Supplements', short: 'Supplements' },
  { id: 'calendar', label: 'Calendar', short: 'Calendar' },
  { id: 'gallery', label: 'Gallery', short: 'Gallery' },
  { id: 'feedback', label: 'Feedback', short: 'Feedback' },
  { id: 'contact', label: 'Contact', short: 'Contact' },
]

export const gym = {
  name: 'BAGGA FITNESS',
  addressLines: ['Prahladpur', 'Uttar Pradesh – 221112', 'India'],
  addressOneLine: 'Prahladpur, Uttar Pradesh – 221112, India',
  /* Short form for badges and chips, where the pin code will not fit. Kept here
     rather than typed into Hero.jsx so the state can never drift from the
     address above — it already did once, and read "Delhi". */
  locality: 'Prahladpur, Uttar Pradesh',
  // Used for the "Get Directions" button and the embedded map frame.
  mapQuery: 'Prahladpur, Uttar Pradesh 221112',
  phone: '+91 7510054999',
  phoneHref: 'tel:+917510054999',
  whatsapp: '917510054999', // digits only, with country code
  instagramHandle: 'parvmaurya8017',
  instagram: 'https://www.instagram.com/parvmaurya8017/',
  email: 'parvmaurya8017@gmail.com',
  youtubeHandle: 'parvmaurya-e5q',
  youtube: 'https://www.youtube.com/@parvmaurya-e5q',
}

/* Builds a wa.me link with a prefilled message. Every WhatsApp action on the
   site goes through this so there is exactly one number to change. */
export const waLink = (message) =>
  `https://wa.me/${gym.whatsapp}?text=${encodeURIComponent(message)}`

/* The ONE confirmed piece of the timetable: the gym is closed every Sunday.
   Owner-confirmed, so it is stated as fact and drives the site-wide notice.

   `index` is a JS Date.getDay() value, which is what useClosedDay() compares
   against — 0 is Sunday. `notice` is the exact wording the owner asked for; it
   is rendered verbatim by ClosedNotice.jsx, so change it here, not there. */
export const closedDay = {
  index: 0,
  name: 'Sunday',
  notice: 'Gym Closed Every Sunday',
  detail:
    'Sunday is a full rest day for the whole floor. Message us and we will set up your week — you will get a reply once we reopen on Monday.',
  askMessage:
    'Hello BAGGA FITNESS, I know you are closed on Sunday. Could you help me plan my training for the coming week?',
}

/* Opening times are not published here — with one exception.
   A gym's timetable shifts with seasons, festivals and holidays, and a wrong
   time on a website sends someone to a closed shutter. So instead of a made-up
   table, the Contact section asks for the one message that always gets an
   accurate answer. The Sunday closure above IS confirmed and so it is stated.
   Replace the rest with a real `hours` table whenever the owner confirms it —
   and add `openingHoursSpecification` back to index.html then. */
export const timings = {
  title: 'Timings',
  lead: 'We have not published a full timetable on this page yet — and we would rather you had the right answer than a guessed one. One thing is fixed, though.',
  points: [
    `Closed every ${closedDay.name} — that one is confirmed`,
    'Message us on WhatsApp for today’s opening and closing time',
    'Or call before you travel — it takes a few seconds',
    'Festival and holiday changes go out on Instagram first',
  ],
  askMessage:
    'Hello BAGGA FITNESS, what are your opening and closing timings today? I would like to plan my visit.',
}

/* Confirmed count of female coaches — surfaced in the UI because it is a real
   deciding factor for women choosing a gym, and it is what backs the
   "female coaching support" answer in `faqs`. Derived, never typed twice.

   Counted from `trainers` in src/data/trainers.js, which is now the single
   source for the roster. This block used to hold its own array of job titles;
   it was removed when the owner supplied real names, so there is exactly one
   place a coach is added or removed. */
export const coachSplit = {
  total: trainers.length,
  male: trainers.filter((c) => c.gender === 'male').length,
  female: trainers.filter((c) => c.gender === 'female').length,
}

/* Every number in the hero strip is COUNTED, not claimed.
   Two come from the confirmed roster, two from the training content shipped in
   this repo — so each one stays true on its own, and none of them can drift
   away from what the page actually shows further down. */
export const stats = [
  { value: exercises.length, suffix: '', label: 'Exercises Demonstrated' },
  { value: coachSplit.total, suffix: '', label: 'Coaches On The Floor' },
  { value: week.length, suffix: '-day', label: 'Training Split' },
  { value: coachSplit.female, suffix: '', label: 'Women Coaches' },
]

/* Describes the TRAINING, not an equipment inventory.
   Every card here is backed by something a visitor can check on this very page
   — the split, the exercise library, the calculators — rather than by a count
   of racks nobody has verified. See `facilitiesNote` for the gap that leaves. */
export const facilities = [
  {
    title: 'Heavy Compound Lifting',
    accent: 'rage',
    text: 'Squat, bench, deadlift and overhead press are the spine of every plan here. Setup, bracing and bar path get taught before the weight goes up.',
  },
  {
    title: 'Machine & Isolation Work',
    accent: 'titan',
    text: 'Big lifts get paired with machine and cable work, so a lagging chest or a weak upper back gets direct attention instead of being trained around.',
  },
  {
    title: 'Programmed Conditioning',
    accent: 'volt',
    text: 'Cardio is prescribed, not guessed — intervals when you are cutting, steady work to build an engine, and step targets you can actually hit.',
  },
  {
    title: 'Mobility & Real Rest',
    accent: 'volt',
    text: 'Sunday is a genuine recovery day at every level: mobility flow, an easy walk, foam rolling. That is what makes the next week possible.',
  },
  {
    title: 'Coaching & Form Checks',
    accent: 'titan',
    text: 'Plans on this site are written to three levels — beginner, intermediate and experienced — so you train at your level instead of copying someone else’s.',
  },
  {
    title: 'Straight Answers',
    accent: 'rage',
    text: 'We will tell you when a supplement is a waste of money and when a plan needs changing. Read the Supplements section — that is the same advice you get on the floor.',
  },
]

/* The honest counterpart to `facilities`: we describe training, not gear, so
   this invites the equipment question rather than answering it with a guess. */
export const facilitiesNote =
  'Looking for a specific bar, rack or machine before you commit? Message us and we will tell you exactly what is on the floor right now.'

/* Real membership pricing. `duration` is the exact plan name used in the
   prefilled WhatsApp message, so it reads naturally in the chat.
   `save` is the difference against paying the 1-month rate for the same span.

   `perks` are deliberately limited to two kinds of true statement: arithmetic
   that follows from the prices above, and access to content that ships on this
   site. Service inclusions — inductions, personal training, classes — are not
   listed because they are not confirmed; `membershipNote` handles those. */
export const membership = [
  {
    id: '1-month',
    name: '1 Month',
    duration: '1 Month Membership',
    price: '₹1,200',
    monthly: '₹1,200 / month',
    accent: 'volt',
    perks: [
      'Full gym floor access',
      'Month to month — nothing locked in',
      'The best way to try us before committing',
      'Every plan and calculator on this site',
    ],
  },
  {
    id: '3-months',
    name: '3 Months',
    duration: '3 Months Membership',
    price: '₹3,000',
    monthly: '₹1,000 / month',
    save: 'Save ₹600',
    accent: 'volt',
    perks: [
      'Everything in 1 Month',
      '₹200 a month cheaper than paying monthly',
      '₹600 less than three single months',
      'Long enough to add real weight to the bar',
    ],
  },
  {
    id: '6-months',
    name: '6 Months',
    duration: '6 Months Membership',
    price: '₹6,000',
    monthly: '₹1,000 / month',
    save: 'Save ₹1,200',
    accent: 'titan',
    perks: [
      'Everything in 3 Months',
      '₹1,000 a month held for half a year',
      '₹1,200 less than six single months',
      'Room to move up a full training level',
    ],
  },
  {
    id: '12-months',
    name: '12 Months',
    duration: '12 Months Membership',
    price: '₹10,000',
    monthly: '≈ ₹833 / month',
    save: 'Save ₹4,400',
    bestValue: true,
    accent: 'rage',
    perks: [
      'Everything in 6 Months',
      'Our lowest rate — about ₹833 a month',
      '₹4,400 less than twelve single months',
      'A full year of training at one price',
    ],
  },
]

export const membershipNote =
  'Prices above are exact. For anything else — induction, personal training, classes, payment options — message us and we will confirm it before you pay, not after.'

/* Gallery entries render as original SVG artwork — see components/art/GymArt.jsx.
   Titles name a training zone, not a specific piece of the owner's equipment.
   To use real photographs later, drop files in /public/images and add a
   `photo: '/images/your-file.jpg'` key to any entry. */
export const gallery = [
  { art: 'rack', title: 'Squat & Rack Work', tag: 'Strength', accent: 'rage' },
  { art: 'dumbbells', title: 'Free Weights', tag: 'Iron', accent: 'volt' },
  { art: 'cardio', title: 'Conditioning', tag: 'Cardio', accent: 'volt' },
  { art: 'kettlebell', title: 'Functional Work', tag: 'Mobility', accent: 'titan' },
  { art: 'bench', title: 'Pressing Day', tag: 'Push', accent: 'rage' },
  { art: 'cable', title: 'Cables & Isolation', tag: 'Detail', accent: 'titan' },
  { art: 'turf', title: 'Sled & Sprint Work', tag: 'Athletic', accent: 'volt' },
  { art: 'lockers', title: 'Before & After', tag: 'Routine', accent: 'titan' },
]

export const galleryNote =
  'Illustrated, not photographed — this artwork was drawn for the site. To see the real floor, message us and come take a look.'

/* Answers stay inside what we can stand behind: the confirmed roster, the
   content on this page, and general training guidance. Where a question needs
   a business fact we have not confirmed — timings, trials, inclusions — the
   answer points at WhatsApp instead of promising something. */
export const faqs = [
  {
    q: 'I have never trained before. Where do I start?',
    a: 'Open the Workout Plans section and switch it to Beginner — that is a full week laid out for someone starting from zero. Then read the Exercise Guide for the movements in it: every one has the setup, the cues and a common mistake. Message us before your first session and we will tell you what to bring and when to come in.',
  },
  {
    q: 'What are your timings?',
    a: 'They are not fixed on this page yet, because they shift with the season and with holidays and we would rather not send you to a closed gym. Message or call us and you will get today’s exact opening and closing time.',
  },
  {
    q: 'Can I see the gym before I join?',
    a: 'Ask us on WhatsApp and we will sort out a visit. Whenever you do come to train, bring clean indoor shoes, a towel and a water bottle.',
  },
  {
    q: 'Is the gym suitable for women?',
    // The 2-of-5 split is confirmed; nothing else here is a service promise.
    a: 'Yes. Two of our five coaches are women, so there is female coaching support on the team. The Legend Protocols section has a full women’s strength programme, and the ideal weight and protein calculators here use separate male and female formulas rather than one generic number.',
  },
  {
    q: 'What exactly does my membership include?',
    a: 'The prices in the Membership cards are exact and the savings are just arithmetic. Anything beyond floor access — induction, one-to-one coaching, group classes — message us and we will confirm what is available before you pay.',
  },
  {
    q: 'Do I need supplements to see results?',
    a: 'No. Training consistency, sleep and whole-food protein drive almost all of your progress. Supplements only fill gaps — read the Supplements section for an honest breakdown.',
  },
]
