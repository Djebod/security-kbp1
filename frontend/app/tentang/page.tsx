import Link from "next/link";
import type { Metadata } from "next";
import BrandLogo from "@/components/BrandLogo";
import Icon from "@/components/Icon";
import { APP, MODUL } from "@/lib/config";
import { getSession } from "@/lib/session";
import { FlightPath, RoadList, RoadMap, type Stop } from "./TravelMap";

export const metadata: Metadata = {
  title: "Tentang Sistem",
  description: "Peta perjalanan teknologi: fondasi, pengguna, database, dan metode yang dipakai aplikasi Security Harper Palembang.",
};

/* ====== DATA HALAMAN (ubah di sini) ====== */

/** Rute satu catatan: dari jari petugas sampai tampil di Beranda */
const RUTE: Stop[] = [
  { kode: "Pos 1", kota: "HP Petugas", ikon: "scan", detail: "Browser Chrome atau Safari, tanpa instal. Kamera membaca QR dan mengambil foto, lalu foto diperkecil ke 1024 px." },
  { kode: "Pos 2", kota: "Server Aplikasi", ikon: "key", detail: "Memeriksa sesi, mengambil nama dari akun login, memvalidasi ulang isian, dan menetapkan tanggal serta jam server WIB." },
  { kode: "Pos 3", kota: "Google Drive", ikon: "camera", detail: "Foto dikirim ke Apps Script dan disimpan di folder Drive per modul. Hanya tautannya yang kembali ke server." },
  { kode: "Pos 4", kota: "Neon PostgreSQL", ikon: "clipboard", detail: "Query berparameter menyimpan catatan. Status satu arah dijaga agar paket dan laporan tidak diproses dua kali." },
  { kode: "Tiba", kota: "Beranda", ikon: "home", detail: "Angka ringkas hari ini dan daftar yang bisa dicari, siap dibaca manajemen dari HP atau laptop." },
];

/** Destinasi teknologi: setiap kartu satu keputusan teknis */
const DESTINASI = [
  { kode: "NX14", nama: "Kerangka aplikasi", via: "Next.js 14, App Router, TypeScript" },
  { kode: "TW03", nama: "Tampilan", via: "Tailwind CSS, tema gelap dengan aksen neon, mobile-first" },
  { kode: "FB-G", nama: "Login pengguna", via: "Firebase Authentication dengan Google Sign-in" },
  { kode: "SESS", nama: "Sesi dan hak akses", via: "Session cookie httpOnly 5 hari, daftar staf di Firestore" },
  { kode: "NEON", nama: "Database", via: "Neon PostgreSQL, library pg, pool 5 koneksi, SSL" },
  { kode: "GDRV", nama: "Penyimpanan foto", via: "Google Drive lewat Apps Script, database menyimpan tautan" },
  { kode: "QRCD", nama: "Scanner kamera", via: "html5-qrcode, kamera belakang, 10 fps, flash" },
  { kode: "VCL1", nama: "Hosting", via: "Vercel region Singapura, deploy otomatis dari GitHub" },
];

/** Pos pemeriksaan: aturan keamanan yang diperiksa di server */
const POS = [
  { nama: "Jam dari server", ket: "Tanggal dan jam memakai waktu server WIB, bukan jam HP." },
  { nama: "Nama dari akun", ket: "Email dan nama petugas diambil dari sesi login, bukan dari isian form." },
  { nama: "Lokasi dari scan", ket: "Kode lokasi hanya dari hasil scan dan dicek ulang ke tabel lokasi." },
  { nama: "Semua lewat server", ket: "HP tidak pernah menulis langsung ke database." },
  { nama: "Status satu arah", ket: "Paket dan laporan tidak bisa diproses dua kali." },
  { nama: "Rahasia di env", ket: "Kunci database dan Firebase hanya ada di server." },
];

const KOPER = [
  { modul: "Patroli", tabel: "security_log", isi: "tanggal, waktu, email, kode lokasi, nama lokasi, petugas", bukti: "Scan QR" },
  { modul: "Checklist", tabel: "checklist", isi: "aktivitas, lokasi, PIC, foto, keterangan", bukti: "Foto + PIC" },
  { modul: "Lost & Found", tabel: "laporan_kehilangan", isi: "jenis, nama barang, foto, pelapor, status, catatan", bukti: "Foto + status" },
  { modul: "Paket", tabel: "paket_manajemen", isi: "resi, pengirim, penerima, foto paket, foto pengambil, status", bukti: "2 foto" },
];

