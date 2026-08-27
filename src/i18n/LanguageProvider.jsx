import React from 'react'
import { LanguageContext } from './context.js'
import { interpolate } from './interpolate.js'
import { readLang, writeLang } from './storage.js'
import chromeHi from './chrome.hi.js'

/* The single language seam for BOTH shells.

   Mounted once in main.jsx around whichever shell boots (the long-scroll
   website App or the tabbed AppShell), so English/Hindi is implemented in
   exactly one place and both targets get it.

   `lang` is lazy-initialised from localStorage (default 'en'), so the very
   first paint is already in the remembered language — a returning Hindi user
   never sees an English flash. English is the SOURCE language, so English mode
   is pure identity: t() returns its own argument and every data hook returns
   the untouched English object. Hindi mode looks each string up and falls back
   to English whenever a translation is missing, which is why English output can
   never silently change and a half-finished translation degrades gracefully. */
export default function LanguageProvider({ children }) {
  const [lang, setLangState] = React.useState(() => readLang() || 'en')

  React.useEffect(() => {
    writeLang(lang)
    // Metadata only — index.html ships lang="en"; this reflects the live choice
    // for the accessibility tree and font fallback. No layout impact.
    document.documentElement.lang = lang
  }, [lang])

  const setLang = React.useCallback((next) => {
    setLangState(next === 'hi' ? 'hi' : 'en')
  }, [])

  /* t(english, vars?, ctx?)
     `ctx` disambiguates one English word that needs two different Hindi words —
     "About" is the Gym screen's label but also the "About 4 kg to lose" prefix,
     and Hindi has no single word covering both. The caller passes a context tag
     and the map holds an object: { default: …, bmi: … }. English is unaffected
     either way, because the English branch never consults the map. */
  const t = React.useCallback(
    (en, vars, ctx) => {
      if (lang === 'hi') {
        const entry = chromeHi[en]
        const hit = entry && typeof entry === 'object' ? entry[ctx] ?? entry.default : entry
        return interpolate(typeof hit === 'string' && hit.length ? hit : en, vars)
      }
      return interpolate(en, vars)
    },
    [lang]
  )

  const value = React.useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
