import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import GymArt from './art/GymArt.jsx'
import { useLockBodyScroll, useKeyDown, useFocusTrap } from '../hooks/index.js'
import { useSiteContent } from '../i18n/localize.js'
import { useT } from '../i18n/context.js'

const accentBadge = { volt: 'badge-volt', titan: 'badge-titan', rage: 'badge-rage' }

/* Mosaic sizing — a couple of feature tiles span 2 cols/rows on desktop. */
const spanOf = (i) => {
  if (i === 0) return 'sm:col-span-2 sm:row-span-2'
  if (i === 3) return 'lg:col-span-2'
  return ''
}

export default function Gallery() {
  const t = useT()
  const { gallery, galleryNote } = useSiteContent()
  const [idx, setIdx] = useState(-1)
  const open = idx >= 0
  useLockBodyScroll(open)
  const trapRef = useFocusTrap(open)

  const show = (i) => setIdx((i + gallery.length) % gallery.length)
  const active = open ? gallery[idx] : null

  useKeyDown(open, {
    Escape: () => setIdx(-1),
    ArrowLeft: () => show(idx - 1),
    ArrowRight: () => show(idx + 1),
  })

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow={t('Inside The Gym')}
        title={t('The')}
        accentWord={t('Gallery')}
        accent="volt"
        sub={t('Original illustrations of the training that happens here — squat work, free weights, conditioning and the rest. Tap any tile to view it larger.')}
      />

      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[160px] lg:grid-cols-4">
        {gallery.map((g, i) => (
          <Reveal
            key={g.title}
            delay={(i % 4) * 55}
            className={`${spanOf(i)}`}
          >
            <button
              type="button"
              onClick={() => show(i)}
              className="card plate-edge group relative block h-full w-full overflow-hidden text-left cv-auto"
            >
              <GymArt name={g.art} accent={g.accent} className="block h-full w-full transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                <div>
                  <div className="text-sm font-semibold text-silver-100">{g.title}</div>
                  <span className={`mt-1 ${accentBadge[g.accent]} !py-0.5`}>{g.tag}</span>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
        >
          <div className="absolute inset-0 bg-ink-950/90" onClick={() => setIdx(-1)} />
          <div ref={trapRef} className="relative z-10 w-full max-w-3xl">
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/10] w-full">
                <GymArt name={active.art} accent={active.accent} label={`${active.title} — ${active.tag}`} className="block h-full w-full" />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <div id="gallery-lightbox-title" className="text-lg font-semibold text-silver-100">
                    {active.title}
                  </div>
                  <span className={accentBadge[active.accent]}>{active.tag}</span>
                </div>
                <span className="text-xs text-silver-500">
                  {idx + 1} / {gallery.length}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIdx(-1)}
              className="absolute -top-3 right-0 grid h-10 w-10 -translate-y-full place-items-center rounded-full bg-ink-800 text-silver-200 hover:text-white sm:-right-3 sm:top-0 sm:translate-y-0"
              aria-label={t('Close gallery viewer')}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => show(idx - 1)}
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink-950/70 text-silver-200 hover:text-white"
              aria-label={t('Previous image')}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => show(idx + 1)}
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink-950/70 text-silver-200 hover:text-white"
              aria-label={t('Next image')}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Says plainly that these are drawings, not photographs of the floor. */}
      <Reveal className="mx-auto mt-6 flex max-w-2xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-silver-500">
        <Images className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{galleryNote}</span>
      </Reveal>
    </Section>
  )
}
