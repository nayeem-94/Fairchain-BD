import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import { Button, ErrorNote, Field } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  if (user) return <Navigate to="/app" replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(form.username.trim(), form.password)
      nav('/app', { replace: true })
    } catch (err) {
      setError(err.status === 401 ? { message: 'Wrong username or password.' } : err)
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8"><Brand /></Link>
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-panel p-6">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <Field label="Username">
          <input className="input" autoComplete="username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </Field>
        <Field label="Password">
          <input className="input" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <ErrorNote error={error} />
        <Button type="submit" busy={busy} className="w-full">Log in</Button>
        <p className="text-center text-sm text-mute">
          New here? <Link to="/register" className="font-semibold text-paddy underline">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
