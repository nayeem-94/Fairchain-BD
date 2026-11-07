// Thin fetch wrapper for the FairChain Django API (JWT + automatic token refresh).
export const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
export const P = '/api/products'

const KEY = 'fc_auth'

export const store = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null } catch { return null }
  },
  set(v) { localStorage.setItem(KEY, JSON.stringify(v)) },
  clear() { localStorage.removeItem(KEY) },
}

export class ApiError extends Error {
  constructor(status, data) {
    super(extractMessage(status, data))
    this.status = status
    this.data = data
    this.fields = data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  }
}

function flat(v) {
  if (Array.isArray(v)) return v.map(flat).join(' ')
  if (v && typeof v === 'object') return Object.values(v).map(flat).join(' ')
  return String(v)
}

function extractMessage(status, data) {
  if (!data) return `Request failed (${status}).`
  if (typeof data === 'string') return status >= 500 ? 'Server error. Try again in a moment.' : data
  if (data.detail) return flat(data.detail)
  if (data.non_field_errors) return flat(data.non_field_errors)
  const entries = Object.entries(data)
  if (entries.length) return entries.map(([k, v]) => `${k.replace(/_/g, ' ')}: ${flat(v)}`).join('  ')
  return `Request failed (${status}).`
}

let refreshing = null
async function refreshAccess() {
  const auth = store.get()
  if (!auth?.refresh) return false
  refreshing ||= fetch(BASE + '/api/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: auth.refresh }),
  })
    .then(async (r) => {
      if (!r.ok) return false
      const d = await r.json()
      store.set({ ...auth, access: d.access, refresh: d.refresh || auth.refresh })
      return true
    })
    .catch(() => false)
    .finally(() => { refreshing = null })
  return refreshing
}

export async function request(path, { method = 'GET', body, query, auth = true } = {}, retry = true) {
  const url = new URL(BASE + path)
  if (query) Object.entries(query).forEach(([k, v]) => v !== undefined && v !== '' && v !== null && url.searchParams.set(k, v))

  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const a = store.get()
  if (auth && a?.access) headers.Authorization = `Bearer ${a.access}`

  let res
  try {
    res = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError(0, { detail: `Cannot reach the server at ${BASE}. Is the backend running?` })
  }

  if (res.status === 401 && auth && retry && a?.refresh) {
    if (await refreshAccess()) return request(path, { method, body, query, auth }, false)
    store.clear()
    window.dispatchEvent(new Event('fc:logout'))
  }

  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

export const api = {
  get: (p, query) => request(p, { query }),
  post: (p, body) => request(p, { method: 'POST', body: body ?? {} }),
  patch: (p, body) => request(p, { method: 'PATCH', body }),

  async login(username, password) {
    const d = await request('/api/login/', { method: 'POST', body: { username, password }, auth: false })
    store.set({ access: d.access, refresh: d.refresh, user: d.user })
    return d.user
  },
  register: (body) => request('/api/register/', { method: 'POST', body, auth: false }),
}
