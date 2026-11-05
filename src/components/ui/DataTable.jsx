import StatusBadge from "./StatusBadge";

export const humanize = (k) => k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

function cell(key, v) {
  if (v == null || v === "") return "–";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return v.name ?? v.username ?? v.title ?? JSON.stringify(v);
  if (/status/i.test(key)) return <StatusBadge value={v} />;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return v.slice(0, 16).replace("T", " ");
  return String(v);
}

// columns: optional array of "key" or { key, label, render(row) }. Without it, the first 7 keys are shown.
export default function DataTable({ rows, columns, actions, empty = "Nothing here yet." }) {
  if (!rows.length) return <p className="py-6 text-sm text-ink/60">{empty}</p>;

  const keys = columns ?? Object.keys(rows[0]).filter((k) => !Array.isArray(rows[0][k])).slice(0, 7);
  const cols = keys.map((c) => (typeof c === "string" ? { key: c, label: humanize(c) } : { label: humanize(c.key), ...c }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-line text-ink/60">
            {cols.map((c) => <th key={c.key} className="px-3 py-2 font-medium">{c.label}</th>)}
            {actions && <th className="px-3 py-2 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-line/70 last:border-0">
              {cols.map((c) => (
                <td key={c.key} className="px-3 py-2.5">{c.render ? c.render(row) : cell(c.key, row[c.key])}</td>
              ))}
              {actions && <td className="px-3 py-2.5">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
