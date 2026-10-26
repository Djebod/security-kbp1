import "server-only";
import { Pool, type QueryResultRow } from "pg";
import { APP } from "./config";

/** Pool koneksi Neon — maks 5 koneksi, SSL wajib */
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 30_000,
  });
if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;

/**
 * WAKTU SERVER — selalu pakai ini, jangan CURRENT_DATE / jam HP.
 * Zona waktu dari lib/config.ts (bukan input pengguna, aman disisipkan).
 */
export const TZ = APP.zonaWaktu;
export const SQL_TANGGAL = `(now() AT TIME ZONE '${TZ}')::date`;
export const SQL_JAM = `(now() AT TIME ZONE '${TZ}')::time(0)`;

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const res = await pool.query<T>(text, params);
  return res.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/** Format tanggal dari Postgres (Date atau string) → "YYYY-MM-DD" */
export function ymd(v: unknown): string {
  if (!v) return "";
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(v).slice(0, 10);
}

/** Format jam "HH:MM:SS" → "HH:MM" */
export function hm(v: unknown): string {
  if (!v) return "";
  return String(v).slice(0, 5);
}

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/** "2026-10-26" → "Senin, 26 Okt 2026" */
export function tglIndo(v: unknown, denganHari = false): string {
  const s = ymd(v);
  if (!s) return "-";
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const base = `${d} ${BULAN[m - 1]} ${y}`;
  return denganHari ? `${HARI[dt.getDay()]}, ${base}` : base;
}
