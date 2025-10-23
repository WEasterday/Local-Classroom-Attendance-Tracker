/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        baseOrange: '#f8941d',
        darkOrange: '#ac6206',
        redAccent: '#c01e2e',
        lightGray: '#bfc0c2'
      },
    },
  },
  plugins: [],
};
