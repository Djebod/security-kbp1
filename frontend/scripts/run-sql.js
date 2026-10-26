// Menjalankan file SQL ke database Neon. Pakai: npm run db:schema / npm run db:seed
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function main() {
  const file = process.argv[2];
  if (!file) { console.error("Pakai: node scripts/run-sql.js <file.sql>"); process.exit(1); }
  if (!process.env.DATABASE_URL) { console.error("DATABASE_URL belum diisi di .env.local"); process.exit(1); }
  const sql = fs.readFileSync(path.resolve(file), "utf8");
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log("Selesai menjalankan", file);
}
main().catch((e) => { console.error(e); process.exit(1); });
