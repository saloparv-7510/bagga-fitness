import React from 'react'
import { Trophy, Target, ListOrdered, Info, MessageCircle } from 'lucide-react'
import { bestPerBodyPart, effectiveness, effectivenessNote } from '../data/effectiveness.js'
import { exercises, muscleSummary } from '../data/exercises.js'
import { waLink } from '../data/site.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import ExerciseArt from './art/ExerciseArt.jsx'

/* ---------------------------------------------------------------------------
   BEST EXERCISES — the section that answers "which exercise targets which body
   part, and which one of them is most effective".

   Every judgement on screen is authored in src/data/effectiveness.js: the array
   order IS the ranking, `why` is the winner's argument, and each `note` says
   what that exercise adds which the one above it does not. This file contributes
   no opinion of its own, and the only figures it prints are the derived rank and
   the counted group size — both computed in that file, neither typed here. Read
   its header before changing anything about how this renders; the no-numbers
   rule it sets is the reason there is no percentage, score or bar chart below.

   WHY THE THUMBNAIL IS ExerciseArt AND NOT MuscleMap
   MuscleMap is the right chart in the Exercise Guide modal and the wrong one
   here. It is authored in a 200x480 box across nineteen paired regions, and it
   always renders its own legend row plus muscle-name chips — furniture the
   caller cannot switch off. Shrunk to the ~3rem a ranked row can spare, a pec
   band is about two pixels of red and the legend is larger than the body it
   explains. ExerciseArt is 200x150 with one figure filling most of the frame, it
   accepts the same `muscles` object so the worked muscles are shaded on the pose
   itself, and it is the same drawing the Exercise Guide card uses — so a reader
   recognises the exercise across both sections instead of meeting two unrelated
   pictures of it. The muscle names then ride alongside as text, which is the
   only part of any muscle chart that survives being made small.
   --------------------------------------------------------------------------- */

/* `silver` is in this map because the core group uses it. The three-accent maps
   elsewhere in this codebase would fall through to volt and quietly paint the
   core card electric blue, which is the kind of drift nobody files a bug for.
   There is no silver gradient utility, so its heading is a flat colour. */
const A = {
  volt: { head: 'brand-text', text: 'text-volt-300', chip: 'badge-volt', ring: 'ring-volt-400/40' },
  titan: { head: 'titan-text', text: 'text-titan-300', chip: 'badge-titan', ring: 'ring-titan-400/40' },
  rage: { head: 'rage-text', text: 'text-rage-300', chip: 'badge-rage', ring: 'ring-rage-500/45' },
  silver: {
    head: 'text-silver-100',
    text: 'text-silver-200',
    chip: 'badge-silver',
    ring: 'ring-silver-300/30',
  },
}

/* The section renders the whole library, so a find() per row would be sixteen
   linear scans of the same array on every render. */
const byId = new Map(exercises.map((ex) => [ex.id, ex]))

/* First-paint height estimates in rem, measured off the rendered card — layout
   only, nothing to do with the data. They are per card rather than shared
   because a two-exercise group is nowhere near the height of a four-exercise
   one, and one shared guess would jump the scrollbar the first time the legs
   card scrolled into view. The `auto` keyword in .cv-auto's
   contain-intrinsic-size replaces the estimate with the measured height as soon
   as a card has rendered once, so this only ever affects the first pass. */
const CARD_BASE_REM = 26
const ROW_REM = 8

const askMessage =
  'Hello BAGGA FITNESS, I read the best-exercise rankings on your website. Which of them should I actually be doing for my build and my training level?'

/* Red for primary, orange for secondary — the encoding MuscleMap and
   ExerciseArt both fix in code, so a chip never disagrees about a muscle's tier
   with the shading on the drawing beside it. Secondary names are optional
   because a ranked row is answering "what does this build", which is the
   primary tier; the full picture is a tap away in the Exercise Guide. */
