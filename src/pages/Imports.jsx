import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, P } from '../lib/api.js'
import { Async, Button, DataTable, Empty, FormModal, PageHeader, Panel, useFetch, useToast } from '../components/ui.jsx'
import { bdt, fmtDate, qty } from '../lib/format.js'
import { productOptions, useProducts } from '../lib/hooks.js'

export default function Imports() {
  const toast = useToast()
  const [params] = useSearchParams()
  const rows = useFetch(() => api.get(`${P}/import-shipments/`), [])
  const products = useProducts()
  const [open, setOpen] = useState(params.get('new') === '1')

  return (
    <>
      <PageHeader
        title="Imports"
        sub="Each shipment creates a batch and adds it to your stock."
        actions={<Button onClick={() => setOpen(true)}>Register a shipment</Button>}
      />
      <Panel flush>
        <Async state={rows} empty={<Empty title="No shipments yet" hint="Register your first shipment to create a batch." action={<Button onClick={() => setOpen(true)}>Register a shipment</Button>} />}>
          {(data) => (
            <DataTable rows={data} columns={[
              { label: 'Imported', render: (r) => fmtDate(r.import_date) },
              { label: 'Product', render: (r) => <><div className="font-medium">{r.product_name}</div><div className="text-xs text-mute">{r.batch_number}</div></> },
              { label: 'Quantity', align: 'right', render: (r) => qty(r.quantity, r.unit) },
              { label: 'Cost per unit', align: 'right', render: (r) => bdt(r.unit_price) },
              { label: 'From', render: (r) => <>{r.country_of_origin}<div className="text-xs text-mute">via {r.port}</div></> },
            ]} />
          )}
        </Async>
      </Panel>

      {open && (
        <FormModal
          title="Register a shipment"
          intro="Choose a batch number that has not been used before."
          wide
          onClose={() => setOpen(false)}
          fields={[
            { name: 'product', label: 'Product', type: 'select', required: true, options: productOptions(products.data || []), help: 'Missing a product? Add it from the Products page.' },
            { name: 'batch_number', label: 'Batch number', required: true, placeholder: 'IMP-2026-001' },
            { name: 'quantity', label: 'Quantity', type: 'number', step: '0.01', min: '0.01', required: true },
            { name: 'unit_price', label: 'Cost per unit (৳)', type: 'number', step: '0.01', min: '0.01', required: true },
            { name: 'country_of_origin', label: 'Country of origin', required: true },
            { name: 'port', label: 'Port of arrival', required: true, placeholder: 'Chattogram' },
            { name: 'import_date', label: 'Import date', type: 'date', required: true },
          ]}
          onSubmit={async (v) => { await api.post(`${P}/import-shipments/`, { ...v, product: Number(v.product) }); toast('Shipment registered. Your stock is updated.'); rows.reload() }}
        />
      )}
    </>
  )
}
