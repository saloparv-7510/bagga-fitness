import { useMemo } from 'react'
import { useLang } from './context.js'

/* English data — the single source of truth, never edited by the language
   feature. */
import * as siteEn from '../data/site.js'
import {
  exercises as exercisesEn,
  muscleGroups as muscleGroupsEn,
  MUSCLE_LABELS as muscleLabelsEn,
} from '../data/exercises.js'
import { trainers as trainersEn, rosterFact as rosterFactEn, trainersNote as trainersNoteEn } from '../data/trainers.js'
import { levels as levelsEn, week as weekEn } from '../data/workouts.js'
import {
  foodCategories as foodCategoriesEn,
  proteinFoods as proteinFoodsEn,
  supplements as supplementsEn,
  supplementNote as supplementNoteEn,
} from '../data/nutrition.js'
import { legends as legendsEn, legendsNote as legendsNoteEn } from '../data/legends.js'
import { effectiveness as effectivenessEn, bestPerBodyPart as bestPerBodyPartEn, rankOf as rankOfEn, isBestFor as isBestForEn } from '../data/effectiveness.js'
import { MUSCLE_NAMES as muscleNamesEn } from '../data/anatomy.js'

/* Hindi mirrors — translatable fields only, keyed by stable id/name/index. */
import hiSite from './hi/site.js'
import hiExercises from './hi/exercises.js'
import hiTrainers from './hi/trainers.js'
import hiWorkouts from './hi/workouts.js'
import hiNutrition from './hi/nutrition.js'
import hiLegends from './hi/legends.js'
import hiEffectiveness from './hi/effectiveness.js'
import hiAnatomy from './hi/anatomy.js'

/* ---------------------------------------------------------------- helpers --- */
/* One string, Hindi if a non-empty translation exists, otherwise English. */
const s = (en, hi) => (typeof hi === 'string' && hi.length ? hi : en)
/* An array of strings, localized element-by-element by index. */
const sArr = (en, hi) => (Array.isArray(en) ? en.map((v, i) => s(v, hi && hi[i])) : en)
/* Overlay only the listed string keys of an object; everything else untouched. */
const overlay = (en, hi, keys) => {
  if (!hi) return en
  const out = { ...en }
  for (const k of keys) if (k in hi) out[k] = s(en[k], hi[k])
  return out
}

/* =====================================================================
   site.js — nav, brand, gym, timings, facilities, membership, gallery, faqs
   ===================================================================== */
export function useSiteContent() {
  const lang = useLang()
  return useMemo(() => {
    const base = {
      brand: siteEn.brand,
      nav: siteEn.nav,
      gym: siteEn.gym,
      waLink: siteEn.waLink,
      closedDay: siteEn.closedDay,
      timings: siteEn.timings,
      coachSplit: siteEn.coachSplit,
      stats: siteEn.stats,
      facilities: siteEn.facilities,
      facilitiesNote: siteEn.facilitiesNote,
      membership: siteEn.membership,
      membershipNote: siteEn.membershipNote,
      gallery: siteEn.gallery,
      galleryNote: siteEn.galleryNote,
      faqs: siteEn.faqs,
    }
    if (lang !== 'hi') return base
    return {
      ...base,
      brand: { ...siteEn.brand, tagline: s(siteEn.brand.tagline, hiSite.tagline) },
      nav: siteEn.nav.map((n) => overlay(n, hiSite.nav?.[n.id], ['label', 'short'])),
      gym: {
        ...siteEn.gym,
        addressLines: sArr(siteEn.gym.addressLines, hiSite.gym?.addressLines),
        addressOneLine: s(siteEn.gym.addressOneLine, hiSite.gym?.addressOneLine),
        locality: s(siteEn.gym.locality, hiSite.gym?.locality),
      },
      closedDay: overlay(siteEn.closedDay, hiSite.closedDay, ['name', 'notice', 'detail', 'askMessage']),
      timings: {
        ...overlay(siteEn.timings, hiSite.timings, ['title', 'lead', 'askMessage']),
        points: sArr(siteEn.timings.points, hiSite.timings?.points),
      },
      stats: siteEn.stats.map((st, i) => ({
        ...st,
        suffix: s(st.suffix, hiSite.stats?.[i]?.suffix),
        label: s(st.label, hiSite.stats?.[i]?.label),
      })),
      facilities: siteEn.facilities.map((f, i) => overlay(f, hiSite.facilities?.[i], ['title', 'text'])),
      facilitiesNote: s(siteEn.facilitiesNote, hiSite.facilitiesNote),
      membership: siteEn.membership.map((m) => ({
        ...overlay(m, hiSite.membership?.[m.id], ['name', 'duration', 'monthly', 'save']),
        perks: sArr(m.perks, hiSite.membership?.[m.id]?.perks),
      })),
      membershipNote: s(siteEn.membershipNote, hiSite.membershipNote),
      gallery: siteEn.gallery.map((g, i) => overlay(g, hiSite.gallery?.[i], ['title', 'tag'])),
      galleryNote: s(siteEn.galleryNote, hiSite.galleryNote),
      faqs: siteEn.faqs.map((f, i) => overlay(f, hiSite.faqs?.[i], ['q', 'a'])),
    }
  }, [lang])
}

