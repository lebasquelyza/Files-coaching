
// Tailwind preset shared (colors pulled from CSS variables in packages/ui/themes/default.css)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand)",
          50: "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)"
        }
      },
      borderRadius: { xl2: "1.25rem" }
    },
  },
  plugins: []
};
