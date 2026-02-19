/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EBF4FF',
          100: '#C3DAFE',
          200: '#A3BFFA',
          300: '#7F9CF5',
          400: '#667EEA',
          500: '#5A67D8',
          600: '#4C51BF',
          700: '#434190',
          800: '#2C5282',
          900: '#1A365D',
        },
        warm: {
          white: '#F7F5F0',
          50: '#FDFBF7',
          100: '#F2EFE9',
          200: '#E6E2D8',
          300: '#D4CFC4',
          gray: '#8B8680',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'paper': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
