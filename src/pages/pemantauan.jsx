// Halaman pemantauan menghitung nilai dari laporan lingkungan yang sudah ditinjau.
import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Tabel from '../components/Tabel';

const gambar = [
  { jenis: 'Udara', file: 'udaraPemantauan.jpg' },
  { jenis: 'Air', file: 'airPemantauan.jpg' },
  { jenis: 'Tanah', file: 'tanahpemantauan.jpg' },
];

// Titik konsentrasi dan indeks ISPU PM2.5 24 jam dari PermenLHK 14/2020.
const rentangISPU = [
  { xLow: 0, xHigh: 15.5, iLow: 0, iHigh: 50 },
  { xLow: 15.5, xHigh: 55.4, iLow: 50, iHigh: 100 },
  { xLow: 55.4, xHigh: 150.4, iLow: 100, iHigh: 200 },
  { xLow: 150.4, xHigh: 250.4, iLow: 200, iHigh: 300 },
];

function hitungISPU(pm25) {
  if (pm25 > 250.4) return { nilai: null, tampilan: 'ISPU > 300' };
  const rentang = rentangISPU.find((item) => pm25 <= item.xHigh) ?? rentangISPU[0];
  const indeks = ((rentang.iHigh - rentang.iLow) / (rentang.xHigh - rentang.xLow))
    * (pm25 - rentang.xLow) + rentang.iLow;
  const nilai = Math.round(indeks);
  return { nilai, tampilan: `ISPU ${nilai}` };
}

function hitungStatus(item) {
  const nilai = Number(item.nilai);
  if (!Number.isFinite(nilai)) return { status: 'Data tidak valid', metode: 'Nilai harus berupa angka.' };

  if (item.parameter === 'PM2.5') {
    if (nilai < 0) return { status: 'Data tidak valid', metode: 'Konsentrasi tidak boleh negatif.' };
    const ispu = hitungISPU(nilai);
    const status = ispu.nilai === null || ispu.nilai > 100
      ? 'Bahaya'
      : ispu.nilai > 50 ? 'Waspada' : 'Aman';
    return { status, metode: `${ispu.tampilan}, konsentrasi rata-rata 24 jam` };
  }

  if (item.parameter === 'pH air') {
    return {
      status: nilai >= 6 && nilai <= 9 ? 'Aman' : 'Bahaya',
      metode: 'Baku mutu air permukaan Indonesia: pH 6–9',
    };
  }

  if (item.parameter === 'pH tanah') {
    const status = nilai >= 6 && nilai <= 7
      ? 'Aman'
      : (nilai >= 5.5 && nilai < 6) || (nilai > 7 && nilai <= 7.5)
        ? 'Waspada'
        : 'Bahaya';
    return {
      status,
      metode: 'Skrining umum: Aman 6–7; Waspada 5,5–<6 atau >7–7,5; Bahaya di luar rentang.',
    };
  }

  return { status: 'Belum ada acuan', metode: 'Parameter belum memiliki aturan perhitungan.' };
}

function warnaStatus(status) {
  if (status === 'Aman') return 'bg-green-100 text-green-800';
  if (status === 'Waspada') return 'bg-orange-100 text-orange-800';
  if (status === 'Bahaya') return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-700';
}

export default function Pemantauan({ pemantauan = [] }) {
  const [filter, setFilter] = useState('Semua');
  const hasilMatriks = pemantauan.map((item) => ({ ...item, ...hitungStatus(item) }));
  const statusTerbaruPerParameter = new Map();
  hasilMatriks.forEach((item) => statusTerbaruPerParameter.set(item.parameter, item.status));
  const hasilTerbaruPerJenis = new Map();
  hasilMatriks.forEach((item) => hasilTerbaruPerJenis.set(item.jenis, item));
  const urutanStatus = ['Aman', 'Waspada', 'Bahaya'];
  const statusTersedia = [...statusTerbaruPerParameter.values()].filter((status) => urutanStatus.includes(status));
  const adaDataPerluKonteks = [...statusTerbaruPerParameter.values()].includes('Perlu konteks');
  const statusUmum = statusTersedia.length
    ? urutanStatus[Math.max(...statusTersedia.map((status) => urutanStatus.indexOf(status)))]
    : adaDataPerluKonteks ? 'Perlu konteks' : 'Belum ada data';

  const dataTampil = hasilMatriks.filter((item) => filter === 'Semua' || item.jenis === filter);
  const barisTabel = dataTampil.map((item, index) => [
    index + 1, item.id, item.jenis, item.parameter, item.nilai, item.aktivitas,
  ]);

  return (
    <>
      <PageTitle label="Pemantauan Lingkungan" title="Pemantauan Lingkungan">
        Data laporan lingkungan yang sudah ditinjau ditampilkan dan dihitung di halaman ini.
      </PageTitle>

      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-sky-700">HASIL PERHITUNGAN</p>
            <h2 className="mt-1 text-2xl font-bold text-blue-950">Status lingkungan</h2>
          </div>
          <span className={`rounded px-4 py-2 font-bold ${warnaStatus(statusUmum)}`}>{statusUmum}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Status ringkasan mengambil tingkat tertinggi dari parameter yang sudah dihitung. Ini bukan penilaian keselamatan PLTN.
        </p>

        

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3">ID Laporan</th>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Nilai (angka)</th>
                <th className="px-4 py-3">Metode dan acuan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {hasilMatriks.length ? hasilMatriks.map((item, index) => (
                <tr key={`${item.id}-${item.parameter}-${index}`}>
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.parameter}</td>
                  <td className="px-4 py-3">{item.nilai}</td>
                  <td className="min-w-64 px-4 py-3 text-sm text-slate-600">{item.metode}</td>
                  <td className="px-4 py-3"><span className={`rounded px-3 py-1 text-sm font-semibold ${warnaStatus(item.status)}`}>{item.status}</span></td>
                </tr>
              )) : (
                <tr><td className="px-4 py-4 text-center text-slate-600" colSpan={5}>Belum ada data pemantauan yang ditinjau.</td></tr>
              )}
            </tbody>
          </table>
        </div>



      </section>

            <section className="grid gap-5 md:grid-cols-3">
        {gambar.map((item) => {
          const hasil = hasilTerbaruPerJenis.get(item.jenis);
          return (
            <article className="overflow-hidden border border-slate-200 bg-white" key={item.jenis}>
              <img className="h-48 w-full object-cover" src={`/assets/${item.file}`} alt={`Pemantauan ${item.jenis}`} />
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-950">Kualitas {item.jenis}</h3>
                {hasil ? (
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>ID Laporan: <span className="font-semibold text-slate-800">{hasil.id}</span></p>
                    <p>Parameter: <span className="font-semibold text-slate-800">{hasil.parameter}</span></p>
                    <p>Nilai: <span className="font-semibold text-slate-800">{hasil.nilai}</span></p>
                    <span className={`inline-block rounded px-3 py-1 text-sm font-semibold ${warnaStatus(hasil.status)}`}>{hasil.status}</span>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Belum ada data yang ditinjau.</p>
                )}
              </div>
            </article>
          );
        })}
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
        <Tabel kolom={['No.', 'ID Laporan', 'Jenis', 'Parameter', 'Nilai (angka)', 'Aktivitas']} data={barisTabel} />
      </section>


    </>
  );
}
