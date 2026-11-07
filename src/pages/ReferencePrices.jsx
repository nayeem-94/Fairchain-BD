import { useState } from 'react'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Async, Button, Chip, DataTable, Empty, FormModal, PageHeader, Panel, useFetch, useToast } from '../components/ui.jsx'
import { bdt, fmtDate, toISO } from '../lib/format.js'
import { productOptions, useProducts } from '../lib/hooks.js'

export default function ReferencePrices() {
  const { user } = useAuth()
  const toast = useToast()
  const isAdmin = user.user_type === 'admin'
  const rows = useFetch(() => api.get(`${P}/reference-prices/`), [])
  const products = useProducts()
  const [open, setOpen] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const toggle = async (r) => {
    setBusyId(r.id)
    try {
      await api.patch(`${P}/admin-dashboard/reference-prices/${r.id}/`, { is_active: !r.is_active })
      toast(r.is_active ? 'Fair price deactivated.' : 'Fair price activated.')
      rows.reload()
    } catch (e) { toast(e.message, 'bad') } finally { setBusyId(null) }
  }

  const columns = [
    { label: 'Product', render: (r) => <span className="font-medium">{r.product_name}</span> },
    { label: 'Fair price', render: (r) => <span className="font-display text-lg font-semibold">{bdt(r.price)}<span className="text-sm font-normal text-mute"> / {r.unit}</span></span> },
    { label: 'Valid from', render: (r) => fmtDate(r.effective_from) },
    { label: 'Valid until', render: (r) => (r.effective_to ? fmtDate(r.effective_to) : <span className="text-mute">No end date</span>) },
    { label: 'Status', render: (r) => <Chip tone={r.is_active ? 'ok' : 'mute'}>{r.is_active ? 'Active' : 'Inactive'}</Chip> },
  ]
  if (isAdmin) columns.push({ label: '', align: 'right', render: (r) => <Button size="sm" variant="quiet" busy={busyId === r.id} onClick={() => toggle(r)}>{r.is_active ? 'Deactivate' : 'Activate'}</Button> })

  return (
    <>
      <PageHeader
        title="Fair prices"
        sub="The price the government considers fair for each product. Only one price per product can be active."
        actions={isAdmin && <Button onClick={() => setOpen(true)}>Set a fair price</Button>}
      />
      <Panel flush>
        <Async state={rows} empty={<Empty title="No fair prices yet" hint={isAdmin ? 'Set the first fair price.' : 'The government has not set any fair prices.'} />}>
          {(data) => <DataTable rows={data} columns={columns} />}
        </Async>
      </Panel>

      {open && (
        <FormModal
          title="Set a fair price"
          intro="If this product already has an active fair price, deactivate it first."
          onClose={() => setOpen(false)}
          fields={[
            { name: 'product', label: 'Product', type: 'select', required: true, options: productOptions(products.data || []), full: true },
            { name: 'price', label: 'Fair price per unit (৳)', type: 'number', step: '0.01', min: '0.01', required: true, full: true },
            { name: 'effective_from', label: 'Valid from', type: 'datetime-local', required: true },
            { name: 'effective_to', label: 'Valid until', type: 'datetime-local', help: 'Optional.' },
          ]}
          initial={{ effective_from: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) }}
          onSubmit={async (v) => {
            const body = { product: Number(v.product), price: v.price, effective_from: toISO(v.effective_from), is_active: true }
            if (v.effective_to) body.effective_to = toISO(v.effective_to)
            await api.post(`${P}/admin-dashboard/reference-prices/`, body)
            toast('Fair price set.')
            rows.reload()
          }}
        />
      )}
    </>
  )
}
