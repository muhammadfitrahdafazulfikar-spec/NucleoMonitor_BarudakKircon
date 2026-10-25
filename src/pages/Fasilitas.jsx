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

}