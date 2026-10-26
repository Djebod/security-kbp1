# Alur Kerja (Workflows)

## Petugas: patroli
Beranda → Patroli → Scan → kamera membaca QR → kotak hijau nama lokasi → Simpan → kembali ke daftar (hari ini terbuka otomatis).
Gagal: QR asing → kotak merah "Barcode tidak dikenali", tombol Simpan tetap mati.

## Petugas: checklist
Checklist → Baru → pilih aktivitas → (DAILY CLEANING: pilih PIC Housekeeping + Foto Hasil Cleaning wajib) → lokasi → Simpan.

## Petugas: lost & found
L&F → Baru → KEHILANGAN/PENEMUAN → data barang + pelapor → Simpan (ON PROGRESS) → … saat selesai: buka detail → catatan → Tandai Selesai (DONE).

## Petugas: paket
1. Paket datang: Paket → Terima → pengirim, scan resi (atau "tanpa resi"), nama penerima, foto paket → Simpan (TERIMA) → detail.
2. Beri tahu: di detail, isi nomor WA → Kirim → WhatsApp terbuka dengan pesan siap kirim.
3. Diambil: foto orang yang mengambil → Serahkan (AMBIL). Tidak bisa diserahkan dua kali.

## Admin: kelola staf
Firebase Console → Firestore → `users` → tambah/ubah dokumen (ID = email huruf kecil). `aktif: false` untuk menonaktifkan.

## Admin: kelola master
Neon → SQL Editor → `INSERT`/`UPDATE` ke `db_lokasi` (lihat README bagian 8).

## Developer: rilis perubahan
1. Ubah kode → `npm run typecheck` → `npm run build` → `npm test`.
2. Cek akun GitHub (Djebod) → `git add .` → `git commit -m "catatan perubahan"` → `git push`.
3. Vercel auto-deploy. Bila ada perubahan env → Vercel Settings → Environment Variables → Redeploy.
