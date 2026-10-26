# AI Engine

Aplikasi ini **tidak memakai AI di dalam fiturnya** (tidak ada pemanggilan model saat aplikasi berjalan). Bagian ini menjelaskan bagaimana AI dipakai **untuk membangun dan merawat** project.

## Peran Claude Code
- Membaca `CLAUDE.md` sebagai aturan utama, lalu `PROJECT_BLUEPRINT.md` dan `docs/` untuk konteks.
- Mengerjakan perubahan dengan pola yang sudah ada (server action → page → baru → [id]) dan selalu menjalankan `npm run typecheck && npm run build` sebelum menyerahkan.
- Selalu menutup jawaban dengan Blok Cek Akun GitHub (Djebod) + `git add . / git commit / git push`.

## Contoh perintah yang aman diberikan ke Claude Code
- "Tambahkan modul Laporan Shift sesuai PROJECT_BLUEPRINT.md bagian 11" → tabel baru + folder modul + entri `MODUL`.
- "Buat rekap patroli per petugas per bulan" → halaman baru di `/security-log/rekap` memakai `SQL_TANGGAL`.
- "Tambah ekspor Excel di Paket" → server action yang membuat `.xlsx` (gunakan skill xlsx), tanpa mengubah tabel.
- "Kirim notifikasi otomatis saat paket datang" → butuh WhatsApp API berbayar; mulai dari dokumen keputusan dulu.

## Ide pengembangan AI (opsional, masa depan)
- Ringkasan otomatis laporan Lost & Found dan paket mingguan untuk GM.
- Deteksi anomali patroli (titik yang sering terlewat) dari `security_log`.
- OCR nomor resi dari foto paket bila barcode rusak.
