import { useState } from 'react'
import { api, P } from '../lib/api.js'
import ChainLadder from '../components/ChainLadder.jsx'
import { Async, Button, Chip, DataTable, Empty, Modal, PageHeader, Panel, Spinner, ErrorNote, useFetch } from '../components/ui.jsx'
import { ROLES, bdt, fmtDate, fmtDateTime, num, pct, qty } from '../lib/format.js'
import { soft } from '../lib/hooks.js'

export default function Batches() {
  const rows = useFetch(() => api.get(`${P}/batches/`), [])
  const [q, setQ] = useState('')
  const [trace, setTrace] = useState(null)

  const filtered = (rows.data || []).filter((b) => `${b.batch_number} ${b.product_name}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <PageHeader title="Batches and trace" sub="Open a batch to see every hand it passed through and the price at each step." />
      <div className="mb-4 max-w-sm">
        <input className="input" placeholder="Search by batch number or product" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search batches" />
      </div>
      <Panel flush>
        <Async state={rows} empty={<Empty title="No batches yet" hint="Batches appear when an importer registers a shipment or a manufacturer records production." />}>
          {() => (
            <DataTable rows={filtered} empty={<Empty title="No match" hint="Try a different batch number or product name." />} columns={[
              { label: 'Batch', render: (r) => <><div className="font-medium">{r.batch_number}</div><div className="text-xs text-mute">{fmtDate(r.created_at)}</div></> },
              { label: 'Product', key: 'product_name' },
              { label: 'Started with', align: 'right', render: (r) => qty(r.initial_quantity, r.unit) },
              { label: 'Expires', render: (r) => fmtDate(r.expiry_date) },
              { label: 'Stock', render: (r) => <Chip>{r.status}</Chip> },
              { label: '', align: 'right', render: (r) => <Button size="sm" variant="quiet" onClick={() => setTrace(r)}>Trace</Button> },
            ]} />
          )}
        </Async>
      </Panel>
      {trace && <TraceModal batch={trace} onClose={() => setTrace(null)} />}
    </>
  )
}

function TraceModal({ batch, onClose }) {
  const state = useFetch(async () => {
    const [chain, fair] = await Promise.all([
      api.get(`${P}/analytics/supply_chain/`, { batch: batch.batch_number }),
      soft(api.get(`${P}/reference-prices/`, { product_id: batch.product })),
    ])
    const ref = fair.ok ? fair.data.find((r) => r.is_active) : null
    return { hops: chain.supply_chain, fair: ref ? num(ref.price) : null }
  }, [batch.id])

  return (
    <Modal title={`${batch.product_name} - ${batch.batch_number}`} onClose={onClose} wide>
      {state.loading && <Spinner label="Tracing batch" />}
      <ErrorNote error={state.error} />
      {state.data && (state.data.hops.length === 0 ? (
        <Empty title="This batch has not moved yet" hint="It is still with the business that first created it. Accepted transfers will appear here." />
      ) : (
        <div className="space-y-6">
          <p className="text-[15px] text-mute">
            Started with <b className="text-ink">{state.data.hops[0].from_user}</b> ({ROLES[state.data.hops[0].from_role]}).
            Each bar is the price charged when the batch moved to that step.
          </p>
          <ChainLadder
            fair={state.data.fair}
            unit={batch.unit}
            steps={state.data.hops.map((h) => ({ label: ROLES[h.to_role], sub: h.to_user, price: num(h.price) }))}
          />
          <DataTable dense rows={state.data.hops.map((h, i, a) => ({ ...h, id: i, prev: i ? num(a[i - 1].price) : null }))} columns={[
            { label: 'When', render: (r) => fmtDateTime(r.transferred_at) },
            { label: 'From', render: (r) => `${r.from_user} (${ROLES[r.from_role]})` },
            { label: 'To', render: (r) => `${r.to_user} (${ROLES[r.to_role]})` },
            { label: 'Quantity', align: 'right', render: (r) => qty(r.quantity, r.unit) },
            { label: 'Price', align: 'right', render: (r) => bdt(r.price) },
            { label: 'Change', align: 'right', render: (r) => (r.prev ? <span className={((num(r.price) - r.prev) / r.prev) * 100 > 10 ? 'font-semibold text-sun' : ''}>{pct(((num(r.price) - r.prev) / r.prev) * 100)}</span> : '-') },
          ]} />
        </div>
      ))}
    </Modal>
  )
}
