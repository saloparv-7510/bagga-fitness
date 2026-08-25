import { useEffect, useRef, useState } from 'react'

/* Scroll spy for the navbar active link.
   Picks the section whose top is closest to just under the sticky nav.

   The measurement itself is 13 getBoundingClientRect() calls, each of which
   forces a style + layout flush. A scroll event can fire several times per
   frame, so it is coalesced into one rAF callback: at most one measurement per
   painted frame, and none at all while a frame is already pending. */
export function useScrollSpy(ids, offset = 90) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    if (!ids.length) return
    let frame = 0

    const measure = () => {
      frame = 0
      const line = offset + 8
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top - line <= 0) current = id
      }
      // near the very bottom, force the last section (short final sections
      // can never reach the trigger line on their own).
      // documentElement, not body: body can be shorter than the scrollable
      // document once margins collapse, which fires this clamp too early.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1]
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    const handler = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [ids, offset])

  return active
}

/* Lock body scroll while the mobile menu / lightbox is open.
   Pads the body by the width of the scrollbar it removes, otherwise every
   desktop overlay shifts the whole page ~15px to the right as it opens. */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return
    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    // Overlay scrollbars (most phones, macOS by default) report 0 — no padding.
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) {
      const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${current + gap}px`
    }
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [locked])
}

/* Accessible overlay plumbing: move focus in, keep Tab inside, put focus back
   where it was on close. Returns the ref to spread on the dialog container. */
export function useFocusTrap(active) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return
    const container = ref.current
    if (!container) return

    const previous = document.activeElement
    const focusables = () =>
      Array.from(
        container.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement)

    // Focus the first control, or the container itself as a fallback.
    const first = focusables()[0]
    if (first) first.focus()
    else {
      container.setAttribute('tabindex', '-1')
      container.focus()
    }

    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) {
        e.preventDefault()
        return
      }
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      // Focus escaping the dialog (or sitting on the container) wraps back in.
      if (!container.contains(document.activeElement)) {
        e.preventDefault()
        firstEl.focus()
        return
      }
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      /* Restore focus only if it would otherwise be lost. Two cases reach
         here: the dialog is still mounted and holds focus, or React already
         removed it and focus fell back to <body>. Anything else means focus
         moved somewhere deliberate, so leave it alone. */
      const activeEl = document.activeElement
      const focusWouldBeLost = !activeEl || activeEl === document.body || container.contains(activeEl)
      if (previous instanceof HTMLElement && focusWouldBeLost) previous.focus()
    }
  }, [active])

  return ref
}

/* Close-on-Escape for overlays (mobile drawer, modal, lightbox).
   Pass extra keys via `keys` — the lightbox uses it for arrow navigation. */
export function useKeyDown(active, handlers) {
  const ref = useRef(handlers)
  ref.current = handlers
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      const fn = ref.current[e.key]
      if (!fn) return
      e.preventDefault()
      fn(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
}

/* True on real touch / coarse-pointer devices. Used to skip pointer-only FX. */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const on = () => setCoarse(mq.matches)
    on()
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return coarse
}

/* Ref + boolean that flips true once when the element scrolls into view.
   Backs the .reveal utility without a library. */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px', ...options }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView]
}

/* ---------------------------------------------------------------------------
   useClosedDay lives in its own module because it is the only hook here with a
   wall-clock dependency — it has to survive a phone left open past midnight and
   a Capacitor app resumed from background on a different day. Re-exported so
   every consumer still imports hooks from one place.
   --------------------------------------------------------------------------- */
export { default as useClosedDay } from './useClosedDay.js'
