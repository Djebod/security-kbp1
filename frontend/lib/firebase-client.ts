"use client";
import { getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, type Auth } from "firebase/auth";

/** Inisialisasi malas: hanya saat dipakai di browser (bukan saat build) */
export function clientAuth(): Auth {
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
  return getAuth(app);
}

export function googleProvider(): GoogleAuthProvider {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: "select_account" });
  return p;
}
