import React, { useEffect, useRef } from 'react'
import BackgroundFX from './components/BackgroundFX.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Trainers from './components/Trainers.jsx'
import BmiCalculator from './components/BmiCalculator.jsx'
import WorkoutPlanner from './components/WorkoutPlanner.jsx'
import LegendsTraining from './components/LegendsTraining.jsx'
import ExerciseGuide from './components/ExerciseGuide.jsx'
import ProteinCalculator from './components/ProteinCalculator.jsx'
import ProteinFoods from './components/ProteinFoods.jsx'
import Supplements from './components/Supplements.jsx'
import Calendar from './components/Calendar.jsx'
import Gallery from './components/Gallery.jsx'
import Feedback from './components/Feedback.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import ClosedNotice from './components/ui/ClosedNotice.jsx'
import { useT } from './i18n/context.js'

/* Section order, and the id each one owns. Kept here so every section can be
   wrapped in its own error boundary — a throw in the BMI calculator must not
   take the contact details down with it. */
const SECTIONS = [
  { id: 'home', name: 'intro', Component: Hero },
  { id: 'about', name: 'gym and membership details', Component: About },
  { id: 'trainers', name: 'trainer profiles', Component: Trainers },
  { id: 'bmi', name: 'BMI calculator', Component: BmiCalculator },
  { id: 'plans', name: 'workout plans', Component: WorkoutPlanner },
  { id: 'legends', name: 'legend training protocols', Component: LegendsTraining },
  { id: 'exercises', name: 'exercise guide', Component: ExerciseGuide },
  { id: 'protein', name: 'protein calculator', Component: ProteinCalculator },
  { id: 'foods', name: 'protein foods list', Component: ProteinFoods },
  { id: 'supplements', name: 'supplement guide', Component: Supplements },
  { id: 'calendar', name: 'training calendar', Component: Calendar },
  { id: 'gallery', name: 'gallery', Component: Gallery },
  { id: 'feedback', name: 'feedback form', Component: Feedback },
  { id: 'contact', name: 'contact details', Component: Contact },
]

/* Thin scroll-progress bar.
   Writes the transform straight to the node instead of through state: a React
   render per scroll frame would drag the whole tree's reconciliation onto the
   scroll path for one number that only ever ends up in a style attribute. */
function ScrollProgress() {
  const bar = useRef(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = bar.current
      if (!el) return
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? window.scrollY / h : 0
      el.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-[55] h-0.5 bg-transparent">
      <div
        ref={bar}
        className="h-full origin-left bg-gradient-to-r from-volt-400 via-titan-400 to-rage-500"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}

export default function App() {
  const t = useT()
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-volt-500 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        {t('Skip to content')}
      </a>
      <BackgroundFX />
      <ScrollProgress />
      <ErrorBoundary name="navigation" quiet>
        <Navbar />
      </ErrorBoundary>
      <main>
        {/* Sunday-only closure notice. It sits in normal flow rather than in the
            fixed navbar on purpose: the navbar's height is the --nav-h the
            mobile drawer and the scroll-spy offset are both keyed to, and
            growing it on one day a week would shift every anchor landing.
            In flow it costs nothing — the component returns null on the other
            six days, padding included, so there is no reserved space. */}
        <ErrorBoundary name="closure notice" quiet>
          <ClosedNotice className="pt-[calc(var(--nav-h)+0.85rem)]" />
        </ErrorBoundary>
        {SECTIONS.map(({ id, name, Component }) => (
          <ErrorBoundary key={id} id={id} name={t(name)}>
            <Component />
          </ErrorBoundary>
        ))}
      </main>
      <ErrorBoundary name="footer" quiet>
        <Footer />
      </ErrorBoundary>
    </>
  )
}
