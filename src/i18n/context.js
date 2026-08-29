import { createContext, useContext } from 'react'
import { interpolate } from './interpolate.js'

/* The language seam, mirroring src/shell/context.js in shape and style.

   The default value is a fully working English implementation — identity t()
   with interpolation and a no-op setter — so any consumer rendered outside the
   provider (a stray unit test, the ErrorBoundary before the tree mounts) keeps
   showing correct English rather than throwing on a null context. */
export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (en, vars) => interpolate(en, vars),
})

export const useLanguage = () => useContext(LanguageContext)
export const useLang = () => useContext(LanguageContext).lang
export const useSetLang = () => useContext(LanguageContext).setLang
export const useT = () => useContext(LanguageContext).t
