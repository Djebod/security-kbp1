"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getRedirectResult, signInWithPopup, signInWithRedirect, signOut, type User } from "firebase/auth";
import { clientAuth, googleProvider } from "@/lib/firebase-client";
import { APP } from "@/lib/config";
import NeoLogo from "@/components/NeoLogo";

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
    const idToken = await user.getIdToken(true);
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
    // Hasil login redirect (HP)
    getRedirectResult(clientAuth())
      .then((r) => { if (r?.user) tukarSesi(r.user); })
      .catch((e) => setError(pesanFirebase(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function masuk() {
    setError("");
    try {
      if (isMobile()) {
        setLoading(true);
        await signInWithRedirect(clientAuth(), googleProvider());
      } else {
        const r = await signInWithPopup(clientAuth(), googleProvider());
        await tukarSesi(r.user);
      }
    } catch (e) {
      setError(pesanFirebase(e));
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-neo-black text-neo-silver">
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <NeoLogo size="lg" />
        <p className="mt-8 font-display text-xs uppercase tracking-[.35em] text-neo-silver/70">Security System</p>
        <h1 className="mt-2 text-center text-xl font-semibold text-white">{APP.nama}</h1>

        <div className="mt-10 w-full max-w-sm space-y-4">
          {inApp ? (
            <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-200">
              Login Google tidak didukung di browser bawaan aplikasi ini. <b>Buka lewat Chrome atau Safari.</b>
            </div>
          ) : (
            <button onClick={masuk} disabled={loading} className="btn btn-lg bg-white text-neo-black hover:bg-neo-mist">
              <GoogleIcon />
              {loading ? "Memproses..." : "Masuk dengan Google"}
            </button>
          )}
          {error && (
            <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>
          )}
          <p className="text-center text-xs text-neo-silver/60">
            Hanya untuk staf {APP.tempat} yang terdaftar.
          </p>
        </div>
      </div>
      <footer className="flex flex-col items-center gap-3 pb-6 text-center text-[10px] uppercase tracking-[.3em] text-neo-silver/40">
        <Link href="/tentang" className="rounded-full border border-white/15 px-4 py-2 text-neo-silver/70 hover:bg-white/10">Tentang sistem · boarding pass teknologi</Link>
        <span>{APP.tempat}</span>
      </footer>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-neo-black" />}>
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
