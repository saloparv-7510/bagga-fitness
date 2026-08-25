import React, { useEffect, useState } from 'react'
import { CalendarX, MessageCircle, X } from 'lucide-react'
import { closedDay, waLink } from '../../data/site.js'
import useClosedDay from '../../hooks/useClosedDay.js'

/* ---------------------------------------------------------------------------
   ClosedNotice — the one closure fact BAGGA FITNESS has confirmed.

   The gym is closed every Sunday. That is the whole claim: no opening time, no
   closing time, no "back at 6am Monday" (see the TRUTH POLICY at the head of
   src/data/site.js — this file must not become the place where invented hours
   creep back in). Everything time-of-day shaped is handed to WhatsApp, which is
   the only channel that can give an accurate answer.

   Renders nothing at all on the other six days — no wrapper, no empty bar, no
   layout space — so it is safe to mount unconditionally at the top of a page or
   inside the app header.

   Shell-agnostic by design: `compact` picks the dense one-line form for the app
   header, the default is the fuller bar for the website. It reads no shell
   context, so either target can render either form.
   --------------------------------------------------------------------------- */

/* Required copy, confirmed by the owner — sourced from `closedDay` in site.js so
   the wording lives in exactly one place. `closedDay.index` is the Date.getDay()
   value the hook compares against, so switching the rest day is a data edit. */
const CLOSED_TEXT = closedDay.notice

/* Session-scoped dismissal, keyed by the LOCAL calendar date rather than a bare
   flag. An app WebView session can outlive the day — Capacitor keeps the page
   alive across a resume — so a plain 'dismissed' key would stay set into next
   week. Keying by date means the notice is gone for the rest of *this* Sunday
   and back on the next one, which is the behaviour asked for. */
const STORE_PREFIX = 'bf:closed-notice:'

function dismissKey() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  // Local date parts, not toISOString() — that is UTC, and would roll the key
  // over at 05:30 local in IST.
  return `${STORE_PREFIX}${d.getFullYear()}-${month}-${day}`
}

/* Storage access itself can throw, not just return null: Safari private mode
   and some Android WebView configurations raise a SecurityError on the property
   access. Both helpers therefore fail soft — worst case the notice simply keeps
   showing, which is better than a blank screen. */
function readDismissed(key) {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeDismissed(key) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(key, '1')
  } catch {
    /* no persistence available — dismissal lasts until the next render tree */
  }
}

