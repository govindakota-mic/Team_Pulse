/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7C6FF0",
          blue: "#5B6EF5",
          teal: "#12B886",
          orange: "#F5A524",
          pink: "#F0537D",
          cyan: "#22C3E6",
          green: "#22C55E",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
