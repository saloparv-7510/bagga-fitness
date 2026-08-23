import React, { useEffect, useState } from 'react'
import { Dumbbell, ArrowUp, MapPin, Heart, Phone, MessageCircle, Instagram, Mail, Youtube } from 'lucide-react'
import { brand, nav, gym, waLink } from '../data/site.js'

const go = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const footerEnquiry = `Hello BAGGA FITNESS, I would like to know more about your gym memberships and timings. Please provide more information.`

export default function Footer() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const year = new Date().getFullYear()
  const cols = [nav.slice(1, 6), nav.slice(6)]

  return (
    <footer className="relative mt-8 border-t border-silver-300/10 bg-ink-950/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-volt-400/50 to-transparent" />
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="#home" onClick={go('home')} className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-800 shadow-volt">
              <Dumbbell className="h-5 w-5 text-volt-300" strokeWidth={2.4} />
            </span>
            <span className="forge text-xl font-bold tracking-brand">
              <span className="brand-text">{brand.first}</span> <span className="text-silver-100">{brand.second}</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver-500">
            Strength-first coaching, an honest iron floor and plans that scale with you. Forge your best body.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-silver-400">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-volt-300" />
            {gym.addressOneLine}
          </p>
          <a
            href={gym.phoneHref}
            className="mt-2.5 inline-flex items-center gap-2 text-sm text-silver-400 transition-colors hover:text-volt-200"
          >
            <Phone className="h-4 w-4 shrink-0 text-volt-300" />
            {gym.phone}
          </a>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={waLink(footerEnquiry)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg border border-silver-300/12 bg-ink-800/70 px-3 py-2 text-xs font-medium text-silver-300 transition-colors hover:border-titan-400/40 hover:text-titan-200"
            >
              <MessageCircle className="h-4 w-4 text-titan-300" /> WhatsApp
            </a>
            <a
              href={gym.instagram}
              target="_blank"
              rel="noopener"
              aria-label={`BAGGA FITNESS on Instagram — @${gym.instagramHandle}`}
              className="inline-flex items-center gap-2 rounded-lg border border-silver-300/12 bg-ink-800/70 px-3 py-2 text-xs font-medium text-silver-300 transition-colors hover:border-rage-500/40 hover:text-rage-300"
            >
              <Instagram className="h-4 w-4" /> @{gym.instagramHandle}
            </a>
            {/* Rendered only while gym.email is set in src/data/site.js */}
            {gym.email && (
              <a
                href={`mailto:${gym.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-silver-300/12 bg-ink-800/70 px-3 py-2 text-xs font-medium text-silver-300 transition-colors hover:border-volt-400/40 hover:text-volt-200"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
            {/* Rendered only while gym.youtube is set in src/data/site.js */}
            {gym.youtube && (
              <a
                href={gym.youtube}
                target="_blank"
                rel="noopener"
                aria-label={`BAGGA FITNESS on YouTube — @${gym.youtubeHandle}`}
                className="inline-flex items-center gap-2 rounded-lg border border-silver-300/12 bg-ink-800/70 px-3 py-2 text-xs font-medium text-silver-300 transition-colors hover:border-rage-500/40 hover:text-rage-300"
              >
                <Youtube className="h-4 w-4" /> YouTube
              </a>
            )}
          </div>
        </div>

        {cols.map((col, i) => (
          <div key={i}>
            <h4 className="text-xs font-semibold uppercase tracking-forge text-silver-500">
              {i === 0 ? 'Explore' : 'Tools & More'}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    className="text-sm text-silver-400 transition-colors hover:text-volt-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-silver-300/8">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-silver-500 sm:flex-row sm:text-left">
          <p>© {year} {brand.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-rage-400" /> for people who train hard.
          </p>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-volt-500 text-ink-950 shadow-volt transition-all duration-300 ${
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </footer>
  )
}