/* Convenience: the nav array on its own (Navbar, Footer, AppShell chrome). */
export function useNav() {
  return useSiteContent().nav
}

/* =====================================================================
   exercises.js — cards, muscle labels, and the derived muscle summary
   ===================================================================== */
export function useExercises() {
  const lang = useLang()
  return useMemo(() => {
    if (lang !== 'hi') {
      const muscleLabel = (id) => muscleLabelsEn[id] || id
      return {
        exercises: exercisesEn,
        muscleGroups: muscleGroupsEn,
        MUSCLE_LABELS: muscleLabelsEn,
        muscleLabel,
        muscleSummary: (ex) => summarize(ex, muscleLabelsEn),
      }
    }
    const labels = { ...muscleLabelsEn }
    for (const id of Object.keys(labels)) labels[id] = s(labels[id], hiExercises.labels?.[id])
    const muscleGroups = muscleGroupsEn.map((g) => ({ ...g, label: s(g.label, hiExercises.muscleGroups?.[g.id]) }))
    const exercises = exercisesEn.map((ex) => {
      const h = hiExercises.exercises?.[ex.id]
      if (!h) return ex
      return {
        ...overlay(ex, h, ['name', 'body', 'equipment', 'tip', 'breathing', 'startCue', 'endCue']),
        steps: sArr(ex.steps, h.steps),
        mistakes: sArr(ex.mistakes, h.mistakes),
        safety: sArr(ex.safety, h.safety),
      }
    })
    const muscleLabel = (id) => labels[id] || id
    return {
      exercises,
      muscleGroups,
      MUSCLE_LABELS: labels,
      muscleLabel,
      muscleSummary: (ex) => summarize(ex, labels),
    }
  }, [lang])
}

/* Mirror of exercises.js muscleSummary, but against a supplied label map so it
   can produce Hindi labels without duplicating the tolerance logic. */
function summarize(ex, labels) {
  const muscles = (ex && ex.muscles) || {}
  const toLabels = (ids) => (Array.isArray(ids) ? ids : []).map((id) => labels[id]).filter(Boolean)
  return { primary: toLabels(muscles.primary), secondary: toLabels(muscles.secondary) }
}

/* =====================================================================
   trainers.js — roster, derived roster fact, note
   ===================================================================== */
export function useTrainers() {
  const lang = useLang()
  return useMemo(() => {
    if (lang !== 'hi') {
      return { trainers: trainersEn, rosterFact: rosterFactEn, trainersNote: trainersNoteEn }
    }
    const trainers = trainersEn.map((tr) => {
      const h = hiTrainers.trainers?.[tr.id]
      if (!h) return tr
      return {
        ...overlay(tr, h, ['name', 'role', 'bio']),
        specializations: sArr(tr.specializations, h.specializations),
      }
    })
    // Rebuilt from the live counts (never typed twice), exactly like the source.
    const total = trainersEn.length
    const male = trainersEn.filter((t) => t.gender === 'male').length
    const female = trainersEn.filter((t) => t.gender === 'female').length
    const rosterFact = `फ़्लोर पर ${total} कोच — ${male} पुरुष और ${female} महिला।`
    return { trainers, rosterFact, trainersNote: s(trainersNoteEn, hiTrainers.trainersNote) }
  }, [lang])
}

/* =====================================================================
   workouts.js — levels + the 7-day split
   ===================================================================== */
export function useWorkouts() {
  const lang = useLang()
  return useMemo(() => {
    if (lang !== 'hi') return { levels: levelsEn, week: weekEn }
    const levels = levelsEn.map((lv) => overlay(lv, hiWorkouts.levels?.[lv.id], ['label', 'blurb', 'cardio']))
    const week = weekEn.map((d, i) => {
      const h = hiWorkouts.week?.[i]
      return {
        ...overlay(d, h, ['day', 'focus']),
        beginner: sArr(d.beginner, h?.beginner),
        intermediate: sArr(d.intermediate, h?.intermediate),
        experienced: sArr(d.experienced, h?.experienced),
      }
    })
    return { levels, week }
  }, [lang])
}

/* =====================================================================
   nutrition.js — protein foods + supplements
   ===================================================================== */
export function useNutrition() {
  const lang = useLang()
  return useMemo(() => {
    if (lang !== 'hi') {
      return {
        foodCategories: foodCategoriesEn,
        proteinFoods: proteinFoodsEn,
        supplements: supplementsEn,
        supplementNote: supplementNoteEn,
      }
    }
    const foodCategories = foodCategoriesEn.map((c) => ({ ...c, label: s(c.label, hiNutrition.foodCategories?.[c.id]) }))
    const proteinFoods = proteinFoodsEn.map((f) => overlay(f, hiNutrition.foods?.[f.name], ['name', 'serving']))
    const supplements = supplementsEn.map((sup) => overlay(sup, hiNutrition.supplements?.[sup.name], ['name', 'tag', 'what', 'who', 'how']))
    return { foodCategories, proteinFoods, supplements, supplementNote: s(supplementNoteEn, hiNutrition.supplementNote) }
  }, [lang])
}

