import React, { useMemo, useState } from 'react'
import { Beef, Egg, Milk, Target, Info, Utensils } from 'lucide-react'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'

/* g protein per kg bodyweight by goal (evidence-based ranges). */
const goals = [
  { id: 'maintain', label: 'General Fitness', lo: 1.2, hi: 1.6, accent: 'volt', note: 'Stay healthy and hold your muscle.' },
  { id: 'build', label: 'Build Muscle', lo: 1.6, hi: 2.2, accent: 'titan', note: 'Maximise lean mass in a surplus.' },
  { id: 'cut', label: 'Fat Loss', lo: 1.8, hi: 2.4, accent: 'rage', note: 'Preserve muscle in a deficit.' },
]

const accentText = { volt: 'text-volt-300', titan: 'text-titan-300', rage: 'text-rage-300' }
const accentBadge = { volt: 'badge-volt', titan: 'badge-titan', rage: 'badge-rage' }

export default function ProteinCalculator() {
  const [weight, setWeight] = useState(70)
  const [goal, setGoal] = useState('build')
  const active = goals.find((g) => g.id === goal)

  const res = useMemo(() => {
    const w = Number(weight) || 0
    if (w < 30 || w > 200) return null
    const lo = Math.round(w * active.lo)
    const hi = Math.round(w * active.hi)
    const mid = Math.round((lo + hi) / 2)
    return {
      lo,
      hi,
      mid,
      perMeal: Math.round(mid / 4),
      scoops: Math.max(1, Math.round(mid / 24)),
      eggs: Math.round(mid / 6),
      chicken: Math.round((mid / 31) * 100),
    }
  }, [weight, active])

  return (
    <Section id="protein" plated>
      <SectionHeading
        eyebrow="Fuel The Machine"
        title="Daily Protein"
        accentWord="Calculator"
        accent="titan"
        sub="Protein drives recovery and muscle. Set your weight and goal to get a daily target — and what it looks like on a plate."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Inputs */}
        <Reveal className="card plate-edge p-6 sm:p-7">
          <div className="flex items-center gap-2 text-silver-200">
            <Target className="h-5 w-5 text-titan-300" />
            <h3 className="text-lg font-semibold">Your Goal</h3>
          </div>

          {/* Goal selector */}
          <div className="mt-5 grid gap-2">
            {goals.map((g) => {
              const on = goal === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    on
                      ? 'border-titan-400/50 bg-titan-500/10'
                      : 'border-silver-300/12 bg-ink-900/70 hover:border-silver-300/25'
                  }`}
                >
                  <span>
                    <span className={`block text-sm font-semibold ${on ? 'text-silver-100' : 'text-silver-300'}`}>
                      {g.label}
                    </span>
                    <span className="text-xs text-silver-500">{g.note}</span>
                  </span>
                  <span className={`text-xs font-semibold ${accentText[g.accent]}`}>
                    {g.lo}–{g.hi} g/kg
                  </span>
                </button>
              )
            })}
          </div>

          {/* Weight slider + input */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="label mb-0">Bodyweight</span>
              <span className="text-sm font-bold text-silver-100">{weight} kg</span>
            </div>
            <input
              type="range"
              min="35"
              max="160"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="range mt-3"
              style={{ backgroundSize: `${((weight - 35) / (160 - 35)) * 100}% 100%` }}
              aria-label="Bodyweight in kilograms"
            />
            <input
              type="number"
              inputMode="numeric"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="field mt-3"
              aria-label="Bodyweight exact"
            />
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-silver-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silver-400" />
            Spread protein across 3–4 meals. Ranges are general guidance for healthy adults, not medical or renal
            advice.
          </p>
        </Reveal>

        {/* Result */}
        <Reveal delay={80} className="card plate-edge p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-silver-200">
              <Utensils className="h-5 w-5 text-titan-300" />
              <h3 className="text-lg font-semibold">Your Daily Target</h3>
            </div>
            <span className={accentBadge[active.accent]}>{active.label}</span>
          </div>

          {!res ? (
            <div className="mt-8 rounded-2xl border border-dashed border-silver-300/12 bg-ink-900/40 px-6 py-14 text-center text-sm text-silver-500">
              Enter a realistic bodyweight (35–160 kg) to see your target.
            </div>
          ) : (
            <div className="mt-6">
              <div className="rounded-2xl border border-titan-400/25 bg-titan-500/8 p-5 text-center">
                <div className="text-xs uppercase tracking-brand text-titan-300">Aim For</div>
                <div className="forge mt-1 text-4xl font-bold text-silver-100 sm:text-5xl">
                  {res.lo}–{res.hi}
                  <span className="ml-2 text-lg font-normal text-silver-500">g / day</span>
                </div>
                <div className="mt-1 text-sm text-silver-400">
                  about <span className="font-semibold text-titan-200">{res.perMeal} g</span> across 4 meals
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 text-xs uppercase tracking-brand text-silver-500">
                  ≈ {res.mid} g looks like any of these
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { Icon: Milk, val: `${res.scoops}`, unit: 'whey scoops' },
                    { Icon: Egg, val: `${res.eggs}`, unit: 'eggs' },
                    { Icon: Beef, val: `${res.chicken} g`, unit: 'chicken' },
                  ].map((x) => (
                    <div key={x.unit} className="rounded-2xl border border-silver-300/10 bg-ink-900/60 p-4 text-center">
                      <x.Icon className="mx-auto h-6 w-6 text-volt-300" />
                      <div className="mt-2 text-lg font-bold text-silver-100">{x.val}</div>
                      <div className="text-[0.68rem] text-silver-500">{x.unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#foods"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('foods')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-titan mt-6 w-full"
              >
                See High-Protein Foods
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
