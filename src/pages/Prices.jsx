import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { RecordPriceModal } from '../components/StockModals.jsx'
import { Async, Button, Chip, DataTable, Empty, PageHeader, Panel, useFetch } from '../components/ui.jsx'
import { ROLES, SUPPLY_ROLES, bdt, fmtDateTime } from '../lib/format.js'
import { useProducts } from '../lib/hooks.js'

export default function Prices() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const [product, setProduct] = useState('')
  const products = useProducts()
  const rows = useFetch(() => api.get(`${P}/prices/`, { product_id: product }), [product])
  const canRecord = SUPPLY_ROLES.includes(user.user_type)
  const [open, setOpen] = useState(params.get('new') === '1' && canRecord)

  return (
    <>
      <PageHeader
        title="Price records"
        sub="Prices recorded by businesses along the chain. Everyone can see them."
        actions={<>
          <Link to="/app/price-check"><Button variant="quiet">Compare with fair price</Button></Link>
          {canRecord && <Button onClick={() => setOpen(true)}>Record a price</Button>}
        </>}
      />
      <div className="mb-4">
        <select className="input max-w-xs" value={product} onChange={(e) => setProduct(e.target.value)} aria-label="Filter by product">
          <option value="">All products</option>
          {(products.data || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <Panel flush>
        <Async state={rows} empty={<Empty title="No prices recorded" hint={canRecord ? 'Record the price of a batch you hold.' : 'Businesses have not recorded prices for this selection yet.'} />}>
          {(data) => (
            <DataTable rows={data} columns={[
              { label: 'When', render: (r) => fmtDateTime(r.recorded_at) },
              { label: 'Product', render: (r) => <><div className="font-medium">{r.product_name}</div><div className="text-xs text-mute">{r.batch_number}</div></> },
              { label: 'Recorded by', render: (r) => <>{r.username}<div className="text-xs text-mute">{ROLES[r.user_role]}</div></> },
              { label: 'Type', render: (r) => <Chip>{r.price_type}</Chip> },
              { label: 'Price', align: 'right', render: (r) => <span className="font-semibold">{bdt(r.price)}<span className="font-normal text-mute"> / {r.unit}</span></span> },
            ]} />
          )}
        </Async>
      </Panel>
      {open && <RecordPriceModal defaultType={user.user_type === 'importer' ? 'purchase' : 'selling'} onClose={() => setOpen(false)} onDone={rows.reload} />}
    </>
  )
}
