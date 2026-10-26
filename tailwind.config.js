/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Brand palette — deep indigo/violet accent on neutral dark
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // Dark mode neutral
        dark: {
          50: "#f8f8f8",
          100: "#e8e8e8",
          200: "#d1d1d1",
          300: "#a8a8a8",
          400: "#6b6b6b",
          500: "#3d3d3d",
          600: "#2a2a2a",
          700: "#1e1e1e",
          800: "#141414",
          900: "#0a0a0a",
          950: "#050505",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: theme("colors.dark.300"),
            a: { color: theme("colors.brand.400"), textDecoration: "none" },
            h1: { color: theme("colors.dark.50"), fontFamily: "Lora, serif" },
            h2: { color: theme("colors.dark.100"), fontFamily: "Lora, serif" },
            h3: { color: theme("colors.dark.100") },
            blockquote: {
              borderLeftColor: theme("colors.brand.500"),
              color: theme("colors.dark.200"),
              fontStyle: "italic",
            },
            code: {
              color: theme("colors.brand.300"),
              backgroundColor: theme("colors.dark.700"),
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            strong: { color: theme("colors.dark.100") },
          },
        },
        light: {
          css: {
            color: theme("colors.slate.700"),
            a: { color: theme("colors.brand.600") },
            h1: { color: theme("colors.slate.900"), fontFamily: "Lora, serif" },
            h2: { color: theme("colors.slate.800"), fontFamily: "Lora, serif" },
            blockquote: {
              borderLeftColor: theme("colors.brand.500"),
              color: theme("colors.slate.600"),
            },
            strong: { color: theme("colors.slate.800") },
            code: {
              color: theme("colors.brand.700"),
              backgroundColor: theme("colors.slate.100"),
            },
          },
        },
      }),
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
