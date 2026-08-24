import React from 'react'
import Reveal from './Reveal.jsx'
import { WebStrand } from '../art/Decor.jsx'
import { useIsApp } from '../../shell/context.js'

/* Standard section shell: full-width band + centered content column + a
   consistent, revealed heading block. Keeps every section visually aligned.

   In the app the same component renders inside a tab screen instead of a long
   page, so the generous band padding and the decorative strand come off — see
   the notes on each below. */

export function Section({ id, className = '', children, plated = false, strand = false }) {
  const isApp = useIsApp()
  return (
    <section
      id={id}
      className={`${isApp ? 'section-pad-app' : 'section-pad'} relative scroll-mt-24 ${
        plated ? 'grid-plate' : ''
      } ${className}`}
    >
      {/* Optional web strand hanging into the section's top padding — the
          spider motif carried through the lower half of the page. Held to lg+
          because it lives in the gutter beside the centered heading, and that
          gutter does not exist on narrow screens. `h-24` matches lg:py-28, so
          the strand never reaches the content below it. The app has neither the
          gutter nor the top padding to hang it in. */}
      {strand && !isApp && (
        <WebStrand
          accent="rage"
          className="pointer-events-none absolute right-[8%] top-0 hidden h-24 w-auto origin-top animate-strandSway opacity-45 lg:block"
        />
      )}
      <div className="shell relative">{children}</div>
    </section>
  )
}

/* One entry per accent so a spider-themed heading is not blue-ruled with a red
   title. `text` is the gradient applied to the accent word; `rule` and `eyebrow`
   keep the small furniture above it in the same key. */
const ACCENT = {
  volt: { text: 'brand-text', rule: 'bg-volt-400/60', eyebrow: 'eyebrow' },
  titan: { text: 'titan-text', rule: 'bg-titan-400/60', eyebrow: 'eyebrow !text-titan-300' },
  rage: { text: 'rage-text', rule: 'bg-rage-500/60', eyebrow: 'eyebrow !text-rage-300' },
  spider: { text: 'spider-text', rule: 'bg-rage-500/60', eyebrow: 'eyebrow !text-rage-300' },
}

export function SectionHeading({ eyebrow, title, accentWord, accent = 'volt', sub, align = 'center' }) {
  const a = ACCENT[accent] || ACCENT.volt
  const isApp = useIsApp()

  /* In the app the screen is already named twice above this point — by the tab
     bar and by the segmented rail — so repeating it a third time in 5xl display
     type would push the actual content below the fold for no information gain.
     The lead paragraph is genuinely useful (it explains each tool), so that
     stays, and the title survives for screen readers and heading structure. */
  if (isApp) {
    return (
      <div className="mb-5">
        <h2 className="sr-only">
          {title} {accentWord}
        </h2>
        {sub && <p className="text-sm leading-relaxed text-silver-400">{sub}</p>}
      </div>
    )
  }

  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start'
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-3 ${alignCls} mb-10 sm:mb-14`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2">
          <span className={`h-px w-6 ${a.rule}`} />
          <span className={a.eyebrow}>{eyebrow}</span>
          <span className={`h-px w-6 ${a.rule}`} />
        </span>
      )}
      <h2 className="forge text-3xl leading-[1.05] sm:text-4xl lg:text-5xl">
        {title} {accentWord && <span className={a.text}>{accentWord}</span>}
      </h2>
      {sub && <p className="max-w-xl text-sm leading-relaxed text-silver-400 sm:text-base">{sub}</p>}
    </Reveal>
  )
}
