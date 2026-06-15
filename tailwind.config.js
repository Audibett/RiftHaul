/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F97316",
          dark: "#1A1A2E",
          gray: "#6B7280",
        }
      }
    },
  },
  plugins: [],
}