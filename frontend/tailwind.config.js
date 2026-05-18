/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
        secondary: { 800: '#1e3a8a', 900: '#0f172a', 950: '#020617' }
      }
    },
  },
  plugins: [],
}