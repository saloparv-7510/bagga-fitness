import React, { useEffect, useRef, useState } from 'react'
import { useInView } from '../../hooks/index.js'

/* Counts up to `end` once when scrolled into view. rAF-based, easeOutCubic.
   Respects prefers-reduced-motion by jumping straight to the value. */
export default function CountUp({ end, suffix = '', duration = 1400, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.5 })
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVal(end)
      return
    }

    let raf
    let startTs
    const step = (ts) => {
      if (startTs === undefined) startTs = ts
      const p = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(end * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}
