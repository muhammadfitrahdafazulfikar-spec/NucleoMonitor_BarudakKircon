export default function PageTitle({ label, title, children }) {
  return (
    <section>
      <span className="inline-block rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800">{label}</span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">{title}</h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600">{children}</p>
    </section>
  );
}