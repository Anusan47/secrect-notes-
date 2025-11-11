/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,0.4)",
      },
      animation: {
        "pulse-slow": "pulse 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
