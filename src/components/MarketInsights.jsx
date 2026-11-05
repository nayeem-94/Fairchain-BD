import PriceTrendChart from "./PriceTrendChart";
import FairPriceComparison from "./FairPriceComparison";
import ForecastChart from "./ForecastChart";

export default function MarketInsights({ products, productId, onProductChange, product, trend, comparison, forecast }) {
  return (
    <section id="insights" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold">Market insights</h2>
            <p className="mt-2 text-ink/70">Pick a product to see how its price has moved, whether it is fair, and where it is likely to go next.</p>
          </div>
          <label className="text-sm font-medium">
            <span className="mb-1 block">Product</span>
            <select
              value={productId}
              onChange={(e) => onProductChange(e.target.value)}
              className="w-56 rounded-md border border-line bg-white px-3 py-2 focus:border-jade focus:outline-none focus:ring-2 focus:ring-jade/30"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <PriceTrendChart trend={trend} unit={product?.unit} />
          <FairPriceComparison comparison={comparison} unit={product?.unit} />
          <ForecastChart forecast={forecast} unit={product?.unit} />
        </div>
      </div>
    </section>
  );
}
