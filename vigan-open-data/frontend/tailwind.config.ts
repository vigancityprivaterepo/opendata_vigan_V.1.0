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
          primary:   '#065F46', // Emerald 800
          primaryDk: '#044034', // Emerald 900
          secondary: '#10B981', // Emerald 500
          accent:    '#047857', // Emerald 700
          light:     '#ECFDF5', // Emerald 50
          bg:        '#F9FAFB', // Gray 50
          text:      '#111827', // Gray 900
          muted:     '#6B7280', // Gray 500
          border:    '#A7F3D0', // Emerald 200
          gold:      '#F59E0B', // Amber 400
          goldDk:    '#D97706', // Amber 600
          goldLt:    '#FEF3C7', // Amber 50
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
