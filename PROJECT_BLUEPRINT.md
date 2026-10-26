# PROJECT BLUEPRINT — Hotel Neo KBP Security System

Versi khusus Hotel NEO KBP by ASTON, diturunkan dari "Blueprint General Aplikasi Operasional Security". **Versi lomba: 4 modul** (Patroli, Checklist, Lost & Found, Paket). Modul Laporan Shift, Kunci, dan APAR dipindah ke bagian 11 (rencana) agar tim fokus pada satu cerita yang utuh.

## 0. Isian (sudah diisi)

| Isian | Nilai |
|---|---|
| Nama aplikasi | **Hotel Neo KBP** (pendek: NEO KBP) |
| Nama tempat | Hotel NEO KBP by ASTON |
| Zona waktu | Asia/Jakarta (WIB) |
| Bahasa tampilan | Bahasa Indonesia |
| Departemen yang boleh masuk | SECURITY, HUMAN RESOURCES |
| Jabatan yang boleh semua | ADMIN, SUPERADMIN (+ system admin via env `SUPER_ADMIN_EMAILS`: Syam, Niko, Yuda, Esar, Rayhan) |
| Jenis aktivitas checklist | DAILY CLEANING, REGULAR ACTIVITY, OTHER ACTIVITY |
| Wajib foto + PIC | DAILY CLEANING (PIC dari tim Housekeeping) |
| Daftar PIC | Andi, Budi, Sari, Dewi, Rudi (ubah di `lib/config.ts`) |
| Warna | Hitam `#0a0a0a`, silver `#b9bcc2`, latar `#f3f4f6` — mengikuti logo HOTEL NEO by ASTON |
| Font | Inter (isi), Michroma (judul, geometris seperti wordmark NEO) |
| Modul | 4: Patroli, Checklist, Lost & Found, Paket |
| Database | Neon PostgreSQL |
| Foto | Google Drive via Apps Script (DB simpan link) |
| Repo | GitHub `Djebod/hotel-neo-kbp` (Private) → Vercel, root `frontend` |

## 1. Tujuan
Aplikasi web HP/laptop untuk tim Security mencatat pekerjaan harian tanpa kertas. Prinsip: cepat di HP; tidak bisa diakali (jam server, nama dari sesi, lokasi hanya dari scan).

## 2. Pengguna & hak akses
- Login Google (Firebase Auth). Daftar staf di Firestore `users/{email-huruf-kecil}`: `{ nama, dept, role, aktif }`.
- Ditolak: tidak terdaftar → "Akun Anda tidak terdaftar di sistem staff."; `aktif` ≠ true → "Akun Anda tidak aktif. Hubungi admin."; dept tidak boleh & role bukan ADMIN/SUPERADMIN → "Akses ditolak. Modul ini hanya untuk departemen SECURITY / HUMAN RESOURCES."
- Lolos → session cookie `neo_session` (httpOnly, 5 hari). Setiap halaman & action memanggil `requireSession()`; gagal → `/login?reason=expired`.
- HP: `signInWithRedirect`; laptop: popup. Browser dalam Instagram/Facebook/Line → pesan "Buka lewat Chrome atau Safari."

## 3. Halaman
| Alamat | Isi |
|---|---|
| `/login` | Logo NEO, tombol Masuk dengan Google, pesan error ramah, tautan ke /tentang |
| `/tentang` | Publik (tanpa login): penjelasan teknologi bergaya travel information untuk juri |
| `/` | Beranda: sapaan + nama depan, tanggal, 3 angka ringkas (patroli hari ini, paket belum diambil, L&F on progress), kartu 4 modul |
| `/security-log`, `/baru` | Patroli |
| `/shift-report`, `/baru`, `/[id]` | Checklist |
| `/lost-found`, `/baru`, `/[id]` | Lost & Found |
| `/paket`, `/baru`, `/[id]` | Paket |

Layout: laptop = sidebar kiri hitam (logo, menu, nama & dept, Keluar); HP = nav bawah (Beranda, Patroli, Checklist, L&F, Paket). Daftar: cari, saring chip, 30/halaman, tombol + Baru. Form: label jelas, `*` wajib, Simpan besar, "Menyimpan...".

## 4. Modul

### Modul 1 — Patroli (`security_log`)
QR berisi `code_lokasi` (`LOK-001`) ditempel di titik. Petugas Scan → server `cekLokasi()` → kotak hijau "Lokasi: …" / merah "Barcode tidak dikenali" → Simpan (aktif hanya bila cocok). Input kode read-only. Server cek ulang ke `db_lokasi`. Daftar dikelompokkan per hari (jumlah scan), ketuk hari → rincian jam/lokasi/petugas; cari & saring tanggal; 31 hari/halaman.

