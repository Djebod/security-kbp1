# Migrations

Perubahan skema setelah aplikasi berjalan ditaruh di sini, satu file per perubahan,
dengan nama `YYYYMMDD_keterangan.sql`. Contoh:

```
20261101_tambah_kolom_catatan_patroli.sql
```

Jalankan dari folder `frontend`:

```
node scripts/run-sql.js ../database/migrations/20261101_tambah_kolom_catatan_patroli.sql
```

Skema awal ada di `database/schema/schema.sql` (semua `CREATE TABLE IF NOT EXISTS`,
aman dijalankan ulang).
