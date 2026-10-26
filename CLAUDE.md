# CLAUDE.md — Aturan utama untuk Claude Code

Project: **Hotel Neo KBP — Security System** (Next.js 14 + Neon PostgreSQL + Firebase Auth + Google Drive).
Pemilik: Bang Syam. Bahasa komunikasi & UI: **Bahasa Indonesia**. Perlakukan pemilik sebagai pemula: satu langkah satu perintah.

## Peta cepat
- Aplikasi ada di `frontend/` (root directory Vercel = `frontend`).
- ISIAN (nama, aktivitas, PIC, departemen, system admin) hanya di `frontend/lib/config.ts`.
- Versi saat ini: **4 modul** (Patroli, Checklist, Lost & Found, Paket). Modul Shift/Kunci/APAR = rencana (lihat PROJECT_BLUEPRINT.md bagian 11); jangan ditambahkan tanpa diminta.
- Skema DB: `database/schema/schema.sql`; perubahan skema berikutnya → file baru di `database/migrations/`.
- Dokumen rinci: `PROJECT_BLUEPRINT.md`, `docs/*.md`.

## Aturan yang TIDAK boleh dilanggar
1. **Semua tulis data lewat server action / API** (`"use server"`), tidak pernah dari browser langsung ke DB.
2. **Sesi diperiksa di setiap halaman & action** lewat `requireSession()`; nama & email petugas selalu dari sesi, bukan dari form.
3. **Tanggal & jam dari server**: pakai `SQL_TANGGAL` / `SQL_JAM` dari `lib/db.ts`. Dilarang `CURRENT_DATE`, `CURRENT_TIME`, `new Date()` untuk data transaksi.
4. **Query selalu berparameter** (`$1, $2`). Satu-satunya interpolasi yang diizinkan: `SQL_TANGGAL`, `SQL_JAM`, dan angka LIMIT/OFFSET hasil parseInt.
5. **Validasi ulang di server**: field wajib, pilihan harus ada di daftar config (`salahSatu`), foto lewat `cekFoto` (prefix `data:image/jpeg|png|webp;base64,`, maks 4 MB).
6. Kode lokasi patroli **hanya dari scan** (input read-only) dan dicek ke `db_lokasi` di server.
7. Operasi satu arah pakai guard: paket `WHERE status IS DISTINCT FROM 'AMBIL'`, L&F `IS DISTINCT FROM 'DONE'`.
8. Rahasia hanya di environment variable; `.env.local` tidak pernah di-commit. Jangan tulis kredensial di kode atau dokumentasi.
9. Foto → `simpanFoto()` (Drive via Apps Script); DB menyimpan URL. Jangan simpan data URL ke DB kecuali `UPLOAD_URL` kosong (mode uji).
10. UI: mobile-first, tombol besar, label jelas, tanda `*` untuk wajib, tombol Simpan menampilkan "Menyimpan...". Warna hanya dari token `neo-*` di `tailwind.config.ts`.

## Pola yang dipakai
- Halaman daftar: server component, `searchParams` (`q`, `f`, `page`), 30 data/halaman, `SearchFilter` + `Pagination`.
- Form: `ActionForm` (useFormState) → action `(prev, fd) => FormState` → `redirect()` ke detail saat sukses, `{ error }` saat gagal.
- Komponen bersama: `Scanner`, `PhotoInput`, `WhatsAppSend`, `StatusBadge`, `DetailRow`.
- ID = 8 hex (`newId()`).

## Menambah modul baru (urutan)
1. Tabel di `database/migrations/YYYYMMDD_nama.sql` (+ update `schema.sql`).
2. `app/(app)/<modul>/actions.ts` → `page.tsx` (daftar) → `baru/` → `[id]/`.
3. Tambahkan ke `MODUL` di `lib/config.ts` (otomatis masuk sidebar, nav bawah, Beranda).
4. Tambah angka ringkas di `app/(app)/page.tsx` bila perlu.
5. `npm run typecheck && npm run build` harus lolos. `npm test` untuk helper.

## Setelah setiap perubahan
Selalu sertakan untuk pemilik: Blok Cek Akun GitHub (**Djebod** / `syam.rakhmany@gmail.com` / `https://Djebod@github.com/Djebod/security-kbp1.git`) lalu `git add .` → `git commit -m "catatan perubahan"` → `git push`. Lihat README bagian 11.
