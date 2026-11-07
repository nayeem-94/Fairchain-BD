import { useState } from 'react'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Async, Button, Chip, DataTable, Empty, FormModal, PageHeader, Panel, opts, useFetch, useToast } from '../components/ui.jsx'
import { CATEGORIES, UNITS, bdt, cap } from '../lib/format.js'

export default function Products() {
  const { user } = useAuth()
  const toast = useToast()
  const products = useFetch(() => api.get(`${P}/products/`), [])
  const fair = useFetch(() => api.get(`${P}/reference-prices/`), [])
  const [open, setOpen] = useState(false)
  const canAdd = ['importer', 'manufacturer'].includes(user.user_type)
  const fairOf = (id) => (fair.data || []).find((r) => r.product === id && r.is_active)

  return (
    <>
      <PageHeader
        title="Products"
        sub="Every essential good tracked on FairChain BD."
        actions={canAdd && <Button onClick={() => setOpen(true)}>Add product</Button>}
      />
      <Panel flush>
        <Async state={products} empty={<Empty title="No products yet" hint={canAdd ? 'Add the first product so batches can be created.' : 'Importers and manufacturers add products.'} />}>
          {(rows) => (
            <DataTable rows={rows} columns={[
              { label: 'Name', render: (r) => <><div className="font-medium">{r.name}</div>{r.description && <div className="text-sm text-mute">{r.description}</div>}</> },
              { label: 'Category', render: (r) => cap(r.category) },
              { label: 'Sold by', render: (r) => r.unit },
              { label: 'Fair price', render: (r) => (fairOf(r.id) ? bdt(fairOf(r.id).price) : <span className="text-mute">Not set</span>) },
              { label: 'Status', render: (r) => <Chip tone={r.is_active ? 'ok' : 'mute'}>{r.is_active ? 'Active' : 'Inactive'}</Chip> },
            ]} />
          )}
        </Async>
      </Panel>

      {open && (
        <FormModal
          title="Add product"
          onClose={() => setOpen(false)}
          fields={[
            { name: 'name', label: 'Name', required: true, full: true, placeholder: 'Miniket rice' },
            { name: 'category', label: 'Category', type: 'select', required: true, options: opts(CATEGORIES) },
            { name: 'unit', label: 'Unit', type: 'select', required: true, options: opts(UNITS) },
            { name: 'description', label: 'Description', type: 'textarea', help: 'Optional.' },
          ]}
          onSubmit={async (v) => { await api.post(`${P}/products/`, v); toast('Product added.'); products.reload() }}
        />
      )}
    </>
  )
}
