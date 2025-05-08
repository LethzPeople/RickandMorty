/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'rick-morty': "url('./assets/rick-and-morty-green-portal-3d-background-scaled.jpg')",
      },
    },
  },
  plugins: [],
}


