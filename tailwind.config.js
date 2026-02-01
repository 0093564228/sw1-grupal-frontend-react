/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addVariant }) {
      // Adds a `fullscreen:` variant for Tailwind
      addVariant('fullscreen', '&:fullscreen');
    }
  ],
}

