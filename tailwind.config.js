/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9b8',
          400: '#ec7a93',
          500: '#de4d6f',
          600: '#c82d56',
          700: '#a82145',
          800: '#862633',
          900: '#76243a',
          950: '#430f1c',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFC72C', /* Salisbury official gold */
          600: '#d4a017',
          700: '#b07d10',
          800: '#7c5a0e',
          900: '#5a400a',
          950: '#3c2a06',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
