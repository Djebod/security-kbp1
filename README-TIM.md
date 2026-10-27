# Hotel Neo KBP — Security System

Aplikasi operasional Security **Hotel NEO KBP by ASTON**: Patroli (scan QR), Checklist aktivitas (foto), Lost & Found, dan Paket.
Dipakai dari HP (Android Chrome / iPhone Safari) dan laptop. Next.js 14 + Neon PostgreSQL + Firebase Auth + Google Drive, di-host di Vercel.

Repo: `https://github.com/Djebod/security-kbp1` · Folder kerja: `D:\security-apps` · Aplikasi: folder `frontend/`

## Daftar isi

1. [Tentang aplikasi](#1-tentang-aplikasi)
2. [Teknologi & struktur folder](#2-teknologi--struktur-folder)
3. [Tim & pembagian tugas (ringkasan)](#3-tim--pembagian-tugas-ringkasan)
4. [Tugas per anggota tim](#4-tugas-per-anggota-tim)
5. [Aturan bersama (wajib untuk semua)](#5-aturan-bersama-wajib-untuk-semua)
6. [Alur kerja tim di GitHub](#6-alur-kerja-tim-di-github)
7. [Siapkan laptop (semua anggota)](#7-siapkan-laptop-semua-anggota)
8. [Deploy ke Vercel (leader)](#8-deploy-ke-vercel-leader)
9. [Cetak QR & mengubah isian](#9-cetak-qr--mengubah-isian)
10. [Daftar cek sebelum rilis](#10-daftar-cek-sebelum-rilis)
11. [Update aplikasi & push (laptop Bang Syam)](#11-update-aplikasi--push-laptop-bang-syam)
12. [Kalau ada masalah](#12-kalau-ada-masalah)

---

## 1. Tentang aplikasi

| Modul | Halaman | Tabel | Fungsi |
|---|---|---|---|
| Patroli | `/security-log` | `security_log` | Scan QR titik patroli → tersimpan dengan jam server |
| Checklist | `/shift-report` | `checklist` | Aktivitas rutin (DAILY CLEANING wajib PIC + foto) |
| Lost & Found | `/lost-found` | `laporan_kehilangan` | Laporan barang hilang/ditemukan, ON PROGRESS → DONE |
| Paket | `/paket` | `paket_manajemen` | Terima paket → kirim WA → serahkan (status AMBIL) |

Halaman lain: Login (`/login`), Beranda (`/`, angka ringkas tiap modul), Tentang (`/tentang`).
Modul **Serah Terima Shift, Manajemen Kunci, Check List APAR** = rencana tahap 2 (lihat `PROJECT_BLUEPRINT.md` bagian 11). Jangan dikerjakan sebelum diminta leader.

## 2. Teknologi & struktur folder

| Bagian | Pilihan |
|---|---|
| Kerangka | Next.js 14 (App Router, server actions) + TypeScript |
| Tampilan | Tailwind CSS, tema gelap aksen neon (token `neo-*`), mobile-first |
| Database | PostgreSQL di **Neon**, library `pg` |
| Login | Firebase Authentication (Google) + session cookie; daftar staf di Firestore `users` |
| Foto | Google Drive lewat Apps Script; database hanya menyimpan link |
| Scan | `html5-qrcode` |
| Hosting | Vercel (Singapura), auto-deploy dari GitHub branch `main` |

```
security-apps/
├── CLAUDE.md               ← aturan utama (dibaca Claude Code & manusia)
├── PROJECT_BLUEPRINT.md    ← blueprint lengkap
├── README.md               ← file ini
├── docs/                   ← architecture, database, api, workflows, ai-engine
├── frontend/               ← aplikasi Next.js (root directory Vercel)
│   ├── app/login, app/tentang, app/api/auth   ← login, tentang, API sesi
│   ├── app/(app)/page.tsx                     ← Beranda
│   ├── app/(app)/security-log|shift-report|lost-found|paket  ← 4 modul
│   ├── components/         ← Scanner, PhotoInput, WhatsAppSend, AppShell, dll.
│   ├── lib/config.ts       ← ★ ISIAN (nama, aktivitas, PIC, departemen, admin)
│   ├── lib/                ← db, session, firebase, upload, validasi
│   └── scripts/run-sql.js  ← jalankan file SQL ke Neon
├── backend/apps-script/    ← Code.gs upload foto ke Google Drive
├── database/schema, seed, migrations/
└── tests/                  ← unit test (npm test)
```

Pola tiap modul: `actions.ts` (server action) → `page.tsx` (daftar, 30/halaman) → `baru/` (form) → `[id]/` (detail).

## 3. Tim & pembagian tugas (ringkasan)

Prinsip: **satu orang satu area**, supaya tidak saling timpa file. Kalau perlu menyentuh file milik orang lain, bilang dulu di grup.

| Nama | Peran | Area | File yang dipegang |
|---|---|---|---|
| **Syam Shugi Rakhmany** | Leader / arsitek | Keputusan desain, config, rahasia, deploy, review & merge | `CLAUDE.md`, `PROJECT_BLUEPRINT.md`, `lib/config.ts`, env Vercel |
| **Jordan Manuhutu** | Modul Patroli | Scan QR, titik patroli, daftar & detail patroli | `app/(app)/security-log/**`, `components/Scanner.tsx`, tabel `db_lokasi`, `security_log` |
| **Jordie Sean Fatahillah** | Modul Checklist + foto | Form checklist, PIC, upload foto ke Drive | `app/(app)/shift-report/**`, `components/PhotoInput.tsx`, `lib/upload*`, `backend/apps-script/Code.gs` |
| **Muhammad Bagja S** | Modul Lost & Found | Laporan, status DONE, kirim WA | `app/(app)/lost-found/**`, `components/WhatsAppSend.tsx`, `components/StatusBadge.tsx`, `lib/wa.ts` |
| **Rony Afriansyah** | Modul Paket + Beranda | Terima/serahkan paket, angka ringkas Beranda | `app/(app)/paket/**`, `app/(app)/page.tsx` |
| **Sakti Kusuma Bagus Prastya** | Login, sesi, database | Firebase Auth, Firestore users, session, skema & migrasi, unit test | `app/login/**`, `app/api/auth/**`, `lib/session.ts`, `lib/firebase-*.ts`, `lib/db.ts`, `lib/validate.ts`, `lib/id.ts`, `database/**`, `tests/**` |
| **Sen Yung** | UI/UX bersama, QA, dokumentasi | Layout, sidebar, nav bawah, halaman Tentang, uji HP, `docs/` | `components/AppShell.tsx`, `Sidebar.tsx`, `BottomNav.tsx`, `PageHeader.tsx`, `app/tentang/**`, `app/globals.css`, `tailwind.config.ts`, `docs/**` |

Komponen bersama (`ActionForm`, `DetailRow`, `Pagination`, `SearchFilter`, `EmptyState`, `FormError`, `Icon`) **tidak diubah sembarangan**: usulkan ke leader, lalu Sen Yung yang mengubah.

## 4. Tugas per anggota tim

Setiap bagian berisi: tanggung jawab, daftar tugas, cara uji, dan **"Selesai jika"**. Centang `[ ]` saat selesai lalu buat Pull Request (bagian 6).

### 4.1 Syam Shugi Rakhmany — Leader

**Tanggung jawab**: keputusan desain & prioritas, pemegang rahasia (env), deploy Vercel, review & merge semua Pull Request.

- [ ] Tambahkan 6 anggota sebagai **Collaborator** repo: GitHub → repo `security-kbp1` → Settings → Collaborators → Add people.
- [ ] Bagikan isi `.env.local` ke tiap anggota **secara pribadi** (bukan di grup, bukan di-commit).
- [ ] Tambahkan email Google tiap anggota ke Firestore `users` (`dept` = `SECURITY`, `role` = `ADMIN`, `aktif` = `true`) supaya bisa login di laptop masing-masing.
- [ ] Setel GitHub → Settings → Branches → **Branch protection** `main`: wajib lewat Pull Request, minimal 1 review.
- [ ] Review setiap PR: pastikan `npm run typecheck && npm run build` lolos dan Aturan bersama (bagian 5) dipatuhi, baru **Merge**.
- [ ] Jaga `lib/config.ts` dan `CLAUDE.md` tetap satu sumber kebenaran.
- [ ] Putuskan kapan modul tahap 2 (Shift / Kunci / APAR) mulai dikerjakan dan oleh siapa.

**Selesai jika**: semua anggota bisa login di laptop, PR pertama tiap anggota ter-merge, aplikasi di Vercel tetap jalan.

### 4.2 Jordan Manuhutu — Modul Patroli

**Tanggung jawab**: `app/(app)/security-log/**`, `components/Scanner.tsx`, tabel `db_lokasi` & `security_log`.

- [ ] Pelajari alur: scan QR → kode lokasi masuk input **read-only** → server cek ke `db_lokasi` → simpan dengan `SQL_TANGGAL`/`SQL_JAM`.
- [ ] Pastikan QR asing ditolak dengan pesan "Barcode tidak dikenali".
- [ ] Scanner: kamera belakang, flash, tetap jalan di Safari iPhone & Chrome Android.
- [ ] Daftar patroli: cari (`q`), filter (`f`), 30 data/halaman, urut terbaru.
- [ ] Siapkan daftar titik patroli nyata hotel bersama tim Security → tambahkan lewat SQL (bagian 9).
- [ ] Tahap 2 (bila diminta leader): rekap patroli per petugas/titik.

**Cara uji**: cetak 2 QR (`LOK-001` dan kode palsu), scan dari HP, cek jam tersimpan = jam dinding.
**Selesai jika**: daftar cek bagian 10 baris Patroli lolos, typecheck & build lolos.

### 4.3 Jordie Sean Fatahillah — Modul Checklist + foto

**Tanggung jawab**: `app/(app)/shift-report/**`, `components/PhotoInput.tsx`, helper upload (`simpanFoto`, `cekFoto`), `backend/apps-script/Code.gs`.

- [ ] Form checklist: aktivitas dari `AKTIVITAS`; **DAILY CLEANING wajib PIC + foto** (validasi di browser dan di server lewat `salahSatu` / `cekFoto`).
- [ ] PhotoInput: kompres foto di HP sebelum kirim (target < 300 KB), format jpeg/png/webp, maks 4 MB.
- [ ] Apps Script: foto masuk folder Drive, balikan URL; DB hanya simpan URL. Mode uji (`UPLOAD_URL` kosong) tetap jalan.
- [ ] Detail checklist menampilkan foto dari Drive.
- [ ] Tahap 2 (bila diminta leader): Check List APAR (pakai pola foto + 4 item OK/TIDAK).

**Cara uji**: simpan DAILY CLEANING tanpa PIC → ditolak; dengan foto → URL Drive tersimpan dan tampil di detail.
**Selesai jika**: baris Checklist & foto di bagian 10 lolos.

### 4.4 Muhammad Bagja S — Modul Lost & Found

**Tanggung jawab**: `app/(app)/lost-found/**`, `components/WhatsAppSend.tsx`, `components/StatusBadge.tsx`.

- [ ] Form laporan: posisi pelapor dari `POSISI_PELAPOR`, foto barang opsional, data pelapor.
- [ ] Proses selesai (`SelesaikanForm`): catatan wajib, status ON PROGRESS → DONE, **guard `IS DISTINCT FROM 'DONE'`** supaya tidak dua kali.
- [ ] WhatsAppSend: teks pesan rapi (nama barang, lokasi, tanggal), tombol besar, buka WA di HP.
- [ ] StatusBadge: warna hanya dari token `neo-*`, dipakai konsisten oleh Paket juga (koordinasi dengan Rony).
- [ ] Tahap 2 (bila diminta leader): tanda tangan digital L&F.

**Cara uji**: buat laporan → selesaikan → coba selesaikan lagi lewat URL yang sama → harus ditolak.
**Selesai jika**: baris Lost & Found di bagian 10 lolos.

### 4.5 Rony Afriansyah — Modul Paket + Beranda

**Tanggung jawab**: `app/(app)/paket/**`, `app/(app)/page.tsx` (Beranda).

- [ ] Alur paket: terima (foto paket) → kirim WA ke penerima → serahkan (`SerahkanForm`, nama pengambil + foto) → status AMBIL, **guard `IS DISTINCT FROM 'AMBIL'`**.
- [ ] Daftar paket: filter status (belum diambil / sudah), cari nama penerima/kamar.
- [ ] Beranda: angka ringkas tiap modul (patroli hari ini, checklist hari ini, L&F on progress, paket belum diambil) harus sama dengan jumlah di daftar masing-masing.
- [ ] Kartu modul di Beranda otomatis dari `MODUL` di `lib/config.ts`; jangan hardcode.
- [ ] Tahap 2 (bila diminta leader): Laporan Serah Terima Shift.

**Cara uji**: terima paket → serahkan → coba serahkan lagi → ditolak; angka Beranda berubah sesuai.
**Selesai jika**: baris Paket & Beranda di bagian 10 lolos.

### 4.6 Sakti Kusuma Bagus Prastya — Login, sesi, database

**Tanggung jawab**: `app/login/**`, `app/api/auth/**`, `lib/session*`, `lib/firebase*`, `lib/db.ts`, `database/**`, `tests/**`.

- [ ] Login Google di HP (redirect) & laptop (popup); `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = domain aplikasi.
- [ ] Session cookie httpOnly 5 hari; `requireSession()` dipakai semua halaman & action; nama/email selalu dari sesi.
- [ ] Hak akses: hanya `dept` SECURITY/HUMAN RESOURCES atau `role` ADMIN/SUPERADMIN atau `SUPER_ADMIN_EMAILS`; akun tidak terdaftar/nonaktif ditolak dengan pesan jelas.
- [ ] `lib/db.ts`: pool, SSL, `SQL_TANGGAL`/`SQL_JAM` (WIB). Cek tidak ada `CURRENT_DATE`/`new Date()` untuk data transaksi di seluruh kode (`grep`).
- [ ] Skema: setiap perubahan tabel = file baru di `database/migrations/YYYYMMDD_nama.sql` **dan** perbarui `schema.sql`.
- [ ] Unit test helper (`salahSatu`, `cekFoto`, `newId`, pembaca private key) lewat `npm test`.

**Cara uji**: login dengan akun di luar daftar → ditolak; logout → halaman modul redirect ke login; `npm test` hijau.
**Selesai jika**: baris Login di bagian 10 lolos, `npm test` lolos.

### 4.7 Sen Yung — UI/UX bersama, QA, dokumentasi

**Tanggung jawab**: `components/AppShell.tsx`, `Sidebar.tsx`, `BottomNav.tsx`, `PageHeader.tsx`, `app/tentang/**`, `app/globals.css`, `tailwind.config.ts`, `docs/**`.

- [ ] Layout: tampil rapi di HP 360–430 px dan laptop; tombol besar; label jelas; tanda `*` untuk wajib; tombol Simpan menampilkan "Menyimpan...".
- [ ] Warna hanya lewat token `neo-*`; tambah token baru hanya di `tailwind.config.ts`.
- [ ] Sidebar & nav bawah otomatis dari `MODUL`; halaman Tentang (tim, teknologi, animasi) jalan di Safari iPhone.
- [ ] **QA**: setiap PR anggota lain diuji di HP Android & iPhone sebelum leader merge; catat hasil di PR.
- [ ] Dokumentasi: `docs/*.md` selalu sesuai kode; perbarui bagian 12 README bila ada masalah baru dan solusinya.

**Cara uji**: buka semua halaman di 2 HP, screenshot ke grup kalau ada yang berantakan.
**Selesai jika**: baris Tampilan di bagian 10 lolos dan tiap PR punya catatan uji.

## 5. Aturan bersama (wajib untuk semua)

Ringkasan dari `CLAUDE.md` (sumber lengkap di sana). Pelanggaran = PR ditolak.

1. Semua tulis data lewat server action / API (`"use server"`), tidak pernah dari browser langsung ke DB.
2. Setiap halaman & action memanggil `requireSession()`; nama & email petugas dari sesi, bukan form.
3. Tanggal & jam dari server: `SQL_TANGGAL` / `SQL_JAM` di `lib/db.ts`. Dilarang `CURRENT_DATE`, `CURRENT_TIME`, `new Date()` untuk data transaksi.
4. Query selalu berparameter (`$1, $2`). Interpolasi hanya `SQL_TANGGAL`, `SQL_JAM`, dan angka LIMIT/OFFSET hasil parseInt.
5. Validasi ulang di server: field wajib, pilihan harus ada di config (`salahSatu`), foto lewat `cekFoto`.
6. Kode lokasi patroli hanya dari scan dan dicek ke `db_lokasi` di server.
7. Operasi satu arah pakai guard: paket `IS DISTINCT FROM 'AMBIL'`, L&F `IS DISTINCT FROM 'DONE'`.
8. Rahasia hanya di env; `.env.local` tidak pernah di-commit. Jangan tulis kredensial di kode/dokumen.
9. Foto lewat `simpanFoto()`; DB menyimpan URL.
10. Isian (nama, aktivitas, PIC, departemen, admin) hanya di `lib/config.ts`.
11. Sebelum PR: `npm run typecheck && npm run build` harus lolos (`npm test` bila menyentuh helper).
12. Komunikasi & UI dalam Bahasa Indonesia.

## 6. Alur kerja tim di GitHub

Anggota memakai **akun GitHub masing-masing** (sudah ditambahkan sebagai Collaborator oleh leader). Branch `main` hanya berubah lewat Pull Request yang di-merge leader. Vercel otomatis deploy `main`; branch lain mendapat **Preview URL** sendiri untuk uji di HP.

Nama branch: `<nama>/<tugas>` — contoh `jordan/patroli-scanner`, `rony/beranda-angka`.

**Sekali saja (ambil kode pertama kali):**
```
git clone https://github.com/Djebod/security-kbp1.git
cd security-kbp1
git config user.name "Nama Kamu"
git config user.email "email-github-kamu@gmail.com"
```

**Setiap mulai tugas baru:**
```
git checkout main
git pull
git checkout -b jordan/patroli-scanner
```

**Setiap selesai sebagian pekerjaan (boleh berkali-kali):**
```
cd frontend
npm run typecheck
npm run build
cd ..
git status
git add .
git commit -m "patroli: tolak QR asing dengan pesan jelas"
git push -u origin jordan/patroli-scanner
```

**Minta digabung:** buka GitHub → repo → tombol **Compare & pull request** → judul singkat, isi: apa yang diubah + cara uji + screenshot HP → **Create pull request**. Sen Yung uji di HP, leader review → **Merge** → Vercel deploy otomatis.

**Setelah PR di-merge:**
```
git checkout main
git pull
git branch -d jordan/patroli-scanner
```

Larangan: `git push --force` ke `main`, commit `.env.local`, mengubah file milik orang lain tanpa bilang.

## 7. Siapkan laptop (semua anggota)

Butuh **Node.js 18+** (https://nodejs.org, LTS) dan Git.

1. Clone repo (bagian 6), lalu:
   ```
   cd security-kbp1\frontend
   npm install
   copy .env.example .env.local
   ```
2. Buka `.env.local` dengan Notepad, isi semua nilai yang **diberikan leader secara pribadi** (`DATABASE_URL`, `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_*`, `UPLOAD_URL`, `UPLOAD_SECRET`, `SUPER_ADMIN_EMAILS`). Untuk laptop, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` isi `<project-id>.firebaseapp.com`.
3. Jalankan:
   ```
   npm run dev
   ```
4. Buka http://localhost:3000 → **Masuk dengan Google** dengan email yang sudah didaftarkan leader di Firestore `users`.
5. Tes unit (opsional): `npm test`.

Catatan: semua anggota memakai **database Neon yang sama** (data uji terlihat bersama). Jangan menjalankan `npm run db:schema` di database bersama tanpa izin leader; untuk eksperimen skema minta Sakti membuatkan branch database di Neon.

Rincian pembuatan akun Neon / Firebase / Apps Script dari nol (hanya leader) ada di `docs/architecture.md` dan riwayat README (`git show v1-klasik:README.md`).

## 8. Deploy ke Vercel (leader)

1. Vercel → login GitHub (**Djebod**) → **Add New → Project** → repo `security-kbp1` → **Root Directory = `frontend`**.
2. Environment Variables: semua nama di `.env.example`. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = domain aplikasi Vercel (supaya login redirect jalan di Safari/Chrome HP).
3. Firebase → Authentication → Settings → **Authorized domains** → tambahkan domain Vercel (produksi dan, bila perlu, preview).
4. Setiap merge ke `main` = deploy produksi otomatis; setiap push branch = Preview URL (muncul di PR).

## 9. Cetak QR & mengubah isian

**QR titik patroli** (Jordan): isi QR = `code_lokasi` di tabel `db_lokasi` (contoh `LOK-001`). Buat di generator QR mana pun (tipe Text), cetak, laminating, tempel. Tambah titik:
```sql
INSERT INTO db_lokasi (code_lokasi, nama_lokasi, location) VALUES ('LOK-011', 'Kolam Renang', 'Lantai 1');
```
Nonaktifkan tanpa hapus riwayat: `UPDATE db_lokasi SET aktif = false WHERE code_lokasi = 'LOK-011';`

**Isian aplikasi** (leader) di `frontend/lib/config.ts`: `APP`, `DEPT_BOLEH`, `ROLE_BEBAS`, `SUPER_ADMIN_DEFAULT`, `AKTIVITAS`, `AKTIVITAS_WAJIB_PIC`, `DAFTAR_PIC`, `POSISI_PELAPOR`, `MODUL`.

## 10. Daftar cek sebelum rilis

| # | Cek | Penanggung jawab |
|---|---|---|
| 1 | Login Google berhasil di HP (Chrome & Safari); akun tidak terdaftar / nonaktif / departemen lain ditolak dengan pesan jelas | Sakti |
| 2 | Scan QR tersimpan dengan jam = jam dinding (bukan selisih 7 jam); kode tidak bisa diketik manual; QR asing ditolak | Jordan |
| 3 | Foto dari HP tersimpan di Drive, tampil di detail, ukuran < 300 KB | Jordie |
| 4 | Checklist DAILY CLEANING menolak simpan tanpa PIC atau foto | Jordie |
| 5 | Lost & Found: ON PROGRESS → DONE dengan catatan; tidak bisa DONE dua kali; WA terbuka dengan teks rapi | Bagja |
| 6 | Paket: terima → WA → serahkan → status berubah; tidak bisa diserahkan dua kali | Rony |
| 7 | Angka di Beranda = jumlah di tiap daftar | Rony |
| 8 | Tampilan rapi di HP 360–430 px dan laptop; halaman Tentang jalan di Safari | Sen Yung |
| 9 | `npm run typecheck`, `npm run build`, `npm test` lolos di `main` | Leader |

## 11. Update aplikasi & push (laptop Bang Syam)

Laptop Bang Syam punya dua akun GitHub, jadi **cek akun dulu setiap kali** sebelum push.

### 🔍 Langkah 1 — Cek akun GitHub (wajib sebelum push)
```
cd D:\security-apps
git config user.name
git config user.email
git remote -v
```
✅ Harus: `Djebod` · `syam.rakhmany@gmail.com` · `https://Djebod@github.com/Djebod/security-kbp1.git`.
❌ Kalau beda:
```
git config user.name "Djebod"
git config user.email "syam.rakhmany@gmail.com"
git remote set-url origin https://Djebod@github.com/Djebod/security-kbp1.git
```

### 🚀 Langkah 2 — Simpan & kirim
```
git status
git add .
git commit -m "catatan perubahan"
git push
```
✅ Berhasil kalau muncul `main -> main`. Vercel deploy otomatis ±2 menit.

Anggota tim lain **tidak** memakai langkah ini; mereka mengikuti bagian 6 (branch + Pull Request).

## 12. Kalau ada masalah

| Gejala | Penyebab & solusi | Tanya ke |
|---|---|---|
| Login: `auth/unauthorized-domain` | Tambahkan domain di Firebase → Authentication → Settings → Authorized domains | Sakti / leader |
| Login di HP berputar terus / kembali ke login | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` harus = domain aplikasi, lalu Redeploy | Sakti |
| "Akun Anda tidak terdaftar di sistem staff." | Buat dokumen Firestore `users` dengan ID = email huruf kecil | Leader |
| "Akses ditolak. Modul ini hanya untuk departemen…" | `dept` harus `SECURITY`/`HUMAN RESOURCES` (huruf besar) atau `role` ADMIN/SUPERADMIN | Leader |
| Jam tersimpan selisih 7 jam | Ada query memakai `CURRENT_DATE`/`new Date()`; ganti ke `SQL_TANGGAL`/`SQL_JAM` | Sakti |
| Foto tidak muncul | `UPLOAD_URL` & `UPLOAD_SECRET` harus sama dengan Code.gs; Apps Script di-deploy "Anyone" | Jordie |
| Kamera tidak terbuka | Harus HTTPS dan izin kamera diberikan; tidak jalan di browser dalam Instagram/FB | Jordan |
| Build Vercel gagal "Couldn't find any pages" | Root Directory belum `frontend` | Leader |
| `FIREBASE_PRIVATE_KEY` error "Invalid PEM" | Salin ulang seluruh `private_key` termasuk `\n`; di `.env.local` bungkus kutip ganda | Sakti |
| Push ditolak 403 / `denied to ITM-achcc` | Git memakai akun salah; jalankan Langkah 1 bagian 11 (laptop Bang Syam) atau cek `git config user.name` (anggota) | Leader |
| Push ke `main` ditolak "protected branch" | Memang sengaja: buat branch + Pull Request (bagian 6) | Leader |
