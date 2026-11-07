import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api, P } from '../lib/api.js'
import ChainLadder from '../components/ChainLadder.jsx'
import { Async, Button, Chip, DataTable, Empty, ErrorNote, PageHeader, Panel, Spinner, Stat, useFetch } from '../components/ui.jsx'
import { CHAIN, ROLES, bdt, fmtDate, num, pct, priceVerdict } from '../lib/format.js'
import { soft, useProducts } from '../lib/hooks.js'

export default function PriceCheck() {
  const [params, setParams] = useSearchParams()
  const products = useProducts()
  const productId = params.get('product') || ''
  const choose = (id) => setParams(id ? { product: id } : {})

  return (
    <>
      <PageHeader title="Price check" sub="Compare what shops and businesses charge with the government's fair price." />
      <div className="mb-6">
        <select className="input max-w-sm" value={productId} onChange={(e) => choose(e.target.value)} aria-label="Product">
          <option value="">Choose a product</option>
          {(products.data || []).map((p) => <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>)}
        </select>
      </div>
      {productId ? <Result key={productId} productId={productId} /> : (
        <Panel><Empty title="Pick a product" hint="You will see the fair price, what each step of the chain charges, and how the price has moved." /></Panel>
      )}
    </>
  )
}

function Result({ productId }) {
  const state = useFetch(async () => {
    const [cmp, trend] = await Promise.all([
      soft(api.get(`${P}/analytics/price_comparison/`, { product_id: productId })),
      soft(api.get(`${P}/analytics/price_trend/`, { product_id: productId })),
    ])
    return { cmp, trend }
  }, [productId])

  return (
    <Async state={state}>
      {({ cmp, trend }) => (
        <div className="space-y-6">
          {cmp.ok ? <Comparison data={cmp.data} /> : (
            <Panel>
              <Empty
                title={cmp.error.status === 404 ? 'No fair price for this product yet' : 'Could not load the comparison'}
                hint={cmp.error.status === 404 ? 'The government has not set a fair price, so there is nothing to compare with. Recorded prices are shown below if any exist.' : cmp.error.message}
              />
            </Panel>
          )}
          {trend.ok ? <Trend data={trend.data} fair={cmp.ok ? num(cmp.data.reference_price) : null} /> : null}
          <Forecast productId={productId} />
        </div>
      )}
    </Async>
  )
}

function Comparison({ data }) {
  const fair = num(data.reference_price)
  const rows = data.prices

  const steps = useMemo(() => CHAIN.map((role) => {
    const mine = rows.filter((r) => r.user_role === role)
    const selling = mine.filter((r) => r.price_type === 'selling')
    const use = selling.length ? selling : mine
    if (!use.length) return null
    const avg = use.reduce((a, r) => a + num(r.market_price), 0) / use.length
    return { label: ROLES[role], sub: selling.length ? 'selling' : 'cost', price: avg }
  }).filter(Boolean), [rows])

  const selling = rows.filter((r) => r.price_type === 'selling')
  const avgSelling = selling.length ? selling.reduce((a, r) => a + num(r.market_price), 0) / selling.length : null
  const above = selling.filter((r) => num(r.difference_percentage) > 10).length

  return (
    <>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <Stat label={`Fair price per ${data.unit}`} value={bdt(fair)} />
        <Stat label="Average selling price" value={avgSelling === null ? '-' : bdt(avgSelling)} note={avgSelling === null ? undefined : pct(((avgSelling - fair) / fair) * 100) + ' vs fair'} tone={avgSelling > fair * 1.1 ? 'bad' : undefined} />
        <Stat label="Selling records above fair" value={above} note={`of ${selling.length}`} tone={above ? 'bad' : undefined} />
        <Stat label="Records in total" value={rows.length} />
      </div>

      <Panel title="Price at each step of the chain">
        {steps.length ? (
          <>
            <ChainLadder steps={steps} fair={fair} unit={data.unit} />
            <p className="mt-4 text-sm text-mute">Average of the prices each kind of business recorded. Red is the part above the fair price.</p>
          </>
        ) : <Empty title="No prices recorded yet" hint="Businesses have not recorded a price for this product." />}
      </Panel>

      <Panel title="Latest records" flush>
        <DataTable dense rows={rows.slice(0, 30).map((r, i) => ({ ...r, id: i }))} empty={<Empty title="No prices recorded yet" />} columns={[
          { label: 'When', render: (r) => fmtDate(r.recorded_at) },
          { label: 'By', render: (r) => <>{r.user}<div className="text-xs text-mute">{ROLES[r.user_role]}</div></> },
          { label: 'Type', render: (r) => <Chip>{r.price_type}</Chip> },
          { label: 'Price', align: 'right', render: (r) => bdt(r.market_price) },
          { label: 'Against fair price', render: (r) => { const v = priceVerdict(r.difference_percentage); return <Chip tone={v.tone}>{`${pct(r.difference_percentage)} ${v.label}`}</Chip> } },
        ]} />
      </Panel>
    </>
  )
}

