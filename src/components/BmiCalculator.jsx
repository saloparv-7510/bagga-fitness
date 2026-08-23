import React, { useMemo, useState } from 'react'
import { Ruler, Scale, Activity, Info, TriangleAlert } from 'lucide-react'
import { Section, SectionHeading } from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'

/* ------------------------------- formulas -------------------------------- */
// BMI healthy band 18.5–24.9. Ideal weight via Devine (medically common est.).
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

function computeHeightCm({ mode, cm, ft, inch }) {
  if (mode === 'cm') return Number(cm) || 0
  const totalInches = (Number(ft) || 0) * 12 + (Number(inch) || 0)
  return totalInches * 2.54
}

const BMI_MIN = 15
const BMI_MAX = 40

/* Accepted input range. Shared by the validity gate, the input min/max and the
   out-of-range message so the three can never disagree. */
const H_MIN = 120
const H_MAX = 230
const W_MIN = 25
const W_MAX = 250

/* Single source of truth for the scale. Category thresholds, the coloured bar
   segments and the tick labels under the bar are all derived from this, so a
   label can never drift away from the band it points at. */
const BANDS = [
  { key: 'under', label: 'Underweight', short: 'Under', to: 18.5, accent: 'volt', bar: 'bg-volt-500/70' },
  { key: 'normal', label: 'Normal', short: 'Normal', to: 25, accent: 'titan', bar: 'bg-titan-500/80' },
  { key: 'over', label: 'Overweight', short: 'Over', to: 30, accent: 'amber', bar: 'bg-amber-500/70' },
  { key: 'obese', label: 'Obese', short: 'Obese', to: Infinity, accent: 'rage', bar: 'bg-rage-600/80' },
]

