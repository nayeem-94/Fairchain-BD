import { useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Button, ErrorNote, Field, Panel, PageHeader, Spinner, useFetch, useToast } from '../components/ui.jsx'
import { ROLES, cap } from '../lib/format.js'
import { store } from '../lib/api.js'

export default function Profile() {
  const { user, setUser } = useAuth()
  const toast = useToast()
  const [f, setF] = useState({ email: user.email || '', phone: user.phone || '', address: user.address || '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const save = async (e) => {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      const me = await api.patch('/api/me/', f)
      const a = store.get(); if (a) store.set({ ...a, user: me })
      setUser(me)
      toast('Profile saved.')
    } catch (err) { setError(err) } finally { setBusy(false) }
  }

  return (
    <>
      <PageHeader title="Profile" sub={`${user.username} - ${ROLES[user.user_type]}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Contact details">
          <form onSubmit={save} className="space-y-4">
            <Field label="Email"><input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
            <Field label="Phone"><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
            <Field label="Address"><textarea className="input" rows={3} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></Field>
            <ErrorNote error={error} />
            <Button type="submit" busy={busy}>Save changes</Button>
          </form>
        </Panel>
        {!['citizen', 'admin'].includes(user.user_type) && <BusinessProfile />}
      </div>
    </>
  )
}

function BusinessProfile() {
  const toast = useToast()
  const state = useFetch(() => api.get('/api/profiles/me/'), [])
  const [values, setValues] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  if (state.loading) return <Panel title="Business details"><Spinner /></Panel>
  if (state.error) return <Panel title="Business details"><ErrorNote error={state.error} onRetry={state.reload} /></Panel>

  const keys = Object.keys(state.data).filter((k) => !['id', 'user', 'created_at'].includes(k))
  const v = values || state.data

  const save = async (e) => {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      const body = {}
      keys.forEach((k) => { body[k] = v[k] === '' ? null : v[k] })
      // Required text fields cannot be null: send empty strings for those.
      keys.forEach((k) => { if (body[k] === null && typeof state.data[k] === 'string') body[k] = '' })
      const d = await api.patch('/api/profiles/me/', body)
      setValues(d)
      toast('Business details saved.')
    } catch (err) { setError(err) } finally { setBusy(false) }
  }

  return (
    <Panel title="Business details">
      <form onSubmit={save} className="space-y-4">
        {keys.map((k) => (
          <Field key={k} label={cap(k)} error={error?.fields?.[k] && [].concat(error.fields[k]).join(' ')}>
            <input className="input" type={typeof state.data[k] === 'number' ? 'number' : 'text'} step="any" value={v[k] ?? ''} onChange={(e) => setValues({ ...v, [k]: e.target.value })} />
          </Field>
        ))}
        {error && !Object.keys(error.fields || {}).some((k) => keys.includes(k)) && <ErrorNote error={error} />}
        <Button type="submit" busy={busy}>Save business details</Button>
      </form>
    </Panel>
  )
}
