/* ---------------------------------------------------------------------------
   BAGGA FITNESS — single source of truth for gym details.
   Everything the owner needs to edit (phone, hours, prices) lives here.

   Contact details below are the gym's real, confirmed values.
   `email` and `youtube` are optional: set either one to null and the UI hides
   its button instead of rendering a dead link.
   --------------------------------------------------------------------------- */

export const brand = {
  name: 'BAGGA FITNESS',
  first: 'BAGGA',
  second: 'FITNESS',
  tagline: 'Strength. Power. Discipline.',
  established: 2019,
}

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Gym' },
  { id: 'bmi', label: 'BMI / Ideal Weight' },
  { id: 'plans', label: 'Workout Plans' },
  { id: 'exercises', label: 'Exercise Guide' },
  { id: 'protein', label: 'Protein Calculator' },
  { id: 'foods', label: 'Protein Foods' },
  { id: 'supplements', label: 'Supplements' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
]

export const gym = {
  name: 'BAGGA FITNESS',
  addressLines: ['Prahladpur', 'Uttar Pradesh – 221112', 'India'],
  addressOneLine: 'Prahladpur, Uttar Pradesh – 221112, India',
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

export const hours = [
  { day: 'Monday – Friday', slots: ['5:00 AM – 10:30 AM', '4:00 PM – 10:00 PM'] },
  { day: 'Saturday', slots: ['5:00 AM – 10:30 AM', '4:00 PM – 9:00 PM'] },
  { day: 'Sunday', slots: ['6:00 AM – 10:00 AM'], note: 'Recovery & stretching only' },
  { day: 'National Holidays', slots: ['6:00 AM – 10:00 AM'], note: 'Reduced hours' },
]

export const stats = [
  { value: 1200, suffix: '+', label: 'Members Trained' },
  { value: 14, suffix: '', label: 'Certified Coaches' },
  { value: 6500, suffix: ' sq.ft', label: 'Training Floor' },
  { value: 7, suffix: ' days', label: 'Open Every Week' },
]

export const facilities = [
  {
    title: 'Heavy Iron Zone',
    accent: 'rage',
    text: 'Calibrated Olympic plates, four power racks, deadlift platforms and competition bars for real strength work.',
  },
  {
    title: 'Titan Strength Floor',
    accent: 'titan',
    text: 'Plate-loaded and pin-select machines covering every movement pattern, arranged for push–pull supersets.',
  },
  {
    title: 'Thunder Cardio Deck',
    accent: 'volt',
    text: 'Treadmills, air bikes, rowers and a sled track for conditioning that actually moves the needle.',
  },
  {
    title: 'Functional & Mobility Bay',
    accent: 'volt',
    text: 'Turf lane, kettlebells, battle ropes, rings and a dedicated stretching and rehab corner.',
  },
  {
    title: 'Coaching & Assessment',
    accent: 'titan',
    text: 'Form checks, monthly measurement tracking and a written plan tuned to your level — not a generic printout.',
  },
  {
    title: 'Clean Facilities',
    accent: 'rage',
    text: 'Changing rooms, lockers, filtered drinking water, sanitised equipment and full-time floor supervision.',
  },
]

export const coaches = [
  {
    name: 'Head Strength Coach',
    role: 'Powerlifting & Hypertrophy',
    focus: 'Squat, bench and deadlift technique, progressive overload programming.',
    accent: 'rage',
  },
  {
    name: 'Conditioning Coach',
    role: 'Fat Loss & Endurance',
    focus: 'Metabolic circuits, interval design, sustainable calorie strategy.',
    accent: 'volt',
  },
  {
    name: 'Mobility Coach',
    role: 'Recovery & Injury Prevention',
    focus: 'Movement screening, mobility drills, safe return-to-training work.',
    accent: 'titan',
  },
]

/* Real membership pricing. `duration` is the exact plan name used in the
   prefilled WhatsApp message, so it reads naturally in the chat.
   `save` is the difference against paying the 1-month rate for the same span. */
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
      'Beginner induction & form check',
      'Weekly workout plan from this site',
      'Locker & filtered water access',
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
      'Monthly body measurement tracking',
      'Personalised split & progression',
      'Diet and protein guidance',
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
      'Two form-check sessions a month',
      'Priority peak-hour access',
      'Plan review every 8 weeks',
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
      'Weekly one-to-one coaching',
      'Competition & event prep support',
      'Lowest monthly rate we offer',
    ],
  },
]

/* Gallery entries render as original SVG artwork — see components/art/GymArt.jsx.
   To use real photographs later, drop files in /public/images and add a
   `photo: '/images/your-file.jpg'` key to any entry. */
export const gallery = [
  { art: 'rack', title: 'Power Rack Row', tag: 'Strength', accent: 'rage' },
  { art: 'dumbbells', title: 'Free Weight Wall', tag: 'Iron Zone', accent: 'volt' },
  { art: 'cardio', title: 'Thunder Cardio Deck', tag: 'Conditioning', accent: 'volt' },
  { art: 'kettlebell', title: 'Functional Bay', tag: 'Mobility', accent: 'titan' },
  { art: 'bench', title: 'Bench Press Island', tag: 'Push Day', accent: 'rage' },
  { art: 'cable', title: 'Cable Crossover', tag: 'Isolation', accent: 'titan' },
  { art: 'turf', title: 'Sled & Turf Lane', tag: 'Athletic', accent: 'volt' },
  { art: 'lockers', title: 'Member Facilities', tag: 'Comfort', accent: 'titan' },
]

export const faqs = [
  {
    q: 'I have never trained before. Where do I start?',
    a: 'Start with the Beginner plan in the Workout Plans section and book a free induction at the front desk. A coach walks you through every machine, sets your starting weights and checks your form for the first two weeks.',
  },
  {
    q: 'Do you offer trial sessions?',
    a: 'Yes. Walk in during any open hour and ask for a trial session. Bring clean indoor shoes, a towel and a water bottle.',
  },
  {
    q: 'Is the gym suitable for women?',
    a: 'Absolutely. We run supervised floor hours, a dedicated functional bay and female coaching support. The ideal weight and protein calculators on this site have separate male and female formulas.',
  },
  {
    q: 'Do I need supplements to see results?',
    a: 'No. Training consistency, sleep and whole-food protein drive almost all of your progress. Supplements only fill gaps — read the Supplements section for an honest breakdown.',
  },
]
