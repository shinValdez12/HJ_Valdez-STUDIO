export default function ClientViewLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-10 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Loading client page</p>
        <p className="mt-4 text-xl font-semibold text-white">Preparing your client view…</p>
      </div>
    </div>
  )
}
