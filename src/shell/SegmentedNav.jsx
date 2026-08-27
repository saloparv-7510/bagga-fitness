import React from 'react'
import { tapFeedback } from '../native/index.js'
import { useT } from '../i18n/context.js'

/* Second-level navigation for a tab that owns more than one section.
   A pill rail rather than a dropdown: one tap instead of two, and it makes
   the whole tab's contents visible at a glance.

   Scrolls horizontally when the labels overrun (Train and Gym have four), and
   keeps the active pill in view when it was reached from somewhere else — a
   Home quick action, or the Android back button. */
export default function SegmentedNav({ screens, sub, onSelect }) {
  const railRef = React.useRef(null)
  const t = useT()

  React.useEffect(() => {
    const rail = railRef.current
    const active = rail?.querySelector('[data-active="true"]')
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [sub])

  return (
    <div ref={railRef} className="app-seg no-scrollbar" role="tablist" aria-label={t('Sections')}>
      {screens.map((s, i) => {
        const active = i === sub
        return (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={active}
            data-active={active}
            onClick={() => {
              if (active) return
              tapFeedback()
              onSelect(i)
            }}
            className={`app-seg-pill ${active ? 'is-active' : ''}`}
          >
            {t(s.label)}
          </button>
        )
      })}
    </div>
  )
}
