import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Panel from "./Panel";

export default function ForecastChart({ forecast, unit }) {
  const data = forecast.data.map((r) => ({ ...r, band: [r.low, r.high] }));

  return (
    <Panel
      title="AI price forecast"
      note={`Predicted price${unit ? ` per ${unit}` : ""} with the likely range shaded`}
      isDemo={forecast.isDemo}
      loading={forecast.loading}
      className="lg:col-span-3"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="#CBD7CF" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 12 }} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} tickFormatter={(v) => `৳${Math.round(v)}`} />
            <Tooltip
              formatter={(v, name) => (name === "band" ? [`৳${v[0].toFixed(1)} – ৳${v[1].toFixed(1)}`, "Range"] : [`৳${v}`, "Forecast"])}
            />
            <Area dataKey="band" stroke="none" fill="#D9A21B" fillOpacity={0.22} isAnimationActive={false} />
            <Line type="monotone" dataKey="price" stroke="#B07F0A" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
