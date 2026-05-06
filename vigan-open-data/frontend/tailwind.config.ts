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
          text:      '#1A202C', // Dark for readability
          muted:     '#64748B', // Slate 500
          border:    '#D1FAE5', // Emerald 100
          gold:      '#F59E0B', // Amber (kept for CTAs)
          goldDk:    '#D97706',
          goldLt:    '#FEF3C7',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vigan-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'vigan-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'vigan-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
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
