import Link from "next/link";
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-display text-4xl">404</p>
      <p className="text-neo-steel">Halaman atau data tidak ditemukan.</p>
      <Link href="/" className="btn-primary">Ke Beranda</Link>
    </main>
  );
}
