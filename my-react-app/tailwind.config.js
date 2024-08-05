/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#003366',
        'brand-green': '#00A859',
        'brand-orange': '#FF6600',
        'brand-gray-light': '#F2F2F2',
        'brand-gray-dark': '#333333',
        'brand-teal': '#009688',
        'brand-purple': '#673ab7'
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
        bounceIn: 'bounceIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