const BEKAL = [
  { judul: "Satu file konfigurasi", isi: "Nama hotel, departemen, aktivitas, nama PIC, dan menu modul ada di lib/config.ts, siap dipakai hotel lain." },
  { judul: "Validasi dua lapis", isi: "Browser memandu pengisian, server yang memutuskan. Foto harus JPEG, PNG, atau WebP, maksimal 4 MB." },
  { judul: "Foto hemat kuota", isi: "Diperkecil di HP ke 1024 px dengan kualitas 70%, sekitar 100 sampai 300 KB per foto." },
  { judul: "Daftar yang bisa dicari", isi: "Setiap modul punya kotak cari, saringan, dan 30 data per halaman lewat alamat yang bisa di-bookmark." },
  { judul: "Login tahan browser HP", isi: "Alur login memakai domain aplikasi sendiri, jadi tidak bergantung pada cookie pihak ketiga." },
  { judul: "Diuji sebelum berangkat", isi: "Pemeriksaan tipe, build 18 route, dan unit test untuk validasi serta nomor WhatsApp." },
];

/** Tim: leader + anggota (nama ditampilkan huruf besar semua) */
const TIM = {
  leader: "Syam Shugi Rakhmany",
  anggota: ["Jordan Manuhutu", "Jordie Sean Fatahillah", "Muhammad Bagja S", "Rony Afriansyah", "Sakti Kusuma Bagus Prastya", "Sen Yung"],
};

const STRUKTUR = [
  ["frontend/app/", "halaman dan server actions per modul"],
  ["frontend/components/", "Scanner, PhotoInput, WhatsAppSend, layout"],
  ["frontend/lib/", "config, db, session, firebase, upload, validasi"],
  ["backend/apps-script/", "Code.gs upload foto ke Drive"],
  ["database/", "schema.sql, seed.sql, migrations/"],
  ["docs/, tests/", "arsitektur, database, api, workflow, unit test"],
];

const TIDAK_DIBAWA = [
  "Tidak ada password yang disimpan. Google yang mengurus autentikasi.",
  "Tidak ada kredensial di kode. Semua di environment variable Vercel.",
  "Tidak ada tulis langsung dari HP ke database. Selalu lewat server action.",
  "Tidak ada jam dari perangkat. Selalu jam server WIB.",
  "Tidak ada biaya langganan. Vercel, Neon, Firebase, dan Drive pada paket gratis.",
];

/* ====== HALAMAN ====== */