function MuscleTags({ ex, withSecondary = false, className = '' }) {
  const worked = muscleSummary(ex)
  const secondary = withSecondary ? worked.secondary : []
  if (!worked.primary.length && !secondary.length) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {worked.primary.map((name) => (
        <span
          key={`p-${name}`}
          className="rounded-full bg-rage-500/15 px-2 py-0.5 text-[11px] font-medium text-rage-300 ring-1 ring-inset ring-rage-500/35"
        >
          {name}
        </span>
      ))}
      {secondary.map((name) => (
        <span
          key={`s-${name}`}
          className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[11px] font-medium text-orange-300 ring-1 ring-inset ring-orange-500/35"
        >
          {name}
        </span>
      ))}
    </div>
  )
}

/* The drawing is decorative in this section and nowhere else: the exercise name
   and every muscle it works are already text within a few pixels of it, so a
   role="img" here would make a screen reader announce all of it twice, sixteen
   times over. The labelled, teaching-sized version lives in the Exercise Guide.
   Passing no `label` is what makes ExerciseArt aria-hidden itself. */
function Thumb({ ex, accent, className }) {
  return (
    <div className={`shrink-0 overflow-hidden rounded-xl border border-silver-300/10 bg-ink-950 ${className}`}>
      <ExerciseArt
        name={ex.art}
        phase="start"
        accent={accent}
        muscles={ex.muscles}
        photo={ex.photo || ex.photoStart}
        className="block h-full w-full"
      />
    </div>
  )
}

