import { useEffect, useMemo, useState } from 'react'

/* ---------------------------------------------------------------------------
   useClosedDay — "is the gym closed today?", answered in the VISITOR's timezone.

   CONFIRMED BUSINESS FACT this hook encodes: BAGGA FITNESS is closed every
   Sunday. Nothing else about the timetable is known (see the TRUTH POLICY at
   the head of src/data/site.js), so this hook deliberately reports a day, never
   an opening or closing time.

   Local time, not UTC, and not the server's clock: "is it Sunday" is a question
   about the person looking at the screen, so it is answered with
   `new Date().getDay()`.

   The hard part is staleness, not the arithmetic. A phone left on the page
   overnight, or a Capacitor WebView resumed from the background on Monday
   morning, would otherwise keep rendering Sunday's notice against a mounted
   component that never re-rendered. So the day index is re-read on four
   triggers:

     1. mount
     2. `visibilitychange` — the app returning to the foreground, or the tab
        being switched back to
     3. window `focus` and `pageshow` — desktop tab focus, and a bfcache
        restore, which does not fire visibilitychange on every engine
     4. one timer armed for the next LOCAL midnight

   The timer is a single chained setTimeout computed from the wall clock, not a
   poll — nothing here runs per second. It is also re-armed on every foreground
   event, because mobile WebViews throttle or suspend pending timers while
   backgrounded, so the midnight callback cannot be trusted to have fired on
   its own.

   SSR / no-window safe: every window and document access is guarded, and the
   first render reports "not the closed day" when there is no window, so a
   server render and its hydration agree.
   --------------------------------------------------------------------------- */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* Keeps a bad prop from producing `undefined` day names downstream. */
function normaliseDay(index) {
  const n = Number(index)
  if (!Number.isFinite(n)) return 0
  return ((Math.trunc(n) % 7) + 7) % 7
}

/* Milliseconds from now until 00:00 local tomorrow.

   Built with the Date(y, m, d + 1) constructor rather than by adding 86.4e6, so
   it stays correct across a DST boundary (the constructor resolves local
   midnight, whatever length that day happened to be). The 750ms cushion keeps
   the callback landing clearly inside the new date instead of a hair before it
   on a timer that fires early; the 1s floor stops a zero/negative delay from
   turning the chain into a busy loop. */
function msUntilLocalMidnight() {
  const now = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
  return Math.max(1000, midnight.getTime() - now.getTime() + 750)
}

/**
 * @param {number} closedDayIndex 0 = Sunday, matching JS `Date#getDay()`.
 * @returns {{ isClosedToday: boolean, dayName: string, nextOpenLabel: string }}
 *   isClosedToday — true only while the visitor's local day is the closed day.
 *   dayName       — the name of the CLOSED day, e.g. 'Sunday'. Constant.
 *   nextOpenLabel — the first upcoming day that is not the closed day, counted
 *                   from today: 'Monday' while today is Sunday, otherwise
 *                   today's own name. A day name only — it makes no claim
 *                   about opening or closing times.
 */
export default function useClosedDay(closedDayIndex = 0) {
  const closed = normaliseDay(closedDayIndex)

  /* null means "no window yet" (server render, or a non-DOM test env), which
     reads as not-closed. The mount effect below replaces it immediately. */
  const [todayIndex, setTodayIndex] = useState(() =>
    typeof window === 'undefined' ? null : new Date().getDay()
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    let timer = 0
    let alive = true

    const readDay = () => {
      if (!alive) return
      const day = new Date().getDay()
      setTodayIndex((prev) => (prev === day ? prev : day))
    }

    const armMidnight = () => {
      if (!alive) return
      timer = window.setTimeout(() => {
        timer = 0
        readDay()
        armMidnight()
      }, msUntilLocalMidnight())
    }

    /* Foreground again: the day may have rolled over while the timer was
       suspended, so re-read *and* rebuild the timer from the current clock. */
    const resync = () => {
      if (!alive) return
      readDay()
      if (timer) window.clearTimeout(timer)
      timer = 0
      armMidnight()
    }

    const onVisibility = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') resync()
    }

    readDay()
    armMidnight()

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibility)
    }
    window.addEventListener('focus', resync)
    window.addEventListener('pageshow', resync)

    return () => {
      alive = false
      if (timer) window.clearTimeout(timer)
      timer = 0
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility)
      }
      window.removeEventListener('focus', resync)
      window.removeEventListener('pageshow', resync)
    }
  }, [])

  /* Memoised so the object can sit in a consumer's dependency array without
     re-triggering their effects on every parent render. */
  return useMemo(() => {
    const isClosedToday = todayIndex === closed
    const nextOpenIndex = isClosedToday ? (closed + 1) % 7 : todayIndex
    return {
      isClosedToday,
      dayName: DAY_NAMES[closed],
      nextOpenLabel: DAY_NAMES[nextOpenIndex == null ? (closed + 1) % 7 : nextOpenIndex],
    }
  }, [todayIndex, closed])
}