const axis = { fontSize: 12, fill: '#5B6A66' }

function Trend({ data, fair }) {
  const points = data.prices.map((p) => ({
    t: new Date(p.date).getTime(),
    selling: p.price_type === 'selling' ? num(p.price) : null,
    purchase: p.price_type === 'purchase' ? num(p.price) : null,
  }))
  return (
    <Panel title="How the price moved">
      <div className="h-[260px]">
        <ResponsiveContainer>
          <ComposedChart data={points} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#D4DAD0" vertical={false} />
            <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tick={axis} tickFormatter={(t) => fmtDate(t)} tickCount={4} />
            <YAxis tick={axis} tickFormatter={(v) => `৳${v}`} domain={['auto', 'auto']} width={56} />
            <Tooltip labelFormatter={(t) => fmtDate(t)} formatter={(v, n) => [bdt(v), n === 'selling' ? 'Selling price' : 'Purchase price']} />
            {fair > 0 && <ReferenceLine y={fair} stroke="#1E2B33" strokeDasharray="5 4" label={{ value: `Fair ${bdt(fair)}`, position: 'insideTopRight', fontSize: 12, fill: '#1E2B33' }} />}
            <Line type="monotone" dataKey="selling" stroke="#C2302A" strokeWidth={2} dot={{ r: 3 }} connectNulls name="selling" />
            <Line type="monotone" dataKey="purchase" stroke="#2A6489" strokeWidth={2} dot={{ r: 3 }} connectNulls name="purchase" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-5 text-sm text-mute">
        <span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-sun" /> Selling price</span>
        <span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-river" /> Purchase price</span>
      </div>
    </Panel>
  )
}

function Forecast({ productId }) {
  const [state, setState] = useState({ busy: false, data: null, error: null })

  const run = async () => {
    setState({ busy: true, data: null, error: null })
    try {
      const d = await api.get('/api/ml/forecast/price/', { product_id: productId })
      setState({ busy: false, data: d, error: null })
    } catch (error) { setState({ busy: false, data: null, error }) }
  }

  const rows = state.data?.forecast.map((f) => ({ t: new Date(f.date).getTime(), predicted: f.predicted_price, band: [f.lower_price, f.upper_price] }))

  return (
    <Panel title="Forecast for the next 7 days" action={<Button size="sm" variant="quiet" onClick={run} busy={state.busy}>{state.data ? 'Run again' : 'Predict'}</Button>}>
      {!state.data && !state.busy && !state.error && (
        <p className="text-[15px] text-mute">A Prophet model learns from recorded prices and estimates the next week. It needs at least two days of prices and can take a few seconds.</p>
      )}
      {state.busy && <Spinner label="Running the model" />}
      <ErrorNote error={state.error} />
      {rows && (
        <div className="h-[260px]">
          <ResponsiveContainer>
            <ComposedChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#D4DAD0" vertical={false} />
              <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tick={axis} tickFormatter={(t) => fmtDate(t)} tickCount={4} />
              <YAxis tick={axis} tickFormatter={(v) => `৳${v}`} domain={['auto', 'auto']} width={56} />
              <Tooltip labelFormatter={(t) => fmtDate(t)} formatter={(v, n) => (n === 'band' ? [`${bdt(v[0])} to ${bdt(v[1])}`, 'Likely range'] : [bdt(v), 'Predicted'])} />
              <Area dataKey="band" stroke="none" fill="#2A6489" fillOpacity={0.15} name="band" />
              <Line dataKey="predicted" stroke="#2A6489" strokeWidth={2} dot={{ r: 3 }} name="predicted" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  )
}
