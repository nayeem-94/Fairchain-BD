// The backend response shapes aren't documented, so these helpers accept
// several likely field names. Adjust the key lists to match your serializers.

export const asList = (d) =>
  Array.isArray(d) ? d
  : Array.isArray(d?.results) ? d.results
  : d && typeof d === "object" ? (Object.values(d).find(Array.isArray) ?? [])
  : [];

const num = (v) => {
  const n = Number(v);
  return v != null && v !== "" && Number.isFinite(n) ? n : null;
};

const first = (o, keys) => {
  for (const k of keys) if (o?.[k] != null) return o[k];
  return null;
};

export const normProducts = (d) =>
  asList(d)
    .map((p) => ({ id: p.id, name: first(p, ["name", "product_name", "title"]), unit: first(p, ["unit"]) || "" }))
    .filter((p) => p.id != null && p.name);

export const normTrend = (d) =>
  asList(d)
    .map((r) => ({
      date: String(first(r, ["date", "recorded_at", "created_at", "month", "day"]) || "").slice(0, 10),
      price: num(first(r, ["price", "avg_price", "average_price", "market_price"])),
    }))
    .filter((r) => r.date && r.price != null);

export const normComparison = (d) => {
  const r = Array.isArray(d) ? d[0] : d;
  if (!r) return null;
  const market = num(first(r, ["market_price", "avg_market_price", "average_market_price", "current_price"]));
  const fair = num(first(r, ["fair_price", "reference_price", "max_price", "fair_market_price"]));
  return market != null && fair != null ? { market, fair } : null;
};

export const normForecast = (d) =>
  asList(d?.forecast ?? d)
    .map((r) => {
      const price = num(first(r, ["yhat", "predicted_price", "forecast", "price"]));
      return {
        date: String(first(r, ["ds", "date"]) || "").slice(0, 10),
        price,
        low: num(first(r, ["yhat_lower", "lower"])) ?? price,
        high: num(first(r, ["yhat_upper", "upper"])) ?? price,
      };
    })
    .filter((r) => r.date && r.price != null);

export const normNodes = (d) =>
  asList(d)
    .map((n) => ({
      name: first(n, ["name", "location", "label", "holder"]),
      role: first(n, ["role", "stage", "type"]) || "Stop",
      lat: num(first(n, ["lat", "latitude"])),
      lng: num(first(n, ["lng", "lon", "longitude"])),
    }))
    .filter((n) => n.name && n.lat != null && n.lng != null);
