/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0A0A0F', soft: '#16161F', muted: '#22222E' },
        paper: { DEFAULT: '#F5F0E8', warm: '#EDE8DC' },
        gold: { DEFAULT: '#C9A84C', light: '#E8C96B', dark: '#9E7A2A' },
        teal: { DEFAULT: '#0D7C66', light: '#10A882', dark: '#095C4B' },
      },
    },
  },
  plugins: [],
};
