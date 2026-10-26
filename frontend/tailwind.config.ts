import type { Config } from "tailwindcss";

/**
 * Token warna NEO (tema gelap + aksen neon hi-vis).
 * - base / panel / raise / line : permukaan gelap bertingkat
 * - neon                        : satu-satunya aksen; hanya untuk hal aktif / butuh perhatian
 * - cloud / silver              : teks utama / teks sekunder di atas gelap
 * - black / ink / steel / mist  : masih dipakai halaman Tentang (versi terang)
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: {
          black: "#0a0a0a",
          base: "#0b0c0f",
          panel: "#13151a",
          raise: "#1b1e24",
          line: "#272b33",
          ink: "#161616",
          steel: "#2b2b2b",
          silver: "#b9bcc2",
          mist: "#dfe1e5",
          cloud: "#f3f4f6",
          white: "#ffffff",
          neon: "#c8ff2e",
          "neon-deep": "#9fd400",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.15)",
        edge: "inset 0 1px 0 rgba(255,255,255,.05)",
        glow: "0 0 0 1px rgba(200,255,46,.35), 0 10px 32px -10px rgba(200,255,46,.5)",
      },
    },
  },
  plugins: [],
};
export default config;
