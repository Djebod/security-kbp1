import type { Config } from "tailwindcss";

/**
 * Token warna brand HARPER PALEMBANG — tema terang: mayoritas PUTIH + ORANYE, aksen TEAL untuk tombol.
 * Nama token tetap `neo-*` supaya komponen tidak perlu diubah semua.
 * Referensi: logo resmi Harper; teal tua #1D3A47 dipakai sebagai warna tombol utama.
 * - base / panel / raise / line : permukaan putih bertingkat (raise = krem oranye sangat muda)
 * - neon                        : oranye Harper (warna mayor): menu aktif, chip aktif, badge, ikon, logo
 * - teal / teal-deep            : aksen tombol utama (btn-primary)
 * - cloud / silver              : teks utama (gelap) / teks sekunder di atas putih
 * - black                       : latar gelap layar scanner kamera
 * - white                       : teks di atas oranye / teal
 * - mist                        : tepi jalan di peta halaman Tentang
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: {
          black: "#13232b",
          base: "#ffffff",
          panel: "#ffffff",
          raise: "#fff4ec",
          line: "#f0e0d3",
          silver: "#5f6b71",
          mist: "#e9dccf",
          cloud: "#1b2a31",
          white: "#ffffff",
          neon: "#f26b1d",
          "neon-deep": "#d4560c",
          teal: "#1d3a47",
          "teal-deep": "#14303c",
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
        edge: "0 1px 2px rgba(29,58,71,.05), 0 6px 18px -12px rgba(242,107,29,.25)",
        glow: "0 0 0 1px rgba(242,107,29,.35), 0 10px 28px -10px rgba(242,107,29,.55)",
        "glow-teal": "0 0 0 1px rgba(29,58,71,.25), 0 10px 26px -10px rgba(29,58,71,.55)",
      },
      dropShadow: {
        neon: ["0 0 1.5px rgba(242,107,29,.8)", "0 0 6px rgba(242,107,29,.45)"],
      },
    },
  },
  plugins: [],
};
export default config;
