import { createContext, useContext } from 'react'

/* Which shell is rendering the shared section components: the long-scroll
   website, or the tabbed mobile app. Shared UI (Section, SectionHeading,
   Reveal) reads this to drop web-only chrome and tighten its spacing, so the
   13 sections themselves stay a single source of truth for both targets. */
export const ShellContext = createContext('web')
export const useShell = () => useContext(ShellContext)
export const useIsApp = () => useContext(ShellContext) === 'app'

/* App-only navigation. `goTab` is what Home's quick actions and the "see the
   full plan" links call, so nothing in the app needs to know about #anchors. */
export const NavContext = createContext({
  tab: 'home',
  sub: 0,
  goTab: () => {},
  goSub: () => {},
})
export const useNav = () => useContext(NavContext)
