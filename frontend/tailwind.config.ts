import type { Config } from "tailwindcss";

/**
 * Token warna brand HARPER PALEMBANG (tema gelap teal + aksen neon tembaga).
 * Nama token tetap `neo-*` supaya semua komponen tidak perlu diubah.
 * Referensi: logo resmi Harper (putih di atas teal tua #1D3A47), gaya "modern rustic".
 * - base / panel / raise / line : permukaan gelap bertingkat, turunan teal Harper
 * - neon                        : satu-satunya aksen (tembaga menyala seperti lampu rustic);
 *                                 hanya untuk hal aktif / butuh perhatian
 * - cloud / silver              : teks utama (krem hangat) / teks sekunder
 * - black / ink / steel / mist  : teks gelap di atas aksen + permukaan lain
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: {
          black: "#0a1418",
          base: "#0b1a20",
          panel: "#10252d",
          raise: "#173139",
          line: "#24414b",
          ink: "#12232a",
          steel: "#1d3a47",
          silver: "#b9c6c7",
          mist: "#e4dccf",
          cloud: "#f6efe6",
          white: "#ffffff",
          neon: "#ff9f4a",
          "neon-deep": "#e07a26",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.15)",
        edge: "inset 0 1px 0 rgba(255,255,255,.05)",
        glow: "0 0 0 1px rgba(255,159,74,.35), 0 10px 32px -10px rgba(255,159,74,.5)",
      },
      dropShadow: {
        neon: ["0 0 2px rgba(255,159,74,.9)", "0 0 8px rgba(255,159,74,.55)"],
      },
    },
  },
  plugins: [],
};
export default config;
