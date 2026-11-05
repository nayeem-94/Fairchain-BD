import { useState } from "react";
import { api, errorMessage } from "../api/client";
import { useApi } from "../hooks/useApi";
import DataTable, { humanize } from "./ui/DataTable";
import DynamicForm from "./ui/DynamicForm";
import { BTN_OUTLINE } from "./ui/styles";

function KeyValues({ data }) {
  const entries = Object.entries(data ?? {});
  if (!entries.length) return <p className="py-6 text-sm text-ink/60">Nothing here yet.</p>;
  return (
    <dl className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-line py-2">
          <dt className="text-ink/70">{humanize(k)}</dt>
          <dd className="font-semibold">{typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

// Loads `path`, shows a table (or key/values for object responses), and optionally an "add" form.
//   form: { label, fields, path?, submitLabel? }   actions: (row, reload) => node   toolbar: (reload) => node
export default function ResourcePanel({ title, note, path, columns, form, actions, toolbar, empty }) {
  const { data, loading, error, reload } = useApi(path);
  const [adding, setAdding] = useState(false);

  const listy =
    Array.isArray(data) || Array.isArray(data?.results) ||
    (data && typeof data === "object" && Object.values(data).some(Array.isArray));
  const rows = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : listy ? Object.values(data).find(Array.isArray) : [];

  return (
    <section className="rounded-md border border-line bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          {note && <p className="text-sm text-ink/60">{note}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {toolbar?.(reload)}
          {form && <button type="button" onClick={() => setAdding((a) => !a)} className={BTN_OUTLINE}>{adding ? "Cancel" : form.label}</button>}
        </div>
      </div>

      {adding && form && (
        <div className="mb-5 rounded-md border border-line bg-paper p-4">
          <DynamicForm
            fields={form.fields}
            submitLabel={form.submitLabel ?? "Save"}
            onSubmit={async (values) => {
              await api(form.path ?? path, { method: "POST", body: values });
              reload();
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="py-6 text-sm text-ink/60">Loading. The free server can take up to 30 seconds to wake.</p>
      ) : error ? (
        <p role="alert" className="py-6 text-sm text-signal">
          {error.status === 403 ? "Your role cannot view this data." : error.status === 404 ? "This endpoint was not found on the server." : errorMessage(error)}
        </p>
      ) : listy ? (
        <DataTable rows={rows} columns={columns} empty={empty} actions={actions && ((row) => actions(row, reload))} />
      ) : (
        <KeyValues data={data} />
      )}
    </section>
  );
}
