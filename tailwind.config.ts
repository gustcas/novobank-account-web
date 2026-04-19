import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#003087",
        secondary: "#0057B8",
        accent: "#f4870e",
        accentHover: "#d4730c",
        success: "#00875A",
        danger: "#D32F2F",
        warning: "#F59E0B",
        neutral: "#F5F7FA",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        "text-main": "#1A2B4A",
        "text-muted": "#6B7280"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      keyframes: {
        "brand-loader": {
          "0%, 100%": {
            transform: "scale(0.95)",
            opacity: "0.18",
            boxShadow: "0 0 0 rgba(255,255,255,0)"
          },
          "50%": {
            transform: "scale(1)",
            opacity: "1",
            boxShadow: "0 0 15px rgba(255,255,255,0.7)"
          }
        }
      },
      animation: {
        "brand-loader": "brand-loader 1.35s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
