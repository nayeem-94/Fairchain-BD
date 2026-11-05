import SupplyChainMap from "./SupplyChainMap";

const STEPS = [
  { title: "Imports and production are recorded", body: "Importers and manufacturers log each shipment and production run against a product and batch." },
  { title: "Batches change hands with consent", body: "Every transfer is sent, then accepted or rejected by the receiver, so each batch has a clear holder." },
  { title: "Prices are logged at each stage", body: "Wholesalers and retailers add the price they charge. Admins keep the fair reference price up to date." },
  { title: "Gaps and trends are flagged", body: "FairChain compares market and fair prices, forecasts the next weeks, and warns about batches nearing expiry." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-b border-line bg-jade-soft/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold">How it works</h2>
          <p className="mt-2 max-w-md text-ink/70">A product is traceable from the port to the shop. Each step adds a record anyone can check.</p>
          <ol className="mt-8 space-y-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-jade font-display font-bold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-ink/70">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <SupplyChainMap />
      </div>
    </section>
  );
}
