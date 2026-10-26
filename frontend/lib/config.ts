/**
 * ISIAN APLIKASI — satu-satunya tempat untuk mengubah nama, daftar pos jaga,
 * aktivitas, departemen, dan lain-lain. Ubah di sini, tidak perlu cari di file lain.
 */

export const APP = {
  nama: "Hotel Neo KBP",
  namaPendek: "NEO KBP",
  tempat: "Hotel NEO KBP by ASTON",
  deskripsi: "Aplikasi operasional Security: patroli, checklist aktivitas, lost & found, dan paket.",
  zonaWaktu: "Asia/Jakarta",
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || "",
};

/** Departemen yang boleh masuk (huruf besar, harus sama dengan isi Firestore users.dept) */
export const DEPT_BOLEH = ["SECURITY", "HUMAN RESOURCES"];

/** Jabatan yang boleh masuk apa pun departemennya */
export const ROLE_BEBAS = ["ADMIN", "SUPERADMIN"];

/**
 * System admin (selalu boleh masuk tanpa perlu dokumen di Firestore users).
 * Diisi lewat env SUPER_ADMIN_EMAILS; daftar ini hanya cadangan bila env kosong.
 */
export const SUPER_ADMIN_DEFAULT = [
  "syam.rakhmany@gmail.com",
  "nikolas.k@sentineltech.com",
  "yuda.d@sentineltech.com",
  "esar.a@archipelagohotels.com",
  "rayhan.f@archiprlagohotels.com",
];

/** Jenis aktivitas Checklist */
export const AKTIVITAS = ["DAILY CLEANING", "REGULAR ACTIVITY", "OTHER ACTIVITY"];

/** Aktivitas yang WAJIB foto + PIC */
export const AKTIVITAS_WAJIB_PIC = ["DAILY CLEANING"];

/** Daftar nama PIC (tim Housekeeping). Isi sesuai tim di hotel. */
export const DAFTAR_PIC = ["Andi", "Budi", "Sari", "Dewi", "Rudi"];

/** Posisi pelapor Lost & Found */
export const POSISI_PELAPOR = ["Tamu", "Staf", "Vendor", "Pengunjung", "Lainnya"];

/** Jumlah data per halaman */
export const PER_HALAMAN = 30;

/** Menu modul — dipakai di sidebar, nav bawah, dan kartu Beranda */
export const MODUL = [
  { href: "/security-log", label: "Patroli", pendek: "Patroli", ikon: "scan", deskripsi: "Scan QR titik patroli" },
  { href: "/shift-report", label: "Checklist", pendek: "Checklist", ikon: "check", deskripsi: "Aktivitas rutin + foto" },
  { href: "/lost-found", label: "Lost & Found", pendek: "L&F", ikon: "search", deskripsi: "Barang hilang / ditemukan" },
  { href: "/paket", label: "Paket", pendek: "Paket", ikon: "box", deskripsi: "Terima & serahkan paket" },
] as const;
