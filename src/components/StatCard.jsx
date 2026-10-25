export default function StatCard({ judul, nilai }) {
  return (
    <article className="rounded border border-slate-200 border-t-4 border-t-sky-600 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-600">{judul}</h2>
      <p className="mt-2 text-3xl font-bold text-blue-950">{nilai}</p>
    </article>
  );
}