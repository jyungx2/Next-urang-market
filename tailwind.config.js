/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-none": {
          "-ms-overflow-style": "none" /* IE, Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".scrollbar-none::-webkit-scrollbar": { display: "none" } /* WebKit */,
      });
    },
  ],
};
