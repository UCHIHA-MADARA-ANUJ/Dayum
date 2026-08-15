/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050507",
        bg2: "#08080d",
        panel: "#0b0b12",
        panel2: "#10101a",
        panel3: "#161624",
        line: "#1e1e2e",
        line2: "#2a2a3e",
        red: "#e01e37",
        red2: "#ff2a44",
        red3: "#7a0e1e",
        crimson: "#4a0813",
        bone: "#e8e4d8",
        steel: "#8a8a94",
        dim: "#5a5a66",
        faint: "#3a3a46",
        amber: "#f4a300",
        amber2: "#ffc24d",
        ice: "#9fb4d8",
        green: "#3ddc84",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        ui: ["Rajdhani", "sans-serif"],
        mono: ["PlexMono", "monospace"],
      },
    },
  },
  plugins: [],
};
