import { useState } from 'react';

const menu = ['Dashboard', 'Data Fasilitas', 'Pemantauan Lingkungan', 'Laporan Pemantauan'];

export default function Navbar({ halaman, pindahHalaman }) {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <>
      <div className="bg-slate-900 text-slate-300">
        <div className="mx-auto flex max-w-7xl justify-between px-5 py-2 text-xs">
          <span>NucleoMonitor</span><span>Sistem Informasi Pemantauan PLTN</span>
        </div>
      </div>
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-5">
          <button className="py-4 text-2xl font-bold tracking-tight text-blue-950" onClick={() => pindahHalaman('Dashboard')}>
            Nucleo<span className="text-sky-600">Monitor</span>
          </button>
          <button className="rounded border border-slate-300 px-3 py-2 text-slate-700 md:hidden" onClick={() => setMenuTerbuka(!menuTerbuka)} aria-expanded={menuTerbuka} aria-label="Buka menu">☰</button>
          <div className={`${menuTerbuka ? 'flex' : 'hidden'} w-full flex-col md:flex md:w-auto md:flex-row`}>
            {menu.map((item) => (
              <button key={item} className={`border-b-2 px-3 py-4 text-left text-sm ${halaman === item ? 'border-sky-500 font-semibold text-sky-700' : 'border-transparent text-slate-600 hover:text-sky-700'}`} onClick={() => { pindahHalaman(item); setMenuTerbuka(false); }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}