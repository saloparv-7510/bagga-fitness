import React from 'react'
import { ArrowRight, Zap, ChevronDown, ShieldCheck } from 'lucide-react'
import { brand, stats } from '../data/site.js'
import { LightningWarrior, GreenTitan, LightningField, Bolt } from './art/Decor.jsx'
import CountUp from './ui/CountUp.jsx'

const scrollTo = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]">
      {/* Decorative superhero-inspired figures, framing the copy on large screens */}
      <LightningWarrior
        accent="volt"
        className="pointer-events-none absolute -left-10 bottom-0 hidden h-[78%] w-auto opacity-[0.16] lg:block"
      />
      <GreenTitan
        accent="titan"
        className="pointer-events-none absolute -right-8 bottom-0 hidden h-[74%] w-auto opacity-[0.15] lg:block"
      />
      {/* animated lightning behind the heading */}
      <LightningField
        accent="volt"
        className="pointer-events-none absolute inset-x-0 top-[18%] mx-auto h-[60%] w-full max-w-4xl animate-arcFlicker opacity-70"
      />

      <div className="shell relative z-10 py-16 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="badge-volt animate-riseIn">
            <Zap className="h-3.5 w-3.5" />
            Prahladpur • Est. {brand.established} • Strength &amp; Conditioning
          </span>

          <h1
            className="forge mt-6 text-4xl font-bold leading-[0.98] text-shadow-power animate-riseIn sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '80ms' }}
          >
            <span className="block text-silver-100">Build Your</span>
            <span className="block">
              <span className="rage-text">Best Body</span> <span className="text-silver-100">With</span>
            </span>
            <span className="mt-1 block">
              <span className="brand-text">{brand.first}</span> <span className="titan-text">{brand.second}</span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-silver-300 animate-riseIn sm:text-lg"
            style={{ animationDelay: '160ms' }}
          >
            Forge strength like thunder and power like a titan. Real coaching, a serious iron floor and a
            plan built for your level — from your very first rep to your heaviest lift.
          </p>

          <div
            className="mt-8 flex w-full flex-col items-center gap-3 animate-riseIn sm:w-auto sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <a href="#bmi" onClick={scrollTo('bmi')} className="btn-volt w-full sm:w-auto">
              Start Your Fitness Journey
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#plans" onClick={scrollTo('plans')} className="btn-ghost w-full sm:w-auto">
              Explore Workout Plans
            </a>
          </div>

          <div
            className="mt-5 flex items-center gap-2 text-xs text-silver-500 animate-riseIn"
            style={{ animationDelay: '320ms' }}
          >
            <ShieldCheck className="h-4 w-4 text-titan-400" />
            No fluff. Certified coaches, honest guidance, open 7 days a week.
          </div>
        </div>

        {/* Stat strip */}
        <div
          className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 animate-riseIn sm:mt-16 sm:grid-cols-4 sm:gap-4"
          style={{ animationDelay: '400ms' }}
        >
          {stats.map((s) => (
            <div key={s.label} className="card plate-edge lift px-4 py-5 text-center">
              <div className="forge text-2xl font-bold text-silver-100 sm:text-3xl">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[0.7rem] uppercase tracking-brand text-silver-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#about"
        onClick={scrollTo('about')}
        className="absolute inset-x-0 bottom-5 z-10 mx-auto hidden w-fit flex-col items-center gap-1 text-silver-500 transition-colors hover:text-volt-300 sm:flex"
        aria-label="Scroll to about"
      >
        <Bolt className="h-5 w-3 animate-breathe" stroke="#38bdf8" />
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  )
}
