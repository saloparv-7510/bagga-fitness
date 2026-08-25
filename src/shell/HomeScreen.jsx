import React from 'react'
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Beef,
  Dumbbell,
  CalendarDays,
  Images,
  MapPin,
} from 'lucide-react'
import { brand, gym, stats } from '../data/site.js'
import { week } from '../data/workouts.js'
import { LightningField, LightningWarrior, GreenTitan, WebNet } from '../components/art/Decor.jsx'
import CountUp from '../components/ui/CountUp.jsx'
import { useNav } from './context.js'

/* JS getDay(): 0=Sun..6=Sat. `week` runs Mon..Sun. Same mapping Calendar uses. */
const dayToSplit = [week[6], week[0], week[1], week[2], week[3], week[4], week[5]]

const accentRing = {
  volt: 'border-volt-400/35 bg-volt-500/10',
  titan: 'border-titan-400/35 bg-titan-500/10',
  rage: 'border-rage-500/35 bg-rage-500/10',
}
const accentText = { volt: 'text-volt-300', titan: 'text-titan-300', rage: 'text-rage-300' }

/* The six things a member opens the app to do. Each jumps straight to a tab +
   screen, so nothing here depends on #anchors the way the website does.

   `screen` is a screen KEY, resolved through subOf() at render time — never a
   numeric index. These were indices once, and adding a screen to the Gym tab
   quietly re-pointed two of them at the wrong section. */
const QUICK = [
  { label: 'BMI & Ideal Weight', Icon: Calculator, tab: 'tools', screen: 'bmi', accent: 'volt' },
  { label: 'Protein Calculator', Icon: Beef, tab: 'tools', screen: 'protein', accent: 'titan' },
  { label: 'Exercise Guide', Icon: Dumbbell, tab: 'train', screen: 'exercises', accent: 'rage' },
  { label: 'Training Calendar', Icon: CalendarDays, tab: 'train', screen: 'calendar', accent: 'volt' },
  { label: 'Gallery', Icon: Images, tab: 'gym', screen: 'gallery', accent: 'titan' },
  { label: 'Visit Us', Icon: MapPin, tab: 'gym', screen: 'visit', accent: 'rage' },
]

export default function HomeScreen() {
  const { goTab } = useNav()
  const today = dayToSplit[new Date().getDay()]

  return (
    <div className="pb-2">
      {/* ---------------------------------------------------------- hero --- */}
      <section className="relative overflow-hidden px-4 pb-8 pt-6">
        <WebNet
          accent="rage"
          opacity={0.1}
          className="pointer-events-none absolute -left-6 -top-4 h-52 w-52"
        />
        <LightningWarrior
          accent="volt"
          className="pointer-events-none absolute -left-6 bottom-0 h-[58%] w-auto opacity-[0.12]"
        />
        <GreenTitan
          accent="titan"
          className="pointer-events-none absolute -right-5 bottom-0 h-[54%] w-auto opacity-[0.12]"
        />
        <LightningField
          accent="volt"
          className="pointer-events-none absolute inset-x-0 top-8 mx-auto h-52 w-full animate-arcFlicker opacity-70"
        />

        <div className="relative flex flex-col items-center text-center">
          <span className="badge-volt animate-riseIn">
            <Zap className="h-3.5 w-3.5" />
            {gym.locality} • Strength &amp; Conditioning
          </span>

          <h1
            className="forge mt-4 text-[2rem] font-bold leading-[0.98] text-shadow-power animate-riseIn xs:text-[2.35rem]"
            style={{ animationDelay: '70ms' }}
          >
            <span className="block text-silver-100">Build Your</span>
            <span className="block">
              <span className="rage-text">Best Body</span> <span className="text-silver-100">With</span>
            </span>
            <span className="mt-0.5 block">
              <span className="brand-text">{brand.first}</span> <span className="titan-text">{brand.second}</span>
            </span>
          </h1>

          <p
            className="mt-3.5 max-w-sm text-sm leading-relaxed text-silver-300 animate-riseIn"
            style={{ animationDelay: '140ms' }}
          >
            Forge strength like thunder and power like a titan. Real coaching and a plan built for your
            level — from your first rep to your heaviest lift.
          </p>

          <div
            className="mt-6 flex w-full flex-col gap-2.5 animate-riseIn"
            style={{ animationDelay: '210ms' }}
          >
            <button type="button" onClick={() => goTab('tools', 0)} className="btn-volt w-full">
              Start Your Fitness Journey
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => goTab('train', 0)} className="btn-ghost w-full">
              Explore Workout Plans
            </button>
          </div>

          <p
            className="mt-4 flex items-center justify-center gap-2 text-[0.7rem] leading-snug text-silver-500 animate-riseIn"
            style={{ animationDelay: '280ms' }}
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-titan-400" />
            No fluff. Real coaching and a plan for your level.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- today --- */}
      <section className="px-4">
        <button
          type="button"
          onClick={() => goTab('train', 0)}
          className={`card plate-edge flex w-full items-center gap-3.5 border p-4 text-left ${
            today.rest ? 'border-silver-300/12 bg-ink-900/50' : accentRing[today.accent] || accentRing.volt
          }`}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-800">
            <Dumbbell
              className={`h-5 w-5 ${today.rest ? 'text-silver-400' : accentText[today.accent] || 'text-volt-300'}`}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.62rem] uppercase tracking-brand text-silver-500">
              Today — {today.day}
            </span>
            <span className="forge mt-0.5 block truncate text-lg font-bold text-silver-100">
              {today.rest ? 'Rest & Recovery' : today.focus}
            </span>
            <span className="mt-0.5 block text-xs text-silver-400">
              {today.rest ? 'Light stretching and sleep. Recovery is training.' : 'Tap to open the full session'}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-silver-500" />
        </button>
      </section>

      {/* ---------------------------------------------------- quick grid --- */}
      <section className="px-4 pt-6">
        <h2 className="forge mb-3 text-xs font-semibold uppercase tracking-forge text-silver-500">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {QUICK.map(({ label, Icon, tab, screen, accent }) => (
            <button
              key={label}
              type="button"
              onClick={() => goTab(tab, screen)}
              className="card plate-edge flex min-h-[5.25rem] flex-col justify-between p-3.5 text-left"
            >
              <Icon className={`h-5 w-5 ${accentText[accent]}`} />
              <span className="text-[0.8rem] font-semibold leading-tight text-silver-200">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- stats --- */}
      <section className="px-4 pt-6">
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((s) => (
            <div key={s.label} className="card plate-edge px-3 py-4 text-center">
              <div className="forge text-2xl font-bold text-silver-100">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-brand text-silver-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
