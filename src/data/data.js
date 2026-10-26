export const fasilitas = [
  { id: 'SEN-001', nama: 'Fasilitas PLTN A', lokasi: 'Lokasi A', kapasitas: '850 MW', status: 'Beroperasi' },
  { id: 'SEN-002', nama: 'Fasilitas PLTN B', lokasi: 'Lokasi B', kapasitas: '1.000 MW', status: 'Pemeliharaan' },
  { id: 'SEN-003', nama: 'Fasilitas PLTN C', lokasi: 'Lokasi C', kapasitas: '750 MW', status: 'Tidak Aktif' },
];

export const pemantauan = [
  { id: 'ENV-001', jenis: 'Udara', parameter: 'PM2.5', nilai: '12 µg/m³', aktivitas: 'Pemantauan partikulat udara' },
  { id: 'ENV-002', jenis: 'Air', parameter: 'pH air', nilai: '7,2', aktivitas: 'Pemantauan kualitas air' },
  { id: 'ENV-003', jenis: 'Tanah', parameter: 'pH tanah', nilai: '6,5', aktivitas: 'Pemantauan kondisi tanah' },
];

export const laporanAwal = [
  {
    id: 'LAP-001', kategori: 'Kualitas Udara', tanggal: '27 September 2026', status: 'Ditinjau',
    deskripsi: 'Laporan simulasi kualitas udara.', pengukuran: { pm25: 12 },
  },
  {
    id: 'LAP-002', kategori: 'Kualitas Air', tanggal: '28 September 2026', status: 'Ditinjau',
    deskripsi: 'Laporan simulasi kualitas air.', pengukuran: { phAir: 7.2 },
  },
  {
    id: 'LAP-003', kategori: 'Kualitas Tanah', tanggal: '29 September 2026', status: 'Menunggu Tinjauan',
    deskripsi: 'Laporan simulasi kondisi tanah.', pengukuran: { phTanah: 6.5 },
  },
];