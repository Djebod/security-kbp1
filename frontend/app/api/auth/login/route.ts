import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE, SESSION_HARI, cekBolehMasuk, getStaff } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Token kosong." }, { status: 400 });

    // Token baru saja diterbitkan Google beberapa detik lalu → cukup cek tanda tangan (tanpa cek revokasi).
    const decoded = await adminAuth().verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase();
    if (!email) return NextResponse.json({ error: "Email tidak ditemukan di akun Google." }, { status: 400 });

    // Baca data staf & buat cookie sesi berbarengan (hemat satu perjalanan ke server Firebase).
    // Cookie hanya DIPASANG bila lolos pemeriksaan di bawah.
    const expiresIn = SESSION_HARI * 24 * 60 * 60 * 1000;
    const [staff, sessionCookie] = await Promise.all([
      getStaff(email),
      adminAuth().createSessionCookie(idToken, { expiresIn }),
    ]);
    const err = cekBolehMasuk(email, staff);
    if (err) return NextResponse.json({ error: err }, { status: 403 });

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
