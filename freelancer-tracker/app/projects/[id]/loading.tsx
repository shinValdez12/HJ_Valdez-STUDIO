export default function ProjectLoading() {
  return (
    <div className="page-container page-content flex min-h-[60vh] items-center justify-center">
      <div className="space-y-3 rounded-3xl border border-brand-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-6 w-48 rounded-full bg-brand-100 animate-pulse dark:bg-slate-800" />
        <div className="h-4 w-96 rounded-full bg-brand-100 animate-pulse dark:bg-slate-800" />
        <div className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="h-28 rounded-3xl bg-brand-100 animate-pulse dark:bg-slate-800" />
          <div className="h-28 rounded-3xl bg-brand-100 animate-pulse dark:bg-slate-800" />
        </div>
      </div>
    </div>
  )
}
