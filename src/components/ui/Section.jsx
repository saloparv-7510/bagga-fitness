import React from 'react'
import Reveal from './Reveal.jsx'

/* Standard section shell: full-width band + centered content column + a
   consistent, revealed heading block. Keeps every section visually aligned. */

export function Section({ id, className = '', children, plated = false }) {
  return (
    <section id={id} className={`section-pad relative scroll-mt-24 ${plated ? 'grid-plate' : ''} ${className}`}>
      <div className="shell relative">{children}</div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, accentWord, accent = 'volt', sub, align = 'center' }) {
  const accentClass = { volt: 'brand-text', titan: 'titan-text', rage: 'rage-text' }[accent] || 'brand-text'
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start'
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-3 ${alignCls} mb-10 sm:mb-14`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-6 bg-volt-400/60" />
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px w-6 bg-volt-400/60" />
        </span>
      )}
      <h2 className="forge text-3xl leading-[1.05] sm:text-4xl lg:text-5xl">
        {title} {accentWord && <span className={accentClass}>{accentWord}</span>}
      </h2>
      {sub && <p className="max-w-xl text-sm leading-relaxed text-silver-400 sm:text-base">{sub}</p>}
    </Reveal>
  )
}
