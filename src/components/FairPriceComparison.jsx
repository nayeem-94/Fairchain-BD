import Panel from "./Panel";

const fmt = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

export default function FairPriceComparison({ comparison, unit }) {
  const { market, fair } = comparison.data;
  const max = Math.max(market, fair) * 1.1;
  const pct = ((market - fair) / fair) * 100;

  const verdict =
    pct > 10 ? { text: "Well above the fair price", color: "text-signal", bar: "bg-signal" }
    : pct > 0 ? { text: "Slightly above the fair price", color: "text-grain", bar: "bg-grain" }
    : { text: "At or below the fair price", color: "text-jade", bar: "bg-jade" };

  const Row = ({ label, value, barClass }) => (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">৳{fmt(value)}</span>
      </div>
      <div className="h-3 rounded-sm bg-jade-soft">
        <div className={`h-3 rounded-sm ${barClass}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );

  return (
    <Panel title="Market vs fair price" note={unit ? `Per ${unit}` : undefined} isDemo={comparison.isDemo} loading={comparison.loading}>
      <div className="space-y-5">
        <Row label="Fair price" value={fair} barClass="bg-jade" />
        <Row label="Market price" value={market} barClass={verdict.bar} />
      </div>
      <p className={`mt-6 font-display text-xl font-bold ${verdict.color}`}>
        {pct > 0 ? "+" : ""}{fmt(pct)}%
      </p>
      <p className="text-sm text-ink/70">{verdict.text}</p>
    </Panel>
  );
}
