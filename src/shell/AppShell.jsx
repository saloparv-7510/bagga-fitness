import React from 'react'
import AppHeader from './AppHeader.jsx'
import TabBar from './TabBar.jsx'
import { TABS, tabByKey, screenId, subOf } from './tabs.js'
import { ShellContext, NavContext } from './context.js'
import ErrorBoundary from '../components/ui/ErrorBoundary.jsx'
import BackgroundFX from '../components/BackgroundFX.jsx'
import { initNative, hideSplash } from '../native/index.js'
import { useT } from '../i18n/context.js'

/* ==========================================================================
   The mobile app shell: fixed header, one visible screen, fixed tab bar.

   Two decisions here do most of the work for smooth scrolling:

   1. Only ONE section is ever visible. The website's 13-section page is dealt
      into 5 tabs (see tabs.js), so no screen is long enough to be expensive to
      scroll.

   2. Screens are mounted on first visit and then kept mounted behind
      `display: none`, rather than being unmounted on the way out. A
      display:none subtree is skipped entirely by layout and paint, so it costs
      nothing to leave there — and in exchange, going back to a tab is instant
      and it still holds its state (the exercise filter you picked, the weight
      you typed into the calculator, the month you scrolled the calendar to).

   The document itself scrolls. Nothing here is a nested overflow container,
   which is what keeps the platform's own momentum scrolling and overscroll
   behaviour intact.
   ========================================================================== */
export default function AppShell() {
  const [tab, setTab] = React.useState('home')
  const [sub, setSub] = React.useState(0)
  const t = useT()

  /* Which screens have ever been opened — the mount cache. */
  const [mounted, setMounted] = React.useState(() => new Set([screenId('home', 0)]))
  const scrollPos = React.useRef(new Map())

  /* Last sub-screen visited per tab. A native tab bar restores where you were,
     so leaving Train on Exercises to check a number in Tools and coming back
     returns you to Exercises — not to the top of Plans. */
  const lastSub = React.useRef(new Map())

  /* The back-button listener is registered once, so it reads nav state through
     a ref rather than closing over the first render's values. */
  const navRef = React.useRef({ tab, sub })
  navRef.current = { tab, sub }

  const current = tabByKey(tab)
  const screens = current.screens

  /* `nextSub` left undefined means "wherever I was in that tab"; passing an
     explicit index (including 0) always wins, which is what the Home quick
     actions and the back button rely on. */
  const navigate = React.useCallback((nextTab, nextSub) => {
    const from = navRef.current
    scrollPos.current.set(screenId(from.tab, from.sub), window.scrollY)
    lastSub.current.set(from.tab, from.sub)

    const target = tabByKey(nextTab)

    /* `nextSub` may be a screen KEY as well as an index. Callers that hardcoded
       the index broke the moment a screen was inserted above theirs — Home's
       quick grid ended up opening Trainers under a "Gallery" label — so a key is
       the preferred form and resolves here, before the numeric clamp below
       would turn a string into NaN. */
    const asked = typeof nextSub === 'string' ? subOf(target.key, nextSub) : nextSub
    const wanted = asked === undefined ? lastSub.current.get(target.key) ?? 0 : asked
    const clamped = Math.min(Math.max(wanted, 0), target.screens.length - 1)
    const to = screenId(target.key, clamped)

    setMounted((prev) => (prev.has(to) ? prev : new Set(prev).add(to)))
    setTab(target.key)
    setSub(clamped)
    lastSub.current.set(target.key, clamped)

    /* Restore after the browser has laid the newly-shown screen out. Explicitly
       'instant': <html> carries scroll-smooth for in-page links, and we do not
       want a tab switch animating a 2000px scroll. */
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPos.current.get(to) || 0, left: 0, behavior: 'instant' })
    })
  }, [])

  const goTab = React.useCallback((t, s = 0) => navigate(t, s), [navigate])
  const goSub = React.useCallback((s) => navigate(navRef.current.tab, s), [navigate])

  const navValue = React.useMemo(() => ({ tab, sub, goTab, goSub }), [tab, sub, goTab, goSub])

  /* ---------------------------------------------------------- native init --- */
  React.useEffect(() => {
    /* Android back, resolved before the shell gets it: overlays and the
       keyboard are handled inside initNative. Returning true means "handled,
       do not exit the app". */
    const onBack = () => {
      const { tab: t, sub: s } = navRef.current
      if (s > 0) {
        navigate(t, 0)
        return true
      }
      if (t !== 'home') {
        navigate('home', 0)
        return true
      }
      return false
    }

    initNative({ onBack })

    /* Hold the splash until React has actually painted, so the app never shows
       an unstyled or half-laid-out first frame. */
    const raf = requestAnimationFrame(() => requestAnimationFrame(hideSplash))
    return () => cancelAnimationFrame(raf)
  }, [navigate])

  return (
    <ShellContext.Provider value="app">
      <NavContext.Provider value={navValue}>
        <BackgroundFX />

        <ErrorBoundary name={t('app navigation')} quiet>
          <AppHeader screens={screens} sub={sub} onSelectSub={goSub} />
        </ErrorBoundary>

        <main className="app-main">
          {TABS.map((tabDef) =>
            tabDef.screens.map((s, i) => {
              const id = screenId(tabDef.key, i)
              if (!mounted.has(id)) return null
              const active = tabDef.key === tab && i === sub
              return (
                <div
                  key={id}
                  style={active ? undefined : { display: 'none' }}
                  aria-hidden={active ? undefined : 'true'}
                >
                  <ErrorBoundary id={s.key} name={t(s.title)}>
                    <s.Component />
                  </ErrorBoundary>
                </div>
              )
            })
          )}
        </main>

        <TabBar
          tab={tab}
          onSelect={(key) => {
            if (key === tab) {
              // Tapping the active tab returns to its first screen and the top,
              // the way every native tab bar behaves. (TabBar already fired the
              // haptic before calling us.)
              if (sub !== 0) navigate(key, 0)
              else window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
              return
            }
            // No sub index: resume wherever this tab was left.
            navigate(key)
          }}
        />
      </NavContext.Provider>
    </ShellContext.Provider>
  )
}
