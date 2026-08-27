import '@fontsource-variable/oswald'
import '@fontsource-variable/inter'
import './styles/index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LanguageProvider from './i18n/LanguageProvider.jsx'

/* ==========================================================================
   One codebase, two shells.

     website  ->  App.jsx      long-scroll page, sticky navbar, footer
     app      ->  AppShell     five bottom tabs, one section per screen

   `VITE_TARGET=app` comes from .env.app (npm run dev:app / build:app), and
   window.Capacitor is injected by the native bridge — so a build that was made
   for the web still behaves correctly if it is ever loaded inside the app.

   window.Capacitor is read rather than imported, and both AppShell and the
   native module are reached through dynamic imports. So nothing native sits in
   the website's entry chunk, and the site never fetches any of it — confirmed
   at runtime: a loaded page reports no capacitor/AppShell resource entries.

   It does not keep those bytes out of dist/ entirely. isApp keeps the
   window.Capacitor fallback, so Rollup cannot fold the branch away and still
   code-splits the AppShell and @capacitor/* chunks (~25KB) into the site build,
   where they are deployed but never requested. Making isApp depend on
   VITE_TARGET alone would drop them, at the cost of a web build no longer
   working if it were ever loaded inside the native shell.
   ========================================================================== */
const isApp =
  import.meta.env.VITE_TARGET === 'app' || window.Capacitor?.isNativePlatform?.() === true

/* Set before the first paint: the app's CSS (fixed chrome, safe-area padding,
   no text selection) hangs off this attribute. */
document.documentElement.dataset.shell = isApp ? 'app' : 'web'

const root = createRoot(document.getElementById('root'))

/* ---------------------------------------------------------- splash safety --- */
/* capacitor.config.json sets launchAutoHide:false, so the native splash stays
   up until something asks it to go. AppShell does that from an effect once
   React has painted — but an effect only runs if render got that far. A failed
   chunk load, or a throw above the error boundary, would leave the splash up
   over a dead page forever, which reads as a hang rather than as an error.

   Imported dynamically, and only in app mode: main.jsx must never pull
   @capacitor/* into the website's entry chunk. By the time this runs on the
   happy path the module is already in cache, so it costs nothing.
   SplashScreen.hide() on an already-hidden splash is a no-op, and
   native/index.js swallows plugin failures, so calling it a second time is
   harmless. */
let splashReleased = false
const releaseSplash = () => {
  if (!isApp || splashReleased) return
  splashReleased = true
  import('./native/index.js').then((m) => m.hideSplash()).catch(() => {})
}

async function boot() {
  const Shell = isApp ? (await import('./shell/AppShell.jsx')).default : App
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <Shell />
      </LanguageProvider>
    </React.StrictMode>
  )
}

boot().catch((err) => {
  /* Reached when the shell chunk itself cannot load. The stylesheet may not
     have applied either, so the message carries its own inline styles and
     depends on nothing in src/. */
  console.error('[boot] shell failed to start', err)
  releaseSplash()
  const el = document.getElementById('root')
  if (el && !el.firstChild) {
    /* This runs when the shell chunk cannot load, so it cannot reach React
       context — read the remembered language straight from localStorage and
       fall back to English on any failure. */
    let hi = false
    try {
      hi = localStorage.getItem('bf.lang') === 'hi'
    } catch {
      hi = false
    }
    const message = hi
      ? 'BAGGA FITNESS शुरू नहीं हो सका। कृपया ऐप बंद करके दोबारा खोलें।'
      : 'BAGGA FITNESS could not start. Please close the app and open it again.'
    el.innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;' +
      'padding:24px;background:#04050a;color:#f4f7fb;font:16px/1.5 system-ui,sans-serif;' +
      'text-align:center">' +
      message +
      '</div>'
  }
})

/* Backstop for the case boot() cannot see: React reports a render error thrown
   above the boundary itself, leaving an empty root and a resolved promise. The
   splash must still come down. Timed from the moment this module executes — the
   bundle has already parsed by then, so a real boot never needs anywhere near
   this long. (The 20s cold start measured on a first-run emulator is all spent
   before any JS runs.) */
setTimeout(releaseSplash, 8000)
