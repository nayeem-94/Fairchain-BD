import { useState } from 'react'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { RecordPriceModal, SendStockModal } from '../components/StockModals.jsx'
import { Async, Button, Chip, DataTable, Empty, PageHeader, Panel, useFetch } from '../components/ui.jsx'
import { CAN_SEND, daysUntil, fmtDate, num, qty } from '../lib/format.js'

function ExpiryChip({ date }) {
  const d = daysUntil(date)
  if (d === null) return <span className="text-mute">No expiry</span>
  if (d < 0) return <Chip tone="bad">Expired</Chip>
  if (d <= 30) return <Chip tone="warn">{`${d} days left`}</Chip>
  return <span>{fmtDate(date)}</span>
}

export default function Inventory() {
  const { user } = useAuth()
  const inv = useFetch(() => api.get(`${P}/inventory/`), [])
  const [modal, setModal] = useState(null)
  const canSend = CAN_SEND.includes(user.user_type)
  const rows = (inv.data || []).filter((i) => num(i.quantity) > 0)

  return (
    <>
      <PageHeader title="My stock" sub="Batches you hold right now." />
      <Panel flush>
        <Async state={inv} empty={<Empty title="No stock yet" hint="Stock appears when you create a batch or accept a transfer." />}>
          {() => (
            <DataTable rows={rows} empty={<Empty title="Your stock is empty" hint="Everything you held has been sent on." />} columns={[
              { label: 'Product', render: (r) => <><div className="font-medium">{r.product_name}</div><div className="text-xs text-mute">{r.batch_number}</div></> },
              { label: 'Quantity', align: 'right', render: (r) => qty(r.quantity, r.unit) },
              { label: 'Expiry', render: (r) => <ExpiryChip date={r.expiry_date} /> },
              {
                label: '', align: 'right', render: (r) => (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="quiet" onClick={() => setModal({ type: 'price', batch: r.batch })}>Record price</Button>
                    {canSend && <Button size="sm" onClick={() => setModal({ type: 'send', batch: r.batch })}>Send</Button>}
                  </div>
                ),
              },
            ]} />
          )}
        </Async>
      </Panel>

      {modal?.type === 'send' && <SendStockModal initialBatch={modal.batch} onClose={() => setModal(null)} onDone={inv.reload} />}
      {modal?.type === 'price' && <RecordPriceModal initialBatch={modal.batch} defaultType={user.user_type === 'importer' ? 'purchase' : 'selling'} onClose={() => setModal(null)} onDone={inv.reload} />}
    </>
  )
}
