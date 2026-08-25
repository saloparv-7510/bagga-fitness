import React from 'react'
import { TABS } from './tabs.js'
import { tapFeedback } from '../native/index.js'

/* Fixed bottom tab bar.

   Deliberately opaque rather than frosted: backdrop-filter on a fixed element
   forces the WebView to re-sample and re-blur the page behind it on every
   scroll frame, which is the single most expensive thing you can put at the
   bottom of a scrolling view. `contain` + translateZ keep it on its own
   compositor layer so scrolling never repaints it at all.

   It hides itself while the keyboard is open (data-kb, set by the native
   keyboard listener) so it cannot sit on top of the field being typed into. */
export default function TabBar({ tab, onSelect }) {
  return (
    <nav className="app-tabbar" aria-label="Main">
      <ul className="flex items-stretch">
        {TABS.map(({ key, label, Icon }) => {
          const active = key === tab
          return (
            <li key={key} className="flex-1">
              <button
                type="button"
                onClick={() => {
                  tapFeedback()
                  onSelect(key)
                }}
                aria-current={active ? 'page' : undefined}
                className={`app-tab ${active ? 'is-active' : ''}`}
              >
                <Icon className="h-[1.35rem] w-[1.35rem]" strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                <span className="app-tab-label">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
