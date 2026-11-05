const TEETH = Array.from({ length: 20 }, (_, i) => `L${(i + 0.5) * 14} 10 L${(i + 1) * 14} 0`).join(" ");

const fmt = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

function PriceReceipt({ product, comparison }) {
  const { market, fair } = comparison.data;
  const pct = ((market - fair) / fair) * 100;
  const over = pct > 0;

  return (
    <div className="w-full max-w-sm rotate-1">
      <div className="border-x border-t border-line bg-white px-6 pt-6 text-ink">
        <p className="text-sm text-ink/60">Price check</p>
        <p className="font-display text-2xl font-bold">
          {product?.name}
          {product?.unit ? <span className="text-base font-normal text-ink/60"> / {product.unit}</span> : null}
        </p>

        <dl className="mt-6 space-y-3 border-t border-dashed border-ink/30 pt-4 text-lg">
          <div className="flex justify-between"><dt>Fair price</dt><dd className="font-semibold">৳{fmt(fair)}</dd></div>
          <div className="flex justify-between"><dt>Market price</dt><dd className="font-semibold">৳{fmt(market)}</dd></div>
        </dl>

        <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-ink/30 py-4">
          <span className="text-lg">Difference</span>
          <span className={`font-display text-3xl font-bold ${over ? "text-signal" : "text-jade"}`}>
            {over ? "+" : ""}{fmt(pct)}%
          </span>
        </div>
        {comparison.isDemo && <p className="pb-4 text-xs text-ink/50">Sample figures. Live data appears once the API responds.</p>}
      </div>
      <svg viewBox="0 0 280 10" preserveAspectRatio="none" className="block h-2.5 w-full text-white" aria-hidden="true">
        <path d={`M0 0 ${TEETH} Z`} fill="currentColor" />
      </svg>
    </div>
  );
}

export default function Hero({ product, comparison }) {
  return (
    <section id="home" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div>
          <h1 className="font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            Know what essentials should cost, and who is charging more.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            FairChain BD follows rice, oil, onions and other staples from import to the market shelf. It compares
            what shops charge with fair reference prices, forecasts where prices are heading, and lets you report
            overpricing in your area.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/register" className="rounded-md bg-jade px-6 py-3 font-semibold text-white hover:bg-jade-dark">
              Get started
            </a>
            <a href="#insights" className="rounded-md border border-ink/25 px-6 py-3 font-semibold text-ink hover:border-jade hover:text-jade">
              See market prices
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <PriceReceipt product={product} comparison={comparison} />
        </div>
      </div>
    </section>
  );
}
