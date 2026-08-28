/**
 * Label tampilan berbahasa Indonesia untuk nilai yang tersimpan dalam bahasa
 * Inggris.
 *
 * Nilai status disimpan apa adanya ("In Stock", "New Arrival", ...) karena
 * dipakai sebagai kunci di form admin, filter katalog, dan basis data. Yang
 * diterjemahkan hanya lapisan tampilannya, jadi tidak ada migrasi data.
 */
const STATUS_LABEL = {
  "In Stock": "Tersedia",
  "New Arrival": "Baru Masuk",
  Reserved: "Dipesan",
  Sold: "Terjual",
  Traded: "Tukar Tambah",
  Consigned: "Konsinyasi",
};

export function statusLabel(status) {
  if (!status) return "—";
  return STATUS_LABEL[status] || status;
}
