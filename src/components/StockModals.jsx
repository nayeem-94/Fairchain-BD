import { api, P } from '../lib/api.js'
import { qty } from '../lib/format.js'
import { FormModal, Modal, Spinner, ErrorNote, useFetch, useToast } from './ui.jsx'

function useInventory() {
  return useFetch(() => api.get(`${P}/inventory/`), [])
}

const stockOptions = (inv = []) =>
  inv
    .filter((i) => Number(i.quantity) > 0)
    .map((i) => ({ value: i.batch, label: `${i.product_name} - ${i.batch_number} (${qty(i.quantity, i.unit)} available)` }))

export function SendStockModal({ initialBatch, onClose, onDone }) {
  const toast = useToast()
  const inv = useInventory()
  const rec = useFetch(() => api.get(`${P}/transfers/receivers/`), [])

  if (inv.loading || rec.loading) return <Modal title="Send stock" onClose={onClose}><Spinner /></Modal>
  if (inv.error || rec.error) return <Modal title="Send stock" onClose={onClose}><ErrorNote error={inv.error || rec.error} /></Modal>

  const options = stockOptions(inv.data)
  return (
    <FormModal
      title="Send stock"
      intro={rec.data.length ? 'The receiver must accept the transfer before the stock moves.' : 'There is nobody to send to yet. The next step in the chain needs to register first.'}
      submitLabel="Send for acceptance"
      onClose={onClose}
      initial={{ batch: initialBatch ?? '' }}
      fields={[
        { name: 'batch', label: 'Batch', type: 'select', required: true, options: options, full: true, placeholder: options.length ? 'Choose a batch' : 'No stock available' },
        { name: 'to_user', label: 'Send to', type: 'select', required: true, full: true, options: rec.data.map((u) => ({ value: u.id, label: `${u.username} (${u.user_type})` })) },
        { name: 'quantity', label: 'Quantity', type: 'number', step: '0.01', min: '0.01', required: true },
        { name: 'price_at_transfer', label: 'Price per unit (৳)', type: 'number', step: '0.01', min: '0.01', required: true, help: 'What you charge the receiver for one unit.' },
      ]}
      onSubmit={async (v) => {
        await api.post(`${P}/transfers/`, {
          batch: Number(v.batch), to_user: Number(v.to_user), quantity: v.quantity, price_at_transfer: v.price_at_transfer,
        })
        toast('Transfer sent. Waiting for the receiver.')
        onDone?.()
      }}
    />
  )
}

export function RecordPriceModal({ initialBatch, defaultType = 'selling', onClose, onDone }) {
  const toast = useToast()
  const inv = useInventory()

  if (inv.loading) return <Modal title="Record a price" onClose={onClose}><Spinner /></Modal>
  if (inv.error) return <Modal title="Record a price" onClose={onClose}><ErrorNote error={inv.error} /></Modal>

  const options = stockOptions(inv.data)
  return (
    <FormModal
      title="Record a price"
      intro="Prices are public. Citizens and the government compare them with the fair price."
      onClose={onClose}
      initial={{ batch: initialBatch ?? '', price_type: defaultType }}
      fields={[
        { name: 'batch', label: 'Batch', type: 'select', required: true, options, full: true, placeholder: options.length ? 'Choose a batch' : 'No stock available' },
        { name: 'price_type', label: 'Type', type: 'select', required: true, options: [{ value: 'selling', label: 'Selling price' }, { value: 'purchase', label: 'Purchase price' }] },
        { name: 'price', label: 'Price per unit (৳)', type: 'number', step: '0.01', min: '0.01', required: true },
      ]}
      onSubmit={async (v) => {
        const row = inv.data.find((i) => String(i.batch) === String(v.batch))
        await api.post(`${P}/prices/`, { product: row?.product, batch: Number(v.batch), price_type: v.price_type, price: v.price })
        toast('Price recorded.')
        onDone?.()
      }}
    />
  )
}
