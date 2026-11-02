export function kelasStatusFasilitas(status) {
  if (status === 'Beroperasi') return 'bg-green-100 text-green-800';
  if (status === 'Pemeliharaan') return 'bg-orange-100 text-orange-800';
  if (status === 'Kerusakan') return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-600';
}