/* =====================================================================
   legends.js — the two protocol templates
   ===================================================================== */
export function useLegends() {
  const lang = useLang()
  return useMemo(() => {
    if (lang !== 'hi') return { legends: legendsEn, legendsNote: legendsNoteEn }
    const legends = legendsEn.map((lg) => {
      const h = hiLegends.legends?.[lg.id]
      if (!h) return lg
      const merged = {
        ...overlay(lg, h, [
          'name', 'kicker', 'influenceLine', 'quote', 'quoteNote', 'summary',
          'reality', 'safety', 'disclaimer', 'cta', 'personaName', 'personaLine',
        ]),
        principles: Array.isArray(lg.principles)
          ? lg.principles.map((p, i) => overlay(p, h.principles?.[i], ['title', 'text']))
          : lg.principles,
      }
      if (lg.day) {
        merged.day = {
          ...lg.day,
          label: s(lg.day.label, h.day?.label),
          rows: Array.isArray(lg.day.rows)
            ? lg.day.rows.map((r, i) => overlay(r, h.day?.rows?.[i], ['move', 'note']))
            : lg.day.rows,
        }
      }
      return merged
    })
    return { legends, legendsNote: s(legendsNoteEn, hiLegends.legendsNote) }
  }, [lang])
}

/* =====================================================================
   effectiveness.js — "best exercise per body part" rankings.
   Re-derives the display objects with localized body-part labels, exercise
   names, role tags, why-lines and notes. Ids/ranks/structure are unchanged.
   ===================================================================== */
export function useEffectiveness() {
  const lang = useLang()
  const { exercises, muscleGroups } = useExercises()
  return useMemo(() => {
    if (lang !== 'hi') {
      return {
        effectiveness: effectivenessEn,
        bestPerBodyPart: bestPerBodyPartEn,
        rankOf: rankOfEn,
        isBestFor: isBestForEn,
      }
    }
    const nameById = new Map(exercises.map((ex) => [ex.id, ex.name]))
    const labelByGroup = new Map(muscleGroups.map((g) => [g.id, g.label]))
    const role = (r) => s(r, hiEffectiveness.roles?.[r])

    const effectiveness = {}
    for (const [group, entry] of Object.entries(effectivenessEn)) {
      const g = hiEffectiveness.groups?.[group]
      effectiveness[group] = {
        ...entry,
        bodyPart: labelByGroup.get(group) || entry.bodyPart,
        why: s(entry.why, g?.why),
        ranked: entry.ranked.map((e) => ({ ...e, role: role(e.role), note: s(e.note, g?.items?.[e.id]) })),
      }
    }
    const bestPerBodyPart = bestPerBodyPartEn.map((b) => ({
      ...b,
      bodyPart: labelByGroup.get(b.group) || b.bodyPart,
      name: nameById.get(b.id) || b.name,
      role: role(b.role),
      why: s(b.why, hiEffectiveness.groups?.[b.group]?.why),
    }))
    // Localized lookups mirroring the source helpers, over the localized data.
    const rankOf = (exerciseId) => {
      for (const entry of Object.values(effectiveness)) {
        const hit = entry.ranked.find((e) => e.id === exerciseId)
        if (hit) return { bodyPart: entry.bodyPart, rank: hit.rank, best: entry.best }
      }
      return null
    }
    const isBestFor = (exerciseId) => {
      const top = bestPerBodyPart.find((b) => b.id === exerciseId)
      return top ? top.bodyPart : null
    }
    return { effectiveness, bestPerBodyPart, rankOf, isBestFor }
  }, [lang, exercises, muscleGroups])
}

/* =====================================================================
   anatomy.js — legend labels for the muscle map / infographics
   ===================================================================== */
export function useAnatomy() {
  const lang = useLang()
  return useMemo(() => {
    if (lang !== 'hi') {
      const muscleLabel = (id) => {
        const m = muscleNamesEn[id]
        if (!m) return id
        return m.anatomical === m.plain ? m.anatomical : `${m.anatomical} (${m.plain})`
      }
      return { MUSCLE_NAMES: muscleNamesEn, muscleLabel }
    }
    const muscleLabel = (id) => {
      const m = muscleNamesEn[id]
      if (!m) return id
      const plain = s(m.plain, hiAnatomy.plain?.[id])
      return m.anatomical === m.plain ? m.anatomical : `${m.anatomical} (${plain})`
    }
    return { MUSCLE_NAMES: muscleNamesEn, muscleLabel }
  }, [lang])
}
