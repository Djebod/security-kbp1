import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "./firebase-admin";
import { DEPT_BOLEH, ROLE_BEBAS, SUPER_ADMIN_DEFAULT } from "./config";

export const SESSION_COOKIE = "neo_session";
export const SESSION_HARI = 5;

export type StaffUser = {
  email: string;
  nama: string;
  dept: string;
  role: string;
  aktif: boolean;
};

export type Session = { email: string; nama: string; dept: string; role: string; isAdmin: boolean };

export function superAdminEmails(): string[] {
  const env = (process.env.SUPER_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set([...SUPER_ADMIN_DEFAULT.map((e) => e.toLowerCase()), ...env]));
}

/** Baca users/{email} dari Firestore */
export async function getStaff(email: string): Promise<StaffUser | null> {
  const snap = await adminDb().collection("users").doc(email.toLowerCase()).get();
  if (!snap.exists) return null;
  const d = snap.data() || {};
  return {
    email: email.toLowerCase(),
    nama: String(d.nama || d.name || ""),
    dept: String(d.dept || d.department || "").toUpperCase(),
    role: String(d.role || "STAFF").toUpperCase(),
    aktif: d.aktif === true || d.aktif === "true" || d.active === true,
  };
}

/** Aturan masuk sesuai blueprint. Mengembalikan pesan error (string) atau null jika boleh. */
export function cekBolehMasuk(email: string, staff: StaffUser | null): string | null {
  if (superAdminEmails().includes(email.toLowerCase())) return null;
  if (!staff) return "Akun Anda tidak terdaftar di sistem staff.";
  if (!staff.aktif) return "Akun Anda tidak aktif. Hubungi admin.";
  const deptOk = DEPT_BOLEH.includes(staff.dept);
  const roleOk = ROLE_BEBAS.includes(staff.role);
  if (!deptOk && !roleOk) return `Akses ditolak. Modul ini hanya untuk departemen ${DEPT_BOLEH.join(" / ")}.`;
  return null;
}

/** Verifikasi cookie sesi. Mengembalikan null jika tidak sah. */
export async function getSession(): Promise<Session | null> {
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    const email = (decoded.email || "").toLowerCase();
    if (!email) return null;
    const staff = await getStaff(email);
    const err = cekBolehMasuk(email, staff);
    if (err) return null;
    const isSuper = superAdminEmails().includes(email);
    return {
      email,
      nama: staff?.nama || decoded.name || email.split("@")[0],
      dept: staff?.dept || (isSuper ? "IT" : ""),
      role: isSuper ? "SUPERADMIN" : staff?.role || "STAFF",
      isAdmin: isSuper || ROLE_BEBAS.includes(staff?.role || ""),
    };
  } catch {
    return null;
  }
}

/** Dipakai di setiap halaman & server action: wajib login, kalau tidak → /login */
export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/login?reason=expired");
  return s;
}
