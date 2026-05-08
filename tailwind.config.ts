import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm "old book" palette
        parchment: {
          DEFAULT: "#f4ecd8",
          muted: "#ebe1c8",
          deep: "#d9caa3",
        },
        ink: {
          DEFAULT: "#2a1f12",
          soft: "#4a3a26",
          muted: "#7a6a52",
          dim: "#a59377",
        },
        accent: {
          DEFAULT: "#b8472b",
          soft: "#d96846",
          glow: "#f4a261",
        },
        // Dark mode (night reading)
        bg: {
          DEFAULT: "#13100a",
          soft: "#1a1610",
          muted: "#221c14",
          panel: "#2a2218",
        },
        line: {
          DEFAULT: "#3a2f20",
          soft: "#2c2418",
        },
      },
      fontFamily: {
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        page: "0 4px 24px rgba(42,31,18,0.18), inset 0 0 0 1px rgba(42,31,18,0.06)",
        glow: "0 0 0 1px rgba(184,71,43,0.35), 0 12px 32px rgba(184,71,43,0.20)",
      },
      animation: {
        "fade-in": "fadeIn 320ms ease-out",
        "slide-up": "slideUp 320ms ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "page-turn": "pageTurn 420ms ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        pageTurn: {
          "0%": { opacity: "0", transform: "translateX(12px) rotateY(-4deg)" },
          "100%": { opacity: "1", transform: "translateX(0) rotateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
