# Hotel Neo KBP — Security System

Aplikasi web (HP & laptop) untuk tim Security **Hotel NEO KBP by ASTON** mencatat pekerjaan harian tanpa kertas (versi lomba: 4 modul):

| # | Modul | Alamat | Fungsi |
|---|---|---|---|
| 1 | Patroli | `/security-log` | Scan QR titik patroli → bukti petugas hadir di lokasi |
| 2 | Checklist | `/shift-report` | Aktivitas rutin + foto bukti (DAILY CLEANING wajib foto + PIC) |
| 3 | Lost & Found | `/lost-found` | Barang hilang / ditemukan sampai DONE |
| 4 | Paket | `/paket` | Terima paket → kirim WhatsApp → serahkan (foto pengambil) |

Halaman publik **`/tentang`** (tanpa login) menjelaskan fondasi, penanganan pengguna, database, dan metode yang dipakai — bergaya *boarding pass / papan keberangkatan* untuk dewan juri. Isinya diubah di `frontend/app/tentang/page.tsx` (bagian DATA HALAMAN).

Modul Laporan Shift, Manajemen Kunci, dan APAR dirancang di `PROJECT_BLUEPRINT.md` bagian 11 sebagai tahap berikutnya.

Prinsip: **cepat di HP** (tombol besar, kamera untuk scan & foto) dan **tidak bisa diakali** (jam dari server, nama dari akun login, lokasi hanya dari scan).

**Akun GitHub project ini: `Djebod` (syam.rakhmany@gmail.com)**

---

## Daftar isi

