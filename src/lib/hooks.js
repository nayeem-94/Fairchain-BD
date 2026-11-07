import { api, P } from './api.js'
import { useFetch } from '../components/ui.jsx'

export const useProducts = () => useFetch(() => api.get(`${P}/products/`), [])

export const productOptions = (products = []) =>
  products.filter((p) => p.is_active).map((p) => ({ value: p.id, label: `${p.name} (${p.unit})` }))

// Resolve to {ok, data} or {ok:false, error} instead of throwing (for "no data yet" cases).
export const soft = (promise) =>
  promise.then((data) => ({ ok: true, data })).catch((error) => ({ ok: false, error }))
