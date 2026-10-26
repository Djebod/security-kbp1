import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE, SESSION_HARI, cekBolehMasuk, getStaff } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Token kosong." }, { status: 400 });

    const decoded = await adminAuth().verifyIdToken(idToken, true);
    const email = (decoded.email || "").toLowerCase();
    if (!email) return NextResponse.json({ error: "Email tidak ditemukan di akun Google." }, { status: 400 });

    const staff = await getStaff(email);
    const err = cekBolehMasuk(email, staff);
    if (err) return NextResponse.json({ error: err }, { status: 403 });

    const expiresIn = SESSION_HARI * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });
    cookies().set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });
    return NextResponse.json({ ok: true, nama: staff?.nama || decoded.name || "" });
  } catch (e) {
    console.error("login error", e);
    return NextResponse.json({ error: "Login gagal. Coba lagi." }, { status: 401 });
  }
}
