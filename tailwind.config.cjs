/** Tailwind is compiled ahead of time (no CDN), so the site also works offline / on a school LAN.
 *  After you add new Tailwind classes to a view, run:  npm run build:css   (or  npm run watch:css) */
module.exports = {
  content: ["./views/**/*.xian", "./public/js/**/*.js", "./utils/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa",
          500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
};
