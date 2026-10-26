# Arsitektur

```
 HP / Laptop (browser)
   │  Next.js App Router (Vercel, region sin1)
   │  ├─ Halaman (server components)  ── requireSession() ──┐
   │  ├─ Server actions ("use server") ── requireSession() ──┤── Firestore users/{email} (via firebase-admin)
   │  └─ /api/auth/login, /api/auth/logout                   │
   │                                                          ▼
   │                                       Neon PostgreSQL (pg pool, maks 5, SSL)
   │
   ├─ Login Google: Firebase Auth (client SDK) → idToken → /api/auth/login → verifikasi + cek users → session cookie
   └─ Foto: PhotoInput (data URL) → server action → simpanFoto() → Apps Script → Google Drive → URL disimpan di DB
```

## Lapisan
| Lapisan | File | Catatan |
|---|---|---|
| Konfigurasi isian | `lib/config.ts` | Satu sumber untuk nama, daftar, menu |
| Sesi | `lib/session.ts`, `middleware.ts` | Middleware hanya cek ada cookie; verifikasi penuh di `requireSession()` |
| DB | `lib/db.ts` | Pool, `query`, `queryOne`, `SQL_TANGGAL`, `SQL_JAM`, format tanggal Indonesia |
| Upload | `lib/upload.ts` | `cekFoto` (validasi), `simpanFoto` (Drive) |
| Validasi | `lib/validate.ts` | `str`, `wajib`, `salahSatu`, `tanggalValid`, `FormState` |
| UI | `components/` | AppShell (Sidebar + BottomNav), Scanner, PhotoInput, WhatsAppSend, SearchFilter, Pagination, StatusBadge, DetailRow, ActionForm |
| Modul | `app/(app)/<modul>/` | `actions.ts` + `page.tsx` + `baru/` + `[id]/` |

## Alur login
1. `/login` (client): `signInWithRedirect` di HP / `signInWithPopup` di laptop.
2. Dapat `idToken` → `POST /api/auth/login`.
3. Server: `verifyIdToken` → baca `users/{email}` → `cekBolehMasuk()` → `createSessionCookie` (5 hari) → set cookie `neo_session` (httpOnly, sameSite lax).
4. `middleware.ts` mengalihkan ke `/login` bila cookie tidak ada; `app/(app)/layout.tsx` memanggil `requireSession()` (verifikasi cookie + cek users lagi) di setiap render.
5. Logout: `POST /api/auth/logout` menghapus cookie.

`next.config.mjs` meneruskan `/__/auth/*` ke `<project-id>.firebaseapp.com` supaya `AUTH_DOMAIN` bisa diisi domain aplikasi sendiri (login redirect di Safari/Chrome HP).

## Waktu server
Database Neon berjalan di UTC. Semua tanggal/jam transaksi memakai `(now() AT TIME ZONE 'Asia/Jakarta')::date` dan `::time(0)` yang disisipkan dari `lib/db.ts`. Jam HP tidak pernah dipakai.

## Keputusan desain
- Tema hitam + silver mengikuti logo HOTEL NEO by ASTON; logo dirender sebagai tipografi (`NeoLogo`), bukan gambar, agar tajam di semua ukuran.
- Font Google dimuat lewat `<link>` (bukan `next/font`) supaya build tidak bergantung jaringan.
- Firebase (client & admin) diinisialisasi malas (lazy) agar `next build` tidak membutuhkan kredensial.
- Nav bawah HP memuat Beranda + 4 modul; tombol Keluar di kartu sapaan Beranda (HP) dan di sidebar (laptop).
