import { useState } from 'react';
import StatCard from '../components/StatCard';
import Tabel from '../components/Tabel';

export default function Dashboard({ fasilitas, pemantauan, laporan, pindahHalaman }) {
  const [kataKunci, setKataKunci] = useState('');
  const [sudahMencari, setSudahMencari] = useState(false);

  // Cari fasilitas berdasarkan nama, ID, atau lokasi.
  const hasilPencarian = fasilitas.filter((item) => {
    const informasi = `${item.nama} ${item.id} ${item.lokasi}`.toLowerCase();
    return informasi.includes(kataKunci.toLowerCase());
  });

  const ringkasanFasilitas = [
    ['Nama Fasilitas', 'PLTN Edukasi Nusantara'],
    ['ID Fasilitas', 'SEN-001'],
    ['Status', 'Beroperasi (simulasi)'],
    ['Daya Keluaran', '850 MW (simulasi)'],
    ['Suhu Pendingin', '295 °C (simulasi)'],
    ['Waktu Pembaruan', '27 September 2026, 20.00 WIB (simulasi)'],
  ];

  function cariFasilitas(event) {
    event.preventDefault();
    setSudahMencari(true);
  }

  return (
    <>
      <section className="grid overflow-hidden rounded-sm bg-blue-950 text-white md:grid-cols-2">
        <div className="self-center p-7 md:p-10">
          <p className="text-xs font-bold tracking-widest text-sky-300">
            NUCLEOMONITOR · DATA SIMULASI
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
            Pantau fasilitas.<br />Pantau lingkungan.
          </h1>
          <p className="mt-4 leading-7 text-slate-300">
            Jelajahi informasi fasilitas PLTN dan data pemantauan lingkungan.
          </p>

          <form className="mt-6 flex bg-white p-1" onSubmit={cariFasilitas}>
            <input
              className="min-w-0 flex-1 border-0 px-3 py-3 text-slate-800 outline-none"
              value={kataKunci}
              onChange={(event) => setKataKunci(event.target.value)}
              placeholder="Cari nama, ID, atau lokasi fasilitas"
              aria-label="Cari fasilitas"
            />
            <button className="bg-sky-700 px-5 font-semibold text-white" type="submit">
              Cari
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-sky-200">
            <button onClick={() => pindahHalaman('Pemantauan Lingkungan')}>
              Lihat pemantauan →
            </button>
            <button onClick={() => pindahHalaman('Laporan Pemantauan')}>
              Buka laporan →
            </button>
          </div>
        </div>

        <img
          className="h-64 w-full object-cover md:h-full"
          src="/assets/PLTN.jpg"
          alt="Ilustrasi pembangkit listrik tenaga nuklir"
        />
      </section>

      {sudahMencari && (
        <section className="border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-2xl font-bold text-blue-950">Hasil Pencarian</h2>

          {hasilPencarian.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {hasilPencarian.map((item) => (
                <button
                  className="border border-slate-200 p-5 text-left hover:border-sky-600"
                  key={item.id}
                  onClick={() => pindahHalaman('Data Fasilitas')}
                >
                  <span className="text-sm text-slate-500">{item.id}</span>
                  <h3 className="mt-2 font-bold text-blue-950">{item.nama}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.lokasi} · {item.kapasitas}</p>
                  <span className="mt-3 block text-sm text-sky-700">Lihat detail →</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">Fasilitas tidak ditemukan. Coba kata kunci lain.</p>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-5 text-2xl font-bold text-blue-950">Ringkasan Sistem</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard judul="Total Fasilitas" nilai={fasilitas.length} />
          <StatCard judul="Data Pemantauan" nilai={pemantauan.length} />
          <StatCard judul="Total Laporan" nilai={laporan.length} />
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-blue-950">Informasi Fasilitas</h2>
        <Tabel kolom={['Informasi', 'Nilai Simulasi']} data={ringkasanFasilitas} />
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-blue-950">Menu Sistem</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <MenuCard judul="Data Fasilitas" pindahHalaman={pindahHalaman}>
            Identitas, lokasi, kapasitas, dan status fasilitas.
          </MenuCard>
          <MenuCard judul="Pemantauan Lingkungan" pindahHalaman={pindahHalaman}>
            Data simulasi udara, air, dan tanah.
          </MenuCard>
          <MenuCard judul="Laporan Pemantauan" pindahHalaman={pindahHalaman}>
            Riwayat laporan dan status peninjauan.
          </MenuCard>
        </div>
      </section>
    </>
  );
}

function MenuCard({ judul, children, pindahHalaman }) {
  return (
    <article className="border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold text-blue-950">{judul}</h3>
      <p className="my-4 text-sm leading-6 text-slate-600">{children}</p>
      <button
        className="rounded-sm bg-sky-700 px-4 py-2 text-sm font-semibold text-white"
        onClick={() => pindahHalaman(judul)}
      >
        Buka Halaman
      </button>
    </article>
  );
}