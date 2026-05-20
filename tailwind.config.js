/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        dark: '#0F0F0F',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        'text-muted': '#8A8A8A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
