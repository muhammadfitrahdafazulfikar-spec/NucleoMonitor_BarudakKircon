import denahFasilitas from '../assets/DENAH_FASILITAS.png';
import fotoFasilitas1 from '../assets/card1.jpg';
import fotoFasilitas2 from '../assets/card2.jpg';
import fotoFasilitas3 from '../assets/card3.jpg';
import { kelasStatusFasilitas } from '../utils/statusFasilitas';

const fotoKartu = [fotoFasilitas1, fotoFasilitas2, fotoFasilitas3];

export default function Fasilitas({ fasilitas = [], fasilitasDitinjau = [] }) {
  const daftarFasilitas = Array.isArray(fasilitas) ? fasilitas.slice(0, 3) : [];
  const dataFasilitasDitinjui = Array.isArray(fasilitasDitinjau) ? fasilitasDitinjau : [];

  return (
    <section className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-sky-700">DATA FASILITAS</p>
        <h1 className="mt-2 text-3xl font-bold text-blue-950">Data Fasilitas PLTN</h1>
        <p className="mt-3 text-slate-600">
          Informasi fasilitas berikut merupakan data simulasi untuk pembelajaran.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3" aria-label="Kartu fasilitas">
        {daftarFasilitas.map((item, index) => (
          <article className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm" key={item.id}>
            <img className="h-52 w-full object-cover" src={fotoKartu[index]} alt={`Foto ${item.nama}`} />
            <div className="p-5">
              <p className="text-sm font-semibold text-sky-700">{item.id}</p>
              <h2 className="mt-2 text-xl font-bold text-blue-950">{item.nama}</h2>
              <p className="mt-3 text-slate-600">Lokasi: {item.lokasi}</p>
              <p className="mt-1 text-slate-600">Daya keluaran: {item.kapasitas}</p>
              <p className="mt-1 text-slate-600">Suhu pendingin: {item.suhuPendingin != null ? `${item.suhuPendingin} °C` : 'Belum dilaporkan'}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-semibold text-slate-800">Status:</span>
                <span className={`rounded px-3 py-1 text-sm font-semibold ${kelasStatusFasilitas(item.status)}`}>{item.status}</span>
              </div>
              {item.deskripsiPembaruan && <p className="mt-2 text-sm text-slate-600">Laporan terakhir: {item.deskripsiPembaruan}</p>}
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-blue-950">Denah Fasilitas</h2>
        <figure className="overflow-hidden rounded border border-slate-200 bg-white p-3 shadow-sm">
          <img className="mx-auto max-h-[75vh] w-full object-contain" src={denahFasilitas} alt="Denah lantai fasilitas" />
          <figcaption className="px-3 pb-2 text-sm text-slate-600">Denah lantai fasilitas.</figcaption>
        </figure>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold text-blue-950">Tabel Data Fasilitas</h2>
        <p className="mb-4 text-sm text-slate-600">Tabel hanya menampilkan data fasilitas dari laporan yang sudah ditinjau.</p>
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="bg-blue-950 text-white">
              <tr>
                {['No.', 'ID Fasilitas', 'Nama', 'Lokasi', 'Daya Keluaran', 'Suhu Pendingin', 'Status Operasional', 'Status Tinjauan', 'Pembaruan Terakhir'].map((judul) => (
                  <th className="whitespace-nowrap px-4 py-3" key={judul}>{judul}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dataFasilitasDitinjui.length > 0 ? dataFasilitasDitinjui.map((item, index) => (
                <tr key={item.id ?? index}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.lokasi}</td>
                  <td className="px-4 py-3">{item.kapasitas}</td>
                  <td className="px-4 py-3">{item.suhuPendingin != null ? `${item.suhuPendingin} °C` : '—'}</td>
                  <td className="px-4 py-3"><span className={`rounded px-3 py-1 text-sm font-semibold ${kelasStatusFasilitas(item.status)}`}>{item.status}</span></td>
                  <td className="px-4 py-3">Ditinjau</td>
                  <td className="px-4 py-3">{item.deskripsiPembaruan || item.waktuPembaruan || '—'}</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-5 text-center text-slate-600" colSpan={9}>
                    Belum ada laporan fasilitas yang ditinjau.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
