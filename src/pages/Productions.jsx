import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, P } from '../lib/api.js'
import { Async, Button, DataTable, Empty, FormModal, PageHeader, Panel, useFetch, useToast } from '../components/ui.jsx'
import { bdt, fmtDate, qty } from '../lib/format.js'
import { productOptions, useProducts } from '../lib/hooks.js'

export default function Productions() {
  const toast = useToast()
  const [params] = useSearchParams()
  const rows = useFetch(() => api.get(`${P}/productions/`), [])
  const products = useProducts()
  const [open, setOpen] = useState(params.get('new') === '1')

  return (
    <>
      <PageHeader
        title="Production"
        sub="Each production run creates a batch with an expiry date and adds it to your stock."
        actions={<Button onClick={() => setOpen(true)}>Record production</Button>}
      />
      <Panel flush>
        <Async state={rows} empty={<Empty title="No production yet" hint="Record a run to create your first batch." action={<Button onClick={() => setOpen(true)}>Record production</Button>} />}>
          {(data) => (
            <DataTable rows={data} columns={[
              { label: 'Produced', render: (r) => fmtDate(r.production_date) },
              { label: 'Product', render: (r) => <><div className="font-medium">{r.product_name}</div><div className="text-xs text-mute">{r.batch_number}</div></> },
              { label: 'Quantity', align: 'right', render: (r) => qty(r.quantity, r.unit) },
              { label: 'Total cost', align: 'right', render: (r) => bdt(r.manufacturing_cost) },
              { label: 'Expires', render: (r) => fmtDate(r.expiry_date) },
            ]} />
          )}
        </Async>
      </Panel>

      {open && (
        <FormModal
          title="Record production"
          wide
          onClose={() => setOpen(false)}
          fields={[
            { name: 'product', label: 'Product', type: 'select', required: true, options: productOptions(products.data || []) },
            { name: 'batch_number', label: 'Batch number', required: true, placeholder: 'PRD-2026-001' },
            { name: 'quantity', label: 'Quantity produced', type: 'number', step: '0.01', min: '0.01', required: true },
            { name: 'manufacturing_cost', label: 'Total manufacturing cost (৳)', type: 'number', step: '0.01', min: '0', required: true },
            { name: 'production_date', label: 'Production date', type: 'date', required: true },
            { name: 'expiry_date', label: 'Expiry date', type: 'date', help: 'Leave empty if the product does not expire.' },
          ]}
          onSubmit={async (v) => {
            const body = { ...v, product: Number(v.product) }
            if (!body.expiry_date) delete body.expiry_date
            await api.post(`${P}/productions/`, body)
            toast('Production recorded. Your stock is updated.')
            rows.reload()
          }}
        />
      )}
    </>
  )
}
