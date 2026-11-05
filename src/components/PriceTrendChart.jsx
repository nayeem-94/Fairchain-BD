import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Panel from "./Panel";

export default function PriceTrendChart({ trend, unit }) {
  return (
    <Panel title="Price trend" note={`Recorded market price${unit ? ` per ${unit}` : ""}`} isDemo={trend.isDemo} loading={trend.loading} className="lg:col-span-2">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend.data} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="#CBD7CF" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 12 }} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} tickFormatter={(v) => `৳${v}`} />
            <Tooltip formatter={(v) => [`৳${v}`, "Price"]} />
            <Line type="monotone" dataKey="price" stroke="#0B5D46" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
