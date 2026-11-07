import { useState } from 'react'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Async, Button, Chip, DataTable, Empty, PageHeader, Panel, useFetch, useToast } from '../components/ui.jsx'
import { fmtDate } from '../lib/format.js'

export default function Expiry() {
  const { user } = useAuth()
  const toast = useToast()
  const isAdmin = user.user_type === 'admin'
  const base = isAdmin ? `${P}/admin-dashboard/expiry-alerts` : `${P}/expiry-alerts`
  const rows = useFetch(() => api.get(`${base}/`), [])
  const [busy, setBusy] = useState(null)

  const run = async (key, fn, message) => {
    setBusy(key)
    try { const r = await fn(); toast(typeof message === 'function' ? message(r) : message); rows.reload() }
    catch (e) { toast(e.message, 'bad') } finally { setBusy(null) }
  }

  const generate = () => run('gen', () => api.post(`${P}/expiry-alerts/generate/`),
    (r) => (r.count ? `${r.count} new alert${r.count > 1 ? 's' : ''} created.` : 'No new alerts. Nothing is close to expiry.'))

  const toggle = (r) => isAdmin
    ? run(r.id, () => api.patch(`${base}/${r.id}/`, { is_read: !r.is_read }), r.is_read ? 'Marked unread.' : 'Marked read.')
    : run(r.id, () => api.post(`${base}/${r.id}/mark_read/`), 'Marked read.')

  const columns = [
    { label: 'Alert', render: (r) => (
      <div className={r.is_read ? 'text-mute' : ''}>
        <div className={r.is_read ? '' : 'font-semibold'}>{r.message}</div>
        <div className="text-xs">{r.product_name} - {r.batch_number}{isAdmin && ` - ${r.username}`}</div>
      </div>
    ) },
    { label: 'Type', render: (r) => <Chip>{r.alert_type}</Chip> },
    { label: 'Expires', render: (r) => fmtDate(r.alert_date) },
    { label: '', align: 'right', render: (r) => (!r.is_read || isAdmin) && (
      <Button size="sm" variant="quiet" busy={busy === r.id} onClick={() => toggle(r)}>{r.is_read ? 'Mark unread' : 'Mark read'}</Button>
    ) },
  ]

  return (
    <>
      <PageHeader
        title="Expiry alerts"
        sub={isAdmin ? 'Alerts for batches that expire within 30 days, across all businesses.' : 'Batches in your stock that expire within 30 days, or already have.'}
        actions={<Button onClick={generate} busy={busy === 'gen'}>{isAdmin ? 'Check all stock' : 'Check my stock'}</Button>}
      />
      <Panel flush>
        <Async state={rows} empty={<Empty title="No alerts" hint="Select Check my stock to look for batches that are close to expiry." />}>
          {(data) => <DataTable rows={data} columns={columns} />}
        </Async>
      </Panel>
    </>
  )
}