export default async function Tentang() {
  // Sudah login → tombol kembali ke Beranda; belum → ke halaman masuk.
  const session = await getSession();
  const tujuan = session ? "/" : "/login";
  const labelTombol = session ? "Kembali ke aplikasi" : "Masuk aplikasi";
  return (
    <main className="min-h-dvh bg-neo-base text-neo-cloud">
      {/* HERO: jalur penerbangan */}
      <section className="relative overflow-hidden border-b border-neo-line">
        <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-neo-neon/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6">
          <div className="flex items-center justify-between">
            <BrandLogo size="sm" />
            <Link href={tujuan} className="btn-primary px-4 py-2 text-xs">{labelTombol}</Link>
          </div>
          <div className="mt-12 max-w-2xl lg:mt-16">
            <p className="font-display text-[11px] uppercase tracking-[.35em] text-neo-neon">Tentang sistem</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neo-cloud sm:text-5xl">Peta perjalanan dari buku kertas ke aplikasi di HP</h1>
            <p className="mt-4 text-sm text-neo-silver/80 sm:text-base">Halaman ini menunjukkan di atas apa aplikasi {APP.nama} dibangun, siapa yang mengurus pengguna dan database, dan pos keamanan apa saja yang dilewati setiap catatan.</p>
          </div>
          <div className="relative -mx-4 mt-6 sm:mx-0">
            <FlightPath />
            <div className="flex justify-between px-6 font-mono text-[10px] uppercase tracking-[.25em] text-neo-silver/60 sm:px-2">
              <span>Berangkat: buku kertas</span>
              <span>Tiba: aplikasi di HP</span>
            </div>
          </div>
        </div>
      </section>

      {/* TIM */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Judul title="Awak perjalanan" sub="Tim yang membawa aplikasi ini dari gagasan sampai dipakai di lapangan." />
        <div className="card flex items-center gap-4 border-neo-neon/40 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neo-neon text-white shadow-glow">
            <Icon name="flash" className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] text-neo-neon">Leader</p>
            <p className="mt-1 truncate font-display text-base uppercase tracking-[.12em] text-neo-cloud sm:text-lg">{TIM.leader}</p>
          </div>
        </div>
        <p className="mb-3 mt-8 font-mono text-[10px] uppercase tracking-[.25em] text-neo-silver/60">Team member</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TIM.anggota.map((n) => (
            <div key={n} className="card flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neo-neon/10 font-mono text-sm text-neo-neon ring-1 ring-inset ring-neo-neon/20">{n.charAt(0)}</span>
              <p className="truncate font-display text-xs uppercase tracking-[.12em] text-neo-cloud sm:text-sm">{n}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINASI: teknologi */}
      <section className="border-y border-neo-line bg-neo-raise/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Judul title="Destinasi teknologi" sub="Delapan tempat yang disinggahi aplikasi. Setiap kartu satu keputusan teknis." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINASI.map((d) => (
              <div key={d.kode} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[.2em] text-neo-neon">{d.kode}</span>
                  <span className="text-neo-silver/50"><PinIcon /></span>
                </div>
                <p className="mt-3 font-semibold text-neo-cloud">{d.nama}</p>
                <p className="mt-1 text-xs leading-relaxed text-neo-silver/70">{d.via}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUTE: jalan berkelok */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Judul title="Rute satu catatan" sub="Setiap catatan menempuh lima pos sebelum tampil di Beranda. Setiap pos punya tugas keamanannya sendiri." />
        <div className="hidden md:block md:pb-24 md:pt-28">
          <RoadMap stops={RUTE} />
        </div>
        <div className="md:hidden">
          <RoadList stops={RUTE} />
        </div>
      </section>

      {/* POS PEMERIKSAAN */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Judul title="Pos pemeriksaan" sub="Enam aturan yang membuat catatan menjadi bukti. Semua diperiksa di server, bukan di HP." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POS.map((p, i) => (
            <div key={p.nama} className="card flex gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-neo-neon/60 font-mono text-sm text-neo-neon">{i + 1}</div>
              <div>
                <p className="font-semibold text-neo-cloud">{p.nama}</p>
                <p className="mt-1 text-xs leading-relaxed text-neo-silver/70">{p.ket}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMPAT TUJUAN: modul */}
      <section className="border-y border-neo-line bg-neo-raise/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Judul title="Empat tujuan, empat modul" sub="Tiap modul punya satu tabel transaksi. Master titik patroli dipakai bersama." />
          <div className="grid gap-3 sm:grid-cols-2">
            {KOPER.map((k, i) => (
              <div key={k.modul} className="card flex gap-4 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neo-neon/10 text-neo-neon ring-1 ring-inset ring-neo-neon/20"><Icon name={MODUL[i].ikon} className="h-7 w-7" /></div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-neo-cloud">{k.modul}</h3>
                    <span className="badge-neon">{k.bukti}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-neo-silver/60">{k.tabel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neo-silver/80">{k.isi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEKAL PERJALANAN: metode */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Judul title="Bekal perjalanan" sub="Keputusan kecil yang membuat aplikasi ringan, aman, dan mudah dirawat." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BEKAL.map((t) => (
            <div key={t.judul} className="rounded-2xl border border-neo-line p-5">
              <h3 className="font-semibold text-neo-cloud">{t.judul}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neo-silver/70">{t.isi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PETA PROYEK + YANG TIDAK DIBAWA */}
      <section className="border-t border-neo-line bg-neo-raise/60 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6">
          <div>
            <h2 className="font-display text-base uppercase tracking-[.15em] text-neo-cloud">Peta proyek</h2>
            <ul className="mt-4 divide-y divide-neo-line font-mono text-xs">
              {STRUKTUR.map(([p, k]) => (
                <li key={p} className="flex gap-3 py-2.5"><span className="w-44 shrink-0 text-neo-neon">{p}</span><span className="text-neo-silver/80">{k}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-base uppercase tracking-[.15em] text-neo-cloud">Yang tidak dibawa</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-neo-silver/85">
              {TIDAK_DIBAWA.map((t) => (
                <li key={t} className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl px-4 text-center sm:px-6">
          <Link href={tujuan} className="btn-primary px-6">{labelTombol}</Link>
          <p className="mt-6 font-display text-[10px] uppercase tracking-[.3em] text-neo-silver/40">{APP.tempat} · Security System</p>
        </div>
      </section>
    </main>
  );
}

function Judul({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-tight text-neo-cloud sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-neo-silver/70 sm:text-base">{sub}</p>
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
