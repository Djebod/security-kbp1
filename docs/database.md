# Database (Neon PostgreSQL)

Skema lengkap: `database/schema/schema.sql`. Seed contoh: `database/seed/seed.sql`. Jalankan dari `frontend`: `npm run db:schema` lalu `npm run db:seed`.

## Tabel master
| Tabel | Kunci | Isi |
|---|---|---|
| `db_lokasi` | `code_lokasi` (isi QR) | nama_lokasi, location, photo_lokasi, aktif |

Menonaktifkan master: `aktif = false` (riwayat tetap tersimpan, tidak muncul di pilihan).

## Tabel transaksi
| Tabel | Modul | Status | Catatan |
|---|---|---|---|
| `security_log` | Patroli | — | satu baris per scan; `tanggal`, `waktu` server |
| `checklist` | Checklist | — | `pic2` wajib bila aktivitas di `AKTIVITAS_WAJIB_PIC`; `photo` = URL |
| `laporan_kehilangan` | Lost & Found | `ON PROGRESS` → `DONE` | `tanggal_selesai`, `waktu_selesai`, `diselesaikan_oleh`, `remark` |
| `paket_manajemen` | Paket | `TERIMA` → `AMBIL` | `photo_pengambil`, `nama_security_pemberi`, `tanggal_diambil`, `jam_diambil` |

Semua `id` = 8 karakter heksadesimal acak (`lib/id.ts`).

## Index
`security_log(tanggal)`, `checklist(tanggal)`, `laporan_kehilangan(tanggal, status)`, `paket_manajemen(tanggal_diterima, status)`.

## Query penting
- Beranda: 3 count dalam satu query (`app/(app)/page.tsx`).
- Guard satu arah: `UPDATE ... WHERE status IS DISTINCT FROM 'AMBIL' RETURNING id` (dan `'DONE'` untuk Lost & Found).

## Modul rencana (Shift, Kunci, APAR)
Skema tabelnya ada di `PROJECT_BLUEPRINT.md` bagian 11; tambahkan lewat file migrasi saat modul dibangun.

## Foto
Kolom `photo*` menyimpan URL `https://drive.google.com/thumbnail?id=<ID>&sz=w1200` (bisa langsung dipakai `<img src>`). Bila `UPLOAD_URL` kosong, kolom berisi data URL (mode uji; ukuran < 300 KB per foto).

## Migrasi dari AppSheet/Excel (tidak dipakai saat ini)
Bila nanti perlu: ekspor CSV → skrip `migrate.js` dengan `csv-parse`, ubah `MM/DD/YYYY` → `YYYY-MM-DD`, insert per 300 baris dalam transaksi, `ON CONFLICT (id) DO NOTHING`.
