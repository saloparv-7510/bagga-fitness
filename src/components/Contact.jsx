import React, { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Youtube,
  Navigation,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react'
import { waLink } from '../data/site.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { WebCorner } from './art/Decor.jsx'
import { useSiteContent } from '../i18n/localize.js'
import { useT } from '../i18n/context.js'

function Faq({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-silver-100">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-volt-300 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-power ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-sm leading-relaxed text-silver-400">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Contact() {
  const t = useT()
  const { gym, timings, faqs } = useSiteContent()
  const [form, setForm] = useState({ name: '', phone: '', goal: 'Build Muscle', message: '' })
  const [sent, setSent] = useState(false)

  const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.mapQuery)}`
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(gym.mapQuery)}&z=14&output=embed`
  /* Generic "Contact Us" handoff — plan-specific messages live on the
     membership cards in About.jsx. */
  const generalEnquiry = t(
    'Hello BAGGA FITNESS, I would like to know more about your gym memberships and timings. Please provide more information.'
  )

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // No backend — hand off to WhatsApp with a prefilled enquiry.
    const lines = [
      t('Hello BAGGA FITNESS, I am {name} ({phone}).', {
        name: form.name || '—',
        phone: form.phone || t('no phone given'),
      }),
      t('Goal: {goal}.', { goal: t(form.goal) }),
      form.message,
    ].filter(Boolean)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener')
    setSent(true)
    setTimeout(() => setSent(false), 6000)
  }

  const contactRows = [
    { Icon: Phone, label: 'Call', value: gym.phone, href: gym.phoneHref, accent: 'text-volt-300' },
    {
      Icon: MessageCircle,
      label: 'WhatsApp',
      value: gym.phone,
      href: waLink(generalEnquiry),
      accent: 'text-titan-300',
    },
    {
      Icon: Instagram,
      label: 'Instagram',
      value: `@${gym.instagramHandle}`,
      href: gym.instagram,
      accent: 'text-rage-300',
    },
    // Rendered only while gym.email is set in src/data/site.js — spans the row
    // so the full address is readable instead of truncated.
    ...(gym.email
      ? [
          {
            Icon: Mail,
            label: 'Email',
            value: gym.email,
            href: `mailto:${gym.email}`,
            accent: 'text-silver-300',
            span: 'sm:col-span-3',
          },
        ]
      : []),
  ]

  return (
    <Section id="contact" plated strand>
      <SectionHeading
        eyebrow={t('Visit Our Gym')}
        title={t('Come Train At')}
        accentWord="BAGGA FITNESS"
        accent="volt"
        sub={t(
          "Call us, message us, or come and see the place for yourself. Your first session is the hardest — after that, it's momentum."
        )}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Left column — address, timings, contacts */}
        <div className="flex flex-col gap-5">
          {/* Address */}
          <Reveal className="card plate-edge p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink-800 text-volt-300 shadow-volt">
                <MapPin className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-silver-100">{gym.name}</h3>
                <address className="mt-1 not-italic leading-relaxed text-silver-400">
                  {gym.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={mapsSearch} target="_blank" rel="noopener" className="btn-ghost !py-2.5">
                    <Navigation className="h-4 w-4" /> {t('Get Directions')}
                  </a>
                  <a href={waLink(generalEnquiry)} target="_blank" rel="noopener" className="btn-titan !py-2.5">
                    <MessageCircle className="h-4 w-4" /> {t('Contact Us')}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Timings. We do not publish a timetable we cannot vouch for — see
              the TRUTH POLICY block at the top of src/data/site.js. Instead of
              inventing hours, this card sends the question straight to the gym. */}
          <Reveal delay={70} className="card plate-edge p-6">
            <div className="flex items-center gap-2 text-silver-100">
              <Clock className="h-5 w-5 text-titan-300" />
              <h3 className="text-lg font-semibold">{timings.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-silver-400">{timings.lead}</p>
            <ul className="mt-4 grid gap-2.5">
              {timings.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-silver-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-titan-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={waLink(timings.askMessage)}
                target="_blank"
                rel="noopener"
                className="btn-titan !py-2.5"
              >
                <MessageCircle className="h-4 w-4" /> {t("Ask Today's Timings")}
              </a>
              <a href={gym.phoneHref} className="btn-ghost !py-2.5">
                <Phone className="h-4 w-4" /> {gym.phone}
              </a>
            </div>
          </Reveal>

          {/* Contact methods + socials */}
          <Reveal delay={140} className="card plate-edge p-6">
            <div className="grid gap-2 sm:grid-cols-3">
              {contactRows.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener"
                  className={`flex flex-col gap-1 rounded-xl border border-silver-300/10 bg-ink-900/60 p-3 transition hover:border-silver-300/25 ${
                    r.span || ''
                  }`}
                >
                  <r.Icon className={`h-5 w-5 ${r.accent}`} />
                  <span className="text-[0.65rem] uppercase tracking-brand text-silver-500">{t(r.label)}</span>
                  <span className="truncate text-sm text-silver-200">{r.value}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-silver-300/10 pt-4">
              <span className="text-xs uppercase tracking-brand text-silver-500">{t('Follow')}</span>
              <a
                href={gym.instagram}
                target="_blank"
                rel="noopener"
                aria-label={t('BAGGA FITNESS on Instagram — @{handle}', { handle: gym.instagramHandle })}
                className="tap inline-flex items-center gap-2 rounded-lg bg-ink-800 px-3.5 text-sm text-silver-300 transition hover:text-rage-300"
              >
                <Instagram className="h-4 w-4" />
                <span>@{gym.instagramHandle}</span>
              </a>
              {/* Rendered only while gym.youtube is set in src/data/site.js */}
              {gym.youtube && (
                <a
                  href={gym.youtube}
                  target="_blank"
                  rel="noopener"
                  aria-label={t('BAGGA FITNESS on YouTube — @{handle}', { handle: gym.youtubeHandle })}
                  className="tap inline-flex items-center gap-2 rounded-lg bg-ink-800 px-3.5 text-sm text-silver-300 transition hover:text-rage-300"
                >
                  <Youtube className="h-4 w-4" />
                  <span>@{gym.youtubeHandle}</span>
                </a>
              )}
            </div>
            {(!gym.email || !gym.youtube) && (
              <p className="mt-3 text-[0.7rem] text-silver-500">
                {!gym.email && !gym.youtube
                  ? t('Email and YouTube are not set up yet — call or message us on WhatsApp instead.')
                  : !gym.email
                    ? t('No email address yet — call or message us on WhatsApp instead.')
                    : t('No YouTube channel yet — follow us on Instagram for updates.')}
              </p>
            )}
          </Reveal>
        </div>

        {/* Right column — form + map */}
        <div className="flex flex-col gap-5">
          <Reveal delay={70} className="card plate-edge relative overflow-hidden p-6">
            {/* Same web corner the Feedback form carries, so both WhatsApp
                handoffs on the site read as the same kind of card. */}
            <WebCorner
              accent="volt"
              className="pointer-events-none absolute right-0 top-0 h-24 w-24 -scale-x-100 opacity-[0.14]"
            />
            <div className="relative">
              <h3 className="text-lg font-semibold text-silver-100">{t('Send an Enquiry')}</h3>
              <p className="mt-1 text-sm text-silver-400">{t("We'll open WhatsApp with your details ready to send.")}</p>
              <form onSubmit={submit} className="mt-5 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="c-name">{t('Name')}</label>
                    <input id="c-name" required value={form.name} onChange={onChange('name')} className="field tap" placeholder={t('Your name')} autoComplete="name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="c-phone">{t('Phone')}</label>
                    <input id="c-phone" type="tel" inputMode="tel" value={form.phone} onChange={onChange('phone')} className="field tap" placeholder={t('Mobile number')} autoComplete="tel" />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="c-goal">{t('Primary Goal')}</label>
                  <select id="c-goal" value={form.goal} onChange={onChange('goal')} className="field tap">
                    <option value="Build Muscle">{t('Build Muscle')}</option>
                    <option value="Fat Loss">{t('Fat Loss')}</option>
                    <option value="General Fitness">{t('General Fitness')}</option>
                    <option value="Strength / Powerlifting">{t('Strength / Powerlifting')}</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="c-msg">{t('Message')}</label>
                  <textarea id="c-msg" rows={3} value={form.message} onChange={onChange('message')} className="field resize-y" placeholder={t("Tell us a little about where you're starting from.")} />
                </div>
                <button type="submit" className="btn-volt w-full">
                  {sent ? <><CheckCircle2 className="h-4 w-4" /> {t('Opening WhatsApp…')}</> : <><Send className="h-4 w-4" /> {t('Send via WhatsApp')}</>}
                </button>
              </form>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={140} className="card plate-edge overflow-hidden">
            <div className="flex items-center gap-2 border-b border-silver-300/10 p-4">
              <MapPin className="h-4 w-4 text-volt-300" />
              <span className="text-sm font-medium text-silver-300">{gym.addressOneLine}</span>
            </div>
            <div className="relative aspect-[16/11] w-full bg-ink-900">
              <iframe
                title={t('BAGGA FITNESS location map')}
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.2]"
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-14">
        <Reveal>
          <h3 className="forge text-center text-2xl font-bold text-silver-100 sm:text-3xl">
            {t('Common')} <span className="brand-text">{t('Questions')}</span>
          </h3>
        </Reveal>
        <div className="mx-auto mt-6 grid max-w-3xl gap-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <Faq {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
