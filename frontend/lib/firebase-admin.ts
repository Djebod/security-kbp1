import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Rapikan FIREBASE_PRIVATE_KEY dari berbagai cara paste yang umum:
 * - terbungkus tanda kutip " atau '
 * - baris baru ditulis sebagai \n (sekali atau dua kali escape)
 * - akhiran baris Windows (\r\n)
 * - seluruh kunci di-base64 (tanpa teks BEGIN)
 */
export function rapikanPrivateKey(raw: string): string {
  let k = (raw || "").trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1).trim();
  if (!k.includes("-----BEGIN")) {
    try {
      const d = Buffer.from(k, "base64").toString("utf8");
      if (d.includes("-----BEGIN")) k = d;
    } catch { /* bukan base64 */ }
  }
  k = k.replace(/\\n/g, "\n").replace(/\n/g, "\n").replace(/\r/g, "").trim();
  return k + "\n";
}

/** Inisialisasi malas (lazy): baru dijalankan saat benar-benar dipakai, bukan saat build. */
function app(): App {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const raw = process.env.FIREBASE_PRIVATE_KEY || "";
  const privateKey = rapikanPrivateKey(raw);
  if (!projectId || !clientEmail || !raw) {
    throw new Error("FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY belum diisi di environment variable.");
  }
  try {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } catch (e) {
    // Diagnosa tanpa membocorkan isi kunci: hanya panjang & bentuknya.
    console.error(
      "FIREBASE_PRIVATE_KEY tidak bisa dibaca.",
      "panjang:", raw.length,
      "| diawali kutip:", /^["']/.test(raw.trim()),
      "| ada BEGIN:", raw.includes("-----BEGIN"),
      "| ada \n literal:", raw.includes("\n"),
      "| ada baris baru asli:", raw.includes("\n"),
    );
    throw e;
  }
}

export function adminAuth(): Auth { return getAuth(app()); }

/**
 * Firestore dipakai lewat REST (preferRest), bukan gRPC.
 * Di serverless (Vercel) ini memangkas waktu "cold start" cukup besar karena
 * tidak perlu membuka kanal gRPC saat permintaan pertama.
 * settings() hanya boleh dipanggil sekali sebelum query pertama → disimpan di global.
 */
const g = globalThis as unknown as { neoFirestore?: Firestore };
export function adminDb(): Firestore {
  if (g.neoFirestore) return g.neoFirestore;
  const db = getFirestore(app());
  try { db.settings({ preferRest: true }); } catch { /* sudah pernah di-set */ }
  g.neoFirestore = db;
  return db;
}
