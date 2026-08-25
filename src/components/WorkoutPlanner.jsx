import React, { useState } from 'react'
import { Dumbbell, Moon, Repeat, Zap } from 'lucide-react'
import { levels, week } from '../data/workouts.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'

const accentMap = {
  volt: { text: 'text-volt-300', ring: 'border-volt-400/40', chip: 'bg-volt-500/12 text-volt-200', dot: 'bg-volt-400' },
  titan: { text: 'text-titan-300', ring: 'border-titan-400/40', chip: 'bg-titan-500/12 text-titan-200', dot: 'bg-titan-400' },
  rage: { text: 'text-rage-300', ring: 'border-rage-500/40', chip: 'bg-rage-500/12 text-rage-300', dot: 'bg-rage-400' },
}

export default function WorkoutPlanner() {
  const [level, setLevel] = useState('beginner')
  const activeLevel = levels.find((l) => l.id === level)

  return (
    <Section id="plans" plated>
      <SectionHeading
        eyebrow="Weekly Split"
        title="Your 7-Day"
        accentWord="Workout Plan"
        accent="rage"
        sub="The same battle-tested split at three levels. Pick yours — the days stay the same, the volume and intensity scale with you."
      />

      {/* Level tabs */}
      <Reveal className="mx-auto mb-6 flex max-w-xl flex-col items-center gap-3">
        <div
          className="inline-flex w-full rounded-2xl border border-silver-300/12 bg-ink-900/70 p-1 sm:w-auto"
          role="group"
          aria-label="Training level"
        >
          {levels.map((l) => {
            const a = accentMap[l.accent]
            const on = level === l.id
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                aria-pressed={on}
                /* `flex-auto min-w-0`, and neither half is decoration.

                   `flex-1` sets a zero basis, so all three tabs get an equal
                   third — and "Intermediate" then needs more than a third and
                   wraps even on a 375px phone, where the row actually fits.
                   `flex-auto` bases them on their own text, which is the layout
                   already shipping, and shrinks only when the row runs out.

                   `min-w-0` (with `whitespace-nowrap` gone) is what makes that
                   shrink legal: a flex item will not go below its min-content
                   width, and nowrap made min-content the full unbroken label —
                   so on a 320px screen the three tabs added up to 328px inside
                   a 286px box and pushed the whole PAGE 28px wide. Now the
                   longest label wraps to a second line at that width and
                   nothing else on the page moves. */
                className={`tap min-w-0 flex-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-6 ${
                  on ? `${a.chip}` : 'text-silver-400 hover:text-silver-100'
                }`}
              >
                {l.label}
              </button>
            )
          })}
        </div>
        <p className="max-w-lg text-center text-sm text-silver-400">{activeLevel.blurb}</p>
        <span className={`chip ${accentMap[activeLevel.accent].chip}`}>
          <Zap className="h-3.5 w-3.5" /> Conditioning: {activeLevel.cardio}
        </span>
      </Reveal>

      {/* 7-day grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {week.map((d, i) => {
          const a = accentMap[d.accent] || accentMap.volt
          const list = d[level]
          return (
            <Reveal
              key={d.day}
              delay={(i % 4) * 70}
              className={`card plate-edge lift flex h-full flex-col overflow-hidden ${
                d.rest ? 'stripes' : ''
              } ${i === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className={`flex items-center justify-between border-b border-silver-300/10 px-5 py-4`}>
                <div>
                  <div className="text-xs uppercase tracking-brand text-silver-500">{d.day}</div>
                  <div className={`font-semibold ${a.text}`}>{d.focus}</div>
                </div>
                <span className={`grid h-9 w-9 place-items-center rounded-lg bg-ink-800 ${a.text}`}>
                  {d.rest ? <Moon className="h-5 w-5" /> : <Dumbbell className="h-5 w-5" />}
                </span>
              </div>
              <ul className="flex flex-1 flex-col gap-2 px-5 py-4">
                {list.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-sm text-silver-300">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
                    {ex}
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-silver-500">
        <Repeat className="h-3.5 w-3.5" />
        Warm up 5–10 min before every session and stretch after. Progress the weight when you hit the top of the rep range with clean form.
      </Reveal>
    </Section>
  )
}
