/* Soft persistence for the language choice.

   Mirrors the try/catch sessionStorage wrappers in
   src/components/ui/ClosedNotice.jsx: web storage can throw (private mode,
   disabled cookies, a locked-down WebView), and a thrown read or write must
   never stop the app from rendering. A failed read just means "fall back to the
   default language"; a failed write just means "the choice is not remembered".

   The key lives on the WebView's localStorage, which Capacitor persists across
   app restarts — so no @capacitor/preferences dependency is needed. */
export const LANG_KEY = 'bf.lang'

export function readLang() {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'en' || v === 'hi' ? v : null
  } catch {
    return null
  }
}

export function writeLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    /* ignore — the choice simply will not be remembered this session */
  }
}
