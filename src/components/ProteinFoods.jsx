import React, { useMemo, useState } from 'react'
import { Drumstick } from 'lucide-react'
import { proteinFoods, foodCategories } from '../data/nutrition.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import FoodArt from './art/FoodArt.jsx'

const MAX_P = 52 // soya chunks — used to scale the protein bars

export default function ProteinFoods() {
  const [cat, setCat] = useState('all')
  const list = useMemo(
    () => (cat === 'all' ? proteinFoods : proteinFoods.filter((f) => f.cat === cat)),
    [cat]
  )

  return (
    <Section id="foods">
      <SectionHeading
        eyebrow="Eat For Strength"
        title="High-Protein"
        accentWord="Foods"
        accent="titan"
        sub="Veg and non-veg sources with protein per 100 g and a real-world serving. Build your plate around these."
      />

      <Reveal className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter foods by category">
        {foodCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
              cat === c.id
                ? 'border-titan-400/50 bg-titan-500/12 text-titan-100'
                : 'border-silver-300/12 bg-ink-900/70 text-silver-400 hover:text-silver-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((f, i) => (
          <Reveal key={f.name} delay={(i % 4) * 55}>
            <article className="card plate-edge lift flex h-full items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0">
                <FoodArt name={f.art} accent={f.accent} className="block h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-silver-100">{f.name}</h3>
                  <span className="shrink-0 text-sm font-bold text-titan-300">{f.protein}g</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-titan-400 to-volt-400"
                    style={{ width: `${Math.min((f.protein / MAX_P) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-2 truncate text-xs text-silver-500">{f.serving}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-silver-500">
        <Drumstick className="h-3.5 w-3.5" />
        Protein per 100 g of the common edible portion — typical rounded values for guidance.
      </Reveal>
    </Section>
  )
}
