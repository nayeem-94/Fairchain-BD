import { Link, Navigate } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import ChainLadder from '../components/ChainLadder.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const EXAMPLE = [
  { label: 'Importer', price: 58 },
  { label: 'Manufacturer', price: 64 },
  { label: 'Distributor', price: 71 },
  { label: 'Wholesaler', price: 79 },
  { label: 'Retailer', price: 94 },
]

const STEPS = [
  ['Importer', 'Registers a shipment. A batch and its stock are created.'],
  ['Manufacturer', 'Records production with a batch number and expiry date.'],
  ['Distributor', 'Accepts stock from the manufacturer and sends it on.'],
  ['Wholesaler', 'Accepts stock and records the price it charges.'],
  ['Retailer', 'Accepts stock and records the shelf price.'],
  ['Citizen', 'Compares shelf prices with the fair price and reports problems.'],
]

export default function Landing() {
  const { user } = useAuth()
  if (user) return <Navigate to="/app" replace />

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Brand />
        <nav className="flex items-center gap-2">
          <Link to="/login" className="rounded-md px-3 py-2 text-[15px] font-medium hover:bg-white">Log in</Link>
          <Link to="/register" className="rounded-md bg-paddy px-4 py-2 text-[15px] font-medium text-white hover:bg-paddy-dark">Create account</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pt-14">
        <div>
          <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[56px]">
            Follow every sack from port to plate.
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-ink/80">
            FairChain BD records who holds each batch of rice, oil, sugar, onion and dal, and what they charge for it.
            When a price jumps, you can see the step where it happened.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-md bg-paddy px-5 py-3 font-medium text-white hover:bg-paddy-dark">Create an account</Link>
            <Link to="/login" className="rounded-md border border-line bg-white px-5 py-3 font-medium hover:bg-panel">Log in</Link>
          </div>
        </div>

        <figure className="rounded-lg border border-line bg-panel p-5 sm:p-6">
          <ChainLadder steps={EXAMPLE} fair={72} unit="kg" animate height={250} />
          <figcaption className="mt-4 text-sm text-mute">
            Example: one batch of miniket rice, price per kg at each step. Red is the part above the government&rsquo;s fair price.
          </figcaption>
        </figure>
      </section>

      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="max-w-xl text-[28px] font-semibold leading-tight">A batch moves through six hands</h2>
          <ol className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(([who, what], i) => (
              <li key={who} className="border-t-2 border-paddy pt-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-sm font-semibold text-paddy">{i + 1}</span>
                  <h3 className="text-lg font-semibold">{who}</h3>
                </div>
                <p className="mt-1 text-[15px] text-ink/80">{what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {[
            ['Businesses', ['Register imports and production in one place.', 'Send stock to the next step and see when it is accepted.', 'Get a warning before a batch expires.']],
            ['Citizens', ['Check today’s price against the fair price.', 'Report a high price, a shortage or hoarding.', 'Trace a batch back through the chain.']],
            ['Government', ['Set and update fair prices.', 'Review citizen reports and change their status.', 'Watch transfers and price records across the country.']],
          ].map(([title, list]) => (
            <div key={title} className="md:px-8 first:md:pl-0 last:md:pr-0">
              <h3 className="text-xl font-semibold">{title}</h3>
              <ul className="mt-3 space-y-2 text-[15px] text-ink/80">
                {list.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line px-5 py-6 text-center text-sm text-mute">
        FairChain BD. Supply chain transparency for essential goods in Bangladesh.
      </footer>
    </div>
  )
}