1. [Teknologi & struktur folder](#1-teknologi--struktur-folder)
2. [Siapkan database Neon](#2-siapkan-database-neon)
3. [Siapkan Firebase (login Google + daftar staf)](#3-siapkan-firebase-login-google--daftar-staf)
4. [Siapkan Google Drive untuk foto](#4-siapkan-google-drive-untuk-foto)
5. [Jalankan di laptop](#5-jalankan-di-laptop)
6. [Upload ke GitHub](#6-upload-ke-github)
7. [Deploy ke Vercel](#7-deploy-ke-vercel)
8. [Cetak QR titik patroli](#8-cetak-qr-titik-patroli)
9. [Mengubah isian (pos jaga, PIC, dll.)](#9-mengubah-isian-pos-jaga-pic-dll)
10. [Daftar cek sebelum dipakai tim](#10-daftar-cek-sebelum-dipakai-tim)
11. [Update aplikasi di kemudian hari](#11-update-aplikasi-di-kemudian-hari)
12. [Kalau ada masalah](#12-kalau-ada-masalah)

---

## 1. Teknologi & struktur folder

| Bagian | Pilihan |
|---|---|
| Kerangka | Next.js 14 (App Router, server actions) + TypeScript |
| Tampilan | Tailwind CSS — hitam + silver sesuai identitas Hotel NEO; font Inter (isi) & Michroma (judul) |
| Database | PostgreSQL di **Neon** (gratis), library `pg` |
| Login | Firebase Authentication (Google) + firebase-admin untuk session cookie & membaca daftar staf di Firestore |
| Foto | Google Drive lewat Apps Script; database hanya menyimpan link |
| Scan | `html5-qrcode` |
| Hosting | Vercel (region Singapura), auto-deploy dari GitHub |

```
hotel-neo-kbp/
├── CLAUDE.md               ← aturan utama untuk Claude Code
├── PROJECT_BLUEPRINT.md    ← blueprint lengkap (versi Hotel Neo KBP)
├── README.md               ← file ini
├── .env.example            ← contoh environment variable
├── push-aman.bat / .ps1    ← script cek akun + push ke GitHub
├── docs/                   ← architecture, database, api, workflows, ai-engine
├── frontend/               ← aplikasi Next.js (ini yang di-deploy ke Vercel)
│   ├── app/                ← halaman (login, beranda, 4 modul, API auth)
│   ├── components/         ← Scanner, PhotoInput, WhatsAppSend, layout, dll.
│   ├── lib/config.ts       ← ★ ISIAN: nama, pos jaga, aktivitas, PIC, dll.
│   ├── lib/                ← db, session, firebase, upload, validasi
│   └── scripts/run-sql.js  ← menjalankan file SQL ke Neon
├── backend/apps-script/    ← Code.gs untuk upload foto ke Google Drive
├── database/
│   ├── schema/schema.sql   ← 5 tabel
│   ├── seed/seed.sql       ← contoh titik patroli
│   └── migrations/         ← perubahan skema berikutnya
└── tests/                  ← unit test (node --test)
```

---

## 2. Siapkan database Neon

1. Buka https://neon.tech → **Sign up** (boleh pakai akun Google `syam.rakhmany@gmail.com`).
2. **Create project** → Name: `hotel-neo-kbp` → Region: **Singapore (ap-southeast-1)** → **Create**.
3. Di halaman project, klik **Connect** → pilih **Connection string** → centang **Pooled connection** → **Copy**.
   Hasilnya seperti `postgres://neondb_owner:xxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`.
   Ini nilai untuk **`DATABASE_URL`**. Simpan dulu di Notepad.
4. Tabel akan dibuat dari laptop pada langkah 5 (`npm run db:schema`).

---

## 3. Siapkan Firebase (login Google + daftar staf)

### 3a. Buat project
1. Buka https://console.firebase.google.com → login `syam.rakhmany@gmail.com`.
2. **Add project** → nama `hotel-neo-kbp` → Google Analytics boleh dimatikan → **Create project**.

### 3b. Aktifkan login Google
1. Menu kiri **Build → Authentication → Get started**.
2. Tab **Sign-in method** → **Google** → **Enable** → pilih email support → **Save**.

### 3c. Buat Firestore (untuk daftar staf)
1. **Build → Firestore Database → Create database**.
2. Lokasi `asia-southeast2 (Jakarta)` → **Production mode** → **Create**.
3. Tab **Rules**, ganti isinya dengan ini lalu **Publish** (hanya server yang membaca, browser tidak boleh):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if false; }
     }
   }
   ```
4. Tab **Data** → **Start collection** → Collection ID: `users` → Next.
5. **Document ID** = email staf **huruf kecil** (contoh `andi@hotelneo.com`), lalu isi field:

   | Field | Type | Contoh |
   |---|---|---|
   | `nama` | string | `Andi Saputra` |
   | `dept` | string | `SECURITY` |
   | `role` | string | `STAFF` (atau `ADMIN` / `SUPERADMIN`) |
   | `aktif` | boolean | `true` |

6. Ulangi untuk semua anggota Security dan HR. Email harus email Google yang mereka pakai untuk login.
   - Yang boleh masuk: `dept` = `SECURITY` atau `HUMAN RESOURCES`, **atau** `role` = `ADMIN` / `SUPERADMIN`.
   - **System admin** (selalu bisa masuk tanpa perlu dokumen di `users`, diatur lewat env `SUPER_ADMIN_EMAILS`): `syam.rakhmany@gmail.com`, `nikolas.k@sentineltech.com`, `yuda.d@sentineltech.com`, `esar.a@archipelagohotels.com`, `rayhan.f@archiprlagohotels.com`. Cukup login Google dengan email itu.
   - Menonaktifkan staf: ubah `aktif` jadi `false`.

### 3d. Ambil config untuk browser (NEXT_PUBLIC_…)
1. ⚙️ **Project settings** → **Your apps** → ikon **</>** (Web) → nama `web` → **Register app**.
2. Salin nilai `apiKey`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` ke Notepad.
   (`authDomain` nanti diisi **domain aplikasi sendiri**, lihat langkah 7.)

### 3e. Ambil kunci server (firebase-admin)
1. ⚙️ **Project settings** → tab **Service accounts** → **Generate new private key** → **Generate key**. File JSON terunduh.
2. Buka file JSON itu dengan Notepad. Yang dipakai:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (salin **seluruh** isinya termasuk `-----BEGIN PRIVATE KEY-----` dan tanda `\n`, bungkus dengan tanda kutip ganda)
3. **Jangan** simpan file JSON ini di dalam folder project. Simpan di tempat aman lain.

---

## 4. Siapkan Google Drive untuk foto

1. Buka https://drive.google.com → **New → Folder** → nama `Foto-Security-NeoKBP`.
2. Buka folder itu, salin **ID folder** dari alamat browser (bagian setelah `/folders/`).
3. Buka https://script.google.com → **New project** → hapus isi editor → tempel isi file `backend/apps-script/Code.gs`.
4. Ganti `PASTE_ID_FOLDER_DRIVE_DISINI` dengan ID folder, dan `ganti-dengan-kata-rahasia` dengan kata rahasia bebas (catat, nanti jadi `UPLOAD_SECRET`).
5. **Deploy → New deployment** → ⚙️ pilih **Web app** → Execute as: **Me** → Who has access: **Anyone** → **Deploy** → **Authorize access** (pilih akun, Advanced → Go to … → Allow).
6. Salin **Web app URL** (diakhiri `/exec`) → ini nilai **`UPLOAD_URL`**.

> Kalau `UPLOAD_URL` dikosongkan, foto tetap tersimpan (sebagai teks data URL di database). Cocok untuk uji coba, tapi untuk pemakaian harian pakai Drive.

---

## 5. Jalankan di laptop

Butuh **Node.js 18 atau lebih baru** (https://nodejs.org, pilih LTS).

1. Ekstrak ZIP ke `D:\Project\hotel-neo-kbp`.
2. Buka terminal (PowerShell) di folder `frontend`:
   ```
   cd D:\Project\hotel-neo-kbp\frontend
   ```
3. Pasang dependensi (sekali saja, ±1 menit):
   ```
   npm install
   ```
4. Salin contoh env menjadi file rahasia:
   ```
   copy .env.example .env.local
   ```
5. Buka `.env.local` dengan Notepad, isi semua nilai dari langkah 2–4. Untuk uji di laptop, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` isi dengan `<project-id>.firebaseapp.com` dulu.
6. Buat tabel & data awal di Neon:
   ```
   npm run db:schema
   npm run db:seed
   ```
   ✅ Benar kalau muncul `Selesai menjalankan ...`.
7. Jalankan:
   ```
   npm run dev
   ```
8. Buka http://localhost:3000 → klik **Masuk dengan Google** → pakai email yang sudah ada di Firestore `users`.
   - Di Firebase → **Authentication → Settings → Authorized domains** pastikan `localhost` ada (bawaan sudah ada).
9. Tes unit (opsional): `npm test`.

---

## 6. Upload ke GitHub

### 🔍 Langkah 1 — Cek / atur akun GitHub (wajib sebelum push)

Project ini memakai akun **`Djebod`** (`syam.rakhmany@gmail.com`). Laptop Bang Syam punya dua akun, jadi atur **per project** (tanpa `--global`).

1. Buat repo kosong di GitHub, login sebagai **Djebod**: https://github.com/new → Repository name `hotel-neo-kbp` → **Private** → jangan centang "Add a README" → **Create repository**.
2. Di terminal, dari **root project** (bukan folder frontend):
   ```
   cd D:\Project\hotel-neo-kbp
   git init
   git config user.name "Djebod"
   git config user.email "syam.rakhmany@gmail.com"
   git branch -M main
   git remote add origin https://Djebod@github.com/Djebod/security-kbp1.git
   ```
3. Cek ulang:
   ```
   git config user.name
   git config user.email
   git remote -v
   ```
   ✅ Hasil yang BENAR:
   - `user.name` → `Djebod`
   - `user.email` → `syam.rakhmany@gmail.com`
   - `git remote -v` → `https://Djebod@github.com/Djebod/security-kbp1.git`

   ❌ Kalau berbeda, ulangi perintah `git config` / `git remote set-url origin https://Djebod@github.com/Djebod/security-kbp1.git` sampai benar.

### 🚀 Langkah 2 — Simpan & kirim ke GitHub

Pastikan tidak ada file rahasia yang ikut (`.env.local` dan `node_modules` sudah dikecualikan oleh `.gitignore`):
```
git status
```
Lalu:
```
git add .
git commit -m "commit pertama: aplikasi Security Hotel Neo KBP (4 modul)"
git push -u origin main
```
Kalau browser terbuka minta login, login dengan akun **Djebod**. ✅ Berhasil kalau muncul `main -> main`.

> Bonus: klik dua kali `push-aman.bat` di root project — script ini mengecek akun lalu menjalankan add/commit/push untukmu.

---

## 7. Deploy ke Vercel

1. Buka https://vercel.com → login dengan GitHub (**Djebod**).
2. **Add New… → Project** → pilih repo `hotel-neo-kbp` → **Import**.
3. **PENTING — Root Directory**: klik **Edit** → pilih folder **`frontend`** → Continue. (Tanpa ini Vercel tidak menemukan aplikasinya.)
4. Framework Preset otomatis **Next.js**.
5. Bagian **Environment Variables**, isi satu per satu (nama persis seperti di `.env.example`):

   | Nama | Isi |
   |---|---|
   | `DATABASE_URL` | dari Neon |
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | dari Firebase web config |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | **`hotel-neo-kbp.vercel.app`** (domain aplikasi sendiri — lihat catatan) |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | project id Firebase |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | dari web config |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | dari web config |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | dari web config |
   | `FIREBASE_PROJECT_ID` | dari file service account |
   | `FIREBASE_CLIENT_EMAIL` | dari file service account |
   | `FIREBASE_PRIVATE_KEY` | dari file service account (tempel apa adanya, Vercel menerima baris baru) |
   | `UPLOAD_URL` | Web app URL Apps Script |
   | `UPLOAD_SECRET` | kata rahasia yang sama dengan di Code.gs |
   | `SUPER_ADMIN_EMAILS` | salin dari `.env.example` (5 email system admin, dipisah koma) |

6. **Deploy** → tunggu ±2 menit → dapat link `https://hotel-neo-kbp.vercel.app` (nama bisa berbeda kalau sudah dipakai orang; sesuaikan `AUTH_DOMAIN` dengan nama sebenarnya).
7. **Daftarkan domain di Firebase**: Firebase → **Authentication → Settings → Authorized domains → Add domain** → `hotel-neo-kbp.vercel.app`. Tanpa ini login Google ditolak.
8. Uji dari **HP Android (Chrome)** dan **iPhone (Safari)**: login, scan QR, ambil foto, kirim WA.

**Catatan login di HP** — kenapa `AUTH_DOMAIN` diisi domain aplikasi sendiri: `next.config.mjs` sudah meneruskan `/__/auth/*` ke Firebase. Dengan domain sendiri, login Google (redirect) tetap jalan di Safari/Chrome HP yang memblokir cookie pihak ketiga.

**Domain sendiri (opsional)**: Vercel → Project → **Settings → Domains → Add** → ikuti instruksi DNS → lalu ubah `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` ke domain itu dan tambahkan juga di Authorized domains Firebase → **Redeploy**.

---

## 8. Cetak QR titik patroli

Isi QR = `code_lokasi` di tabel `db_lokasi` (contoh `LOK-001`), dipakai oleh Patroli dan Checklist.

Cara membuat QR: buka https://www.qr-code-generator.com (atau generator QR lain), pilih **Text**, ketik kodenya (mis. `LOK-001`), unduh PNG, cetak, laminating, tempel di lokasi. Satu kode untuk satu titik.

Menambah titik baru: Neon → **SQL Editor**:
```sql
INSERT INTO db_lokasi (code_lokasi, nama_lokasi, location) VALUES ('LOK-011', 'Kolam Renang', 'Lantai 1');
```
Menonaktifkan tanpa menghapus riwayat: `UPDATE db_lokasi SET aktif = false WHERE code_lokasi = 'LOK-011';`

---

## 9. Mengubah isian (pos jaga, PIC, dll.)

Semua ada di **`frontend/lib/config.ts`**:

- `APP.nama`, `APP.tempat` — nama aplikasi & tempat
- `DEPT_BOLEH`, `ROLE_BEBAS` — siapa yang boleh masuk
- `SUPER_ADMIN_DEFAULT` — cadangan daftar system admin (utamanya tetap env `SUPER_ADMIN_EMAILS`)
- `AKTIVITAS`, `AKTIVITAS_WAJIB_PIC`, `DAFTAR_PIC` — jenis aktivitas & nama tim Housekeeping
- `POSISI_PELAPOR` — pilihan posisi pelapor Lost & Found

Setelah mengubah, lakukan langkah di bagian 11.

---

## 10. Daftar cek sebelum dipakai tim

- [ ] Login Google berhasil di HP (Chrome & Safari); akun tidak terdaftar / tidak aktif / departemen lain ditolak dengan pesan jelas.
- [ ] Scan QR titik patroli tersimpan dengan jam yang sama dengan jam dinding (bukan selisih 7 jam).
- [ ] Kode lokasi tidak bisa diketik manual; QR asing ditolak ("Barcode tidak dikenali").
- [ ] Foto dari HP tersimpan di Drive dan tampil di halaman detail; ukuran kecil (< 300 KB).
- [ ] Checklist DAILY CLEANING menolak simpan tanpa PIC atau foto.
- [ ] Paket: terima → kirim WA → serahkan → status berubah; tidak bisa diserahkan dua kali.
- [ ] Lost & Found: ON PROGRESS → DONE dengan catatan.
- [ ] Angka di Beranda sesuai jumlah di tiap daftar.
- [ ] Tampilan rapi di HP (360–430 px) dan laptop.

---

## 11. Update aplikasi di kemudian hari

Setiap kali ada perubahan kode:

### 🔍 Langkah 1 — Cek akun GitHub (wajib sebelum push)
```
cd D:\Project\hotel-neo-kbp
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
Ganti `catatan perubahan` dengan ringkasan nyata, mis. `"tambah pos jaga Belakang"`. Vercel otomatis deploy ±1–2 menit setelah push.

Kalau mengubah **Apps Script**: Deploy → Manage deployments → ✏️ → Version: **New version** → Deploy (URL tetap sama).

---

## 12. Kalau ada masalah

| Gejala | Penyebab & solusi |
|---|---|
| Login: "Domain ini belum didaftarkan" / `auth/unauthorized-domain` | Tambahkan domain Vercel di Firebase → Authentication → Settings → Authorized domains |
| Login di HP berputar terus / kembali ke login | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` harus = domain aplikasi (`hotel-neo-kbp.vercel.app`), lalu Redeploy |
| "Akun Anda tidak terdaftar di sistem staff." | Buat dokumen di Firestore `users` dengan ID = email huruf kecil |
| "Akses ditolak. Modul ini hanya untuk departemen…" | Field `dept` harus `SECURITY`/`HUMAN RESOURCES` (huruf besar) atau `role` ADMIN/SUPERADMIN |
| Jam tersimpan selisih 7 jam | Pastikan tidak ada query memakai `CURRENT_DATE`; semua lewat `SQL_TANGGAL`/`SQL_JAM` di `lib/db.ts` |
| Foto tidak muncul | Cek `UPLOAD_URL` & `UPLOAD_SECRET` sama dengan Code.gs; Apps Script di-deploy "Anyone" |
| Kamera tidak terbuka | Harus HTTPS (Vercel sudah) dan izin kamera diberikan di browser; tidak jalan di browser dalam Instagram/FB |
| Build Vercel gagal "Couldn't find any pages" | Root Directory belum di-set ke `frontend` |
| `FIREBASE_PRIVATE_KEY` error "Invalid PEM" | Salin ulang seluruh `private_key` termasuk `\n`; di `.env.local` bungkus dengan kutip ganda |
| Push ditolak 403 / `denied to ITM-achcc` | Git memakai akun yang salah — jalankan Langkah 1 bagian 11 |
