/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F1E8',
        'paper-deep': '#EBE6D9',
        ink: '#14150F',
        'ink-soft': '#4A4C42',
        'ink-faint': '#7D7F73',
        rule: '#D5CFBE',
        'rule-strong': '#B8B1A0',
        signal: '#1F4FD8',
        'signal-soft': '#DBE3FB',
        alert: '#A83A20',
        verify: '#2F6B46',
        amber: '#A16207',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        sheet: '1220px',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
}
