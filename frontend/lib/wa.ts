/** Normalisasi nomor WhatsApp Indonesia → "62812...". Mengembalikan null jika tidak sah. */
export function normalisasiNomorWA(input: string): string | null {
  let n = (input || "").replace(/[^\d+]/g, "");
  if (n.startsWith("+")) n = n.slice(1);
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  if (!n.startsWith("62")) return null;
  if (n.length < 10 || n.length > 15) return null;
  return n;
}

export function linkWA(nomor62: string, pesan: string): string {
  return `https://wa.me/${nomor62}?text=${encodeURIComponent(pesan)}`;
}
