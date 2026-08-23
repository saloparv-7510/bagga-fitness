/* ---------------------------------------------------------------------------
   Nutrition data — protein foods and supplements.
   Protein values are per 100 g of the common edible portion and are rounded
   typical figures for guidance, not lab-exact numbers.
   --------------------------------------------------------------------------- */

export const foodCategories = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'nonveg', label: 'Non-Veg' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'plant', label: 'Plant / Legumes' },
]

/* protein = grams per 100 g. `serving` gives a real-world portion. */
export const proteinFoods = [
  { name: 'Chicken Breast', cat: 'nonveg', protein: 31, serving: '1 breast ≈ 40 g protein', art: 'chicken', accent: 'rage' },
  { name: 'Eggs', cat: 'nonveg', protein: 13, serving: '1 large egg ≈ 6 g protein', art: 'egg', accent: 'volt' },
  { name: 'Fish (Rohu / Tuna)', cat: 'nonveg', protein: 24, serving: '1 fillet ≈ 30 g protein', art: 'fish', accent: 'volt' },
  { name: 'Paneer', cat: 'dairy', protein: 18, serving: '100 g ≈ 18 g protein', art: 'paneer', accent: 'titan' },
  { name: 'Greek Yogurt', cat: 'dairy', protein: 10, serving: '1 cup ≈ 17 g protein', art: 'yogurt', accent: 'titan' },
  { name: 'Milk', cat: 'dairy', protein: 3.4, serving: '1 glass ≈ 8 g protein', art: 'milk', accent: 'volt' },
  { name: 'Soya Chunks', cat: 'plant', protein: 52, serving: '50 g dry ≈ 26 g protein', art: 'soya', accent: 'titan' },
  { name: 'Lentils (Dal)', cat: 'plant', protein: 9, serving: '1 bowl cooked ≈ 18 g protein', art: 'lentil', accent: 'titan' },
  { name: 'Chickpeas (Chana)', cat: 'plant', protein: 9, serving: '1 bowl cooked ≈ 15 g protein', art: 'chickpea', accent: 'titan' },
  { name: 'Rajma (Kidney Beans)', cat: 'plant', protein: 9, serving: '1 bowl cooked ≈ 15 g protein', art: 'rajma', accent: 'rage' },
  { name: 'Peanuts', cat: 'plant', protein: 26, serving: 'small handful ≈ 7 g protein', art: 'peanut', accent: 'rage' },
  { name: 'Almonds', cat: 'plant', protein: 21, serving: '1 handful ≈ 6 g protein', art: 'almond', accent: 'volt' },
  { name: 'Tofu', cat: 'plant', protein: 8, serving: '100 g ≈ 8 g protein', art: 'tofu', accent: 'titan' },
  { name: 'Cottage Cheese', cat: 'dairy', protein: 11, serving: '1 cup ≈ 24 g protein', art: 'paneer', accent: 'titan' },
  { name: 'Whey Scoop', cat: 'dairy', protein: 80, serving: '1 scoop ≈ 24 g protein', art: 'whey', accent: 'volt' },
  { name: 'Oats', cat: 'plant', protein: 13, serving: '1 bowl ≈ 6 g protein', art: 'oats', accent: 'titan' },
]

export const supplements = [
  {
    name: 'Whey Protein',
    tag: 'Foundational',
    accent: 'volt',
    what: 'A fast-digesting milk protein powder used to top up your daily protein target.',
    who: 'Anyone struggling to hit protein from food alone.',
    how: '1 scoop (≈24 g) post-workout or between meals.',
    art: 'tub',
  },
  {
    name: 'Creatine Monohydrate',
    tag: 'Proven',
    accent: 'titan',
    what: 'The most researched supplement for strength and lean mass. Helps regenerate energy for heavy sets.',
    who: 'Almost every trainee, from beginner to advanced.',
    how: '3–5 g every day, any time — consistency matters more than timing.',
    art: 'scoop',
  },
  {
    name: 'Multivitamin',
    tag: 'Insurance',
    accent: 'titan',
    what: 'Covers micronutrient gaps that a busy or restrictive diet can leave behind.',
    who: 'Those with limited food variety or high training loads.',
    how: '1 serving daily with a meal.',
    art: 'pill',
  },
  {
    name: 'Omega-3 (Fish Oil)',
    tag: 'Recovery',
    accent: 'volt',
    what: 'Supports joint comfort, heart health and recovery from hard training.',
    who: 'People who eat little fatty fish.',
    how: '1–2 g combined EPA/DHA daily with food.',
    art: 'softgel',
  },
  {
    name: 'Caffeine / Pre-Workout',
    tag: 'Optional',
    accent: 'rage',
    what: 'A stimulant that can improve focus and output for tough sessions.',
    who: 'Trainees who need a lift for early or heavy workouts.',
    how: '100–200 mg, 30 min pre-session. Avoid late in the day.',
    art: 'shaker',
  },
  {
    name: 'Vitamin D3',
    tag: 'Insurance',
    accent: 'volt',
    what: 'Supports bone health, immunity and muscle function — commonly low in indoor lifestyles.',
    who: 'Anyone with limited sun exposure.',
    how: 'As advised after a blood test, typically 1000–2000 IU daily.',
    art: 'pill',
  },
]

export const supplementNote =
  'Supplements support a solid diet — they never replace it. Training, whole-food protein, sleep and consistency drive the vast majority of your results. Talk to a doctor before starting anything, especially if you take medication or have a medical condition.'
