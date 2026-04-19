/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hungers: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#2c5234', // Original brand green
            950: '#1a2e21',
          },
          lime: {
            50: '#f7fee7',
            100: '#ecfcc1',
            200: '#d9f99d',
            300: '#bef264',
            400: '#a3e635',
            500: '#c1ff72', // Original brand lime
            600: '#65a30d',
            700: '#4d7c0f',
            800: '#3f6212',
            900: '#365314',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        display: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'lime': '0 10px 20px -5px rgba(193, 255, 114, 0.3)',
      }
    },
  },
  plugins: [],
}