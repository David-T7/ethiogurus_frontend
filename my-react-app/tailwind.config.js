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
        'brand-teal':'#009688',
        'brand-purple':'#673ab7'
      },
    },
  },
  plugins: [],
}
