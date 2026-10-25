// Halaman laporan menerima data form dan mengirimnya kembali ke App.jsx.
import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import StatCard from '../components/StatCard';
import Tabel from '../components/Tabel';

const gayaInput = 'mt-2 block w-full rounded border border-slate-300 px-3 py-3 outline-none focus:border-sky-600';

export default function Laporan({ laporan, setLaporan }) {
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [pesan, setPesan] = useState('');
  const sudahDitinjau = laporan.filter((item) => item.status === 'Ditinjau').length;

  function tambahLaporan(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const idBaru = form.get('id').trim();
    const pm25 = form.get('pm25');
    const phAir = form.get('phAir');
    const phTanah = form.get('phTanah');

    if (!pm25 && !phAir && !phTanah) {
      setPesan('Isi setidaknya satu nilai pemantauan.');
      return;
    }

    const idSudahAda = laporan.some((item) => item.id.toLowerCase() === idBaru.toLowerCase());
    if (idSudahAda) {
      setPesan('ID laporan sudah digunakan.');
      return;
    }

    const pengukuran = {};
    if (pm25) pengukuran.pm25 = Number(pm25);
    if (phAir) pengukuran.phAir = Number(phAir);
    if (phTanah) pengukuran.phTanah = Number(phTanah);

    const tanggal = new Date(`${form.get('tanggal')}T00:00:00`);
    const laporanBaru = {
      id: idBaru,
      kategori: form.get('kategori'),
      tanggal: tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: form.get('status'),
      deskripsi: form.get('deskripsi').trim(),
      pengukuran,
    };

    setLaporan([...laporan, laporanBaru]);
    event.target.reset();
    setPesan('Laporan dan nilai pemantauan berhasil ditambahkan.');
    setFormTerbuka(false);
  }
 const barisTabel = laporan.map((item) => [
    item.id,
    item.kategori,
    item.tanggal,
    item.pengukuran?.pm25 ?? '—',
    item.pengukuran?.phAir ?? '—',
    item.pengukuran?.phTanah ?? '—',
    item.status,
  ]);

  return (
    <>
      <PageTitle label="Manajemen Laporan" title="Laporan Pemantauan">
        Tambahkan laporan dan nilai mentah lingkungan untuk dihitung di halaman pemantauan.
      </PageTitle>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard judul="Total Laporan" nilai={laporan.length} />
        <StatCard judul="Sudah Ditinjau" nilai={sudahDitinjau} />
        <StatCard judul="Menunggu Tinjauan" nilai={laporan.length - sudahDitinjau} />
      </section>

      <section className="border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="text-2xl font-bold text-blue-950">Buat Laporan Baru</h2><p className="mt-2 text-slate-600">Isi laporan dan angka pemantauan.</p></div>
          <button className="rounded-sm bg-sky-700 px-5 py-3 font-semibold text-white" onClick={() => setFormTerbuka(!formTerbuka)}>
            {formTerbuka ? 'Tutup Form' : 'Tampilkan Form'}
          </button>
        </div>

        {pesan && <p className="mt-4 rounded bg-sky-50 p-3 text-sky-900" role="status">{pesan}</p>}

        {formTerbuka && (
          <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={tambahLaporan}>
            <label className="font-semibold">ID Laporan<input className={gayaInput} name="id" required placeholder="Contoh: LAP-004" /></label>
            <label className="font-semibold">Kategori
              <select className={gayaInput} name="kategori" required defaultValue="">
                <option value="" disabled>Pilih kategori</option><option>Kualitas Udara</option><option>Kualitas Air</option><option>Kualitas Tanah</option><option>Fasilitas</option><option>Lainnya</option>
              </select>
            </label>
            <label className="font-semibold">Tanggal<input className={gayaInput} name="tanggal" type="date" required /></label>
            <label className="font-semibold">Status
              <select className={gayaInput} name="status" defaultValue="Menunggu Tinjauan"><option>Menunggu Tinjauan</option><option>Ditinjau</option></select>
            </label>

            <div className="rounded border border-slate-200 p-4 md:col-span-2">
              <h3 className="font-bold text-blue-950">Nilai mentah pemantauan</h3>
              <p className="mt-1 text-sm text-slate-600">Isi satu atau beberapa nilai. Angka ini akan diproses sebagai simulasi.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="text-sm font-semibold">PM2.5 udara (µg/m³)<input className={gayaInput} name="pm25" type="number" min="0" step="any" placeholder="Contoh: 12" /></label>
                <label className="text-sm font-semibold">pH air<input className={gayaInput} name="phAir" type="number" min="0" max="14" step="any" placeholder="Contoh: 7.2" /></label>
                <label className="text-sm font-semibold">pH tanah<input className={gayaInput} name="phTanah" type="number" min="0" max="14" step="any" placeholder="Contoh: 6.5" /></label>
              </div>
            </div>

            <label className="font-semibold md:col-span-2">Deskripsi<textarea className={gayaInput} name="deskripsi" rows="3" required placeholder="Tuliskan keterangan laporan..." /></label>
            <div className="flex gap-3 md:col-span-2"><button className="rounded-sm bg-sky-700 px-5 py-3 font-semibold text-white">Simpan</button><button className="rounded-sm border border-slate-300 px-5 py-3" type="reset">Reset</button></div>
          </form>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-blue-950">Riwayat Laporan</h2>
        <Tabel kolom={['ID', 'Kategori', 'Tanggal', 'PM2.5', 'pH Air', 'pH Tanah', 'Status']} data={barisTabel} />
      </section>
    </>
  );

  
}