const scalePct = (bmi) => ((bmi - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100

// Segment widths in %, walking the thresholds. Clamped to the drawn scale.
const bandWidths = BANDS.map((b, i) => {
  const from = i === 0 ? BMI_MIN : BANDS[i - 1].to
  return Math.max(0, scalePct(Math.min(b.to, BMI_MAX)) - scalePct(from))
})

// Boundary values labelled beneath the bar, positioned at their true offsets.
const TICKS = [BMI_MIN, ...BANDS.slice(0, -1).map((b) => b.to), BMI_MAX]

function bmiCategory(bmi) {
  return BANDS.find((b) => bmi < b.to) || BANDS[BANDS.length - 1]
}

function recommendation(cat) {
  switch (cat) {
    case 'under':
      return 'Focus on a calorie surplus with strength training. Add protein-dense meals and progressive overload to build lean mass.'
    case 'normal':
      return 'Great range. Train for strength and body composition, keep protein high and stay consistent to maintain and sculpt.'
    case 'over':
      return 'Combine resistance training with a modest calorie deficit and daily steps. Small, steady changes beat crash diets.'
    default:
      return 'Prioritise sustainable fat loss: resistance training, a controlled deficit and more movement. Consider medical guidance for a tailored plan.'
  }
}

export default function BmiCalculator() {
  const [gender, setGender] = useState('male')
  const [mode, setMode] = useState('cm') // 'cm' | 'ft'
  const [cm, setCm] = useState('')
  const [ft, setFt] = useState('')
  const [inch, setInch] = useState('')
  const [weight, setWeight] = useState('')

  const result = useMemo(() => {
    const hCm = computeHeightCm({ mode, cm, ft, inch })
    const w = Number(weight) || 0
    if (hCm < H_MIN || hCm > H_MAX || w < W_MIN || w > W_MAX) return null

    const h = hCm / 100
    const bmi = w / (h * h)
    const cat = bmiCategory(bmi)

    const lowW = 18.5 * h * h
    const highW = 24.9 * h * h

    // Devine ideal weight (gender specific), inches over 5 ft
    const inchesOver5ft = Math.max(hCm / 2.54 - 60, 0)
    const ideal = (gender === 'male' ? 50 : 45.5) + 2.3 * inchesOver5ft

    const pct = clamp(scalePct(bmi), 1.5, 98.5)
    return {
      bmi: bmi.toFixed(1),
      cat,
      low: lowW.toFixed(1),
      high: highW.toFixed(1),
      ideal: ideal.toFixed(1),
      weight: w,
      toGoal: w < lowW ? (lowW - w).toFixed(1) : w > highW ? (w - highW).toFixed(1) : 0,
      direction: w < lowW ? 'gain' : w > highW ? 'lose' : 'maintain',
      pct,
    }
  }, [gender, mode, cm, ft, inch, weight])

  /* Both fields filled but no result ⇒ the numbers are out of range. Worth
     saying so, instead of showing the same "fill this in" prompt. */
  const heightFilled = mode === 'cm' ? cm !== '' : ft !== '' || inch !== ''
  const outOfRange = heightFilled && weight !== '' && !result

  const accentText = {
    volt: 'text-volt-300',
    titan: 'text-titan-300',
    amber: 'text-amber-300',
    rage: 'text-rage-300',
  }
  const accentBadge = {
    volt: 'badge-volt',
    titan: 'badge-titan',
    amber: 'badge-amber',
    rage: 'badge-rage',
  }

  return (
    <Section id="bmi">
      <SectionHeading
        eyebrow="Know Your Numbers"
        title="BMI & Ideal"
        accentWord="Weight Calculator"
        accent="volt"
        sub="Enter your details to see your BMI, a healthy weight range and an ideal-weight estimate for your height and gender."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* ---------------- Inputs ---------------- */}
        <Reveal className="card plate-edge p-6 sm:p-7">
          <div className="flex items-center gap-2 text-silver-200">
            <Ruler className="h-5 w-5 text-volt-300" />
            <h3 className="text-lg font-semibold">Your Details</h3>
          </div>

          {/* Gender */}
          <div className="mt-5" role="group" aria-labelledby="bmi-gender-label">
            <span className="label" id="bmi-gender-label">
              Gender
            </span>
            <div className="grid grid-cols-2 gap-2">
              {['male', 'female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  aria-pressed={gender === g}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
                    gender === g
                      ? 'border-volt-400/60 bg-volt-500/12 text-volt-100'
                      : 'border-silver-300/12 bg-ink-900/70 text-silver-400 hover:text-silver-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Height mode toggle */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="label mb-0" id="bmi-height-label">
                Height
              </span>
              <div
                className="inline-flex rounded-lg border border-silver-300/12 bg-ink-900/70 p-0.5 text-xs"
                role="group"
                aria-label="Height unit"
              >
                {[
                  ['cm', 'cm'],
                  ['ft', 'ft / in'],
                ].map(([m, lbl]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    className={`rounded-md px-3 py-1.5 font-medium transition ${
                      mode === m ? 'bg-volt-500/20 text-volt-100' : 'text-silver-500 hover:text-silver-200'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            {mode === 'cm' ? (
              <input
                type="number"
                inputMode="decimal"
                min={H_MIN}
                max={H_MAX}
                step="1"
                value={cm}
                onChange={(e) => setCm(e.target.value)}
                placeholder="e.g. 175"
                className="field mt-2"
                aria-label="Height in centimetres"
              />
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min="3"
                  max="7"
                  step="1"
                  value={ft}
                  onChange={(e) => setFt(e.target.value)}
                  placeholder="feet"
                  className="field"
                  aria-label="Height feet"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="11"
                  step="1"
                  value={inch}
                  onChange={(e) => setInch(e.target.value)}
                  placeholder="inches"
                  className="field"
                  aria-label="Height inches"
                />
              </div>
            )}
          </div>

          {/* Weight */}
          <div className="mt-5">
            <span className="label">Current Weight (kg)</span>
            <input
              type="number"
              inputMode="decimal"
              min={W_MIN}
              max={W_MAX}
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 72"
              className="field"
              aria-label="Current weight in kilograms"
            />
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-silver-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silver-400" />
            Estimates only. Ideal weight ranges vary with muscle mass and frame and do not replace professional
            medical advice.
          </p>
        </Reveal>

        {/* ---------------- Results ---------------- */}
        <Reveal delay={80} className="card plate-edge relative overflow-hidden p-6 sm:p-7">
          <div className="flex items-center gap-2 text-silver-200">
            <Activity className="h-5 w-5 text-titan-300" />
            <h3 className="text-lg font-semibold">Your Results</h3>
          </div>

          {!result ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-silver-300/12 bg-ink-900/40 px-6 py-14 text-center">
              <Scale className="h-10 w-10 text-silver-500" />
              {outOfRange ? (
                <p className="max-w-xs text-sm text-silver-400">
                  Those numbers are outside the range this calculator covers. Use a height of{' '}
                  <span className="font-semibold text-silver-200">
                    {H_MIN}–{H_MAX} cm
                  </span>{' '}
                  (about 3 ft 11 in – 7 ft 7 in) and a weight of{' '}
                  <span className="font-semibold text-silver-200">
                    {W_MIN}–{W_MAX} kg
                  </span>
                  .
                </p>
              ) : (
                <p className="max-w-xs text-sm text-silver-500">
                  Fill in your gender, height and a realistic weight to see your BMI and healthy range.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6">
              {/* BMI headline + badge */}
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-brand text-silver-500">Your BMI</div>
                  <div className={`forge text-5xl font-bold ${accentText[result.cat.accent]}`}>{result.bmi}</div>
                </div>
                <span className={`${accentBadge[result.cat.accent]} text-sm`}>{result.cat.label}</span>
              </div>

              {/* BMI scale bar — segments, ticks and marker all derive from BANDS */}
              <div className="mt-5">
                <div className="relative h-3 overflow-hidden rounded-full bg-ink-900">
                  <div className="absolute inset-0 flex">
                    {BANDS.map((b, i) => (
                      <div key={b.key} className={`h-full ${b.bar}`} style={{ width: `${bandWidths[i]}%` }} />
                    ))}
                  </div>
                  <div
                    className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink-950 shadow-lg transition-[left] duration-500 ease-power"
                    style={{ left: `${result.pct}%` }}
                  />
                </div>

                {/* Boundary values, each sitting exactly where its band ends */}
                <div className="relative mt-1.5 h-3.5 text-[0.6rem] tracking-brand text-silver-500">
                  {TICKS.map((t, i) => (
                    <span
                      key={t}
                      className="absolute top-0 whitespace-nowrap"
                      style={{
                        left: `${scalePct(t)}%`,
                        transform:
                          i === 0
                            ? 'none'
                            : i === TICKS.length - 1
                              ? 'translateX(-100%)'
                              : 'translateX(-50%)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Band legend, with the one you are in called out */}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {BANDS.map((b) => {
                    const on = b.key === result.cat.key
                    return (
                      <span
                        key={b.key}
                        className={`flex items-center gap-1.5 text-[0.62rem] uppercase tracking-brand ${
                          on ? `font-semibold ${accentText[b.accent]}` : 'text-silver-500'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${b.bar}`} />
                        {b.short}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Range + ideal cards */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-titan-400/25 bg-titan-500/8 p-4">
                  <div className="text-[0.65rem] uppercase tracking-brand text-titan-300">Healthy Range</div>
                  <div className="mt-1 text-xl font-bold text-silver-100">
                    {result.low}–{result.high}
                    <span className="ml-1 text-sm font-normal text-silver-500">kg</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-volt-400/25 bg-volt-500/8 p-4">
                  <div className="text-[0.65rem] uppercase tracking-brand text-volt-300">Ideal Estimate</div>
                  <div className="mt-1 text-xl font-bold text-silver-100">
                    {result.ideal}
                    <span className="ml-1 text-sm font-normal text-silver-500">kg</span>
                  </div>
                </div>
              </div>

              {/* Goal line */}
              <div className="mt-3 rounded-2xl border border-silver-300/10 bg-ink-900/60 p-4">
                {result.direction === 'maintain' ? (
                  <p className="text-sm text-titan-200">
                    You are within your healthy weight range — nice work. Train for strength and maintain.
                  </p>
                ) : (
                  <p className="text-sm text-silver-300">
                    About{' '}
                    <span className={`font-bold ${result.direction === 'lose' ? 'text-rage-300' : 'text-volt-300'}`}>
                      {result.toGoal} kg
                    </span>{' '}
                    to {result.direction === 'lose' ? 'lose' : 'gain'} to reach the healthy range.
                  </p>
                )}
              </div>

              {/* Recommendation */}
              <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-silver-300/10 bg-ink-900/40 p-4">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-volt-300" />
                <p className="text-sm leading-relaxed text-silver-400">{recommendation(result.cat.key)}</p>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
