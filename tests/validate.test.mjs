import { test } from "node:test";
import assert from "node:assert/strict";
import { str, wajib, salahSatu, tanggalValid } from "../frontend/lib/validate.ts";

const fd = new FormData();
fd.set("nama", "  Andi  ");
fd.set("tgl", "2026-10-26");

test("str memotong spasi dan membatasi panjang", () => {
  assert.equal(str(fd, "nama"), "Andi");
  assert.equal(str(fd, "nama", 2), "An");
  assert.equal(str(fd, "tidak_ada"), "");
});
test("wajib melempar error bila kosong", () => {
  assert.throws(() => wajib(fd, "kosong", "Kolom"), /Kolom wajib diisi/);
});
test("salahSatu dan tanggalValid", () => {
  assert.equal(salahSatu("Pagi", ["Pagi", "Siang"], "Shift"), "Pagi");
  assert.throws(() => salahSatu("Sore", ["Pagi"], "Shift"));
  assert.equal(tanggalValid("2026-10-26", "Tgl"), "2026-10-26");
  assert.throws(() => tanggalValid("26/10/2026", "Tgl"));
});
