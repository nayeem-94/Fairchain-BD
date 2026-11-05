import { useState } from "react";
import { errorMessage } from "../../api/client";
import { FIELD, BTN } from "./styles";

// field: { name, label, type = "text" | "number" | "date" | "select" | "textarea", options, required, step, placeholder }
export default function DynamicForm({ fields, onSubmit, submitLabel = "Save" }) {
  const empty = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [values, setValues] = useState(empty);
  const [state, setState] = useState({ busy: false, error: "", ok: false });

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const payload = {};
    for (const f of fields) {
      const raw = values[f.name];
      if (raw === "") continue;
      if (f.type === "number") payload[f.name] = Number(raw);
      else if (f.type === "select" && typeof f.options?.[0]?.value === "number") payload[f.name] = Number(raw);
      else payload[f.name] = raw;
    }
    setState({ busy: true, error: "", ok: false });
    try {
      await onSubmit(payload);
      setValues(empty);
      setState({ busy: false, error: "", ok: true });
    } catch (err) {
      setState({ busy: false, error: errorMessage(err), ok: false });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className={`block text-sm font-medium ${f.type === "textarea" ? "sm:col-span-2" : ""}`}>
            {f.label}
            {f.type === "select" ? (
              <select required={f.required !== false} value={values[f.name]} onChange={set(f.name)} className={`${FIELD} mt-1`}>
                <option value="" disabled>Select</option>
                {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea rows={3} required={f.required === true} value={values[f.name]} onChange={set(f.name)} placeholder={f.placeholder} className={`${FIELD} mt-1`} />
            ) : (
              <input
                type={f.type ?? "text"}
                step={f.step}
                min={f.type === "number" ? 0 : undefined}
                required={f.required !== false}
                value={values[f.name]}
                onChange={set(f.name)}
                placeholder={f.placeholder}
                className={`${FIELD} mt-1`}
              />
            )}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state.busy} className={BTN}>{state.busy ? "Saving" : submitLabel}</button>
        <p role="status" className={`text-sm ${state.ok ? "text-jade" : "text-signal"}`}>{state.ok ? "Saved." : state.error}</p>
      </div>
    </form>
  );
}