export default function BestExercises() {
  return (
    /* Plated: this is a wall of cards immediately below another wall of cards
       (the Exercise Guide grid), and the grid plate is what stops it reading as
       a continuation of it. */
    <Section id="best" plated>
      <SectionHeading
        eyebrow="Best Per Body Part"
        title="Which Exercise Actually"
        accentWord="Builds It"
        accent="rage"
        sub="Every exercise in our guide, grouped by the body part it trains and put in order. Each group leads with the one that builds it best and says why, then lists the rest with what each one adds that the exercise above it does not."
      />

      {/* The caveat opens the section instead of closing it. effectiveness.js
          says plainly why it exists — a ranked list is read as a verdict — and a
          reader who meets the qualification underneath the list has already
          rewritten their session by the time they get there. Body copy, coach's
          tone, and an action attached, because "ask a coach" is the actual
          advice rather than a legal hedge. */}
      <Reveal className="mb-10">
        <div className="card plate-edge p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-800 text-volt-300 shadow-volt">
              <Info className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="forge text-sm font-bold text-silver-100">Read this before the rankings</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-300">{effectivenessNote}</p>
              <a
                href={waLink(askMessage)}
                target="_blank"
                rel="noopener"
                className="btn-ghost mt-4 w-full sm:w-auto"
                aria-label="Ask a coach on WhatsApp which of these exercises suits you"
              >
                <MessageCircle className="h-4 w-4 text-titan-300" /> Ask A Coach What Suits You
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Two columns at most: the notes are full sentences, and a third column
          would narrow them to four words a line on a 1280px laptop. */}
      <div className="grid gap-5 lg:grid-cols-2">
        {bestPerBodyPart.map((part, i) => {
          const a = A[part.accent] || A.volt
          const ranked = effectiveness[part.group].ranked
          const first = ranked[0]
          const rest = ranked.slice(1)
          /* effectiveness.js warns about an id that is not in the library but
             still renders, and `part.name` already falls back to the raw id — so
             a typo costs this card its drawing, not its whole ranking. */
          const winner = byId.get(part.id)

          return (
            <Reveal key={part.group} delay={(i % 2) * 70} className="min-w-0">
              <article
                className="card plate-edge flex h-full flex-col overflow-hidden cv-auto"
                style={{ '--cv-h': `${CARD_BASE_REM + rest.length * ROW_REM}rem` }}
              >
                <header className="flex items-baseline justify-between gap-3 border-b border-silver-300/10 px-5 py-4">
                  <h3 className={`forge text-xl font-bold sm:text-2xl ${a.head}`}>{part.bodyPart}</h3>
                  <span className="text-xs text-silver-500">{part.total} ranked</span>
                </header>

                {/* ---- The winner. Ringed, badged and given the largest drawing
                    in the card, because the one thing a reader should be able to
                    take away from a body part at a glance is which exercise to
                    put first in the session. */}
                <div className={`m-3 rounded-2xl bg-ink-900/70 p-4 ring-1 ${a.ring}`}>
                  <div className="flex items-start gap-4">
                    {winner && <Thumb ex={winner} accent={part.accent} className="h-[4.5rem] w-24 sm:h-24 sm:w-32" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`${a.chip} forge font-bold`}>
                          <Trophy className="h-3.5 w-3.5" /> MOST EFFECTIVE
                        </span>
                        <span className="badge-silver !py-0.5">{first.role}</span>
                      </div>
                      <h4 className="mt-2 text-base font-semibold leading-tight text-silver-100 sm:text-lg">
                        {part.name}
                      </h4>
                      {winner && (
                        <div className="mt-2 flex items-start gap-1.5">
                          <Target className={`mt-1 h-3.5 w-3.5 shrink-0 ${a.text}`} />
                          <MuscleTags ex={winner} withSecondary />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-silver-200">
                    <span className={`font-semibold ${a.text}`}>Why it wins — </span>
                    {part.why}
                  </p>
                  {/* Rank 1 has nothing above it, so its note states the standard
                      the rest of the group is measured against. Kept in the row
                      note's voice and colour so the list below reads as a
                      continuation of this sentence, not a separate idea. */}
                  <p className="mt-3 border-t border-silver-300/10 pt-3 text-xs leading-relaxed text-silver-400">
                    {first.note}
                  </p>
                </div>

                {rest.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-5 pb-1 pt-2 text-[0.68rem] uppercase tracking-brand text-silver-500">
                      <ListOrdered className="h-3.5 w-3.5" /> Then, in order
                    </div>
                    {/* Ordered, because the order IS the ranking — and `start`
                        comes off the data rather than being typed as 2, so the
                        numeral on screen and the list's own numbering cannot
                        drift apart if the winner ever stops being rank 1. */}
                    <ol
                      start={rest[0].rank}
                      className="divide-y divide-silver-300/8 border-t border-silver-300/10"
                    >
                      {rest.map((r) => {
                        const ex = byId.get(r.id)
                        return (
                          <li key={r.id} className="flex items-start gap-3 px-4 py-4 sm:px-5">
                            <span className="forge w-6 shrink-0 pt-0.5 text-sm font-bold tabular-nums text-silver-500">
                              #{r.rank}
                            </span>
                            {ex && <Thumb ex={ex} accent={part.accent} className="h-12 w-16" />}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="text-sm font-semibold text-silver-100">
                                  {ex ? ex.name : r.id}
                                </span>
                                <span className="badge-silver !py-0.5">{r.role}</span>
                              </div>
                              {ex && <MuscleTags ex={ex} className="mt-1.5" />}
                              <p className="mt-1.5 text-xs leading-relaxed text-silver-400">{r.note}</p>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </>
                )}
              </article>
            </Reveal>
          )
        })}
      </div>

      {/* Not a second disclaimer — a pointer at the section that teaches the
          movements, since a reader who has just picked an exercise needs the
          setup and the mistakes next. Named rather than linked, because the app
          shell renders these sections as tabs and an anchor would go nowhere. */}
      <Reveal delay={80} className="mx-auto mt-8 max-w-2xl text-center">
        <p className="text-xs leading-relaxed text-silver-500">
          Every exercise here is demonstrated in the Exercise Guide — start and end position, the
          muscles it works, the technique and the mistakes to avoid.
        </p>
      </Reveal>
    </Section>
  )
}
