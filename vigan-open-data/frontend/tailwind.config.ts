import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vigan: {
          // ── Core brand ────────────────────────────────────
          primary:     '#065F46', // Emerald 800  — nav, links, primary CTA
          primaryDk:   '#044034', // Emerald 900  — footer, CTA section
          deepDk:      '#022C22', // Emerald 950+ — hero dark end of gradient
          mid:         '#059669', // Emerald 600  — fills the gap between 800 & 500
          secondary:   '#10B981', // Emerald 500  — highlights, badges
          accent:      '#047857', // Emerald 700  — hover states
          // ── Surfaces ─────────────────────────────────────
          light:       '#ECFDF5', // Emerald 50   — light tint for pills, chips
          surface:     '#F0FDF4', // Emerald 50   — page section background
          bg:          '#F9FAFB', // Gray 50      — fallback bg
          // ── Text ─────────────────────────────────────────
          text:        '#111827', // Gray 900
          muted:       '#6B7280', // Gray 500
          // ── Borders ──────────────────────────────────────
          border:      '#A7F3D0', // Emerald 200
          borderDk:    '#6EE7B7', // Emerald 300
          // ── Gold accent ──────────────────────────────────
          gold:        '#F59E0B', // Amber 400
          goldDk:      '#D97706', // Amber 600
          goldLt:      '#FEF3C7', // Amber 50
          goldAccent:  '#C9962A', // Satin gold for CTA highlights
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':        '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover':  '0 4px 12px 0 rgba(0,0,0,0.10)',
        'card-deep':   '0 8px 24px 0 rgba(0,0,0,0.12)',
        'glow-emerald':'0 0 20px 0 rgba(16,185,129,0.25)',
      },
      backgroundImage: {
        'hero-gradient':  'linear-gradient(135deg, #022C22 0%, #044034 55%, #065F46 100%)',
        'emerald-gradient':'linear-gradient(135deg, #065F46 0%, #059669 100%)',
        'gold-gradient':  'linear-gradient(90deg, #C9962A 0%, #F59E0B 100%)',
        'dot-pattern':    "radial-gradient(circle, #A7F3D0 1px, transparent 1px)",
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.5s ease-out both',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'count-up': 'countUp 0.3s ease-out both',
      },
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
