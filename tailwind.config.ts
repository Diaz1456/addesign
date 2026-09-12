import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          DEFAULT: "#1F2937",
          deep: "#121A29",
          darker: "#0B1120",
          light: "#4B5563",
        },
        brand: {
          orange: "#D96C2C",
          ember: "#B5531F",
        },
        snow: "#F7F7F5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(11, 17, 32, 0.06), 0 8px 24px rgba(11, 17, 32, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;