// App mengatur state bersama dan menentukan halaman yang sedang ditampilkan.
// App adalah komponen utama yang menghubungkan navigasi dan halaman.
// Halaman laporan disimpan di localStorage supaya tetap ada setelah browser dimuat ulang.
import { useState } from 'react';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Fasilitas from './pages/Fasilitas';
import Pemantauan from './pages/pemantauan';
import Laporan from './pages/Laporan';
import { fasilitas, laporanAwal } from './data/data';
import { urutkanLaporanTerbaru } from './utils/tanggalLaporan';

const kunciLaporan = 'nucleo-laporan';
const kunciLaporanFasilitas = 'nucleo-laporan-fasilitas';

function bacaArrayLocalStorage(kunci) {
  try {
    const tersimpan = localStorage.getItem(kunci);
    if (!tersimpan) return null;
    const data = JSON.parse(tersimpan);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

// Ambil laporan dari browser. Kalau belum ada, gunakan data awal.
function ambilLaporan() {
  const laporanUtama = bacaArrayLocalStorage(kunciLaporan) ?? laporanAwal;
  const laporanFasilitasTersimpan = bacaArrayLocalStorage(kunciLaporanFasilitas) ?? [];
  const semuaLaporan = new Map(laporanUtama.map((item) => [item.id, item]));
  laporanFasilitasTersimpan.forEach((item) => semuaLaporan.set(item.id, item));
  return [...semuaLaporan.values()];
}

export default function App() {
  const [halaman, setHalaman] = useState('Dashboard');
  const [laporan, setLaporan] = useState(ambilLaporan);

  const definisiVariabel = {
    pm25: { jenis: 'Udara', parameter: 'PM2.5' },
    phAir: { jenis: 'Air', parameter: 'pH air' },
    phTanah: { jenis: 'Tanah', parameter: 'pH tanah' },
  };
  const variabelPerKategori = {
    'Kualitas Udara': 'pm25',
    'Kualitas Air': 'phAir',
    'Kualitas Tanah': 'phTanah',
  };
  const laporanLingkunganDitinjau = urutkanLaporanTerbaru(
    laporan.filter((item) => item.status === 'Ditinjau'),
  );
  const nilaiTerbaruPerParameter = new Map();
  laporanLingkunganDitinjau.forEach((item) => {
    const kunci = variabelPerKategori[item.kategori];
    const nilai = item.pengukuran?.[kunci];
    if (kunci && definisiVariabel[kunci] && nilai !== '' && nilai !== null && nilai !== undefined
      && !nilaiTerbaruPerParameter.has(kunci)) {
      nilaiTerbaruPerParameter.set(kunci, { laporan: item, nilai });
    }
  });
  const dataDariLaporan = Object.keys(definisiVariabel)
    .filter((kunci) => nilaiTerbaruPerParameter.has(kunci))
    .map((kunci) => {
      const { laporan: item, nilai } = nilaiTerbaruPerParameter.get(kunci);
      const variabel = definisiVariabel[kunci];
      return {
        id: item.id,
        jenis: variabel.jenis,
        parameter: variabel.parameter,
        nilai,
        aktivitas: item.deskripsi || 'Pengukuran dari laporan',
      };
    });
  const dataPemantauan = dataDariLaporan;
  const fasilitasTerbaru = fasilitas.map((item) => {
    const laporanTerbaruDitinjau = urutkanLaporanTerbaru(laporan).find((laporanItem) => (
      laporanItem.status === 'Ditinjau' && laporanItem.detailFasilitas?.fasilitasId === item.id
    ));
    if (!laporanTerbaruDitinjau) return item;

    const detail = laporanTerbaruDitinjau.detailFasilitas;
    return {
      ...item,
      status: detail.statusOperasional || item.status,
      kapasitas: detail.dayaKeluaran != null ? `${detail.dayaKeluaran} MW` : item.kapasitas,
      suhuPendingin: detail.suhuPendingin ?? item.suhuPendingin,
      waktuPembaruan: laporanTerbaruDitinjau.tanggal,
      deskripsiPembaruan: laporanTerbaruDitinjau.deskripsi,
      laporanDitinjau: true,
    };
  });
  const fasilitasDitinjau = fasilitasTerbaru.filter((item) => item.laporanDitinjau);

  // Simpan laporan baru ke state dan localStorage.
  function simpanLaporan(laporanBaru) {
    setLaporan(laporanBaru);
    localStorage.setItem(kunciLaporan, JSON.stringify(laporanBaru));
    localStorage.setItem(kunciLaporanFasilitas, JSON.stringify(
      laporanBaru.filter((item) => item.jenisLaporan === 'Fasilitas' || item.detailFasilitas),
    ));
  }

  // Tampilkan halaman sesuai menu yang dipilih.
  function tampilkanHalaman() {
    if (halaman === 'Data Fasilitas') {
      return <Fasilitas fasilitas={fasilitasDitinjau} />;
    }

    if (halaman === 'Pemantauan Lingkungan') {
      return <Pemantauan pemantauan={dataPemantauan} />;
    }

    if (halaman === 'Laporan Pemantauan') {
      return <Laporan laporan={laporan} setLaporan={simpanLaporan} fasilitas={fasilitas} />;
    }

    return (
      <Dashboard
        fasilitas={fasilitasDitinjau}
        pemantauan={dataPemantauan}
        laporan={laporan}
        pindahHalaman={setHalaman}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar halaman={halaman} pindahHalaman={setHalaman} />

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-8 md:py-10">
        {tampilkanHalaman()}

        <p className="rounded border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <strong>Catatan:</strong> Semua informasi dan angka merupakan data simulasi untuk pembelajaran.
        </p>
      </main>

      <Footer />
    </div>
  );
}



