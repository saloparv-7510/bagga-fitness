import React, { useMemo, useState } from 'react'
import { X, Target, ListChecks, Lightbulb, Layers } from 'lucide-react'
import { exercises, muscleGroups } from '../data/exercises.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import ExerciseArt from './art/ExerciseArt.jsx'
import { useLockBodyScroll, useKeyDown } from '../hooks/index.js'

const levelBadge = {
  Beginner: 'badge-titan',
  Intermediate: 'badge-volt',
  Experienced: 'badge-rage',
}

// Colour the illustration by body part so the grid reads at a glance.
const groupAccent = {
  chest: 'rage',
  back: 'titan',
  legs: 'volt',
  shoulders: 'volt',
  arms: 'rage',
  core: 'titan',
}
const accentOf = (ex) => ex.accent || groupAccent[ex.group] || 'volt'

function ExerciseModal({ ex, onClose }) {
  useLockBodyScroll(!!ex)
  useKeyDown(!!ex, { Escape: onClose })
  if (!ex) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/80" onClick={onClose} />
      <div className="glass-strong relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-silver-300/12 shadow-plate sm:rounded-3xl">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-3xl">
          <ExerciseArt name={ex.art} accent={accentOf(ex)} className="block h-full w-full" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink-950/70 text-silver-200 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={levelBadge[ex.level]}>{ex.level}</span>
            <span className="badge-silver">{ex.equipment}</span>
            <span className="badge-silver">{ex.sets}</span>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-silver-100">{ex.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-volt-300">
            <Target className="h-4 w-4" /> {ex.body}
          </p>

          <div className="mt-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-silver-200">
              <ListChecks className="h-4 w-4 text-titan-300" /> How to perform
            </div>
            <ol className="mt-2 space-y-2">
              {ex.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-silver-300">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-volt-500/15 text-[0.7rem] font-bold text-volt-200">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-titan-400/20 bg-titan-500/8 p-3.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-titan-300" />
            <p className="text-sm text-silver-300">
              <span className="font-semibold text-titan-200">Coach tip: </span>
              {ex.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExerciseGuide() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const list = useMemo(
    () => (filter === 'all' ? exercises : exercises.filter((e) => e.group === filter)),
    [filter]
  )

  return (
    <Section id="exercises">
      <SectionHeading
        eyebrow="Exercise Guide"
        title="Move With"
        accentWord="Perfect Form"
        accent="titan"
        sub="Tap any exercise for step-by-step technique, the muscles it targets and a coach tip. Filter by body part to build your session."
      />

      {/* Filter rail */}
      <Reveal className="mb-8 -mx-4 overflow-x-auto px-4 no-scrollbar rail-fade sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
          {muscleGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setFilter(g.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                filter === g.id
                  ? 'border-volt-400/50 bg-volt-500/12 text-volt-100'
                  : 'border-silver-300/12 bg-ink-900/70 text-silver-400 hover:text-silver-100'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((ex, i) => (
          <Reveal key={ex.id} delay={(i % 4) * 60}>
            <button
              type="button"
              onClick={() => setSelected(ex)}
              className="card plate-edge lift group block h-full w-full overflow-hidden text-left"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <ExerciseArt name={ex.art} accent={accentOf(ex)} className="block h-full w-full transition-transform duration-500 group-hover:scale-105" />
                <span className={`absolute left-3 top-3 ${levelBadge[ex.level]}`}>{ex.level}</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-silver-100 group-hover:text-white">{ex.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-volt-300">
                  <Target className="h-3.5 w-3.5" /> {ex.body}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-silver-500">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" /> {ex.equipment}
                  </span>
                  <span className="font-semibold text-silver-300">{ex.sets}</span>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <ExerciseModal ex={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
