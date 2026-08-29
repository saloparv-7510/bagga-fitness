import React, { useState } from 'react'
import {
  Quote,
  Info,
  ShieldAlert,
  MessageCircle,
  Flame,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { waLink } from '../data/site.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { WebNet, WebEmblem, PowerLiftMark, AthleteMark, SenseRings } from './art/Decor.jsx'
import { useLegends } from '../i18n/localize.js'
import { useT } from '../i18n/context.js'

/* One accent key per protocol, so the card, the tab and the CTA all agree. */
const A = {
  rage: {
    tabOn: 'border-rage-500/55 bg-rage-500/12 text-rage-200',
    ring: 'text-rage-300 shadow-rage',
    heading: 'rage-text',
    btn: 'btn-rage',
    dot: 'text-rage-400',
  },
  titan: {
    tabOn: 'border-titan-400/55 bg-titan-500/12 text-titan-200',
    ring: 'text-titan-300 shadow-titan',
    heading: 'titan-text',
    btn: 'btn-titan',
    dot: 'text-titan-400',
  },
}

const ART = { lift: PowerLiftMark, athlete: AthleteMark }

export default function LegendsTraining() {
  const t = useT()
  const { legends, legendsNote } = useLegends()
  const [openId, setOpenId] = useState(legends[0].id)

  return (
    <Section id="legends">
      {/* Web strung across both top corners — the spider motif at the scale it
          works best: structural, faint, and behind everything. */}
      <WebNet
        accent="rage"
        opacity={0.16}
        className="pointer-events-none absolute -top-6 left-0 hidden h-[26rem] w-[26rem] sm:block"
      />
      <WebNet
        accent="volt"
        opacity={0.14}
        className="pointer-events-none absolute -top-6 right-0 hidden h-[26rem] w-[26rem] -scale-x-100 sm:block"
      />

      <SectionHeading
        eyebrow={t('Legend Protocols')}
        title={t('Train Like The')}
        accentWord={t('Greats')}
        accent="spider"
        sub={t(
          'Two templates built on how the strongest people in the sport actually train — brutal volume on one side, strength-first women’s programming on the other. Pick the one that matches your goal, then earn it.'
        )}
      />

      {/* Protocol switcher. Buttons rather than links: nothing navigates. */}
      <Reveal className="mb-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {legends.map((l) => {
          const on = openId === l.id
          const a = A[l.accent] || A.rage
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setOpenId(l.id)}
              aria-pressed={on}
              className={`tap flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition duration-200 ease-power sm:justify-start ${
                on
                  ? a.tabOn
                  : 'border-silver-300/12 bg-ink-900/70 text-silver-400 hover:border-silver-300/25 hover:text-silver-200'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{l.name}</span>
                <span className="block text-xs opacity-70">{l.kicker}</span>
              </span>
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${on ? 'rotate-90 sm:rotate-0' : ''}`}
              />
            </button>
          )
        })}
      </Reveal>

      <div className="grid gap-5">
        {legends.map((l) => {
          if (l.id !== openId) return null
          const a = A[l.accent] || A.rage
          const Art = ART[l.art] || PowerLiftMark
          return (
            <article key={l.id} className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
              {/* ---------- Identity panel ---------- */}
              <Reveal className="card plate-edge relative overflow-hidden p-6 sm:p-7">
                <Art
                  accent={l.accent}
                  className="pointer-events-none absolute -right-8 top-6 h-56 w-auto opacity-[0.09]"
                />
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink-800 ${a.ring}`}>
                      <WebEmblem accent={l.accent} className="h-8 w-8" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[0.68rem] uppercase tracking-brand text-silver-500">
                        {l.kicker}
                      </div>
                      <h3 className="forge mt-0.5 text-xl font-bold leading-tight sm:text-2xl">
                        <span className={a.heading}>{l.name}</span>
                      </h3>
                    </div>
                  </div>

                  {/* Attribution. This is the block that keeps the section
                      honest — an influence citation for the real name, an
                      explicit fiction label for the invented one. */}
                  {l.influence && (
                    <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-silver-300">
                      <Flame className={`mt-0.5 h-4 w-4 shrink-0 ${a.dot}`} />
                      <span>{l.influenceLine}</span>
                    </p>
                  )}
                  {l.persona && (
                    <>
                      <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-silver-300">
                        <Sparkles className={`mt-0.5 h-4 w-4 shrink-0 ${a.dot}`} />
                        <span>{l.influenceLine}</span>
                      </p>
                      <p className="mt-3 rounded-xl border border-silver-300/12 bg-ink-900/70 p-3 text-xs leading-relaxed text-silver-400">
                        <span className="badge-silver mr-2 !py-0.5 align-middle">
                          {t('Illustrated persona')}
                        </span>
                        {l.personaLine}
                      </p>
                    </>
                  )}

                  {/* Quote */}
                  <blockquote className="mt-6 rounded-2xl border border-silver-300/10 bg-ink-900/60 p-5">
                    <Quote className={`h-5 w-5 ${a.dot}`} />
                    <p className="mt-2 text-base font-medium italic leading-relaxed text-silver-100 sm:text-lg">
                      “{l.quote}”
                    </p>
                    <footer className="mt-2 text-xs text-silver-500">{l.quoteNote}</footer>
                  </blockquote>

                  <p className="mt-5 text-sm leading-relaxed text-silver-400">{l.summary}</p>

                  <a
                    href={waLink(l.cta)}
                    target="_blank"
                    rel="noopener"
                    className={`${a.btn} mt-6 w-full`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t('Start This With A Coach')}
                  </a>
                </div>
              </Reveal>

              {/* ---------- Programme panel ---------- */}
              <div className="flex flex-col gap-5">
                {/* Principles */}
                <Reveal delay={70} className="card plate-edge p-6 sm:p-7">
                  <h4 className="forge text-sm font-bold uppercase tracking-brand text-silver-200">
                    {t('How It Works')}
                  </h4>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {l.principles.map((p, i) => (
                      <li
                        key={p.title}
                        className="rounded-xl border border-silver-300/10 bg-ink-900/60 p-4"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className={`forge text-xs font-bold ${a.dot}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-semibold text-silver-100">{p.title}</span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-silver-400">{p.text}</p>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* Sample day */}
                <Reveal delay={140} className="card plate-edge overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-silver-300/10 p-5">
                    <h4 className="forge text-sm font-bold uppercase tracking-brand text-silver-200">
                      {l.day.label}
                    </h4>
                    <SenseRings accent={l.accent === 'rage' ? 'rage' : 'titan'} className="h-7 w-7" />
                  </div>
                  <ul className="divide-y divide-silver-300/8">
                    {l.day.rows.map((r) => (
                      <li key={r.move} className="grid gap-1 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-silver-100">{r.move}</div>
                          <div className="mt-0.5 text-xs leading-relaxed text-silver-500">{r.note}</div>
                        </div>
                        <span className="justify-self-start rounded-lg border border-silver-300/12 bg-ink-900/70 px-2.5 py-1 text-xs font-semibold tabular-nums text-silver-200 sm:justify-self-end">
                          {r.work}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* Reality check + safety */}
                <Reveal delay={200} className="card plate-edge p-6">
                  <p className="flex items-start gap-2 text-sm leading-relaxed text-silver-300">
                    <ShieldAlert className={`mt-0.5 h-4 w-4 shrink-0 ${a.dot}`} />
                    <span>
                      <span className="font-semibold text-silver-100">{t('Reality check — ')}</span>
                      {l.reality}
                    </span>
                  </p>
                  <div className="web-rule my-4" />
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-silver-500">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silver-400" />
                    {l.safety}
                  </p>
                  {l.disclaimer && (
                    <p className="mt-3 rounded-xl border border-silver-300/10 bg-ink-900/60 p-3 text-xs leading-relaxed text-silver-500">
                      {l.disclaimer}
                    </p>
                  )}
                </Reveal>
              </div>
            </article>
          )
        })}
      </div>

      {/* One standing note under the whole section. */}
      <Reveal delay={80} className="mx-auto mt-8 max-w-2xl text-center">
        <p className="text-xs leading-relaxed text-silver-500">{legendsNote}</p>
      </Reveal>
    </Section>
  )
}
