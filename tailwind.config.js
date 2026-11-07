/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paddy: { DEFAULT: '#0F5B43', dark: '#0B4533', tint: '#E0EDE6' },
        paper: '#EEF1EB',
        panel: '#FAFBF8',
        line: '#D4DAD0',
        ink: '#1E2B33',
        mute: '#5B6A66',
        sun: { DEFAULT: '#C2302A', tint: '#F7E2E0' },
        jute: { DEFAULT: '#8F6410', tint: '#F3E7C9' },
        river: { DEFAULT: '#2A6489', tint: '#DCE9F1' },
      },
      fontFamily: {
        display: ['"Anek Bangla"', '"Hind Siliguri"', 'system-ui', 'sans-serif'],
        sans: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
