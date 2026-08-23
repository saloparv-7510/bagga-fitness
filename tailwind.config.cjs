/* CommonJS on purpose. package.json sets "type": "module", so a .js config here
   is an ES module — and Tailwind v3 loads its config with require(), which makes
   Node print an ExperimentalWarning on every build. Naming the file .cjs lets
   require() take the native path and the build comes out clean. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark premium gym base
        ink: {
          950: '#04050a',
          900: '#070910',
          850: '#0b0e17',
          800: '#10141f',
          700: '#171d2b',
          600: '#232b3d',
          500: '#323c52',
        },
        // Thor — electric blue / lightning
        volt: {
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        // Power red
        rage: {
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Hulk — titan green
        titan: {
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        silver: {
          100: '#f4f7fb',
          200: '#e2e8f0',
          300: '#c7d0de',
          400: '#94a3b8',
          // Dimmest step on purpose: this is the muted/fine-print colour, so it
          // is tuned to clear WCAG AA 4.5:1 on the ink-950 base (4.8:1).
          // There is no `600` — anything dimmer fails contrast on this palette.
          500: '#707c8e',
        },
      },
      fontFamily: {
        display: ['"Oswald Variable"', 'Oswald', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        forge: '0.16em',
        brand: '0.06em',
      },
      // Extra opacity steps so `@apply xxx/NN` (used in styles/index.css)
      // resolves — the JIT engine allows arbitrary slashes in scanned markup,
      // but @apply requires the value to exist in the scale.
      opacity: {
        8: '0.08',
        9: '0.09',
        12: '0.12',
        15: '0.15',
        16: '0.16',
        18: '0.18',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        62: '0.62',
        65: '0.65',
        72: '0.72',
        82: '0.82',
        85: '0.85',
      },
      screens: {
        xs: '420px',
        '3xl': '1720px',
      },
      maxWidth: {
        shell: '84rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        volt: '0 0 0 1px rgba(56,189,248,.35), 0 12px 40px -18px rgba(56,189,248,.55)',
        rage: '0 0 0 1px rgba(239,68,68,.35), 0 12px 40px -18px rgba(239,68,68,.55)',
        titan: '0 0 0 1px rgba(34,197,94,.35), 0 12px 40px -18px rgba(34,197,94,.55)',
        plate: '0 24px 60px -32px rgba(0,0,0,.9)',
        // Web theme: the crimson hairline reads red, the drop shadow reads
        // electric blue — the two-tone accent used by the Legend Protocols and
        // Feedback sections. Both colours already exist in the palette (rage +
        // volt), so nothing new was added to `colors`.
        spider: '0 0 0 1px rgba(239,68,68,.32), 0 14px 44px -18px rgba(56,189,248,.5)',
      },
      transitionTimingFunction: {
        power: 'cubic-bezier(.22,1,.36,1)',
      },
      keyframes: {
        // opacity / transform only — compositor friendly
        riseIn: {
          from: { opacity: '0', transform: 'translate3d(0,18px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        arcFlicker: {
          '0%,100%': { opacity: '.25' },
          '42%': { opacity: '.75' },
          '48%': { opacity: '.2' },
          '55%': { opacity: '.95' },
          '61%': { opacity: '.35' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-2.5%,0) scale(1.045)' },
        },
        sheen: {
          from: { transform: 'translate3d(-120%,0,0)' },
          to: { transform: 'translate3d(220%,0,0)' },
        },
        breathe: {
          '0%,100%': { opacity: '.55' },
          '50%': { opacity: '.95' },
        },
        // Spider-sense pulse (see SenseRings in art/Decor.jsx). Scale + opacity
        // only, so three staggered rings still cost nothing per frame.
        senseRing: {
          '0%': { opacity: '.85', transform: 'scale(.45)' },
          '70%': { opacity: '0', transform: 'scale(1.28)' },
          '100%': { opacity: '0', transform: 'scale(1.28)' },
        },
        // Barely-there drift for a hanging web strand — a 1.4° rotation, which
        // reads as weight without ever looking like a swinging pendulum.
        strandSway: {
          '0%,100%': { transform: 'rotate(-1.4deg)' },
          '50%': { transform: 'rotate(1.4deg)' },
        },
      },
      animation: {
        riseIn: 'riseIn .6s cubic-bezier(.22,1,.36,1) both',
        arcFlicker: 'arcFlicker 5.5s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
        sheen: 'sheen 2.6s cubic-bezier(.22,1,.36,1) infinite',
        breathe: 'breathe 4.5s ease-in-out infinite',
        senseRing: 'senseRing 3.2s cubic-bezier(.22,1,.36,1) infinite',
        strandSway: 'strandSway 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
