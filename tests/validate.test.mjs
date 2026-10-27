import { test } from "node:test";
import assert from "node:assert/strict";
import { str, wajib, salahSatu, tanggalValid, tanggalOpsional, rentangTanggal } from "../frontend/lib/validate.ts";

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
test("tanggalOpsional menolak format salah dan tanggal tidak ada", () => {
  assert.equal(tanggalOpsional("2026-10-26"), "2026-10-26");
  assert.equal(tanggalOpsional(undefined), "");
  assert.equal(tanggalOpsional("2026-02-30"), "");
  assert.equal(tanggalOpsional("26-10-2026"), "");
  assert.equal(tanggalOpsional("2026-10-26' OR 1=1"), "");
});
test("rentangTanggal menukar bila terbalik", () => {
  assert.deepEqual(rentangTanggal("2026-10-27", "2026-10-01"), { dari: "2026-10-01", sampai: "2026-10-27" });
  assert.deepEqual(rentangTanggal("2026-10-01", ""), { dari: "2026-10-01", sampai: "" });
});
