import React from 'react'
import { useLang, useSetLang, useT } from './context.js'

/* The one new UI control the language feature adds — explicitly requested:
   a simple segmented "English / हिन्दी" switch. English is the default, and the
   highlighted side reflects the active language. It changes nothing else on the
   page; styling is existing utility classes only (the same border/ink/volt
   tokens the header icon buttons already use).

   `compact` renders the tighter "EN / हिं" pair for the app header, where the
   control shares a single row with the call and WhatsApp buttons. */
export default function LanguageToggle({ compact = false, className = '' }) {
  const lang = useLang()
  const setLang = useSetLang()
  const t = useT()

  const options = [
    { code: 'en', label: compact ? 'EN' : 'English' },
    { code: 'hi', label: compact ? 'हिं' : 'हिन्दी' },
  ]

  return (
    <div
      role="group"
      aria-label={t('Language')}
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border border-silver-300/12 bg-ink-800/70 p-0.5 ${className}`}
    >
      {options.map((o) => {
        const active = lang === o.code
        return (
          <button
            key={o.code}
            type="button"
            lang={o.code}
            onClick={() => setLang(o.code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold leading-none transition-colors duration-200 ${
              active ? 'bg-volt-500 text-ink-950' : 'text-silver-300 hover:text-silver-100'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
