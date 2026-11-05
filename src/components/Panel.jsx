export default function Panel({ title, note, isDemo, loading, children, className = "" }) {
  return (
    <div className={`rounded-md border border-line bg-white p-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        {loading ? (
          <span className="text-xs text-ink/50">Loading. The free server can take up to 30 seconds to wake.</span>
        ) : isDemo ? (
          <span className="rounded bg-grain/20 px-2 py-0.5 text-xs font-medium text-ink">Sample data</span>
        ) : null}
      </div>
      {note && <p className="-mt-2 mb-4 text-sm text-ink/60">{note}</p>}
      {children}
    </div>
  );
}
