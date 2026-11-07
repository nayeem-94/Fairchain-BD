import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, store } from '../lib/api.js'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => store.get()?.user || null)

  useEffect(() => {
    const out = () => setUser(null)
    window.addEventListener('fc:logout', out)
    return () => window.removeEventListener('fc:logout', out)
  }, [])

  // Refresh the profile in the background (older deployed backends may not have /api/me/).
  useEffect(() => {
    if (!store.get()?.access) return
    api.get('/api/me/').then((me) => {
      const a = store.get()
      if (a) store.set({ ...a, user: me })
      setUser(me)
    }).catch(() => {})
  }, [])

  const login = useCallback(async (username, password) => {
    const u = await api.login(username, password)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    store.clear()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, setUser, login, logout }), [user, login, logout])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
