import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Tabel from '../components/Tabel';

const gambar = [
  { jenis: 'Udara', file: 'udaraPemantauan.jpg' },
  { jenis: 'Air', file: 'airPemantauan.jpg' },
  { jenis: 'Tanah', file: 'tanahpemantauan.jpg' },
];
const aturanStatus = [
  {
    kunci: 'pm25', nama: 'PM2.5 Udara', satuan: 'µg/m³', ambang: 'Aman ≤ 15; waspada ≤ 35; di atasnya bahaya',
    nilaiStatus: (nilai) => nilai <= 15 ? 'Aman' : nilai <= 35 ? 'Waspada' : 'Bahaya',
  },
  {
    kunci: 'phAir', nama: 'pH Air', satuan: 'pH', ambang: 'Aman 6,5–8,5; waspada 5,5–9,5; di luar itu bahaya',
    nilaiStatus: (nilai) => nilai >= 6.5 && nilai <= 8.5 ? 'Aman' : nilai >= 5.5 && nilai <= 9.5 ? 'Waspada' : 'Bahaya',
  },
  {
    kunci: 'phTanah', nama: 'pH Tanah', satuan: 'pH', ambang: 'Aman 5,5–7,5; waspada 4,5–8,5; di luar itu bahaya',
    nilaiStatus: (nilai) => nilai >= 5.5 && nilai <= 7.5 ? 'Aman' : nilai >= 4.5 && nilai <= 8.5 ? 'Waspada' : 'Bahaya',
  },
];

function ambilNilaiTerbaru(laporan, kunci) {
  const laporanTerbaru = [...laporan].reverse();
  const laporanDenganNilai = laporanTerbaru.find((item) => {
    return item.pengukuran && item.pengukuran[kunci] !== '' && item.pengukuran[kunci] !== undefined;
  });

  return laporanDenganNilai ? Number(laporanDenganNilai.pengukuran[kunci]) : null;
}

function warnaStatus(status) {
  if (status === 'Aman') return 'bg-green-100 text-green-800';
  if (status === 'Waspada') return 'bg-amber-100 text-amber-800';
  if (status === 'Bahaya') return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-700';
}

export default function Pemantauan({ pemantauan, laporan = [] }) {
  const [filter, setFilter] = useState('Semua');
  const dataTampil = pemantauan.filter((item) => filter === 'Semua' || item.jenis === filter);
  const barisTabel = dataTampil.map((item, index) => [
    index + 1, item.id, item.jenis, item.parameter, item.nilai, item.aktivitas,
  ]);
  const hasilMatriks = aturanStatus.map((aturan) => {
    const nilai = ambilNilaiTerbaru(laporan, aturan.kunci);
    return { ...aturan, nilai, status: nilai === null || Number.isNaN(nilai) ? 'Belum ada data' : aturan.nilaiStatus(nilai) };
  });
  const urutanStatus = ['Aman', 'Waspada', 'Bahaya'];
  const statusTersedia = hasilMatriks.map((item) => item.status).filter((status) => urutanStatus.includes(status));
  const statusUmum = statusTersedia.length
    ? urutanStatus[Math.max(...statusTersedia.map((status) => urutanStatus.indexOf(status)))]
    : 'Belum ada data';

  return (
    <>
      <PageTitle label="Pemantauan Lingkungan" title="Pemantauan Lingkungan">
        Data pemantauan dan hasil perhitungan sederhana dari angka yang dimasukkan melalui laporan.
      </PageTitle>

      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-sky-700">HASIL PERHITUNGAN</p>
            <h2 className="mt-1 text-2xl font-bold text-blue-950">Status simulasi lingkungan</h2>
          </div>
          <span className={`rounded px-4 py-2 font-bold ${warnaStatus(statusUmum)}`}>{statusUmum}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Hasil ini hanya demonstrasi pengolahan data lingkungan. Bukan penilaian keselamatan atau status operasional PLTN.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Nilai Terbaru</th>
                <th className="px-4 py-3">Aturan Simulasi</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {hasilMatriks.map((item) => (
                <tr key={item.kunci}>
                  <td className="px-4 py-3 font-medium">{item.nama}</td>
                  <td className="px-4 py-3">{item.nilai === null ? 'Belum diisi' : `${item.nilai} ${item.satuan}`}</td>
                  <td className="min-w-64 px-4 py-3 text-sm text-slate-600">{item.ambang}</td>
                  <td className="px-4 py-3"><span className={`rounded px-3 py-1 text-sm font-semibold ${warnaStatus(item.status)}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">Ambang pada tabel adalah angka contoh untuk proyek pembelajaran, bukan standar lingkungan atau standar keselamatan PLTN.</p>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-blue-950">Data Pemantauan</h2>
          <label className="text-sm font-semibold text-slate-700">
            Filter jenis
            <select className="mt-2 block rounded border border-slate-300 bg-white px-3 py-2" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option>Semua</option><option>Udara</option><option>Air</option><option>Tanah</option>
            </select>
          </label>
        </div>
        <Tabel kolom={['No.', 'ID Data', 'Jenis', 'Parameter', 'Nilai', 'Aktivitas']} data={barisTabel} />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {gambar.map((item) => (
          <article className="overflow-hidden border border-slate-200 bg-white" key={item.jenis}>
            <img className="h-48 w-full object-cover" src={`/assets/${item.file}`} alt={`Pemantauan ${item.jenis}`} />
            <div className="p-5"><h3 className="text-xl font-bold text-blue-950">Kualitas {item.jenis}</h3></div>
          </article>
        ))}
      </section>
    </>
  );
}

