import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'
import { STATUS_TONE, cap } from '../lib/format.js'

/* ---------- data hook ---------- */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [tick, setTick] = useState(0)
  const ref = useRef(fetcher)
  ref.current = fetcher

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    Promise.resolve()
      .then(() => ref.current())
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((error) => alive && setState({ data: null, error, loading: false }))
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { ...state, reload: () => setTick((t) => t + 1) }
}

/* ---------- toast ---------- */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((message, tone = 'ok') => {
    const id = Math.random()
    setItems((l) => [...l, { id, message, tone }])
    setTimeout(() => setItems((l) => l.filter((i) => i.id !== id)), 4200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm shadow-lg ${t.tone === 'ok' ? 'border-paddy/30 bg-paddy-tint text-paddy-dark' : 'border-sun/30 bg-sun-tint text-sun'}`}>
            {t.tone === 'ok' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- basics ---------- */
const BTN = {
  primary: 'bg-paddy text-white hover:bg-paddy-dark disabled:bg-paddy/50',
  danger: 'bg-sun text-white hover:bg-[#a52720] disabled:bg-sun/50',
  quiet: 'border border-line bg-white text-ink hover:bg-paper disabled:text-mute',
  ghost: 'text-paddy hover:bg-paddy-tint disabled:text-mute',
}

export function Button({ variant = 'primary', size = 'md', busy, className = '', children, ...rest }) {
  const pad = size === 'sm' ? 'px-2.5 py-1 text-sm' : 'px-4 py-2 text-[15px]'
  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium ${pad} ${BTN[variant]} ${className}`}
    >
      {busy && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

export function Panel({ title, action, children, className = '', flush }) {
  return (
    <section className={`rounded-lg border border-line bg-panel ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="text-[17px] font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={flush ? '' : 'p-4'}>{children}</div>
    </section>
  )
}

export function PageHeader({ title, sub, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-semibold leading-tight sm:text-[30px]">{title}</h1>
        {sub && <p className="mt-1 max-w-prose text-[15px] text-mute">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Stat({ label, value, note, tone }) {
  const color = tone === 'bad' ? 'text-sun' : tone === 'warn' ? 'text-jute' : 'text-ink'
  return (
    <div className="border-l-2 border-line pl-3">
      <div className={`font-display text-[28px] font-semibold leading-none ${color}`}>{value}</div>
      <div className="mt-1.5 text-sm text-mute">{label}</div>
      {note && <div className="text-xs text-mute">{note}</div>}
    </div>
  )
}

const TONES = {
  ok: 'bg-paddy-tint text-paddy-dark',
  warn: 'bg-jute-tint text-jute',
  bad: 'bg-sun-tint text-sun',
  info: 'bg-river-tint text-river',
  mute: 'bg-paper text-mute border border-line',
}

export function Chip({ tone, children }) {
  const t = tone || STATUS_TONE[String(children).toLowerCase()] || 'mute'
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-medium ${TONES[t]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {typeof children === 'string' ? cap(children) : children}
    </span>
  )
}

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-2 py-10 text-mute" role="status">
      <Loader2 size={18} className="animate-spin" /> {label}
    </div>
  )
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null
  return (
    <div className="flex items-start gap-2 rounded-md border border-sun/30 bg-sun-tint p-3 text-sm text-sun" role="alert">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        {error.message}
        {error.status === 403 && <span> Your account type does not have access to this.</span>}
      </div>
      {onRetry && <button onClick={onRetry} className="font-semibold underline">Try again</button>}
    </div>
  )
}

export function Empty({ title, hint, action }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-sm text-[15px] text-mute">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/* Loads + renders states so pages stay short. */
export function Async({ state, children, empty }) {
  if (state.loading && !state.data) return <Spinner />
  if (state.error) return <ErrorNote error={state.error} onRetry={state.reload} />
  if (empty && Array.isArray(state.data) && state.data.length === 0) return empty
  return children(state.data)
}

export function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-md border border-line bg-white p-0.5" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded px-3 py-1.5 text-sm font-medium ${value === o.value ? 'bg-paddy text-white' : 'text-mute hover:text-ink'}`}
        >
          {o.label}
          {o.count > 0 && <span className="ml-1.5 rounded-full bg-sun px-1.5 text-xs text-white">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

/* ---------- table ---------- */
export function DataTable({ columns, rows, rowKey = 'id', empty, dense }) {
  if (!rows?.length) return empty || <Empty title="Nothing here yet" />
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
        <thead>
          <tr className="border-b border-line text-sm text-mute">
            {columns.map((c) => (
              <th key={c.key || c.label} className={`px-4 py-2.5 font-medium ${c.align === 'right' ? 'text-right' : ''}`}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r[rowKey] ?? i} className="border-b border-line/70 last:border-0">
              {columns.map((c) => (
                <td key={c.key || c.label} className={`px-4 ${dense ? 'py-2' : 'py-3'} align-top ${c.align === 'right' ? 'text-right' : ''}`}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- modal + form ---------- */
export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-panel shadow-2xl sm:rounded-xl ${wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'}`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-line bg-panel px-5 py-3.5">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-mute hover:bg-paper"><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, error, help, children, full }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {help && !error && <span className="mt-1 block text-xs text-mute">{help}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-sun">{error}</span>}
    </label>
  )
}

/* fields: [{name,label,type,options,required,step,min,placeholder,help,full,default}] */
export function FormModal({ title, intro, fields, initial = {}, submitLabel = 'Save', onSubmit, onClose, wide }) {
  const [values, setValues] = useState(() => {
    const v = {}
    fields.forEach((f) => { v[f.name] = initial[f.name] ?? f.default ?? '' })
    return v
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const set = (n, val) => setValues((s) => ({ ...s, [n]: val }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSubmit(values)
      onClose()
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  const fieldErr = (n) => (error?.fields?.[n] ? [].concat(error.fields[n]).join(' ') : null)
  const shownFieldKeys = fields.map((f) => f.name)
  const generalMessage = error && (!error.fields || !Object.keys(error.fields).some((k) => shownFieldKeys.includes(k)) || error.fields.non_field_errors || error.fields.detail)

  return (
    <Modal title={title} onClose={onClose} wide={wide}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {intro && <p className="text-[15px] text-mute sm:col-span-2">{intro}</p>}
        {fields.map((f) => (
          <Field key={f.name} label={f.label} help={f.help} error={fieldErr(f.name)} full={f.full || f.type === 'textarea'}>
            {f.type === 'select' ? (
              <select className="input" required={f.required} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                <option value="">{f.placeholder || 'Choose one'}</option>
                {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className="input" rows={3} required={f.required} placeholder={f.placeholder} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            ) : (
              <input className="input" type={f.type || 'text'} required={f.required} step={f.step} min={f.min} placeholder={f.placeholder} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            )}
          </Field>
        ))}
        {generalMessage && (
          <div className="sm:col-span-2"><ErrorNote error={error} /></div>
        )}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="quiet" onClick={onClose}>Cancel</Button>
          <Button type="submit" busy={busy}>{submitLabel}</Button>
        </div>
      </form>
    </Modal>
  )
}

export const opts = (list, labels = {}) => list.map((v) => ({ value: v, label: labels[v] || cap(v) }))
