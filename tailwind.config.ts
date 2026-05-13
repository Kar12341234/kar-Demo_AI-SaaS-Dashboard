import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#060812",
        panel: "#0c1020",
        line: "rgba(148, 163, 184, 0.16)"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(79, 70, 229, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
