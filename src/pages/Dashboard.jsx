import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Async, Button, Chip, DataTable, Empty, PageHeader, Panel, Stat, useFetch, useToast } from '../components/ui.jsx'
import { ROLES, bdt, cap, fmtDateTime, qty, num, REASONS } from '../lib/format.js'

export default function Dashboard() {
  const { user } = useAuth()
  if (user.user_type === 'admin') return <AdminHome />
  if (user.user_type === 'citizen') return <CitizenHome />
  return <SupplyHome />
}

/* ---------------- supply chain roles ---------------- */
const PRIMARY = {
  importer: ['Register a shipment', '/app/imports?new=1'],
  manufacturer: ['Record production', '/app/productions?new=1'],
  distributor: ['Send stock', '/app/transfers?new=1'],
  wholesaler: ['Send stock', '/app/transfers?new=1'],
  retailer: ['Record a shelf price', '/app/prices?new=1'],
}

function SupplyHome() {
  const { user } = useAuth()
  const toast = useToast()
  const inv = useFetch(() => api.get(`${P}/inventory/`), [])
  const tr = useFetch(() => api.get(`${P}/transfers/`), [])
  const al = useFetch(() => api.get(`${P}/expiry-alerts/`), [])
  const [busyId, setBusyId] = useState(null)

  const stock = (inv.data || []).filter((i) => num(i.quantity) > 0)
  const incoming = (tr.data || []).filter((t) => t.to_user === user.id && t.status === 'pending')
  const outgoing = (tr.data || []).filter((t) => t.from_user === user.id && t.status === 'pending')
  const unread = (al.data || []).filter((a) => !a.is_read).length
  const [label, to] = PRIMARY[user.user_type] || []

  const respond = async (t, verb) => {
    setBusyId(t.id)
    try {
      await api.post(`${P}/transfers/${t.id}/${verb}/`)
      toast(verb === 'accept' ? 'Transfer accepted. The stock is now yours.' : 'Transfer rejected.')
      tr.reload(); inv.reload()
    } catch (e) {
      toast(e.message, 'bad')
    } finally { setBusyId(null) }
  }

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.username}`}
        sub={`${ROLES[user.user_type]} account`}
        actions={to && <Link to={to}><Button>{label}</Button></Link>}
      />

      <div className="mb-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
        <Stat label="Batches in stock" value={stock.length} />
        <Stat label="Transfers to review" value={incoming.length} tone={incoming.length ? 'warn' : undefined} />
        <Stat label="Sent, waiting for reply" value={outgoing.length} />
        <Stat label="Unread expiry alerts" value={unread} tone={unread ? 'bad' : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Waiting for you" flush>
          <Async state={tr} empty={<Empty title="Nothing to review" hint="When someone sends you stock, it appears here for you to accept or reject." />}>
            {() => incoming.length === 0 ? (
              <Empty title="Nothing to review" hint="When someone sends you stock, it appears here for you to accept or reject." />
            ) : (
              <ul className="divide-y divide-line">
                {incoming.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <div className="font-semibold">{t.product_name} <span className="font-normal text-mute">- {t.batch_number}</span></div>
                      <div className="text-sm text-mute">{qty(t.quantity, t.unit)} at {bdt(t.price_at_transfer)} from {t.from_username}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" busy={busyId === t.id} onClick={() => respond(t, 'accept')}>Accept</Button>
                      <Button size="sm" variant="quiet" disabled={busyId === t.id} onClick={() => respond(t, 'reject')}>Reject</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Panel>

        <Panel title="Your stock" flush action={<Link to="/app/inventory" className="text-sm font-semibold text-paddy underline">See all</Link>}>
          <Async state={inv} empty={<Empty title="No stock yet" hint={user.user_type === 'importer' ? 'Register a shipment to create your first batch.' : user.user_type === 'manufacturer' ? 'Record production or accept a transfer to get stock.' : 'Accept a transfer to get stock.'} />}>
            {() => stock.length === 0 ? (
              <Empty title="No stock yet" hint="Accept a transfer to get stock." />
            ) : (
              <DataTable dense rows={stock.slice(0, 6)} columns={[
                { label: 'Product', render: (r) => <><div className="font-medium">{r.product_name}</div><div className="text-xs text-mute">{r.batch_number}</div></> },
                { label: 'Quantity', align: 'right', render: (r) => qty(r.quantity, r.unit) },
              ]} />
            )}
          </Async>
        </Panel>
      </div>
    </>
  )
}

/* ---------------- citizen ---------------- */
function CitizenHome() {
  const { user } = useAuth()
  const fair = useFetch(() => api.get(`${P}/reference-prices/`), [])
  const mine = useFetch(() => api.get(`${P}/citizen-reports/`), [])
  const active = (fair.data || []).filter((r) => r.is_active)

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.username}`}
        sub="See what essential goods should cost, and tell the government when a shop charges more."
        actions={<Link to="/app/reports?new=1"><Button>Report a price</Button></Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel title="Fair prices today" flush>
          <Async state={fair} empty={<Empty title="No fair prices yet" hint="The government has not set any fair prices." />}>
            {() => active.length === 0 ? <Empty title="No fair prices yet" hint="The government has not set any fair prices." /> : (
              <DataTable rows={active} columns={[
                { label: 'Product', render: (r) => <span className="font-medium">{r.product_name}</span> },
                { label: 'Fair price', render: (r) => <span className="font-display text-lg font-semibold">{bdt(r.price)}<span className="text-sm font-normal text-mute"> / {r.unit}</span></span> },
                { label: '', align: 'right', render: (r) => <Link className="text-sm font-semibold text-paddy underline" to={`/app/price-check?product=${r.product}`}>Check shops</Link> },
              ]} />
            )}
          </Async>
        </Panel>

        <Panel title="Your latest reports" flush action={<Link to="/app/reports" className="text-sm font-semibold text-paddy underline">See all</Link>}>
          <Async state={mine} empty={<Empty title="No reports yet" hint="Saw a price that looks wrong? Report it and the government will review it." />}>
            {(rows) => (
              <ul className="divide-y divide-line">
                {rows.slice(0, 4).map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <div className="font-medium">{r.product_name}</div>
                      <div className="text-sm text-mute">{REASONS[r.reason]} - {r.location}</div>
                    </div>
                    <Chip>{r.status}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Panel>
      </div>
    </>
  )
}

/* ---------------- admin ---------------- */
function AdminHome() {
  const { user } = useAuth()
  const sum = useFetch(() => api.get(`${P}/admin-dashboard/summary/`), [])
  const act = useFetch(() => api.get(`${P}/admin-dashboard/activity/`), [])
  const pending = useFetch(() => api.get(`${P}/admin-dashboard/reports/`, { status: 'pending' }), [])

  return (
    <>
      <PageHeader title={`Welcome, ${user.username}`} sub="What needs attention across the supply chain." />

      <Async state={sum}>
        {(s) => (
          <div className="mb-8 grid grid-cols-2 gap-6 lg:grid-cols-3">
            <Stat label="Citizen reports to review" value={s.pending_citizen_reports} tone={s.pending_citizen_reports ? 'warn' : undefined} />
            <Stat label="Transfers waiting for a reply" value={s.pending_transfers} />
            <Stat label="Unread expiry alerts" value={s.unread_expiry_alerts} tone={s.unread_expiry_alerts ? 'bad' : undefined} />
            <Stat label="Active products" value={s.total_products} />
            <Stat label="Batches tracked" value={s.total_batches} />
            <Stat label="Accounts" value={Object.values(s.users_by_role || {}).reduce((a, b) => a + b, 0)} note={Object.entries(s.users_by_role || {}).map(([k, v]) => `${v} ${k}`).join(', ')} />
          </div>
        )}
      </Async>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Reports waiting for review" flush action={<Link to="/app/reports" className="text-sm font-semibold text-paddy underline">Open reports</Link>}>
          <Async state={pending} empty={<Empty title="All caught up" hint="No citizen reports are waiting." />}>
            {(rows) => (
              <ul className="divide-y divide-line">
                {rows.slice(0, 5).map((r) => (
                  <li key={r.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{r.product_name}</span>
                      <span className="text-sm text-mute">{fmtDateTime(r.created_at)}</span>
                    </div>
                    <div className="text-sm text-mute">
                      {REASONS[r.reason]}{r.reported_price ? ` at ${bdt(r.reported_price)}` : ''} - {r.location}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Panel>

        <Panel title="Latest transfers" flush>
          <Async state={act}>
            {(a) => a.recent_transfers.length === 0 ? <Empty title="No transfers yet" /> : (
              <DataTable dense rows={a.recent_transfers.slice(0, 6)} columns={[
                { label: 'Batch', key: 'batch' },
                { label: 'Route', render: (r) => `${r.from_user} to ${r.to_user}` },
                { label: 'Price', align: 'right', render: (r) => bdt(r.price_at_transfer) },
                { label: 'Status', render: (r) => <Chip>{r.status}</Chip> },
              ]} />
            )}
          </Async>
        </Panel>

        <Panel title="Latest price records" flush className="lg:col-span-2">
          <Async state={act}>
            {(a) => a.recent_prices.length === 0 ? <Empty title="No prices recorded yet" /> : (
              <DataTable dense rows={a.recent_prices} columns={[
                { label: 'When', render: (r) => fmtDateTime(r.recorded_at) },
                { label: 'Product', key: 'product' },
                { label: 'By', key: 'user' },
                { label: 'Type', render: (r) => <Chip>{r.price_type}</Chip> },
                { label: 'Price', align: 'right', render: (r) => bdt(r.price) },
              ]} />
            )}
          </Async>
        </Panel>
      </div>
    </>
  )
}
