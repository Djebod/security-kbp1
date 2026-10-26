"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-display text-lg uppercase tracking-[.2em] text-neo-cloud">Terjadi kesalahan</p>
      <p className="max-w-md text-sm text-neo-silver">{error.message || "Coba muat ulang halaman."}</p>
      <button onClick={reset} className="btn-primary">Coba lagi</button>
    </main>
  );
}
