import Link from "next/link";
import type { Metadata } from "next";
import NeoLogo from "@/components/NeoLogo";
import Icon from "@/components/Icon";
import { APP, MODUL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Tentang Sistem",
  description: "Boarding pass teknologi: fondasi, pengguna, database, dan metode yang dipakai aplikasi Security Hotel Neo KBP.",
};

/* ====== DATA HALAMAN (ubah di sini) ====== */

const PAPAN = [
  { kode: "NX14", tujuan: "Kerangka aplikasi", via: "Next.js 14 · App Router · TypeScript", gate: "A1", status: "ON TIME" },
  { kode: "TW03", tujuan: "Tampilan & tema", via: "Tailwind CSS · hitam + silver NEO · mobile-first", gate: "A2", status: "ON TIME" },
  { kode: "FB-G", tujuan: "Login pengguna", via: "Firebase Authentication · Google Sign-in", gate: "B1", status: "BOARDING" },
  { kode: "SESS", tujuan: "Sesi & hak akses", via: "firebase-admin · session cookie httpOnly 5 hari · daftar staf Firestore", gate: "B2", status: "BOARDING" },
  { kode: "NEON", tujuan: "Database", via: "Neon PostgreSQL · library pg · pool 5 koneksi · SSL", gate: "C1", status: "ON TIME" },
  { kode: "GDRV", tujuan: "Penyimpanan foto", via: "Google Drive · Apps Script Web App · DB simpan tautan", gate: "C2", status: "ON TIME" },
  { kode: "QRCD", tujuan: "Scanner kamera", via: "html5-qrcode · kamera belakang · 10 fps · flash", gate: "D1", status: "ON TIME" },
  { kode: "VCL1", tujuan: "Hosting", via: "Vercel · region Singapura (sin1) · auto-deploy dari GitHub", gate: "D2", status: "DEPARTED" },
];

const RUTE = [
  { jam: "00:00", kota: "HP Petugas", kode: "HPX", detail: "Browser Chrome / Safari, tanpa instal. Kamera membaca QR dan mengambil foto; foto diperkecil ke 1024 px sebelum dikirim." },
  { jam: "00:01", kota: "Server Aplikasi", kode: "SRV", detail: "Server action memeriksa sesi, mengambil nama & email dari akun login, memvalidasi ulang semua isian, dan mengambil tanggal & jam dari server (WIB)." },
  { jam: "00:02", kota: "Google Drive", kode: "DRV", detail: "Foto dikirim server ke Apps Script, disimpan di folder Drive per modul; hanya tautannya yang kembali ke server." },
  { jam: "00:03", kota: "Neon PostgreSQL", kode: "DB", detail: "Query berparameter ($1, $2) menyimpan catatan; status satu arah dijaga oleh WHERE status IS DISTINCT FROM …" },
  { jam: "00:04", kota: "Beranda", kode: "HOME", detail: "Angka ringkas hari ini dan daftar yang bisa dicari — siap dibaca manajemen dari HP atau laptop." },
];

const STEMPEL = [
  { nama: "JAM DARI SERVER", ket: "now() AT TIME ZONE 'Asia/Jakarta' — bukan jam HP", putar: "-6deg" },
  { nama: "NAMA DARI AKUN", ket: "Email & nama dari session cookie, bukan dari form", putar: "4deg" },
  { nama: "LOKASI DARI SCAN", ket: "Kode read-only, dicek ulang ke db_lokasi", putar: "-3deg" },
  { nama: "SEMUA LEWAT SERVER", ket: "HP tidak pernah menulis langsung ke database", putar: "5deg" },
  { nama: "STATUS SATU ARAH", ket: "Paket & laporan tidak bisa diproses dua kali", putar: "-5deg" },
  { nama: "RAHASIA DI ENV", ket: "DATABASE_URL & kunci Firebase hanya di server", putar: "3deg" },
];

const TIPS = [
  { judul: "Satu file konfigurasi", isi: "Nama hotel, departemen, aktivitas, nama PIC, dan menu modul ada di lib/config.ts — siap dipakai hotel lain." },
  { judul: "Validasi dua lapis", isi: "Browser memandu (field wajib, pilihan), server memutuskan (salahSatu, cekFoto, tanggalValid). Foto harus data:image/jpeg|png|webp, maksimal 4 MB." },
  { judul: "Foto hemat kuota", isi: "Diperkecil di HP ke sisi terpanjang 1024 px, JPEG kualitas 70% — sekitar 100–300 KB per foto." },
  { judul: "Daftar yang bisa dicari", isi: "Setiap modul: kotak cari, saringan chip, 30 data per halaman lewat query string — bisa di-bookmark." },
  { judul: "Login tahan browser HP", isi: "Redirect di HP, popup di laptop; /__/auth/* diteruskan ke Firebase agar domain sendiri dipakai dan cookie pihak ketiga tidak dibutuhkan." },
  { judul: "Diuji sebelum terbang", isi: "npm run typecheck, next build (17 route), dan unit test Node untuk normalisasi nomor WhatsApp & validasi." },
];