export default function ClosedNotice({ className = '', compact = false, dismissible = true }) {
  const { isClosedToday, dayName, nextOpenLabel } = useClosedDay(closedDay.index)

  /* Read once during the first render rather than in an effect, so a visitor who
     already dismissed it never sees a frame of the bar. Guarded for no-window. */
  const [dismissed, setDismissed] = useState(() => readDismissed(dismissKey()))
  const [shown, setShown] = useState(false)

  const storeKey = isClosedToday ? dismissKey() : null

  /* Re-check when the date key changes — a page left open across midnight into
     the next Sunday (or a week-long app session) must not inherit the old
     dismissal. */
  useEffect(() => {
    if (!storeKey) return
    setDismissed(readDismissed(storeKey))
  }, [storeKey])

  const visible = isClosedToday && !dismissed

  /* Entry transition: opacity + transform only, ~200ms, driven by a class flip
     one frame after the element is in the DOM. Two nested rAFs, not one — a
     single rAF callback runs *before* the frame that would have painted the
     opacity-0 state, so the browser would have nothing to transition from.
     prefers-reduced-motion is handled globally in src/styles/index.css, which
     collapses every transition-duration; the end state is reached either way. */
  useEffect(() => {
    if (!visible) {
      setShown(false)
      return
    }
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      setShown(true)
      return
    }
    let inner = 0
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setShown(true))
    })
    return () => {
      window.cancelAnimationFrame(outer)
      if (inner) window.cancelAnimationFrame(inner)
    }
  }, [visible])

  if (!visible) return null

  const onDismiss = () => {
    if (storeKey) writeDismissed(storeKey)
    setDismissed(true)
  }

  /* Both strings come from site.js, not from here. The prefill asks a question
     and states only the confirmed fact, and keeping it in the data layer means
     the owner can re-word the notice without opening a component. */
  const message = closedDay.askMessage

  const enter = `transition duration-200 ease-power ${
    shown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
  }`

  const dismissBtn = dismissible ? (
    <button
      type="button"
      onClick={onDismiss}
      aria-label={`Dismiss the ${dayName} closure notice`}
      className="tap grid w-11 shrink-0 place-items-center rounded-xl text-silver-400
        transition-transform duration-150 ease-power hover:text-silver-100 active:scale-90"
    >
      <X className="h-4 w-4" aria-hidden="true" />
    </button>
  ) : null

  /* ---- Dense single line: app header, or anywhere vertical space is scarce.
     The row is exactly one 44px line, so the two controls in it are full-size
     touch targets without making the bar any taller. */
  if (compact) {
    return (
      <div
        role="status"
        className={`tap flex items-center gap-2 border-b border-amber-400/25 bg-amber-500/10 px-3 ${enter} ${className}`}
      >
        <CalendarX className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
        <span className="forge min-w-0 flex-1 truncate text-[0.68rem] font-semibold text-amber-100">
          {CLOSED_TEXT}
        </span>
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener"
          aria-label={`Message BAGGA FITNESS on WhatsApp about ${nextOpenLabel} and the week ahead`}
          className="tap grid w-11 shrink-0 place-items-center rounded-xl text-titan-300
            transition-transform duration-150 ease-power active:scale-90"
        >
          <MessageCircle className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
        </a>
        {dismissBtn}
      </div>
    )
  }

  /* ---- Full bar: website. Amber carries the "closed" signal, the rage hairline
     ties it to the site's alert language, and `stripes` is the existing
     rest-day hazard texture — a single tiled gradient, so it costs nothing.

     It brings its own `.shell` wrapper so a caller can pass spacing without the
     padding landing inside the card's border — and because this whole subtree
     unmounts when the notice is not showing, that spacing disappears with it.
     A wrapper in the caller would leave a gap behind after a dismissal. */
  return (
    <div className={`shell ${className}`}>
      <div
        role="status"
        className={`card plate-edge relative overflow-hidden !border-amber-400/30 ${enter}`}
      >
        <span aria-hidden="true" className="stripes pointer-events-none absolute inset-0 opacity-60" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/12 via-rage-500/8 to-transparent"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-amber-400/50" />

        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3.5 sm:px-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-400/30 bg-amber-500/12">
            <CalendarX className="h-5 w-5 text-amber-300" aria-hidden="true" />
          </span>

          {/* flex-[1_1_15rem], NOT flex-1 — and the difference is the whole
              reason this row works on a phone.

              `flex-1` is `flex: 1 1 0%`, and a zero basis is what a wrap
              decision is made from. So this block counted as 0px wide, the row
              never wrapped, and the text was squeezed into the ~24px left over
              between the icon and two shrink-0 buttons: a 375px phone rendered
              this notice 679px tall, one character per line.

              A real basis makes the row wrap the way it always looked like it
              would, while `1 1` keeps it free to grow on a wide card and to
              shrink below 15rem on a 320px one rather than overflow the
              card's `overflow-hidden` edge. */}
          <div className="min-w-0 flex-[1_1_15rem]">
            <p className="forge text-sm font-semibold text-amber-100 sm:text-base">{CLOSED_TEXT}</p>
            <p className="mt-1 text-xs leading-relaxed text-silver-400 sm:text-sm">{closedDay.detail}</p>
          </div>

          {/* The two controls travel as one shrink-0 unit so the dismiss X can
              never wrap onto a line of its own, stranded under the CTA.
              `ml-auto` only bites once they are on their own line — on a wide
              card the text above has already eaten the slack. */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a href={waLink(message)} target="_blank" rel="noopener" className="btn-titan !py-2.5">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp Us
            </a>

            {dismissBtn}
          </div>
        </div>
      </div>
    </div>
  )
}
