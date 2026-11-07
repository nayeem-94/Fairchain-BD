import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api, P } from '../lib/api.js'
import { Async, Chip, DataTable, Empty, PageHeader, Panel, Stat, useFetch } from '../components/ui.jsx'
import { CHAIN, ROLES, bdt, fmtDateTime, num, qty } from '../lib/format.js'

export default function Analytics() {
  const inv = useFetch(() => api.get(`${P}/analytics/inventory/`), [])
  const summary = useFetch(() => api.get(`${P}/analytics/transfer_summary/`), [])
  const chain = useFetch(() => api.get(`${P}/analytics/supply_chain/`), [])
  const [product, setProduct] = useState('')

  const products = useMemo(() => [...new Set((inv.data?.inventory || []).map((r) => r.product))], [inv.data])
  const current = product || products[0] || ''

  const byRole = useMemo(() => {
    const rows = (inv.data?.inventory || []).filter((r) => r.product === current)
    return CHAIN.map((role) => ({
      role: ROLES[role],
      quantity: rows.filter((r) => r.user_type === role).reduce((a, r) => a + num(r.quantity), 0),
    }))
  }, [inv.data, current])
  const unit = (inv.data?.inventory || []).find((r) => r.product === current)?.unit || ''

  return (
    <>
      <PageHeader title="Analytics" sub="Where stock sits in the chain and how transfers are going." />

      <Async state={summary}>
        {(s) => (
          <div className="mb-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            <Stat label="Transfers in total" value={s.total_transfers} />
            <Stat label="Accepted" value={s.accepted_transfers} />
            <Stat label="Waiting for a reply" value={s.pending_transfers} tone={s.pending_transfers ? 'warn' : undefined} />
            <Stat label="Rejected" value={s.rejected_transfers} />
          </div>
        )}
      </Async>

      <div className="space-y-6">
        <Panel title="Where the stock is" action={products.length > 0 && (
          <select className="input !w-auto !py-1 text-sm" value={current} onChange={(e) => setProduct(e.target.value)} aria-label="Product">
            {products.map((p) => <option key={p}>{p}</option>)}
          </select>
        )}>
          <Async state={inv}>
            {() => products.length === 0 ? <Empty title="No stock recorded" hint="Charts appear once businesses hold stock." /> : (
              <>
                <div className="h-[260px]">
                  <ResponsiveContainer>
                    <BarChart data={byRole} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid stroke="#D4DAD0" vertical={false} />
                      <XAxis dataKey="role" tick={{ fontSize: 12, fill: '#5B6A66' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#5B6A66' }} width={56} />
                      <Tooltip formatter={(v) => [qty(v, unit), 'In stock']} cursor={{ fill: '#E0EDE6' }} />
                      <Bar dataKey="quantity" fill="#0F5B43" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-sm text-mute">Quantity in {unit || 'units'} held by each kind of business.</p>
              </>
            )}
          </Async>
        </Panel>

        <Panel title="Accepted transfers" flush>
          <Async state={chain} empty={<Empty title="No accepted transfers yet" />}>
            {(d) => d.supply_chain.length === 0 ? <Empty title="No accepted transfers yet" /> : (
              <DataTable dense rows={d.supply_chain.slice(-40).reverse().map((r, i) => ({ ...r, id: i }))} columns={[
                { label: 'When', render: (r) => fmtDateTime(r.transferred_at) },
                { label: 'Product', render: (r) => <>{r.product}<div className="text-xs text-mute">{r.batch}</div></> },
                { label: 'Route', render: (r) => <>{r.from_user} <span className="text-mute">to</span> {r.to_user}<div className="text-xs text-mute">{ROLES[r.from_role]} to {ROLES[r.to_role]}</div></> },
                { label: 'Quantity', align: 'right', render: (r) => qty(r.quantity, r.unit) },
                { label: 'Price', align: 'right', render: (r) => bdt(r.price) },
              ]} />
            )}
          </Async>
        </Panel>
      </div>
    </>
  )
}
