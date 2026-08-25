import { House, Dumbbell, Calculator, Apple, Building2 } from 'lucide-react'

import HomeScreen from './HomeScreen.jsx'
import About from '../components/About.jsx'
import Trainers from '../components/Trainers.jsx'
import BmiCalculator from '../components/BmiCalculator.jsx'
import WorkoutPlanner from '../components/WorkoutPlanner.jsx'
import LegendsTraining from '../components/LegendsTraining.jsx'
import ExerciseGuide from '../components/ExerciseGuide.jsx'
import ProteinCalculator from '../components/ProteinCalculator.jsx'
import ProteinFoods from '../components/ProteinFoods.jsx'
import Supplements from '../components/Supplements.jsx'
import Calendar from '../components/Calendar.jsx'
import Gallery from '../components/Gallery.jsx'
import Feedback from '../components/Feedback.jsx'
import Contact from '../components/Contact.jsx'

/* ==========================================================================
   The app's information architecture.

   The website is one ~14-section scroll. That is the wrong shape for a phone:
   the reason app scrolling feels fast is that no single screen is long enough
   to fight. So the same 14 components are dealt into 5 tabs, and a tab with
   more than one screen gets a segmented rail — meaning exactly one section is
   on screen at any moment.

   Five tabs is the ceiling, not a coincidence: Android's own guidance is 3–5,
   and a sixth would leave each tab ~60dp on a 360dp phone and truncate the
   labels. New sections become a SCREEN inside an existing tab instead — which
   is why Trainers sits under Gym rather than earning a tab of its own.

   Adding a section? Add it here and to `nav` in src/data/site.js. The tab bar,
   the header titles, the back-button order and the screen cache all derive
   from this array.
   ========================================================================== */
export const TABS = [
  {
    key: 'home',
    label: 'Home',
    Icon: House,
    screens: [{ key: 'home', label: 'Home', title: 'BAGGA FITNESS', Component: HomeScreen }],
  },
  {
    key: 'train',
    label: 'Train',
    Icon: Dumbbell,
    screens: [
      { key: 'plans', label: 'Plans', title: 'Workout Plans', Component: WorkoutPlanner },
      { key: 'exercises', label: 'Exercises', title: 'Exercise Guide', Component: ExerciseGuide },
      { key: 'legends', label: 'Legends', title: 'Legend Protocols', Component: LegendsTraining },
      { key: 'calendar', label: 'Calendar', title: 'Training Calendar', Component: Calendar },
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    Icon: Calculator,
    screens: [
      { key: 'bmi', label: 'BMI', title: 'BMI & Ideal Weight', Component: BmiCalculator },
      { key: 'protein', label: 'Protein', title: 'Protein Calculator', Component: ProteinCalculator },
    ],
  },
  {
    key: 'food',
    label: 'Food',
    Icon: Apple,
    screens: [
      { key: 'foods', label: 'Foods', title: 'Protein Foods', Component: ProteinFoods },
      { key: 'supplements', label: 'Supplements', title: 'Supplements', Component: Supplements },
    ],
  },
  {
    key: 'gym',
    label: 'Gym',
    Icon: Building2,
    screens: [
      { key: 'about', label: 'About', title: 'About the Gym', Component: About },
      { key: 'trainers', label: 'Trainers', title: 'Our Trainers', Component: Trainers },
      { key: 'gallery', label: 'Gallery', title: 'Gallery', Component: Gallery },
      { key: 'visit', label: 'Visit', title: 'Visit Us', Component: Contact },
      { key: 'feedback', label: 'Feedback', title: 'Feedback', Component: Feedback },
    ],
  },
]

export const tabByKey = (key) => TABS.find((t) => t.key === key) || TABS[0]

/* Resolve a screen KEY to its position within its tab.

   `goTab` takes a numeric index, so anything linking to a screen used to carry
   that number literally — and inserting a screen silently re-pointed every link
   below it. That is not hypothetical: adding Trainers to the Gym tab moved
   Gallery from 1 to 2, and Home's quick-access grid started opening Trainers
   under a "Gallery" label. Nothing threw, so nothing caught it.

   Address screens by key and that whole class of bug goes away. */
export const subOf = (tabKey, screenKey) => {
  const i = tabByKey(tabKey).screens.findIndex((s) => s.key === screenKey)
  if (i < 0) {
    // Falling back to 0 keeps a typo off the user's screen, but a silent
    // fallback is exactly how the original bug hid — so say so while developing.
    if (import.meta.env?.DEV) {
      console.warn(`[tabs] no screen "${screenKey}" in tab "${tabKey}" — falling back to its first screen`)
    }
    return 0
  }
  return i
}

/* Stable cache key for a mounted screen, and for its saved scroll offset. */
export const screenId = (tabKey, sub) => `${tabKey}:${sub}`
