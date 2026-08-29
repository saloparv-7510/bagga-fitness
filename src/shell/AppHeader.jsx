import React from 'react'
import { Dumbbell, Phone, MessageCircle } from 'lucide-react'
import { gym, waLink } from '../data/site.js'
import SegmentedNav from './SegmentedNav.jsx'
import ClosedNotice from '../components/ui/ClosedNotice.jsx'
import { useSiteContent } from '../i18n/localize.js'
import { useT } from '../i18n/context.js'
import LanguageToggle from '../i18n/LanguageToggle.jsx'

/* Fixed top bar: the wordmark stays visible on every screen (branding), with
   the two actions a gym visitor actually wants one tap away.

   The bar's height varies — tabs with one screen have no segmented rail — so it
   publishes its own measured height as --app-header-h instead of the layout
   guessing. A ResizeObserver only fires on an actual size change, so this costs
   nothing while scrolling. */
export default function AppHeader({ screens, sub, onSelectSub }) {
  const ref = React.useRef(null)
  const t = useT()
  const { brand } = useSiteContent()
  const headerEnquiry = t(
    'Hello BAGGA FITNESS, I would like to know more about your gym memberships and timings. Please provide more information.'
  )

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const publish = () => {
      document.documentElement.style.setProperty('--app-header-h', `${el.offsetHeight}px`)
    }
    publish()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <header ref={ref} className="app-header">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-800 shadow-volt">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-volt-400/20 to-titan-500/20" />
            <Dumbbell className="relative h-[1.15rem] w-[1.15rem] text-volt-300" strokeWidth={2.4} />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="forge truncate text-[1.05rem] font-bold tracking-brand">
              <span className="brand-text">{brand.first}</span>{' '}
              <span className="text-silver-100">{brand.second}</span>
            </span>
            <span className="mt-0.5 truncate text-[0.55rem] uppercase tracking-forge text-silver-500">
              {brand.tagline}
            </span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageToggle compact />
          <a href={gym.phoneHref} aria-label={t('Call BAGGA FITNESS on {phone}', { phone: gym.phone })} className="app-icon-btn">
            <Phone className="h-[1.15rem] w-[1.15rem] text-volt-300" />
          </a>
          <a
            href={waLink(headerEnquiry)}
            aria-label={t('Message BAGGA FITNESS on WhatsApp')}
            className="app-icon-btn"
          >
            <MessageCircle className="h-[1.15rem] w-[1.15rem] text-titan-300" />
          </a>
        </div>
      </div>

      {/* Sunday-only. Safe to put inside the fixed header because the header
          already measures itself — the ResizeObserver above fires when the
          notice appears or is dismissed, so --app-header-h and the main
          padding follow it without any hardcoded number. */}
      <ClosedNotice compact />

      {screens.length > 1 && <SegmentedNav screens={screens} sub={sub} onSelect={onSelectSub} />}
    </header>
  )
}
