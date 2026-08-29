import React from 'react'
import { ShieldAlert, User, Clock } from 'lucide-react'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { SupplementArt } from './art/FoodArt.jsx'
import { useNutrition } from '../i18n/localize.js'
import { useT } from '../i18n/context.js'

const accentText = { volt: 'text-volt-300', titan: 'text-titan-300', rage: 'text-rage-300' }
const accentBadge = { volt: 'badge-volt', titan: 'badge-titan', rage: 'badge-rage' }

export default function Supplements() {
  const t = useT()
  const { supplements, supplementNote } = useNutrition()
  return (
    <Section id="supplements" plated strand>
      <SectionHeading
        eyebrow={t('Smart Support')}
        title={t('Supplements That')}
        accentWord={t('Actually Help')}
        accent="volt"
        sub={t('An honest breakdown — what each one does, who it is for and how to use it. Food first, always.')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supplements.map((s, i) => (
          <Reveal key={s.name} delay={(i % 3) * 70}>
            <article className="card plate-edge lift flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14">
                  <SupplementArt name={s.art} accent={s.accent} className="block h-full w-full" />
                </div>
                <span className={accentBadge[s.accent]}>{s.tag}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-silver-100">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{s.what}</p>

              <div className="mt-4 space-y-2 border-t border-silver-300/10 pt-4 text-sm">
                <div className="flex items-start gap-2">
                  <User className={`mt-0.5 h-4 w-4 shrink-0 ${accentText[s.accent]}`} />
                  <p className="text-silver-400">
                    <span className="font-medium text-silver-300">{t('Best for: ')}</span>
                    {s.who}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className={`mt-0.5 h-4 w-4 shrink-0 ${accentText[s.accent]}`} />
                  <p className="text-silver-400">
                    <span className="font-medium text-silver-300">{t('How: ')}</span>
                    {s.how}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6">
        <div className="card flex items-start gap-3 p-5">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rage-400" />
          <p className="text-sm leading-relaxed text-silver-400">
            <span className="font-semibold text-silver-200">{t('Important: ')}</span>
            {supplementNote}
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
