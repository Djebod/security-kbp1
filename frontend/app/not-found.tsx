import Link from "next/link";
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-mono text-5xl text-neo-neon">404</p>
      <p className="text-neo-silver">Halaman atau data tidak ditemukan.</p>
      <Link href="/" className="btn-primary">Ke Beranda</Link>
    </main>
  );
}
