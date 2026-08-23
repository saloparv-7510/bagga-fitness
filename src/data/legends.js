/* ---------------------------------------------------------------------------
   LEGEND PROTOCOLS — two motivational training templates.

   ATTRIBUTION RULES. Read these before editing this file.

   1. Ronnie Coleman is cited as a training INFLUENCE only. His competitive
      record (eight consecutive Mr. Olympia titles, 1998–2005) and his
      reputation for very high training volume are matters of public record, and
      citing them is fair. What this file must never do:
        - imply he endorses, coaches at, or is affiliated with BAGGA FITNESS
        - use his likeness, photograph, signature or any trademark of his
        - reproduce a programme as "his routine" — this is our interpretation
      Every card carries `disclaimer`, and the section renders it. Do not remove
      it, and do not add a portrait.

   2. `coach-tara` is a FICTIONAL persona invented for this site. She is not a
      real person, is not a member of the coaching team, and must never be
      presented as either. `persona: true` drives the "illustrated persona"
      label in the UI. The programme she fronts is real training content and is
      run by the gym's two real women coaches (see coachSplit in site.js).

   3. All artwork is original inline SVG from components/art/ — no downloaded,
      scraped or licensed imagery anywhere on this site.

   The programmes themselves are ordinary evidence-based training templates.
   They are general guidance for healthy adults, not medical advice or a
   personalised prescription — `safety` says so on every card.
   --------------------------------------------------------------------------- */

export const legends = [
  {
    id: 'iron-volume',
    /* Programme name is ours. It is not, and must not be labelled as, his. */
    name: 'The Iron Volume Protocol',
    kicker: 'Mass & Raw Strength',
    accent: 'rage',
    art: 'lift',
    influence: 'Ronnie Coleman',
    influenceLine:
      'Built on the high-volume, heavy-compound approach Ronnie Coleman became known for through eight consecutive Mr. Olympia wins between 1998 and 2005.',
    quote: 'Everybody wants to be a bodybuilder, but nobody wants to lift heavy-ass weights.',
    quoteNote: 'The line Coleman is widely quoted for — and the whole idea behind this block.',
    summary:
      'Heaviest compound first while you are fresh, then earn the size with volume that most people quit before reaching. Four working sets is the floor, not the target.',
    principles: [
      { title: 'Heavy movement first', text: 'The main lift comes first in the session, at a weight that is genuinely hard for the prescribed reps.' },
      { title: 'Then out-volume yourself', text: 'After the heavy work, four to five sets per accessory. The last two sets are where the growth argument gets made.' },
      { title: 'Full range, every rep', text: 'Heavy is only heavy if the rep is complete. A shortened rep at a bigger number is a smaller stimulus.' },
      { title: 'Eat and sleep like it matters', text: 'This much volume outruns a casual diet. Use the protein calculator on this page and get eight hours.' },
    ],
    day: {
      label: 'Sample Back Day',
      rows: [
        { move: 'Deadlift', work: '4 × 8, 6, 5, 5', note: 'Build to the heaviest set of five you can brace for.' },
        { move: 'Barbell Row', work: '4 × 10', note: 'Chest proud, pull to the lower ribs, no jerking.' },
        { move: 'T-Bar Row', work: '4 × 10', note: 'Squeeze and hold half a second at the top.' },
        { move: 'Lat Pulldown', work: '4 × 12', note: 'Lean back slightly, drive elbows down not back.' },
        { move: 'Straight-Arm Pulldown', work: '3 × 15', note: 'Lats only. Keep the elbows locked soft.' },
        { move: 'Back Extension', work: '3 × 15', note: 'Finisher for the whole posterior chain.' },
      ],
    },
    reality:
      'This is advanced volume. If you have less than a year of steady training behind you it will bury you before it builds you — run the Intermediate plan in Workout Plans first, then come back to this.',
    safety:
      'General training guidance for healthy adults. It is not medical advice — if you have an injury, a heart condition or you are returning from a long break, talk to a doctor and a coach before starting.',
    disclaimer:
      'BAGGA FITNESS is not affiliated with, sponsored by or endorsed by Ronnie Coleman. His name appears here as a documented training influence only. This programme is our own interpretation, not his routine.',
    cta: 'Hello BAGGA FITNESS, I would like to train on the Iron Volume Protocol (mass and strength). Can a coach check whether I am ready for that volume?',
  },
  {
    id: 'coach-tara',
    name: 'The Strong & Sculpted Protocol',
    kicker: 'Women’s Strength',
    accent: 'titan',
    art: 'athlete',
    /* Fictional. `persona: true` makes the UI say so, in plain words. */
    persona: true,
    personaName: 'Coach Tara',
    personaLine:
      'Coach Tara is an illustrated persona created for this site — a fictional character, not a real trainer and not a member of our team. The programme she fronts is real, and our two women coaches are the ones who run it.',
    influenceLine:
      'Written for women who want to get genuinely strong: the heavy work goes to the hips, hamstrings and back, and the upper body does not get skipped.',
    quote: 'Train for the number on the bar. The mirror follows.',
    quoteNote: 'Written for this programme — not a quotation from anyone real.',
    summary:
      'Strength first, shape second — because shape is what strength looks like. Progress gets logged, conditioning goes at the end of the session, and nothing here is a "toning" workout.',
    principles: [
      { title: 'Hips and hamstrings lead', text: 'Thrusts, squats and Romanian deadlifts carry the load. This is the engine of the whole programme.' },
      { title: 'Press and pull properly', text: 'Overhead pressing and real pull-up progressions. Upper-body strength is not optional and not a men’s-only thing.' },
      { title: 'Write the numbers down', text: 'Add weight or add a rep against last week. Progressive overload is the entire method — everything else is detail.' },
      { title: 'Conditioning last, not instead', text: 'Ten to fifteen minutes at the end. Cardio in place of lifting is how people train hard and change nothing.' },
    ],
    day: {
      label: 'Sample Lower Day',
      rows: [
        { move: 'Barbell Hip Thrust', work: '4 × 10', note: 'Ribs down, chin tucked, squeeze hard at the top.' },
        { move: 'Back or Goblet Squat', work: '4 × 8', note: 'Goblet until depth and control are solid, then the bar.' },
        { move: 'Romanian Deadlift', work: '3 × 10', note: 'Push the hips back, feel the hamstrings, stop at the stretch.' },
        { move: 'Bulgarian Split Squat', work: '3 × 10 / leg', note: 'Hold a rail for balance so the legs do the work.' },
        { move: 'Hip Abduction', work: '3 × 15', note: 'Slow out, slower back. No swinging.' },
        { move: 'Plank + Dead Bug', work: '3 × 45s / 3 × 10', note: 'Bracing work that carries straight back to the squat.' },
      ],
    },
    reality:
      'Lifting heavy will not make you bulky. Visible muscle at that scale takes years of deliberate surplus eating — what this actually builds is strength, shape and bone density.',
    safety:
      'General training guidance for healthy adults. It is not medical advice, and it is not written for pregnancy or postpartum training — speak to your doctor and a coach for that.',
    cta: 'Hello BAGGA FITNESS, I would like to start the Strong & Sculpted Protocol (women’s strength). Can I train it with one of your women coaches?',
  },
]

/* Shown once under the section, above the per-card notes. */
export const legendsNote =
  'Names cited here are influences, not endorsements. No one on this page is claimed as a coach, sponsor or partner of BAGGA FITNESS, and all artwork is original to this site.'
