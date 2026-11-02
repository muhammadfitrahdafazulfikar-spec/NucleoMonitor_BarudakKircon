export default function Fasilitas({ fasilitas = [] }) {
  const daftarFasilitas = Array.isArray(fasilitas) ? fasilitas : [];

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-sky-700">DATA FASILITAS</p>
        <h1 className="mt-2 text-3xl font-bold text-blue-950">Data Fasilitas PLTN</h1>
        <p className="mt-3 text-slate-600">
          Informasi fasilitas berikut merupakan data simulasi untuk pembelajaran.
        </p>
      </header>

      <div className="overflow-x-auto border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left">
          <thead className="bg-blue-950 text-white">
            <tr>
              {['No.', 'ID Fasilitas', 'Nama', 'Lokasi', 'Kapasitas', 'Status'].map((judul) => (
                <th className="whitespace-nowrap px-4 py-3" key={judul}>{judul}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {daftarFasilitas.length > 0 ? daftarFasilitas.map((item, index) => (
              <tr key={item.id ?? index}>
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3">{item.nama}</td>
                <td className="px-4 py-3">{item.lokasi}</td>
                <td className="px-4 py-3">{item.kapasitas}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            )) : (
              <tr>
                <td className="px-4 py-5 text-center text-slate-600" colSpan={6}>
                  Belum ada data fasilitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {daftarFasilitas.map((item) => (
          <article className="border border-slate-200 bg-white p-5" key={item.id}>
            <p className="text-sm font-semibold text-sky-700">{item.id}</p>
            <h2 className="mt-2 text-xl font-bold text-blue-950">{item.nama}</h2>
            <p className="mt-3 text-slate-600">Lokasi: {item.lokasi}</p>
            <p className="mt-1 text-slate-600">Kapasitas: {item.kapasitas}</p>
            <p className="mt-3 font-semibold text-slate-800">Status: {item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
