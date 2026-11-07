import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, P } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Async, Button, Chip, DataTable, Empty, FormModal, PageHeader, Panel, opts, useFetch, useToast } from '../components/ui.jsx'
import { REASONS, bdt, fmtDateTime, cap } from '../lib/format.js'
import { productOptions, useProducts } from '../lib/hooks.js'

const STATUSES = ['pending', 'reviewed', 'resolved', 'rejected']

export default function Reports() {
  const { user } = useAuth()
  return user.user_type === 'admin' ? <AdminReports /> : <CitizenReports />
}

function CitizenReports() {
  const toast = useToast()
  const [params] = useSearchParams()
  const rows = useFetch(() => api.get(`${P}/citizen-reports/`), [])
  const products = useProducts()
  const [open, setOpen] = useState(params.get('new') === '1')

  return (
    <>
      <PageHeader
        title="Report a price"
        sub="Tell the government when a shop charges too much, runs out of stock, or may be hoarding."
        actions={<Button onClick={() => setOpen(true)}>New report</Button>}
      />
      <Panel title="Your reports" flush>
        <Async state={rows} empty={<Empty title="You have not reported anything" hint="Saw a price that looks wrong? Send a report and follow its status here." action={<Button onClick={() => setOpen(true)}>New report</Button>} />}>
          {(data) => (
            <DataTable rows={data} columns={[
              { label: 'Sent', render: (r) => fmtDateTime(r.created_at) },
              { label: 'Product', render: (r) => <span className="font-medium">{r.product_name}</span> },
              { label: 'Problem', render: (r) => <>{REASONS[r.reason]}{r.reported_price && <div className="text-sm text-mute">Seen at {bdt(r.reported_price)} / {r.unit}</div>}</> },
              { label: 'Where', key: 'location' },
              { label: 'Status', render: (r) => <Chip>{r.status}</Chip> },
            ]} />
          )}
        </Async>
      </Panel>

      {open && (
        <FormModal
          title="New report"
          onClose={() => setOpen(false)}
          fields={[
            { name: 'product', label: 'Product', type: 'select', required: true, options: productOptions(products.data || []) },
            { name: 'reason', label: 'What is wrong?', type: 'select', required: true, options: Object.entries(REASONS).map(([value, label]) => ({ value, label })) },
            { name: 'reported_price', label: 'Price you saw (৳)', type: 'number', step: '0.01', min: '0.01', help: 'Optional for shortages.' },
            { name: 'location', label: 'Shop or market and area', required: true, placeholder: 'Karwan Bazar, Dhaka' },
            { name: 'description', label: 'Details', type: 'textarea', help: 'Optional.' },
          ]}
          onSubmit={async (v) => {
            const body = { ...v, product: Number(v.product) }
            if (!body.reported_price) delete body.reported_price
            await api.post(`${P}/citizen-reports/`, body)
            toast('Report sent. You can follow its status here.')
            rows.reload()
          }}
        />
      )}
    </>
  )
}

function AdminReports() {
  const toast = useToast()
  const [status, setStatus] = useState('pending')
  const rows = useFetch(() => api.get(`${P}/admin-dashboard/reports/`, { status }), [status])
  const [busyId, setBusyId] = useState(null)

  const change = async (r, next) => {
    setBusyId(r.id)
    try {
      await api.patch(`${P}/admin-dashboard/reports/${r.id}/`, { status: next })
      toast(`Report marked ${next}.`)
      rows.reload()
    } catch (e) { toast(e.message, 'bad') } finally { setBusyId(null) }
  }

  return (
    <>
      <PageHeader title="Citizen reports" sub="Review what citizens report and update the status so they can follow it." />
      <div className="mb-4">
        <select className="input max-w-[220px]" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All reports</option>
          {STATUSES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
        </select>
      </div>
      <Panel flush>
        <Async state={rows} empty={<Empty title="No reports here" hint={status === 'pending' ? 'Nothing is waiting for review.' : 'No reports match this filter.'} />}>
          {(data) => (
            <DataTable rows={data} columns={[
              { label: 'Sent', render: (r) => fmtDateTime(r.created_at) },
              { label: 'Report', render: (r) => (
                <div className="max-w-[320px]">
                  <div className="font-medium">{r.product_name} - {REASONS[r.reason]}{r.reported_price ? ` at ${bdt(r.reported_price)}` : ''}</div>
                  <div className="text-sm text-mute">{r.location} - by {r.citizen_username}</div>
                  {r.description && <div className="mt-1 text-sm">{r.description}</div>}
                </div>
              ) },
              { label: 'Status', render: (r) => <Chip>{r.status}</Chip> },
              { label: 'Change to', render: (r) => (
                <select className="input !w-auto !py-1 text-sm" disabled={busyId === r.id} value="" onChange={(e) => e.target.value && change(r, e.target.value)} aria-label={`Change status of report ${r.id}`}>
                  <option value="">Choose</option>
                  {STATUSES.filter((s) => s !== r.status).map((s) => <option key={s} value={s}>{cap(s)}</option>)}
                </select>
              ) },
            ]} />
          )}
        </Async>
      </Panel>
    </>
  )
}
