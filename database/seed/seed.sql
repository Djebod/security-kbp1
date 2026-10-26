-- ============================================================
-- Data awal (contoh). Ubah sesuai kondisi Hotel Neo KBP.
-- Jalankan: npm run db:seed  (dari folder frontend)
-- Boleh dijalankan ulang: baris yang sudah ada dilewati.
-- ============================================================

-- Titik patroli: cetak QR berisi code_lokasi, tempel di lokasi
INSERT INTO db_lokasi (code_lokasi, nama_lokasi, location) VALUES
  ('LOK-001', 'Lobby Utama',      'Lantai 1'),
  ('LOK-002', 'Pos Depan',        'Pintu masuk utama'),
  ('LOK-003', 'Parkir Timur',     'Area parkir sisi timur'),
  ('LOK-004', 'Parkir Barat',     'Area parkir sisi barat'),
  ('LOK-005', 'Koridor Lantai 2', 'Lantai 2'),
  ('LOK-006', 'Koridor Lantai 3', 'Lantai 3'),
  ('LOK-007', 'Ruang Genset',     'Area belakang'),
  ('LOK-008', 'Loading Dock',     'Area belakang'),
  ('LOK-009', 'Rooftop',          'Lantai atas'),
  ('LOK-010', 'Restoran',         'Lantai 1')
ON CONFLICT (code_lokasi) DO NOTHING;
