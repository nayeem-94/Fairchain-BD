/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12201A",
        paper: "#F3F6F2",
        line: "#CBD7CF",
        jade: { DEFAULT: "#0B5D46", dark: "#084634", soft: "#D6E8DE" },
        signal: "#C93B2B",
        grain: "#B07F0A",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        body: ['"Hind Siliguri"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
