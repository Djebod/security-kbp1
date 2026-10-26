import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP } from "@/lib/config";

export const metadata: Metadata = {
  title: { default: `${APP.nama} — Security`, template: `%s · ${APP.namaPendek}` },
  description: APP.deskripsi,
  applicationName: APP.nama,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: APP.namaPendek, statusBarStyle: "black" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter untuk isi, Michroma (geometris) untuk judul — senada dengan logo NEO */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Michroma&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
