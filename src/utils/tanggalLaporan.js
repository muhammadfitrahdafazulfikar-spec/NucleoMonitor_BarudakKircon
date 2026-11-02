const nomorBulan = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

export function waktuLaporan(item) {
  if (item.tanggalISO) {
    const waktuISO = Date.parse(`${item.tanggalISO}T00:00:00`);
    if (!Number.isNaN(waktuISO)) return waktuISO;
  }

  const cocok = item.tanggal?.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
  if (!cocok) return 0;

  const bulan = nomorBulan[cocok[2].toLowerCase()];
  if (bulan === undefined) return 0;
  return new Date(Number(cocok[3]), bulan, Number(cocok[1])).getTime();
}

export function urutkanLaporanTerbaru(laporan) {
  return [...laporan].sort((a, b) => waktuLaporan(b) - waktuLaporan(a));
}
