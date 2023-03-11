/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      boxShadow: {
        "dark-edge": "inset 0px 0px 40px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin"), require("@tailwindcss/forms")],
};
