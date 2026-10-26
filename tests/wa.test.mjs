// Jalankan dari folder frontend:  node --experimental-strip-types --test ../tests/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalisasiNomorWA, linkWA } from "../frontend/lib/wa.ts";

test("normalisasi nomor WhatsApp Indonesia", () => {
  assert.equal(normalisasiNomorWA("0812-3456-7890"), "6281234567890");
  assert.equal(normalisasiNomorWA("812 3456 7890"), "6281234567890");
  assert.equal(normalisasiNomorWA("6281234567890"), "6281234567890");
  assert.equal(normalisasiNomorWA("+62 812-3456-7890"), "6281234567890");
  assert.equal(normalisasiNomorWA("12345"), null);
  assert.equal(normalisasiNomorWA("abc"), null);
});

test("link wa.me terbentuk dengan pesan ter-encode", () => {
  const l = linkWA("6281234567890", "Halo *Budi*\nPaket tiba");
  assert.ok(l.startsWith("https://wa.me/6281234567890?text="));
  assert.ok(l.includes(encodeURIComponent("\n")));
});
