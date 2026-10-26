# API & Server Actions

## Route API
| Metode | Alamat | Fungsi |
|---|---|---|
| POST | `/api/auth/login` | body `{ idToken }` → verifikasi, cek `users`, buat cookie `neo_session`. Respons `{ ok, nama }` atau `{ error }` (400/401/403) |
| POST | `/api/auth/logout` | hapus cookie, redirect 303 ke `/login` |

Pesan error login (persis):
- `Akun Anda tidak terdaftar di sistem staff.`
- `Akun Anda tidak aktif. Hubungi admin.`
- `Akses ditolak. Modul ini hanya untuk departemen SECURITY / HUMAN RESOURCES.`

## Server actions (semua memanggil `requireSession()`)
Bentuk umum: `(prev: FormState, fd: FormData) => Promise<FormState>`; sukses → `redirect()`, gagal → `{ error }`.

| Modul | Action | Masukan (FormData) | Aturan server |
|---|---|---|---|
| Patroli | `cekLokasi(code)` | kode scan | cari di `db_lokasi` aktif |
| Patroli | `simpanPatroli` | `code_lokasi` | wajib ada di `db_lokasi`; nama/email dari sesi |
| Checklist | `simpanChecklist` | `aktivitas*`, `code_lokasi*`, `pic2`, `photo`, `keterangan` | aktivitas ∈ `AKTIVITAS`; bila ∈ `AKTIVITAS_WAJIB_PIC` → `pic2` ∈ `DAFTAR_PIC` & foto wajib |
| L&F | `simpanLaporan` | `type_kejadian*`, `nama_barang*`, `deskripsi*`, `tanggal_kejadian*`, `tempat_kejadian*`, `nama_pelapor*`, … | jenis ∈ {KEHILANGAN, PENEMUAN}; status awal ON PROGRESS |
| L&F | `selesaikanLaporan` | `id`, `remark*` | guard `IS DISTINCT FROM 'DONE'` |
| Paket | `terimaPaket` | `nama_pengirim*`, `scan_barcode`/`tanpa_resi`, `penerima_barang*`, `photo_barang*` | status TERIMA |
| Paket | `serahkanPaket` | `id`, `photo_pengambil*` | guard `IS DISTINCT FROM 'AMBIL'` |

## Validasi foto (`lib/upload.ts`)
Harus diawali `data:image/jpeg|png|webp;base64,`; maks 4 MB (`serverActions.bodySizeLimit = 4mb`).

## Apps Script (`backend/apps-script/Code.gs`)
`POST` JSON `{ foto, nama, folder, secret }` → `{ status: "ok", id, url, view }`. `url` siap dipakai sebagai `<img src>`. Subfolder per modul: `paket/`, `checklist/`, `lost-found/`.
