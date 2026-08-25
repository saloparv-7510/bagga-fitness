import React from 'react'
import { CircleDashed, MessageCircle, Users } from 'lucide-react'
import { trainers, rosterFact, trainersNote } from '../data/trainers.js'
import { waLink } from '../data/site.js'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import TrainerAvatar from './art/TrainerAvatar.jsx'

/* ---------------------------------------------------------------------------
   TRAINERS — the roster, rendered once for both shells: a band on the website
   and a screen inside the app's Gym tab. Section and Reveal absorb the whole
   difference, so there is nothing shell-aware in this file.

   WHAT THIS CARD DELIBERATELY DOES NOT SAY.
   Only the fields in src/data/trainers.js reach the screen. No certification,
   no years on the job, no competition placing, no client count — read that
   file's header for the reasoning: these are real employees at a real gym, and
   a badge a visitor can check and find false costs more trust than it ever
   buys. So a card is built from role, focus (`specializations`) and method
   (`bio`), which are true on day one and stay true.

   THE TWO UNNAMED SLOTS.
   Entries 4 and 5 are literally 'Female Trainer 1' and 'Female Trainer 2':
   the owner chose to publish the roster with those slots unnamed rather than
   invent names, so the names render verbatim. Verbatim and unexplained, though,
   they read as a draft nobody finished — so `placeholderName` earns one dashed
   chip saying the name is still to be confirmed. Dashed rather than red, and
   phrased as a fact rather than an apology, because nothing is broken: the slot
   is staffed and bookable today and only the name is outstanding, which is
   exactly and only what the chip claims.
   --------------------------------------------------------------------------- */

/* accent -> class. `silver` has a badge and a text step but there is no
   `btn-silver`, so that card's CTA takes the ghost button instead of borrowing
   another coach's colour and breaking the one-accent-per-card read. */
const accentBadge = {
  volt: 'badge-volt',
  titan: 'badge-titan',
  rage: 'badge-rage',
  silver: 'badge-silver',
}
const accentRole = {
  volt: 'text-volt-300',
  titan: 'text-titan-300',
  rage: 'text-rage-300',
  silver: 'text-silver-300',
}
const accentBtn = { volt: 'btn-volt', titan: 'btn-titan', rage: 'btn-rage', silver: 'btn-ghost' }

/* The prefill names the coach, which is the whole point — an enquiry that
   arrives already saying who it is about can be answered in one reply.
   The placeholder slots must not be addressed the same way: "I would like to
   train with Female Trainer 1" lands on the owner's phone reading as a person's
   name. Those two ask for the ROLE and cite the listing as a listing, so the
   card is still identifiable without inventing a human being. */
const askMessage = (t) =>
  t.placeholderName
    ? `Hello BAGGA FITNESS, I would like to train with your ${t.role} — the coach listed on your site as "${t.name}". Please tell me about availability and how to start.`
    : `Hello BAGGA FITNESS, I would like to train with ${t.name} (${t.role}). Please tell me about availability and how to start.`

/* Every card's button reads "Ask On WhatsApp", so the accessible name has to
   carry the difference — otherwise a screen-reader user tabbing the grid hears
   the same link five times. */
const askLabel = (t) =>
  t.placeholderName
    ? `Ask on WhatsApp about training with the ${t.role}`
    : `Ask on WhatsApp about training with ${t.name}`

export default function Trainers() {
  return (
    <Section id="trainers">
      <SectionHeading
        eyebrow="Our Trainers"
        title="Meet Your"
        accentWord="Coaches"
        accent="rage"
        sub="How each coach runs a session, and who it suits. The portraits are illustrations, not photographs."
      />

      {/* The confirmed composition, counted in trainers.js rather than typed.
          It sits ABOVE the grid because for a woman deciding whether to walk
          into a strength gym it is the deciding fact, not a footnote. */}
      <Reveal className="mb-8 flex justify-center">
        <span className="badge-silver text-center">
          <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {rosterFact}
        </span>
      </Reveal>

      {/* role="list" because preflight strips list-style, and Safari drops the
          list semantics with it — the same reason the calendar grid carries it. */}
      <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((t, i) => (
          <Reveal as="li" key={t.id} delay={(i % 3) * 70}>
            <article className="card plate-edge lift flex h-full flex-col p-6">
              <div className="flex items-start gap-4">
                {/* photo={t.photo} is the entire handover: drop a file in and set
                    that one key in the data, and the same frame renders the
                    photograph instead of the illustration. Nothing here needs to
                    know which of the two it got, so nothing here branches on it. */}
                <TrainerAvatar
                  name={t.name}
                  accent={t.accent}
                  gender={t.gender}
                  photo={t.photo}
                  size={null}
                  className="h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20"
                />
                {/* min-w-0 so a long name wraps instead of pushing the avatar
                    out of the card — flex children refuse to shrink otherwise. */}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-tight text-silver-100">{t.name}</h3>
                  <p
                    className={`mt-1 text-xs font-semibold uppercase tracking-brand ${
                      accentRole[t.accent] || accentRole.volt
                    }`}
                  >
                    {t.role}
                  </p>
                  {/* Sits directly under the name it qualifies, so the caveat is
                      read with the name rather than found later in the card. */}
                  {t.placeholderName && (
                    <span className="chip mt-2 border-dashed border-silver-300/25 !py-0.5 text-silver-400">
                      <CircleDashed className="h-3 w-3 shrink-0" aria-hidden="true" />
                      Name to be confirmed
                    </span>
                  )}
                </div>
              </div>

              <ul
                role="list"
                aria-label={`${t.name} — areas of focus`}
                className="mt-4 flex flex-wrap gap-1.5"
              >
                {t.specializations.map((s) => (
                  <li key={s} className={accentBadge[t.accent] || accentBadge.volt}>
                    {s}
                  </li>
                ))}
              </ul>

              {/* flex-1 on the bio, not a margin on the button: bios differ by a
                  line or two, and this keeps every CTA on the same baseline
                  across a row instead of stepping down with the text. */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-silver-400">{t.bio}</p>

              <a
                href={waLink(askMessage(t))}
                target="_blank"
                rel="noopener"
                className={`${accentBtn[t.accent] || accentBtn.volt} mt-5 w-full`}
                aria-label={askLabel(t)}
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> Ask On WhatsApp
              </a>
            </article>
          </Reveal>
        ))}
      </ul>

      {/* This page cannot actually assign you a coach, so the note points at the
          one channel that can. Verbatim from the data — the owner edits it
          there, not here. */}
      <Reveal delay={80} className="mx-auto mt-6 max-w-2xl text-center">
        <p className="text-xs leading-relaxed text-silver-500">{trainersNote}</p>
      </Reveal>
    </Section>
  )
}
