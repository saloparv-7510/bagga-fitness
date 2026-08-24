import React from 'react'
import { useInView } from '../../hooks/index.js'
import { useIsApp } from '../../shell/context.js'

/* Scroll reveal wrapper — adds the .reveal utility and flips .is-in on view.
   `delay` staggers grid items (ms). Purely opacity+transform → compositor. */
function Animated({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* In the app, reveal-on-scroll is the wrong behaviour and the wrong cost.
   Wrong behaviour: screens stay mounted, so returning to a tab would replay
   every animation — native apps do not re-animate content you have already
   seen. Wrong cost: it would put ~100 IntersectionObservers on the page for
   content that is mostly already in view on a short screen.
   So the wrapper collapses to its own layout classes and nothing else. */
function Static({ as: Tag = 'div', delay: _delay, className = '', children, ...rest }) {
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  )
}

/* Split in two so neither branch calls a hook conditionally. */
export default function Reveal(props) {
  return useIsApp() ? <Static {...props} /> : <Animated {...props} />
}
