import React, { useMemo, useState } from 'react'
import {
  X,
  Target,
  ListChecks,
  Lightbulb,
  Layers,
  Wind,
  TriangleAlert,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import ExerciseArt from './art/ExerciseArt.jsx'
import MuscleMap from './art/MuscleMap.jsx'
import { useLockBodyScroll, useKeyDown, useFocusTrap } from '../hooks/index.js'
import { useExercises } from '../i18n/localize.js'
import { useT } from '../i18n/context.js'

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

/* ==========================================================================
   PHASE CONVENTION — the same one src/data/exercises.js uses, and the reason
   the two never disagree:

     start = where the working rep BEGINS — the stretched, loaded, bottom
             position (bar on the chest, hips below the knee, dead hang)
     end   = where it FINISHES — contracted and locked out (bar overhead,
             standing tall, chin above the bar)

   Every exercise follows it, including the ones a gym would casually describe
   the other way round. `startCue` / `endCue` in the data are the captions for
   these two, so a flip here silently mislabels the illustration.
   ========================================================================== */

/* One phase of the movement: the illustration plus its cue caption.
   `photo` is honoured ahead of the drawing, so dropping a real image into an
   exercise's photoStart / photoEnd swaps it in with no code change here. */
function PhaseFigure({ ex, phase, badge }) {
  const t = useT()
  const cue = phase === 'start' ? ex.startCue : ex.endCue
  const photo = phase === 'start' ? ex.photoStart : ex.photoEnd
  const phaseWord = phase === 'start' ? t('start') : t('end')
  const label = cue
    ? t('{name} — {phase} position: {cue}', { name: ex.name, phase: phaseWord, cue })
    : t('{name} — {phase} position', { name: ex.name, phase: phaseWord })

  return (
    <figure className="min-w-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-silver-300/10 bg-ink-950">
        <ExerciseArt
          name={ex.art}
          phase={phase}
          accent={accentOf(ex)}
          photo={photo}
          label={label}
          className="block h-full w-full"
        />
        <span className="absolute left-2 top-2 rounded-lg bg-ink-950/80 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-brand text-silver-200">
          {badge}
        </span>
      </div>
      {cue && (
        <figcaption className="mt-2 text-[0.7rem] leading-snug text-silver-400">{cue}</figcaption>
      )}
    </figure>
  )
}

function ExerciseModal({ ex, onClose }) {
  const t = useT()
  const { muscleSummary } = useExercises()
  useLockBodyScroll(!!ex)
  useKeyDown(!!ex, { Escape: onClose })
  const trapRef = useFocusTrap(!!ex)
  if (!ex) return null

  const worked = muscleSummary(ex)
  const primary = ex.muscles?.primary || []
  const secondary = ex.muscles?.secondary || []

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-modal-title"
    >
      <div className="absolute inset-0 bg-ink-950/80" onClick={onClose} />
      <div
        ref={trapRef}
        className="glass-strong relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-silver-300/12 shadow-plate sm:rounded-3xl"
      >
        {/* Close sits above everything and outside the scrolling content flow so
            it stays reachable however far down the panel is scrolled. */}
        <button
          type="button"
          onClick={onClose}
          className="tap absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-ink-950/80 text-silver-200 transition-colors hover:text-white"
          aria-label={t('Close {name}', { name: ex.name })}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 pr-12">
            <span className={levelBadge[ex.level]}>{t(ex.level)}</span>
            <span className="badge-silver">{ex.equipment}</span>
            <span className="badge-silver">{ex.sets}</span>
          </div>
          <h3 id="exercise-modal-title" className="mt-3 text-2xl font-bold text-silver-100">
            {ex.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-volt-300">
            <Target className="h-4 w-4" /> {ex.body}
          </p>

          {/* ---- Start → end. Both are on screen at once rather than behind a
              toggle: the difference between the two poses IS the lesson, and a
              toggle hides half of it behind a tap nobody is prompted to make. */}
          <div className="mt-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-silver-200">
              <ArrowRight className="h-4 w-4 text-volt-300" /> {t('Start & end position')}
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <PhaseFigure ex={ex} phase="start" badge="Start" />
              <PhaseFigure ex={ex} phase="end" badge="End" />
            </div>
          </div>

          {/* ---- Muscles worked. One anatomical chart, lit from the data, so
              every exercise in the library highlights the same body the same
              way — red for primary, orange for secondary. */}
          {(primary.length > 0 || secondary.length > 0) && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-silver-200">
                <Target className="h-4 w-4 text-rage-300" /> {t('Muscles worked')}
              </div>
              <div className="mt-2.5 rounded-2xl border border-silver-300/10 bg-ink-950/40 p-3">
                <MuscleMap
                  primary={primary}
                  secondary={secondary}
                  view="both"
                  label={
                    worked.secondary.length
                      ? t(
                          'Muscles worked by the {name}: {primary} as the primary movers, assisted by {secondary}',
                          {
                            name: ex.name,
                            primary: worked.primary.join(', ') || t('none listed'),
                            secondary: worked.secondary.join(', '),
                          }
                        )
                      : t('Muscles worked by the {name}: {primary} as the primary movers', {
                          name: ex.name,
                          primary: worked.primary.join(', ') || t('none listed'),
                        })
                  }
                  className="block w-full"
                />
              </div>
            </div>
          )}

          {/* ---- How to perform */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-silver-200">
              <ListChecks className="h-4 w-4 text-titan-300" /> {t('How to perform')}
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

          {/* ---- Breathing */}
          {ex.breathing && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-volt-400/20 bg-volt-500/8 p-3.5">
              <Wind className="mt-0.5 h-4 w-4 shrink-0 text-volt-300" />
              <p className="text-sm text-silver-300">
                <span className="font-semibold text-volt-200">{t('Breathing: ')}</span>
                {ex.breathing}
              </p>
            </div>
          )}

          {/* ---- Mistakes. Amber, not red: these cost you reps, whereas the
              safety block below is about not getting hurt. */}
          {ex.mistakes?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-silver-200">
                <TriangleAlert className="h-4 w-4 text-amber-300" /> {t('Common mistakes to avoid')}
              </div>
              <ul className="mt-2 space-y-2">
                {ex.mistakes.map((m, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-silver-300">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ---- Safety */}
          {ex.safety?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-silver-200">
                <ShieldCheck className="h-4 w-4 text-rage-300" /> {t('Safety')}
              </div>
              <ul className="mt-2 space-y-2">
                {ex.safety.map((s, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-2xl border border-rage-500/18 bg-rage-500/8 p-3 text-sm text-silver-300"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-rage-300" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ---- Coach tip */}
          {ex.tip && (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-titan-400/20 bg-titan-500/8 p-3.5">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-titan-300" />
              <p className="text-sm text-silver-300">
                <span className="font-semibold text-titan-200">{t('Coach tip: ')}</span>
                {ex.tip}
              </p>
            </div>
          )}

          {/* The same disclaimer the calculators carry. Form cues on a web page
              are not a substitute for someone watching you lift. */}
          <p className="mt-6 text-[0.7rem] leading-relaxed text-silver-500">
            {t(
              'General technique guidance for healthy adults — it does not replace coaching or medical advice. If a movement hurts, stop and ask a coach on the floor.'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ExerciseGuide() {
  const t = useT()
  const { exercises, muscleGroups } = useExercises()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const list = useMemo(
    () => (filter === 'all' ? exercises : exercises.filter((e) => e.group === filter)),
    [filter, exercises]
  )

  return (
    <Section id="exercises">
      <SectionHeading
        eyebrow={t('Exercise Guide')}
        title={t('Move With')}
        accentWord={t('Perfect Form')}
        accent="titan"
        sub={t(
          'Tap any exercise for the start and end position, the muscles it works, step-by-step technique, breathing, the mistakes to avoid and the safety notes. Filter by body part to build your session.'
        )}
      />

      {/* Filter rail */}
      <Reveal className="mb-8 -mx-4 overflow-x-auto px-4 no-scrollbar rail-fade sm:mx-0 sm:px-0">
        <div
          className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center"
          role="group"
          aria-label={t('Filter exercises by body part')}
        >
          {muscleGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setFilter(g.id)}
              aria-pressed={filter === g.id}
              className={`tap whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
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

      {/* Cards. One pose each, not both: sixteen cards each carrying two SVG
          figures doubles the node count on the scroll path for a difference
          nobody can read at thumbnail size. The pair lives in the detail view,
          where it is big enough to teach something. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((ex, i) => (
          /* min-w-0 on the grid ITEM, not the container.

             A `1fr` track is really `minmax(auto, 1fr)`, and that `auto`
             floor is the item's min-content width — so a card that cannot
             narrow past 330px makes the single-column track 330px wide no
             matter that the page only has 288px to give it. On a 320px
             phone that was the whole document scrolling sideways by 42px.

             min-w-0 removes the floor, the track stays at the shell width,
             and every card lays out inside it. */
          <Reveal key={ex.id} delay={(i % 4) * 60} className="min-w-0">
            <button
              type="button"
              onClick={() => setSelected(ex)}
              className="card plate-edge lift group block h-full w-full overflow-hidden text-left cv-auto [--cv-h:20.5rem]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <ExerciseArt
                  name={ex.art}
                  phase="start"
                  accent={accentOf(ex)}
                  photo={ex.photo || ex.photoStart}
                  className="block h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <span className={`absolute left-3 top-3 ${levelBadge[ex.level]}`}>{t(ex.level)}</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-silver-100 group-hover:text-white">
                  {ex.name}
                </h3>
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
