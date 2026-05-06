/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isso diz ao Tailwind para olhar todos os seus arquivos React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}