### Modul 2 — Checklist (`checklist`)
Aktivitas* (radio), lokasi* (dari `db_lokasi`), foto (opsional), keterangan. DAILY CLEANING: PIC wajib (chip nama), foto wajib dengan label "Foto Hasil Cleaning"; server menolak bila kosong. Daftar (cari, saring aktivitas, thumbnail) + detail dengan foto.

### Modul 3 — Lost & Found (`laporan_kehilangan`)
Jenis* (dua tombol KEHILANGAN/PENEMUAN), nama barang*, deskripsi*, tanggal kejadian*, jam, tempat*, foto, pelapor (nama*, posisi, no. identitas, alamat). Status ON PROGRESS → tombol Selesaikan + catatan → DONE (tanggal/jam/oleh tercatat). Daftar: cari, saring status & jenis.

### Modul 4 — Paket (`paket_manajemen`)
Terima: pengirim*, resi* (scan/ketik/"Paket tanpa resi" → `TANPA RESI`), penerima*, foto paket* → status TERIMA → ke detail. Detail: data + foto; belum diambil → foto pengambil* → Serahkan → AMBIL (tanggal, jam, security pemberi), guard `status IS DISTINCT FROM 'AMBIL'`. Kirim WhatsApp: normalisasi nomor (`0812…`, `812…`, `62812…`, `+62 812-…`), buka `wa.me` dengan template pesan (lihat `app/(app)/paket/[id]/page.tsx`). Daftar: Semua / Belum diambil / Sudah diambil + jumlah.

## 5. Komponen bersama
`Scanner` (html5-qrcode, kamera belakang, 10 fps, flash bila didukung, tutup) · `PhotoInput` (`capture="environment"`, perkecil 1024 px, JPEG 0.7, pratinjau + ulang, kirim data URL) · `WhatsAppSend` · waktu server `SQL_TANGGAL`/`SQL_JAM` di `lib/db.ts`.

## 6. Database
Lihat `database/schema/schema.sql` (5 tabel + index) dan `docs/database.md`. ID = 8 hex acak. Foto = URL Drive (atau data URL saat `UPLOAD_URL` kosong).

## 7. Aturan keamanan & kualitas
Sama dengan blueprint general (semua simpan lewat server, sesi dicek, validasi ulang, foto dicek, waktu server, query berparameter, guard status, rahasia di env). Ditambah: Firestore rules tutup total untuk browser (hanya firebase-admin yang membaca `users`); super admin lewat `SUPER_ADMIN_EMAILS`; Apps Script memeriksa `UPLOAD_SECRET`.

## 8. Teknologi
Next.js 14 App Router + TS, Tailwind, Neon + `pg` (pool 5), Firebase Auth + firebase-admin, html5-qrcode, Vercel `sin1`. Env: lihat `.env.example`. Rewrite `/__/auth/:path*` → `https://<project-id>.firebaseapp.com/__/auth/:path*` sudah ada di `next.config.mjs`.

## 9. Urutan pengerjaan (sudah selesai di paket ini)
1 Kerangka ✓ · 2 Login ✓ · 3 Database ✓ · 4 Komponen ✓ · 5 Patroli ✓ · 6 Paket ✓ · 7 L&F ✓ · 8 Checklist ✓ · 9 Beranda ✓ · 10 Deploy → ikuti README.

## 10. Daftar cek
Lihat README bagian 10.

## 11. Rencana pengembangan (modul berikutnya)

Tiga modul berikut sudah dirancang dan pernah dibangun dalam versi 7 modul; dipindahkan ke rencana agar versi lomba fokus.

### Laporan Serah Terima Shift (`security_shift`)
Shift awal*, akhir*, anggota shift sebelumnya, satu kolom per pos jaga (Lobby, Pos Depan, Parkir Timur, Parkir Barat, Mobile), anggota off, izin, informasi penting. Tanggal & jam server. Daftar (cari) + detail.

### Manajemen Kunci (`db_kunci`, `kunci_transaksi`)
Master kunci (`KEY-001`, nama, lokasi simpan). Pinjam: pilih/scan kunci, nama peminjam*, dept, keperluan*, foto peminjam* → DIPINJAM; kunci yang sedang dipinjam tidak bisa dipinjam lagi. Kembali: nama pengembali*, kondisi (Baik/Rusak/Hilang), catatan → KEMBALI. Beranda: "Kunci belum kembali".

### Check List APAR (`db_apar`, `apar_check`)
Master APAR (`APAR-001`, lokasi, jenis, kapasitas, tgl kedaluwarsa). Cek harian: scan QR → 4 item OK/TIDAK (tekanan, segel & pin, selang & nozzle, tabung), foto, catatan wajib bila ada TIDAK → hasil OK / PERLU TINDAKAN. Papan status unit hari ini + peringatan kedaluwarsa ≤ 30 hari.

### Lainnya
Rekap patroli per petugas/titik · ekspor Excel/PDF bulanan · tanda tangan digital L&F · notifikasi WhatsApp API otomatis · mode offline.
