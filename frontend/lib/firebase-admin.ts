import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/** Inisialisasi malas (lazy): baru dijalankan saat benar-benar dipakai, bukan saat build. */
function app(): App {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY belum diisi di environment variable.");
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
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
