import React, { useEffect, useState } from 'react'
import { Menu, X, Dumbbell } from 'lucide-react'
import { brand, nav } from '../data/site.js'
import { useScrollSpy, useLockBodyScroll } from '../hooks/index.js'

const NAV_IDS = nav.map((n) => n.id)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(NAV_IDS, 88)
  useLockBodyScroll(open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'nav-blur shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)]' : 'bg-transparent'
      }`}
    >
      {/* electric underline that only shows once scrolled */}
      <div
        className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-volt-400/60 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-4">
        {/* Brand */}
        <a href="#home" onClick={(e) => go(e, 'home')} className="group flex items-center gap-2.5">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-ink-800 shadow-volt">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-volt-400/20 to-titan-500/20" />
            <Dumbbell className="relative h-5 w-5 text-volt-300" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="forge text-lg font-bold tracking-brand">
              <span className="brand-text">{brand.first}</span>{' '}
              <span className="text-silver-100 group-hover:text-white">{brand.second}</span>
            </span>
            <span className="mt-0.5 text-[0.58rem] uppercase tracking-forge text-silver-500">{brand.tagline}</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 xl:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => go(e, item.id)}
                className={`relative rounded-lg px-2.5 py-2 text-[0.8rem] font-medium transition-colors duration-200 ${
                  active === item.id ? 'text-volt-200' : 'text-silver-400 hover:text-silver-100'
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-volt-400 to-titan-400 transition-transform duration-300 ${
                    active === item.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 xl:flex">
          <a href="#contact" onClick={(e) => go(e, 'contact')} className="btn-volt !px-4 !py-2.5">
            Join Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-silver-300/12 bg-ink-800/70 text-silver-100 xl:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`xl:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 top-[var(--nav-h)] bg-ink-950/70 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`glass-strong absolute inset-x-0 top-full origin-top border-t border-silver-300/10 transition-all duration-300 ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >
          <ul className="shell grid max-h-[70vh] grid-cols-2 gap-1.5 overflow-y-auto py-4">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active === item.id
                      ? 'bg-volt-500/12 text-volt-200'
                      : 'text-silver-300 hover:bg-ink-700/60 hover:text-silver-100'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="col-span-2 mt-1">
              <a href="#contact" onClick={(e) => go(e, 'contact')} className="btn-volt w-full">
                Join BAGGA FITNESS
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
