import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import { Button, ErrorNote, Field, useToast } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

const ROLE_HELP = {
  importer: 'You bring goods into Bangladesh.',
  manufacturer: 'You process or pack goods in a factory.',
  distributor: 'You move goods from factories to wholesalers.',
  wholesaler: 'You sell in bulk to retailers.',
  retailer: 'You sell to shoppers in a shop or market.',
  citizen: 'You buy goods and want to check prices.',
}

export default function Register() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const toast = useToast()
  const [f, setF] = useState({ username: '', email: '', password: '', user_type: '', phone: '', address: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  if (user) return <Navigate to="/app" replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const fe = (k) => (error?.fields?.[k] ? [].concat(error.fields[k]).join(' ') : null)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await api.register({ ...f, username: f.username.trim() })
      await login(f.username.trim(), f.password)
      toast('Account created. Welcome to FairChain BD.')
      nav('/app', { replace: true })
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  const fieldKeys = ['username', 'email', 'password', 'user_type', 'phone', 'address']
  const showGeneral = error && !fieldKeys.some((k) => error.fields?.[k])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8"><Brand /></Link>
      <form onSubmit={submit} className="grid w-full max-w-lg gap-4 rounded-lg border border-line bg-panel p-6 sm:grid-cols-2">
        <h1 className="text-2xl font-semibold sm:col-span-2">Create your account</h1>
        <Field label="I am a" error={fe('user_type')} help={ROLE_HELP[f.user_type]} full>
          <select className="input" required value={f.user_type} onChange={set('user_type')}>
            <option value="">Choose your role</option>
            {Object.keys(ROLE_HELP).map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Username" error={fe('username')}>
          <input className="input" autoComplete="username" required value={f.username} onChange={set('username')} />
        </Field>
        <Field label="Email" error={fe('email')}>
          <input className="input" type="email" autoComplete="email" value={f.email} onChange={set('email')} />
        </Field>
        <Field label="Password" error={fe('password')} help="At least 8 characters, not only digits." full>
          <input className="input" type="password" autoComplete="new-password" required minLength={8} value={f.password} onChange={set('password')} />
        </Field>
        <Field label="Phone" error={fe('phone')}>
          <input className="input" inputMode="tel" value={f.phone} onChange={set('phone')} />
        </Field>
        <Field label="Address" error={fe('address')}>
          <input className="input" autoComplete="street-address" value={f.address} onChange={set('address')} />
        </Field>
        {showGeneral && <div className="sm:col-span-2"><ErrorNote error={error} /></div>}
        <Button type="submit" busy={busy} className="sm:col-span-2">Create account</Button>
        <p className="text-center text-sm text-mute sm:col-span-2">
          Already registered? <Link to="/login" className="font-semibold text-paddy underline">Log in</Link>
        </p>
      </form>
    </div>
  )
}
