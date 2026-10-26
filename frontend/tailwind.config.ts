import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: {
          black: "#0a0a0a",
          ink: "#161616",
          steel: "#2b2b2b",
          silver: "#b9bcc2",
          mist: "#dfe1e5",
          cloud: "#f3f4f6",
          white: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: { soft: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.15)" },
    },
  },
  plugins: [],
};
export default config;
