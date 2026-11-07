export const ROLES = {
  importer: 'Importer',
  manufacturer: 'Manufacturer',
  distributor: 'Distributor',
  wholesaler: 'Wholesaler',
  retailer: 'Retailer',
  citizen: 'Citizen',
  admin: 'Government admin',
}

export const CHAIN = ['importer', 'manufacturer', 'distributor', 'wholesaler', 'retailer']
export const SUPPLY_ROLES = CHAIN
export const CAN_SEND = ['importer', 'manufacturer', 'distributor', 'wholesaler']

export const CATEGORIES = ['rice', 'oil', 'sugar', 'onion', 'dal', 'vegetable', 'fruit', 'other']
export const UNITS = ['kg', 'ton', 'liter', 'piece', 'bag', 'carton']
export const REASONS = {
  high_price: 'Price is too high',
  shortage: 'Product is not available',
  hoarding: 'Possible hoarding',
  other: 'Something else',
}

export const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')
export const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number(v))

export const bdt = (v, digits = 2) =>
  v === null || v === undefined || v === ''
    ? '-'
    : '৳' + num(v).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: digits })

export const qty = (v, unit = '') =>
  `${num(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}${unit ? ' ' + unit : ''}`

export const fmtDate = (v) =>
  v ? new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

export const fmtDateTime = (v) =>
  v
    ? new Date(v).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '-'

export const daysUntil = (v) => (v ? Math.ceil((new Date(v) - new Date()) / 86400000) : null)

export const toISO = (local) => (local ? new Date(local).toISOString() : null)

export const pct = (v) => `${num(v) > 0 ? '+' : ''}${num(v).toFixed(1)}%`

// How a price compares with the government's fair price.
export function priceVerdict(diffPct) {
  const d = num(diffPct)
  if (d > 10) return { tone: 'bad', label: 'Above fair price' }
  if (d < -10) return { tone: 'info', label: 'Below fair price' }
  return { tone: 'ok', label: 'Near fair price' }
}

export const STATUS_TONE = {
  pending: 'warn', accepted: 'ok', rejected: 'bad',
  reviewed: 'info', resolved: 'ok',
  active: 'ok', depleted: 'mute',
  upcoming: 'warn', expired: 'bad',
  purchase: 'info', selling: 'ok',
}
