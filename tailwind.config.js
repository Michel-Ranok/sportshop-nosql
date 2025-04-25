/* tailwind.config.js */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7522c2',
          light: '#a855f7',
          dark: '#5b1fa3',
        },
        secondary: {
          DEFAULT: '#ffed4a',
          light: '#fff382',
          dark: '#e3ac08',
        },
        accent: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        }
      },
    },
  },
  plugins: [],
}
