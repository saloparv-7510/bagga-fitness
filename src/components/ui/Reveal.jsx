import React from 'react'
import { useInView } from '../../hooks/index.js'

/* Scroll reveal wrapper — adds the .reveal utility and flips .is-in on view.
   `delay` staggers grid items (ms). Purely opacity+transform → compositor. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
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