const KOPER = [
  { modul: "Patroli", tabel: "security_log", isi: "tanggal, waktu, email, code_lokasi, nama_lokasi, security_name", bukti: "Scan QR" },
  { modul: "Checklist", tabel: "checklist", isi: "aktivitas, code_lokasi, pic2, photo, keterangan", bukti: "Foto + PIC" },
  { modul: "Lost & Found", tabel: "laporan_kehilangan", isi: "type_kejadian, nama_barang, photo_barang, pelapor, status, remark", bukti: "Foto + status" },
  { modul: "Paket", tabel: "paket_manajemen", isi: "scan_barcode, nama_pengirim, penerima_barang, photo_barang, photo_pengambil, status", bukti: "2 foto" },
];

const STRUKTUR = [
  ["frontend/app/", "halaman & server actions per modul"],
  ["frontend/components/", "Scanner, PhotoInput, WhatsAppSend, layout"],
  ["frontend/lib/", "config, db, session, firebase, upload, validasi"],
  ["backend/apps-script/", "Code.gs upload foto ke Drive"],
  ["database/", "schema.sql, seed.sql, migrations/"],
  ["docs/ · tests/", "arsitektur, database, api, workflows · unit test"],
];

/* ====== HALAMAN ====== */

export default function Tentang() {
  return (
    <main className="min-h-dvh bg-neo-cloud text-neo-ink">
      {/* HERO: boarding pass */}
      <section className="bg-neo-black px-4 pb-16 pt-10 text-neo-silver">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center justify-between">
            <NeoLogo size="sm" />
            <Link href="/login" className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[.2em] hover:bg-white/10">Masuk aplikasi</Link>
          </div>
          <p className="font-display text-[11px] uppercase tracking-[.4em] text-neo-silver/60">Travel information · Tentang sistem</p>
          <h1 className="mt-3 font-display text-3xl uppercase leading-tight tracking-[.12em] text-white sm:text-4xl">Boarding Pass Teknologi</h1>
          <p className="mt-3 max-w-2xl text-sm text-neo-silver/80 sm:text-base">Halaman ini menjelaskan di atas apa aplikasi {APP.nama} dibangun, siapa yang mengurus pengguna dan database, dan metode apa saja yang dipakai — disusun seperti dokumen perjalanan supaya mudah dibaca dewan juri.</p>

          <div className="mt-8 overflow-hidden rounded-2xl bg-white text-neo-ink shadow-soft sm:flex">
            <div className="flex-1 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-display text-[10px] uppercase tracking-[.35em] text-neo-steel/60">Boarding pass</p>
                <span className="badge bg-neo-black text-neo-silver">Economy · Web App</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Field label="Penumpang" value="Tim Security" />
                <Field label="Dari" value="Buku kertas" />
                <Field label="Ke" value="Aplikasi HP" />
                <Field label="Maskapai" value="Next.js 14" />
                <Field label="Gate" value="Vercel SIN1" />
                <Field label="Kursi" value="Browser HP" />
                <Field label="Bagasi" value="4 modul" />
                <Field label="Status" value="Siap terbang" accent />
              </div>
            </div>
            <div className="relative border-t border-dashed border-neo-mist bg-neo-cloud p-6 sm:w-64 sm:border-l sm:border-t-0">
              <span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-neo-black sm:block" />
              <p className="font-display text-[10px] uppercase tracking-[.35em] text-neo-steel/60">Flight</p>
              <p className="mt-1 font-display text-2xl text-neo-black">NEO 001</p>
              <p className="mt-4 text-xs text-neo-steel">Operator</p>
              <p className="text-sm font-medium">{APP.tempat}</p>
              <div className="mt-5 flex gap-[3px]">
                {[3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 1, 2].map((w, i) => (
                  <span key={i} className="h-10 bg-neo-black" style={{ width: w * 2 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAPAN KEBERANGKATAN: stack */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Judul eyebrow="Departures" title="Papan teknologi" sub="Fondasi, penanganan pengguna, database, dan layanan pendukung — setiap baris satu keputusan teknis." />
        <div className="overflow-hidden rounded-2xl bg-neo-black text-neo-silver shadow-soft">
          <div className="hidden grid-cols-[88px_1fr_1.6fr_64px_120px] gap-3 border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[.25em] text-neo-silver/50 sm:grid">
            <span>Flight</span><span>Tujuan</span><span>Via</span><span>Gate</span><span>Status</span>
          </div>
          <ul className="divide-y divide-white/10">
            {PAPAN.map((r) => (
              <li key={r.kode} className="grid gap-1 px-5 py-4 sm:grid-cols-[88px_1fr_1.6fr_64px_120px] sm:items-center sm:gap-3">
                <span className="font-mono text-sm tracking-widest text-amber-300">{r.kode}</span>
                <span className="font-semibold text-white">{r.tujuan}</span>
                <span className="font-mono text-xs leading-relaxed text-neo-silver/80 sm:text-sm">{r.via}</span>
                <span className="font-mono text-sm text-neo-silver/70">{r.gate}</span>
                <span className={`font-mono text-xs tracking-widest ${r.status === "DEPARTED" ? "text-neo-silver/60" : r.status === "BOARDING" ? "text-amber-300" : "text-emerald-300"}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ITINERARY: perjalanan satu data */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4">
          <Judul eyebrow="Itinerary" title="Perjalanan satu catatan" sub="Dari jari petugas sampai tampil di Beranda — setiap pemberhentian punya tugas keamanan sendiri." />
          <ol className="relative ml-3 border-l-2 border-dashed border-neo-mist">
            {RUTE.map((s, i) => (
              <li key={s.kode} className="relative mb-8 pl-8 last:mb-0">
                <span className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neo-black text-[9px] font-bold text-neo-silver">{i + 1}</span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-neo-steel/60">+{s.jam.slice(3)} dtk</span>
                  <h3 className="text-lg font-semibold">{s.kota}</h3>
                  <span className="badge bg-neo-mist font-mono text-neo-steel">{s.kode}</span>
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neo-steel">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PASPOR: stempel keamanan */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Judul eyebrow="Passport control" title="Stempel keamanan" sub="Enam aturan yang membuat catatan menjadi bukti. Semua diperiksa di server, bukan di HP." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {STEMPEL.map((s) => (
            <div key={s.nama} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-soft">
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-double border-red-700/70 text-red-700/80" style={{ transform: `rotate(${s.putar})` }}>
                <span className="font-display text-[8px] uppercase leading-tight tracking-[.15em]">{s.nama}</span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest">Verified</span>
              </div>
              <p className="text-xs leading-relaxed text-neo-steel">{s.ket}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BAGASI: 4 modul */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4">
          <Judul eyebrow="Baggage claim" title="Empat koper, empat modul" sub="Tiap modul punya satu tabel transaksi; master titik patroli (db_lokasi) dipakai bersama." />
          <div className="grid gap-4 sm:grid-cols-2">
            {KOPER.map((k, i) => (
              <div key={k.modul} className="flex gap-4 rounded-2xl border border-neo-mist bg-neo-cloud p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neo-black text-neo-silver"><Icon name={MODUL[i].ikon} className="h-7 w-7" /></div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{k.modul}</h3>
                    <span className="badge bg-neo-black text-neo-silver">{k.bukti}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-neo-steel/70">{k.tabel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neo-steel">{k.isi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL TIPS: metode lain */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Judul eyebrow="Travel tips" title="Metode yang dipakai" sub="Keputusan kecil yang membuat aplikasi ringan, aman, dan mudah dirawat." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((t) => (
            <div key={t.judul} className="rounded-2xl bg-white p-5 shadow-soft">
              <h3 className="font-semibold">{t.judul}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neo-steel">{t.isi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PETA: struktur proyek + env */}
      <section className="bg-neo-black py-12 text-neo-silver">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[.35em] text-neo-silver/60">Map</p>
            <h2 className="mt-2 font-display text-xl uppercase tracking-[.1em] text-white">Peta proyek</h2>
            <ul className="mt-4 divide-y divide-white/10 font-mono text-xs">
              {STRUKTUR.map(([p, k]) => (
                <li key={p} className="flex gap-3 py-2"><span className="w-44 shrink-0 text-amber-300">{p}</span><span className="text-neo-silver/80">{k}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-[11px] uppercase tracking-[.35em] text-neo-silver/60">Customs declaration</p>
            <h2 className="mt-2 font-display text-xl uppercase tracking-[.1em] text-white">Yang tidak dibawa</h2>
            <ul className="mt-4 space-y-2 text-sm text-neo-silver/85">
              <li className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> Tidak ada password yang disimpan — Google yang mengurus autentikasi.</li>
              <li className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> Tidak ada kredensial di kode — semua di environment variable Vercel.</li>
              <li className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> Tidak ada tulis langsung HP → database — selalu lewat server action.</li>
              <li className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> Tidak ada jam dari perangkat — selalu jam server WIB.</li>
              <li className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> Tidak ada biaya langganan — Vercel, Neon, Firebase, dan Drive pada paket gratis.</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-5xl px-4 text-center">
          <Link href="/login" className="btn bg-white px-6 text-neo-black hover:bg-neo-mist">Masuk aplikasi</Link>
          <p className="mt-6 text-[10px] uppercase tracking-[.3em] text-neo-silver/40">{APP.tempat} · Security System · {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[.25em] text-neo-steel/60">{label}</p>
      <p className={`mt-0.5 font-semibold ${accent ? "text-emerald-700" : "text-neo-ink"}`}>{value}</p>
    </div>
  );
}

function Judul({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <p className="font-display text-[11px] uppercase tracking-[.35em] text-neo-steel/60">{eyebrow}</p>
      <h2 className="mt-2 font-display text-xl uppercase tracking-[.1em] text-neo-black sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-neo-steel">{sub}</p>
    </div>
  );
}
