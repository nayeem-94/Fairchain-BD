import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { SendStockModal } from '../components/StockModals.jsx'
import { Async, Button, Chip, DataTable, Empty, PageHeader, Panel, Segmented, useFetch, useToast } from '../components/ui.jsx'
import { CAN_SEND, ROLES, bdt, fmtDateTime, qty } from '../lib/format.js'

export default function Transfers() {
  const { user } = useAuth()
  const toast = useToast()
  const [params] = useSearchParams()
  const isAdmin = user.user_type === 'admin'
  const list = useFetch(() => api.get(isAdmin ? `${P}/admin-dashboard/transfers/` : `${P}/transfers/`), [])
  const [tab, setTab] = useState('incoming')
  const [status, setStatus] = useState('')
  const [send, setSend] = useState(params.get('new') === '1' && CAN_SEND.includes(user.user_type))
  const [busyId, setBusyId] = useState(null)

  const all = list.data || []
  const incoming = all.filter((t) => t.to_user === user.id)
  const sent = all.filter((t) => t.from_user === user.id)
  const pendingIn = incoming.filter((t) => t.status === 'pending').length
  const rows = isAdmin ? all.filter((t) => !status || t.status === status) : tab === 'incoming' ? incoming : sent

  const respond = async (t, verb) => {
    setBusyId(t.id)
    try {
      await api.post(`${P}/transfers/${t.id}/${verb}/`)
      toast(verb === 'accept' ? 'Transfer accepted. The stock is now yours.' : 'Transfer rejected.')
      list.reload()
    } catch (e) { toast(e.message, 'bad') } finally { setBusyId(null) }
  }

  const columns = [
    { label: 'Sent', render: (r) => fmtDateTime(r.created_at) },
    { label: 'Product', render: (r) => <><div className="font-medium">{r.product_name}</div><div className="text-xs text-mute">{r.batch_number}</div></> },
    { label: 'From', render: (r) => <>{r.from_username}<div className="text-xs text-mute">{ROLES[r.from_role]}</div></> },
    { label: 'To', render: (r) => <>{r.to_username}<div className="text-xs text-mute">{ROLES[r.to_role]}</div></> },
    { label: 'Quantity', align: 'right', render: (r) => qty(r.quantity, r.unit) },
    { label: 'Price per unit', align: 'right', render: (r) => bdt(r.price_at_transfer) },
    { label: 'Status', render: (r) => <Chip>{r.status}</Chip> },
  ]
  if (!isAdmin && tab === 'incoming') {
    columns.push({
      label: '', align: 'right', render: (r) => r.status === 'pending' && (
        <div className="flex justify-end gap-2">
          <Button size="sm" busy={busyId === r.id} onClick={() => respond(r, 'accept')}>Accept</Button>
          <Button size="sm" variant="quiet" disabled={busyId === r.id} onClick={() => respond(r, 'reject')}>Reject</Button>
        </div>
      ),
    })
  }

  return (
    <>
      <PageHeader
        title="Transfers"
        sub={isAdmin ? 'Every transfer between businesses.' : 'Stock moves only after the receiver accepts.'}
        actions={!isAdmin && CAN_SEND.includes(user.user_type) && <Button onClick={() => setSend(true)}>Send stock</Button>}
      />

      <div className="mb-4">
        {isAdmin ? (
          <select className="input max-w-[220px]" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        ) : (
          <Segmented value={tab} onChange={setTab} options={[{ value: 'incoming', label: 'Incoming', count: pendingIn }, { value: 'sent', label: 'Sent' }]} />
        )}
      </div>

      <Panel flush>
        <Async state={list}>
          {() => (
            <DataTable rows={rows} columns={columns} empty={<Empty title={tab === 'incoming' && !isAdmin ? 'No incoming transfers' : 'No transfers here'} hint={isAdmin ? 'Nothing matches this filter.' : tab === 'incoming' ? 'When someone sends you stock it shows up here.' : 'Send stock to the next step in the chain.'} />} />
          )}
        </Async>
      </Panel>

      {send && <SendStockModal onClose={() => setSend(false)} onDone={list.reload} />}
    </>
  )
}
