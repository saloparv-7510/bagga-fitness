import React from 'react'
import { Flame, Users, Dumbbell, HeartPulse, ShieldCheck, Sparkles, Check } from 'lucide-react'
import { facilities, coaches, membership } from '../data/site.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { TorsoMark } from './art/Decor.jsx'

const accentRing = {
  volt: 'shadow-volt text-volt-300',
  titan: 'shadow-titan text-titan-300',
  rage: 'shadow-rage text-rage-300',
}
const facilityIcon = [Flame, Dumbbell, HeartPulse, Sparkles, Users, ShieldCheck]

export default function About() {
  return (
    <Section id="about" plated>
      <SectionHeading
        eyebrow="About The Gym"
        title="A Serious Floor Built For"
        accentWord="Real Results"
        accent="titan"
        sub="BAGGA FITNESS is a strength-first gym in Prahladpur. No gimmicks — proper equipment, certified coaching and a plan matched to your level, whether it is day one or year ten."
      />

      {/* Facilities grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((f, i) => {
          const Icon = facilityIcon[i % facilityIcon.length]
          return (
            <Reveal key={f.title} delay={i * 70}>
              <article className="card plate-edge lift relative h-full overflow-hidden p-6">
                <TorsoMark
                  accent={f.accent}
                  className="pointer-events-none absolute -right-6 -top-4 h-28 w-auto opacity-[0.06]"
                />
                <span
                  className={`grid h-12 w-12 place-items-center rounded-xl bg-ink-800 ${
                    accentRing[f.accent] || accentRing.volt
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-silver-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{f.text}</p>
              </article>
            </Reveal>
          )
        })}
      </div>

      {/* Coaches */}
      <div className="mt-16">
        <Reveal>
          <h3 className="forge text-center text-2xl font-bold text-silver-100 sm:text-3xl">
            Coaching That <span className="titan-text">Actually Coaches</span>
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-silver-400">
            Every member gets form checks and a plan — not just a keycard and a treadmill.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {coaches.map((coach, i) => (
            <Reveal key={coach.role} delay={i * 80}>
              <article className="card plate-edge lift h-full p-6 text-center">
                <div
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-800 ${
                    accentRing[coach.accent] || accentRing.volt
                  }`}
                >
                  <Users className="h-7 w-7" strokeWidth={2} />
                </div>
                <h4 className="mt-4 text-base font-semibold text-silver-100">{coach.name}</h4>
                <div className="mt-1 text-xs uppercase tracking-brand text-volt-300">{coach.role}</div>
                <p className="mt-3 text-sm text-silver-400">{coach.focus}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Membership */}
      <div className="mt-16">
        <Reveal>
          <h3 className="forge text-center text-2xl font-bold text-silver-100 sm:text-3xl">
            Simple <span className="brand-text">Membership</span>
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-silver-400">
            Prices are placeholders — confirm current rates at the front desk or on WhatsApp.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {membership.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80}>
              <article
                className={`card plate-edge lift relative flex h-full flex-col p-6 ${
                  plan.featured ? 'ring-1 ring-titan-400/40' : ''
                }`}
              >
                {plan.featured && (
                  <span className="badge-titan absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</span>
                )}
                <div className="text-sm font-semibold uppercase tracking-brand text-silver-400">{plan.name}</div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="forge text-3xl font-bold text-silver-100">{plan.price}</span>
                  <span className="mb-1 text-xs text-silver-500">/ {plan.period}</span>
                </div>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-silver-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-titan-400" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`mt-6 ${plan.featured ? 'btn-titan' : 'btn-ghost'} w-full`}
                >
                  Enquire
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
