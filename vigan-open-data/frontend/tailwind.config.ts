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
          primary:   '#065F46',
          primaryDk: '#044034',
          secondary: '#10B981',
          accent:    '#047857',
          light:     '#D1FAE5',
          bg:        '#F0FDF4',
          text:      '#064E3B',
          muted:     '#4B7A66',
          border:    '#6EE7B7',
          gold:      '#F59E0B',
          goldDk:    '#D97706',
          goldLt:    '#FEF3C7',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Source Sans 3', 'Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vigan-sm': '0 1px 3px rgba(6,95,70,0.08), 0 1px 2px rgba(6,95,70,0.04)',
        'vigan-md': '0 4px 12px rgba(6,95,70,0.10), 0 2px 6px rgba(6,95,70,0.06)',
        'vigan-lg': '0 12px 32px rgba(6,95,70,0.14), 0 4px 12px rgba(6,95,70,0.08)',
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-out both',
        'slide-up':  'slideUp 0.6s cubic-bezier(0.4,0,0.2,1) both',
        'count-up':  'countUp 1.8s ease-out both',
        'pulse-gold':'pulseGold 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        countUp:   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config
