import React, { useMemo, useRef, useState } from 'react'
import {
  ThumbsUp,
  AlertTriangle,
  ClipboardList,
  Lightbulb,
  Send,
  Copy,
  Check,
  Info,
  AlertCircle,
  Star,
  MessageCircle,
} from 'lucide-react'
import { gym, waLink } from '../data/site.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { WebNet, WebCorner } from './art/Decor.jsx'
import { useT } from '../i18n/context.js'

/* What the member is writing in about. `tag` is what leads the WhatsApp
   message, so the owner can triage the chat at a glance. */
const KINDS = [
  { id: 'feedback', label: 'Feedback', tag: 'FEEDBACK', Icon: ThumbsUp, accent: 'titan', hint: 'Something we are doing right, or an honest opinion.' },
  { id: 'complaint', label: 'Complaint', tag: 'COMPLAINT', Icon: AlertTriangle, accent: 'rage', hint: 'Something is wrong and needs fixing.' },
  { id: 'requirement', label: 'Requirement', tag: 'REQUIREMENT', Icon: ClipboardList, accent: 'volt', hint: 'You need equipment, a timing or a service we do not have.' },
  { id: 'suggestion', label: 'Suggestion', tag: 'SUGGESTION', Icon: Lightbulb, accent: 'volt', hint: 'An idea that would make the gym better.' },
]

const AREAS = [
  'Equipment',
  'Cleanliness & hygiene',
  'Coaching & guidance',
  'Timings & crowd',
  'Membership & billing',
  'Music & atmosphere',
  'Changing rooms',
  'Something else',
]

const KIND_ON = {
  titan: 'border-titan-400/55 bg-titan-500/12 text-titan-200',
  rage: 'border-rage-500/55 bg-rage-500/12 text-rage-200',
  volt: 'border-volt-400/55 bg-volt-500/12 text-volt-200',
}

const MAX = 900

