// App mengatur state bersama dan menentukan halaman yang sedang ditampilkan.
// App adalah komponen utama yang menghubungkan navigasi dan halaman.
// Halaman laporan disimpan di localStorage supaya tetap ada setelah browser dimuat ulang.
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Fasilitas from './pages/Fasilitas';
import Pemantauan from './pages/pemantauan';
import Laporan from './pages/Laporan';
import { fasilitas, pemantauan, laporanAwal } from './data/data';

// Ambil laporan dari browser. Kalau belum ada, gunakan data awal.
function ambilLaporan() {
  const dataTersimpan = localStorage.getItem('nucleo-laporan');

  if (dataTersimpan) {
    return JSON.parse(dataTersimpan);
  }

  return laporanAwal;
}

export default function App() {
  const [halaman, setHalaman] = useState('Dashboard');
  const [laporan, setLaporan] = useState(ambilLaporan);

  // Simpan laporan baru ke state dan localStorage.
  function simpanLaporan(laporanBaru) {
    setLaporan(laporanBaru);
    localStorage.setItem('nucleo-laporan', JSON.stringify(laporanBaru));
  }

  // Tampilkan halaman sesuai menu yang dipilih.
  function tampilkanHalaman() {
    if (halaman === 'Data Fasilitas') {
      return <Fasilitas fasilitas={fasilitas} />;
    }

    if (halaman === 'Pemantauan Lingkungan') {
      return <Pemantauan pemantauan={pemantauan} laporan={laporan} />;
    }

    if (halaman === 'Laporan Pemantauan') {
      return <Laporan laporan={laporan} setLaporan={simpanLaporan} />;
    }

    return (
      <Dashboard
        fasilitas={fasilitas}
        pemantauan={pemantauan}
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



