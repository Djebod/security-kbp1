-- ============================================================
-- Hotel Neo KBP — Security System
-- Skema database PostgreSQL (Neon)
-- Jalankan sekali: npm run db:schema  (dari folder frontend)
-- ============================================================

-- Master titik patroli / lokasi (isi QR = code_lokasi)
CREATE TABLE IF NOT EXISTS db_lokasi (
  code_lokasi  TEXT PRIMARY KEY,
  nama_lokasi  TEXT NOT NULL,
  location     TEXT,
  photo_lokasi TEXT,
  aktif        BOOLEAN DEFAULT TRUE
);

-- Modul 1: Patroli / Checkpoint
CREATE TABLE IF NOT EXISTS security_log (
  id            TEXT PRIMARY KEY,
  tanggal       DATE,
  waktu         TIME,
  email         TEXT,
  code_lokasi   TEXT REFERENCES db_lokasi(code_lokasi),
  nama_lokasi   TEXT,
  security_name TEXT,
  created_at    TIMESTAMP DEFAULT now()
);

-- Modul 2: Checklist Aktivitas Shift
CREATE TABLE IF NOT EXISTS checklist (
  id            TEXT PRIMARY KEY,
  tanggal       DATE,
  waktu         TIME,
  email         TEXT,
  aktivitas     TEXT,
  code_lokasi   TEXT REFERENCES db_lokasi(code_lokasi),
  nama_lokasi   TEXT,
  security_name TEXT,
  pic2          TEXT,
  photo         TEXT,
  keterangan    TEXT
);

-- Modul 3: Lost & Found
CREATE TABLE IF NOT EXISTS laporan_kehilangan (
  id               TEXT PRIMARY KEY,
  tanggal          DATE,
  waktu            TIME,
  email            TEXT,
  type_kejadian    TEXT,            -- KEHILANGAN / PENEMUAN
  nama_barang      TEXT,
  deskripsi        TEXT,
  photo_barang     TEXT,
  tanggal_kejadian DATE,
  waktu_kejadian   TEXT,
  tempat_kejadian  TEXT,
  nama_pelapor     TEXT,
  posisi           TEXT,
  nomor_identitas  TEXT,
  alamat           TEXT,
  penerima_laporan TEXT,
  status           TEXT,            -- ON PROGRESS / DONE
  remark           TEXT,
  tanggal_selesai  DATE,
  waktu_selesai    TIME,
  diselesaikan_oleh TEXT
);

-- Modul 4: Paket
CREATE TABLE IF NOT EXISTS paket_manajemen (
  id                     TEXT PRIMARY KEY,
  tanggal_diterima       DATE,
  jam_diterima           TIME,
  email                  TEXT,
  scan_barcode           TEXT,
  nama_pengirim          TEXT,
  nama_security_penerima TEXT,
  penerima_barang        TEXT,
  photo_barang           TEXT,
  status                 TEXT,      -- TERIMA / AMBIL
  nama_security_pemberi  TEXT,
  tanggal_diambil        DATE,
  jam_diambil            TIME,
  photo_pengambil        TEXT
);

-- Index
CREATE INDEX IF NOT EXISTS idx_security_log_tanggal ON security_log(tanggal);
CREATE INDEX IF NOT EXISTS idx_checklist_tanggal ON checklist(tanggal);
CREATE INDEX IF NOT EXISTS idx_lf_tanggal ON laporan_kehilangan(tanggal);
CREATE INDEX IF NOT EXISTS idx_lf_status ON laporan_kehilangan(status);
CREATE INDEX IF NOT EXISTS idx_paket_tanggal ON paket_manajemen(tanggal_diterima);
CREATE INDEX IF NOT EXISTS idx_paket_status ON paket_manajemen(status);
