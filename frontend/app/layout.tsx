import type { Metadata, Viewport } from "next";
import { Cinzel, JetBrains_Mono, Lato } from "next/font/google";
import "./globals.css";
import { APP } from "@/lib/config";

/* Mengikuti situs resmi Harper: Lato untuk isi, Cinzel (serif klasik) untuk nama brand & judul, JetBrains Mono untuk angka & jam */
const sans = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-sans", display: "swap" });
const display = Cinzel({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${APP.nama} Security`, template: `%s · ${APP.namaPendek}` },
  description: APP.deskripsi,
  applicationName: APP.nama,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: APP.namaPendek, statusBarStyle: "black" },
};

export const viewport: Viewport = {
  themeColor: "#0b1a20",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
