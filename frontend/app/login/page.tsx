"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getRedirectResult, signInWithPopup, signInWithRedirect, signOut, type User } from "firebase/auth";
import { clientAuth, googleProvider } from "@/lib/firebase-client";
import { APP } from "@/lib/config";
import NeoLogo from "@/components/NeoLogo";

/** Penanda di sessionStorage: sedang menunggu hasil login redirect dari Google */
const KUNCI_REDIRECT = "neo_login_redirect";

function isInAppBrowser() {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line\/|Twitter|TikTok/i.test(ua);
}
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [inApp, setInApp] = useState(false);

  async function tukarSesi(user: User) {
    setLoading(true);
    // Token baru saja diterbitkan saat login → tidak perlu dipaksa refresh (hemat satu panggilan jaringan).
    const idToken = await user.getIdToken();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      await signOut(clientAuth()).catch(() => {});
      setError(data.error || "Login gagal.");
      setLoading(false);
      return;
    }
    router.replace("/");
  }

  useEffect(() => {
    setInApp(isInAppBrowser());
    if (params.get("reason") === "expired") setError("Sesi Anda berakhir. Silakan masuk kembali.");
    // Baru kembali dari halaman Google (HP)? Langsung tampilkan "Memproses..." supaya tidak terlihat diam.
    const menunggu = sessionStorage.getItem(KUNCI_REDIRECT) === "1";
    if (menunggu) setLoading(true);
    // Hasil login redirect (HP)
    getRedirectResult(clientAuth())
      .then((r) => {
        sessionStorage.removeItem(KUNCI_REDIRECT);
        if (r?.user) tukarSesi(r.user);
        else if (menunggu) setLoading(false);
      })
      .catch((e) => { sessionStorage.removeItem(KUNCI_REDIRECT); setLoading(false); setError(pesanFirebase(e)); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function masuk() {
    setError("");
    try {
      if (isMobile()) {
        setLoading(true);
        sessionStorage.setItem(KUNCI_REDIRECT, "1");
        await signInWithRedirect(clientAuth(), googleProvider());
      } else {
        const r = await signInWithPopup(clientAuth(), googleProvider());
        await tukarSesi(r.user);
      }
    } catch (e) {
      sessionStorage.removeItem(KUNCI_REDIRECT);
      setError(pesanFirebase(e));
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-neo-base text-neo-cloud lg:flex-row">
      {/* Panel brand: logo + nama sistem. Di laptop jadi kolom kiri, di HP jadi bagian atas. */}
      <section className="relative overflow-hidden border-b border-neo-line px-6 pb-10 pt-12 lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:px-16 lg:py-14">
        <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-neo-neon/10 blur-3xl" aria-hidden />
        <div className="relative">
          <NeoLogo size="md" />
        </div>
        <div className="relative mt-10 lg:mt-0">
          <p className="font-display text-[11px] uppercase tracking-[.35em] text-neo-neon">Security System</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neo-cloud lg:text-5xl">{APP.nama}</h1>
          <p className="mt-2 text-sm text-neo-silver/70 lg:text-base">{APP.tempat}</p>
        </div>
      </section>

      {/* Panel masuk */}
      <section className="flex flex-1 flex-col justify-center px-6 py-10 lg:max-w-xl lg:px-16">
        <h2 className="text-lg font-semibold text-neo-cloud">Masuk</h2>
        <p className="mt-1 text-sm text-neo-silver/70">Gunakan akun Google yang terdaftar sebagai staf.</p>

        <div className="mt-8 space-y-4">
          {inApp ? (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
              Login Google tidak didukung di browser bawaan aplikasi ini. <b>Buka lewat Chrome atau Safari.</b>
            </div>
          ) : (
            <button onClick={masuk} disabled={loading} className="btn btn-lg bg-neo-cloud text-neo-black hover:bg-white">
              <GoogleIcon />
              {loading ? "Memproses..." : "Masuk dengan Google"}
            </button>
          )}
          {error && <div className="notice-bad text-sm">{error}</div>}
          <p className="text-xs text-neo-silver/60">Hanya untuk staf {APP.tempat} yang terdaftar.</p>
        </div>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 text-xs text-neo-silver/50">
          <Link href="/tentang" className="rounded-full border border-neo-line px-4 py-2 text-neo-silver transition hover:border-neo-silver/50 hover:text-neo-cloud">Tentang sistem</Link>
          <span className="font-display text-[10px] uppercase tracking-[.25em]">{APP.namaPendek}</span>
        </footer>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-neo-base" />}>
      <LoginInner />
    </Suspense>
  );
}

function pesanFirebase(e: unknown): string {
  const code = (e as { code?: string })?.code || "";
  if (code.includes("popup-closed")) return "Jendela login ditutup sebelum selesai.";
  if (code.includes("unauthorized-domain")) return "Domain ini belum didaftarkan di Firebase (Authorized domains).";
  if (code.includes("network")) return "Tidak ada koneksi internet.";
  return "Login gagal. Coba lagi.";
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.4 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 7.2-9.9 7.2-17.4z"/>
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C.9 16.3 0 20 0 24s.9 7.7 2.6 10.8l7.8-6.1z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.6l-7.3-5.7c-2 1.4-4.7 2.3-8 2.3-6.3 0-11.7-3.9-13.6-9.4l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