export default function Feedback() {
  const t = useT()
  const [kindId, setKindId] = useState('feedback')
  const [area, setArea] = useState(AREAS[0])
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [opened, setOpened] = useState(false)
  const msgRef = useRef(null)

  const kind = KINDS.find((k) => k.id === kindId) || KINDS[0]
  const valid = message.trim().length > 0
  /* Derived, not stored: "write your message first" must be impossible to see
     once a message exists. Clearing it from the change handler instead would
     depend on the closed-over `showError`, which is one render behind. */
  const emptyError = showError && !valid

  /* The exact text that will land in the owner's chat. Shown to the member
     before they send it — nothing is added behind their back. */
  const built = useMemo(() => {
    const lines = [
      `${kind.tag} — BAGGA FITNESS`,
      t('About: {area}', { area: t(area) }),
      rating > 0
        ? t('Rating: {stars} ({rating}/5)', {
            stars: '★'.repeat(rating) + '☆'.repeat(5 - rating),
            rating,
          })
        : null,
      '',
      message.trim() || '…',
      '',
      t('From: {name}', { name: name.trim() || t('name not given') }),
      phone.trim() ? t('Contact: {phone}', { phone: phone.trim() }) : null,
    ].filter((l) => l !== null)
    return lines.join('\n')
  }, [t, kind.tag, area, rating, message, name, phone])

  const href = waLink(built)

  /* A real link, not window.open: a user-activated anchor is never popup
     blocked, and `window.open(url, '_blank', 'noopener')` returns null even on
     success — so it cannot be used to detect a block anyway. When the message
     is empty we cancel the navigation and point at the field instead of
     silently sending an empty complaint. */
  const onSend = (e) => {
    if (!valid) {
      e.preventDefault()
      setShowError(true)
      msgRef.current?.focus()
      return
    }
    setShowError(false)
    setOpened(true)
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(built)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* Clipboard is blocked on insecure origins and in some in-app browsers.
         The message is already on screen and selectable, so there is nothing
         to recover from — just do not claim it was copied. */
      setCopied(false)
    }
  }

  const reset = () => {
    setMessage('')
    setRating(0)
    setShowError(false)
    setOpened(false)
  }

  return (
    <Section id="feedback" plated>
      <WebNet
        accent="volt"
        opacity={0.13}
        className="pointer-events-none absolute -top-4 right-0 hidden h-[22rem] w-[22rem] -scale-x-100 sm:block"
      />

      <SectionHeading
        eyebrow={t('Your Voice')}
        title={t('Feedback, Complaints &')}
        accentWord={t('Requirements')}
        accent="spider"
        sub={t(
          "Tell us what is working, what is not, and what you need on the floor. This goes straight to the gym owner's WhatsApp — no ticket queue, no inbox nobody reads."
        )}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* ---------------- The form ---------------- */}
        <Reveal className="card plate-edge relative overflow-hidden p-6 sm:p-7">
          <WebCorner
            accent="rage"
            className="pointer-events-none absolute right-0 top-0 h-24 w-24 -scale-x-100 opacity-[0.14]"
          />

          <div className="relative grid gap-6">
            {/* Kind */}
            <fieldset>
              <legend className="label">{t('What is this about?')}</legend>
              <div className="grid gap-2 xs:grid-cols-2">
                {KINDS.map((k) => {
                  const on = k.id === kindId
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setKindId(k.id)}
                      aria-pressed={on}
                      className={`tap flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition duration-200 ease-power ${
                        on
                          ? KIND_ON[k.accent]
                          : 'border-silver-300/12 bg-ink-900/70 text-silver-300 hover:border-silver-300/25 hover:text-silver-100'
                      }`}
                    >
                      <k.Icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-semibold">{t(k.label)}</span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-xs text-silver-500">{t(kind.hint)}</p>
            </fieldset>

            {/* Area */}
            <div>
              <label className="label" htmlFor="fb-area">
                {t('Which part of the gym?')}
              </label>
              <select
                id="fb-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="field tap"
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {t(a)}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating — optional, and clearable by re-tapping the same star. */}
            <fieldset>
              <legend className="label">
                {t('Rate us')} <span className="font-normal normal-case tracking-normal text-silver-500">({t('optional')})</span>
              </legend>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating((r) => (r === n ? 0 : n))}
                    aria-pressed={rating >= n}
                    aria-label={t('{n} out of 5', { n })}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-silver-300/10 bg-ink-900/60 transition duration-200 hover:border-silver-300/25"
                  >
                    <Star
                      className={`h-5 w-5 transition-colors duration-200 ${
                        rating >= n ? 'fill-volt-400 text-volt-400' : 'text-silver-500'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-1 text-sm font-semibold text-volt-200">{rating}/5</span>
                )}
              </div>
            </fieldset>

            {/* Message */}
            <div>
              <div className="flex items-end justify-between gap-3">
                <label className="label mb-0" htmlFor="fb-msg">
                  {t('Your message')}
                </label>
                <span className="text-xs tabular-nums text-silver-500">
                  {message.length}/{MAX}
                </span>
              </div>
              <textarea
                id="fb-msg"
                ref={msgRef}
                rows={5}
                maxLength={MAX}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-invalid={emptyError || undefined}
                aria-describedby={emptyError ? 'fb-msg-error' : undefined}
                className={`field mt-2 resize-y ${emptyError ? '!border-rage-500/70' : ''}`}
                placeholder={
                  kindId === 'complaint'
                    ? t('What happened, when, and which machine or area was involved?')
                    : t('Be as specific as you like — details make it fixable.')
                }
              />
              {emptyError && (
                <p id="fb-msg-error" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rage-300">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {t('Write your message first — we do not want to send an empty one.')}
                </p>
              )}
            </div>

            {/* Who */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="fb-name">
                  {t('Name')} <span className="font-normal normal-case tracking-normal text-silver-500">({t('optional')})</span>
                </label>
                <input
                  id="fb-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field tap"
                  placeholder={t('Your name')}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="label" htmlFor="fb-phone">
                  {t('Contact')} <span className="font-normal normal-case tracking-normal text-silver-500">({t('optional')})</span>
                </label>
                <input
                  id="fb-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field tap"
                  placeholder={t('Mobile number')}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Send */}
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <a
                href={href}
                target="_blank"
                rel="noopener"
                onClick={onSend}
                aria-disabled={!valid || undefined}
                className={`btn-spider w-full ${valid ? '' : 'opacity-62'}`}
              >
                <Send className="h-4 w-4" />
                {t('Send To The Owner')}
              </a>
              <button type="button" onClick={onCopy} className="btn-ghost w-full sm:w-auto">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-titan-300" /> {t('Copied')}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> {t('Copy Text')}
                  </>
                )}
              </button>
            </div>

            {opened && (
              <p className="flex items-start gap-2 rounded-xl border border-titan-400/25 bg-titan-500/8 p-3 text-xs leading-relaxed text-titan-200">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  {t(
                    'WhatsApp should have opened in a new tab with your message ready to send — press send there to deliver it.'
                  )}{' '}
                  <button
                    type="button"
                    onClick={reset}
                    className="font-semibold underline decoration-titan-400/50 underline-offset-2"
                  >
                    {t('Write another')}
                  </button>
                </span>
              </p>
            )}
          </div>
        </Reveal>

        {/* ---------------- Preview + the honest small print ---------------- */}
        <div className="flex flex-col gap-5">
          <Reveal delay={70} className="card plate-edge p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="forge text-sm font-bold uppercase tracking-brand text-silver-200">
                {t('Exactly what gets sent')}
              </h3>
              {/* Names the receiving number, so "straight to the owner" is
                  something the member can check rather than take on trust. */}
              <span className="badge-spider !py-0.5">
                <MessageCircle className="h-3 w-3" />
                {gym.phone}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-silver-500">
              {t(
                'Nothing is added to this and nothing is stored on the way — the site simply opens WhatsApp with the text below.'
              )}
            </p>
            <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-silver-300/10 bg-ink-950/70 p-4">
              <p className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-silver-300">
                {built}
              </p>
            </div>
          </Reveal>

          <Reveal delay={140} className="card plate-edge p-6">
            <ul className="grid gap-3">
              {/* This is the one thing a feedback form must not fudge. */}
              <li className="flex items-start gap-2 text-xs leading-relaxed text-silver-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-volt-300" />
                <span>
                  <span className="font-semibold text-silver-200">{t('This is not anonymous.')}</span>{' '}
                  {t(
                    'It is sent from your own WhatsApp account, so the gym sees your number and profile name. If you would rather not be identified, call {phone} instead and say so.',
                    { phone: gym.phone }
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs leading-relaxed text-silver-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-titan-300" />
                <span>
                  {t(
                    'There is no server behind this form and no database — the message exists only in your WhatsApp chat.'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2 text-xs leading-relaxed text-silver-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rage-300" />
                <span>
                  {t('No WhatsApp on this device? Use')}{' '}
                  <span className="font-semibold text-silver-200">{t('Copy Text')}</span>{' '}
                  {t('and paste it into an email to')}{' '}
                  {gym.email ? (
                    <a
                      href={`mailto:${gym.email}?subject=${encodeURIComponent('BAGGA FITNESS — member feedback')}`}
                      className="font-semibold text-volt-200 underline decoration-volt-400/40 underline-offset-2"
                    >
                      {gym.email}
                    </a>
                  ) : (
                    t('us')
                  )}
                  .
                </span>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
