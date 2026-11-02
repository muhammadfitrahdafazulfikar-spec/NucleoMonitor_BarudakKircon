export default function Tabel({ kolom, data }) {
  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead className="bg-blue-950 text-white">
          <tr>
            {kolom.map((judul) => (
              <th key={judul} className="whitespace-nowrap px-5 py-4">
                {judul}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length > 0 ? (
            data.map((baris, index) => (
              <tr key={index} className="hover:bg-slate-50">
                {baris.map((isi, nomor) => (
                  <td key={nomor} className="px-5 py-4">
                    {isi}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-5 py-4 text-center" colSpan={kolom.length}>
                Data tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}