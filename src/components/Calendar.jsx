import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { week } from '../data/workouts.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { WebPattern } from './art/Decor.jsx'

/* JS getDay(): 0=Sun..6=Sat. Our `week` is Mon..Sun. Map weekday→split entry. */
const dayToSplit = [week[6], week[0], week[1], week[2], week[3], week[4], week[5]]

const accentDot = { volt: 'bg-volt-400', titan: 'bg-titan-400', rage: 'bg-rage-400' }
const accentCell = {
  volt: 'border-volt-400/30 bg-volt-500/8',
  titan: 'border-titan-400/30 bg-titan-500/8',
  rage: 'border-rage-500/30 bg-rage-500/8',
}
const accentText = { volt: 'text-volt-300', titan: 'text-titan-300', rage: 'text-rage-300' }
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Calendar() {
  const today = new Date()
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1)
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
    // convert Sun-first (0..6) to Mon-first offset (Mon=0..Sun=6)
    const lead = (first.getDay() + 6) % 7
    const out = []
    for (let i = 0; i < lead; i++) out.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(view.y, view.m, d)
      out.push({ d, split: dayToSplit[date.getDay()], date })
    }
    return out
  }, [view])

  const isToday = (c) =>
    c && c.date.getFullYear() === today.getFullYear() && c.date.getMonth() === today.getMonth() && c.d === today.getDate()

  const shift = (delta) =>
    setView((v) => {
      const m = v.m + delta
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 }
    })

  return (
    <Section id="calendar">
      <SectionHeading
        eyebrow="Stay Consistent"
        title="Training"
        accentWord="Calendar"
        accent="rage"
        sub="Your weekly split mapped across the month. Every day has a target — show up and tick it off."
      />

      <Reveal className="card plate-edge relative overflow-hidden">
        {/* Spider-inspired original web lattice backdrop */}
        <WebPattern
          accent="silver"
          opacity={0.22}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        <div className="relative p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-silver-100">
              <CalendarDays className="h-5 w-5 text-volt-300" />
              <span className="forge text-xl font-bold sm:text-2xl">
                {MONTHS[view.m]} <span className="text-silver-500">{view.y}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shift(-1)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-silver-300/12 bg-ink-800/70 text-silver-300 hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setView({ y: today.getFullYear(), m: today.getMonth() })}
                className="rounded-lg border border-silver-300/12 bg-ink-800/70 px-3 py-2 text-xs font-semibold text-silver-300 hover:text-white"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => shift(1)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-silver-300/12 bg-ink-800/70 text-silver-300 hover:text-white"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Weekday header */}
          <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
            {DOW.map((d) => (
              <div key={d} className="pb-1 text-center text-[0.6rem] font-semibold uppercase tracking-brand text-silver-500 sm:text-xs">
                {d}
              </div>
            ))}
            {cells.map((c, i) => {
              if (!c) return <div key={`e${i}`} className="aspect-square" />
              const a = c.split.accent
              return (
                <div
                  key={c.d}
                  className={`relative flex aspect-square flex-col justify-between rounded-lg border p-1.5 transition sm:p-2 ${
                    c.split.rest ? 'border-silver-300/10 bg-ink-900/40 stripes' : accentCell[a] || accentCell.volt
                  } ${isToday(c) ? 'ring-2 ring-white/70' : ''}`}
                  title={`${c.split.day}: ${c.split.focus}`}
                >
                  <span className={`text-xs font-bold sm:text-sm ${isToday(c) ? 'text-white' : 'text-silver-200'}`}>
                    {c.d}
                  </span>
                  <span className={`hidden text-[0.58rem] font-medium leading-tight sm:block ${accentText[a] || 'text-silver-400'}`}>
                    {c.split.rest ? 'Rest' : c.split.focus.split(' + ')[0]}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full sm:hidden ${c.split.rest ? 'bg-silver-500' : accentDot[a]}`} />
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-silver-300/10 pt-4">
            {week.map((d) => (
              <span key={d.day} className="flex items-center gap-1.5 text-[0.7rem] text-silver-400">
                <span className={`h-2 w-2 rounded-full ${d.rest ? 'bg-silver-500' : accentDot[d.accent]}`} />
                <span className="font-semibold text-silver-300">{d.day.slice(0, 3)}</span> {d.focus}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
