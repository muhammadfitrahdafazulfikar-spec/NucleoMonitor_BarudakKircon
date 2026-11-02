// Halaman laporan menyimpan laporan lingkungan dan laporan fasilitas.
import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import StatCard from '../components/StatCard';
import Tabel from '../components/Tabel';
import { urutkanLaporanTerbaru } from '../utils/tanggalLaporan';

const gayaInput = 'mt-2 block w-full rounded border border-slate-300 px-3 py-3 outline-none focus:border-sky-600';

export default function Laporan({ laporan, setLaporan, fasilitas = [] }) {
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [jenisForm, setJenisForm] = useState('Lingkungan');
  const [kategoriLingkungan, setKategoriLingkungan] = useState('Kualitas Udara');
  const [pesan, setPesan] = useState('');
  const sudahDitinjau = laporan.filter((item) => item.status === 'Ditinjau').length;

  function ubahStatusTinjauan(id, status) {
    setLaporan(laporan.map((item) => item.id === id ? { ...item, status } : item));
  }

  function pilihanStatus(item) {
    return (
      <select
        className="rounded border border-slate-300 bg-white px-2 py-2"
        value={item.status}
        onChange={(event) => ubahStatusTinjauan(item.id, event.target.value)}
        aria-label={`Status tinjauan ${item.id}`}
      >
        <option>Menunggu Tinjauan</option>
        <option>Ditinjau</option>
      </select>
    );
  }

  function tambahLaporan(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const idBaru = form.get('id').trim();

    if (laporan.some((item) => item.id.toLowerCase() === idBaru.toLowerCase())) {
      setPesan('ID laporan sudah digunakan.');
      return;
    }

    const pengukuran = {};
    let kategori;
    let detailFasilitas;

    if (jenisForm === 'Lingkungan') {
      kategori = form.get('kategori');
      const kunciPengukuran = {
        'Kualitas Udara': 'pm25',
        'Kualitas Air': 'phAir',
        'Kualitas Tanah': 'phTanah',
      }[kategori];
      const nilai = form.get(kunciPengukuran);
      if (!nilai) {
        setPesan(`Isi nilai untuk kategori ${kategori.toLowerCase()}.`);
        return;
      }
      pengukuran[kunciPengukuran] = Number(nilai);
    } else {
      const fasilitasTerpilih = fasilitas.find((item) => item.id === form.get('fasilitasId'));
      kategori = 'Laporan Fasilitas';
      detailFasilitas = {
        fasilitasId: fasilitasTerpilih?.id ?? '',
        namaFasilitas: fasilitasTerpilih?.nama ?? '',
        statusOperasional: form.get('statusOperasional'),
        dayaKeluaran: form.get('dayaKeluaran') ? Number(form.get('dayaKeluaran')) : null,
        suhuPendingin: form.get('suhuPendingin') ? Number(form.get('suhuPendingin')) : null,
      };
    }

    const tanggalISO = form.get('tanggal');
    const tanggal = new Date(`${tanggalISO}T00:00:00`);
    const laporanBaru = {
      id: idBaru,
      jenisLaporan: jenisForm,
      kategori,
      tanggalISO,
      tanggal: tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: form.get('status'),
      deskripsi: form.get('deskripsi').trim(),
      pengukuran,
      ...(detailFasilitas ? { detailFasilitas } : {}),
    };

    setLaporan([...laporan, laporanBaru]);
    event.target.reset();
    setPesan(`Laporan ${jenisForm.toLowerCase()} berhasil ditambahkan.`);
    setFormTerbuka(false);
  }

  const laporanFasilitas = urutkanLaporanTerbaru(
    laporan.filter((item) => item.jenisLaporan === 'Fasilitas' || item.detailFasilitas),
  );
  const laporanLingkungan = urutkanLaporanTerbaru(
    laporan.filter((item) => item.jenisLaporan !== 'Fasilitas' && !item.detailFasilitas),
  );

  const barisLingkungan = laporanLingkungan.map((item) => [
    item.id,
    item.kategori,
    item.tanggal,
    item.pengukuran?.pm25 ?? '—',
    item.pengukuran?.phAir ?? '—',
    item.pengukuran?.phTanah ?? '—',
    item.deskripsi || '—',
    pilihanStatus(item),
  ]);

  const barisFasilitas = laporanFasilitas.map((item) => [
    item.id,
    item.detailFasilitas?.fasilitasId ?? '—',
    item.detailFasilitas?.namaFasilitas ?? '—',
    item.tanggal,
    item.detailFasilitas?.statusOperasional ?? '—',
    item.detailFasilitas?.dayaKeluaran ?? '—',
    item.detailFasilitas?.suhuPendingin ?? '—',
    item.deskripsi || '—',
    pilihanStatus(item),
  ]);

  return (
    <>
      <PageTitle label="Manajemen Laporan" title="Laporan Pemantauan">
        Pilih jenis laporan. Nilai mentah lingkungan akan dihitung di halaman pemantauan, sedangkan laporan fasilitas menyimpan kondisi fasilitas.
      </PageTitle>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard judul="Total Laporan" nilai={laporan.length} />
        <StatCard judul="Sudah Ditinjau" nilai={sudahDitinjau} />
        <StatCard judul="Menunggu Tinjauan" nilai={laporan.length - sudahDitinjau} />
      </section>

      <section className="border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="text-2xl font-bold text-blue-950">Buat Laporan Baru</h2><p className="mt-2 text-slate-600">Pilih form lingkungan atau form fasilitas.</p></div>
          <button className="rounded-sm bg-sky-700 px-5 py-3 font-semibold text-white" onClick={() => setFormTerbuka(!formTerbuka)}>
            {formTerbuka ? 'Tutup Form' : 'Tampilkan Form'}
          </button>
        </div>

        {pesan && <p className="mt-4 rounded bg-sky-50 p-3 text-sky-900" role="status">{pesan}</p>}

        {formTerbuka && (
          <>
            <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Pilih jenis form laporan">
              {['Lingkungan', 'Fasilitas'].map((jenis) => (
                <button
                  className={`rounded-sm px-5 py-3 font-semibold ${jenisForm === jenis ? 'bg-blue-950 text-white' : 'border border-slate-300 text-slate-700'}`}
                  key={jenis}
                  type="button"
                  aria-pressed={jenisForm === jenis}
                  onClick={() => { setJenisForm(jenis); setPesan(''); }}
                >
                  Form {jenis === 'Lingkungan' ? 'Laporan Lingkungan' : 'Fasilitas'}
                </button>
              ))}
            </div>

            <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={tambahLaporan}>
              <label className="font-semibold">ID Laporan<input className={gayaInput} name="id" required placeholder="Contoh: LAP-004" /></label>
              <label className="font-semibold">Tanggal<input className={gayaInput} name="tanggal" type="date" required /></label>
              <label className="font-semibold">Status Tinjauan
                <select className={gayaInput} name="status" defaultValue="Menunggu Tinjauan"><option>Menunggu Tinjauan</option><option>Ditinjau</option></select>
              </label>

              {jenisForm === 'Lingkungan' ? (
                <>
                  <label className="font-semibold">Kategori Lingkungan
                    <select
                      className={gayaInput}
                      name="kategori"
                      required
                      value={kategoriLingkungan}
                      onChange={(event) => setKategoriLingkungan(event.target.value)}
                    >
                      <option>Kualitas Udara</option><option>Kualitas Air</option><option>Kualitas Tanah</option>
                    </select>
                  </label>
                  <div className="rounded border border-slate-200 p-4 md:col-span-2">
                    <h3 className="font-bold text-blue-950">Nilai mentah lingkungan</h3>
                    <p className="mt-1 text-sm text-slate-600">Isi nilai sesuai kategori yang dipilih. Untuk perhitungan ISPU, nilai PM2.5 perlu berupa rata-rata 24 jam. Deskripsi laporan menjadi aktivitas pada data pemantauan.</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {kategoriLingkungan === 'Kualitas Udara' && <label className="text-sm font-semibold">PM2.5 udara, rata-rata 24 jam (µg/m³)<input className={gayaInput} name="pm25" type="number" min="0" step="any" required placeholder="Contoh: 12" /></label>}
                      {kategoriLingkungan === 'Kualitas Air' && <label className="text-sm font-semibold">pH air<input className={gayaInput} name="phAir" type="number" min="0" max="14" step="any" required placeholder="Contoh: 7.2" /></label>}
                      {kategoriLingkungan === 'Kualitas Tanah' && <label className="text-sm font-semibold">pH tanah<input className={gayaInput} name="phTanah" type="number" min="0" max="14" step="any" required placeholder="Contoh: 6.5" /></label>}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <label className="font-semibold">Fasilitas
                    <select className={gayaInput} name="fasilitasId" required defaultValue="">
                      <option value="" disabled>Pilih fasilitas</option>
                      {fasilitas.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.nama}</option>)}
                    </select>
                  </label>
                  <label className="font-semibold">Status Operasional
                    <select className={gayaInput} name="statusOperasional" required defaultValue="Beroperasi"><option>Beroperasi</option><option>Pemeliharaan</option><option>Tidak Aktif</option></select>
                  </label>
                  <label className="font-semibold">Daya Keluaran (MW)<input className={gayaInput} name="dayaKeluaran" type="number" min="0" step="any" placeholder="Contoh: 850" /></label>
                  <label className="font-semibold">Suhu Pendingin (°C)<input className={gayaInput} name="suhuPendingin" type="number" min="0" step="any" placeholder="Contoh: 295" /></label>
                </>
              )}

              <label className="font-semibold md:col-span-2">Deskripsi<textarea className={gayaInput} name="deskripsi" rows="3" required placeholder="Tuliskan keterangan laporan..." /></label>
              <div className="flex gap-3 md:col-span-2"><button className="rounded-sm bg-sky-700 px-5 py-3 font-semibold text-white">Simpan</button><button className="rounded-sm border border-slate-300 px-5 py-3" type="reset">Reset</button></div>
            </form>
          </>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-blue-950">Riwayat Laporan Lingkungan</h2>
        <Tabel kolom={['ID', 'Kategori', 'Tanggal', 'PM2.5', 'pH Air', 'pH Tanah', 'Aktivitas', 'Status Tinjauan']} data={barisLingkungan} />
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-blue-950">Riwayat Laporan Fasilitas</h2>
        <Tabel kolom={['ID', 'ID Fasilitas', 'Nama Fasilitas', 'Tanggal', 'Status Operasional', 'Daya (MW)', 'Suhu Pendingin (°C)', 'Deskripsi', 'Status Tinjauan']} data={barisFasilitas} />
      </section>
    </>
  );
}
