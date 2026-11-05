import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import { useApi } from "../hooks/useApi";
import { normNodes } from "../api/normalize";
import { DEMO_NODES } from "../data/demo";

const ROLE_COLORS = {
  importer: "#0B5D46",
  manufacturer: "#B07F0A",
  wholesaler: "#2F6F9F",
  retailer: "#C93B2B",
};
const colorFor = (role) => ROLE_COLORS[String(role).toLowerCase()] || "#12201A";

export default function SupplyChainMap() {
  const { data, loading } = useApi("/api/products/analytics/supply_chain/");
  const live = normNodes(data);
  const isDemo = !loading && live.length < 2;
  const nodes = live.length >= 2 ? live : DEMO_NODES;
  const path = nodes.map((n) => [n.lat, n.lng]);

  return (
    <div className="rounded-md border border-line bg-white p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-bold">Supply chain map</h3>
        {loading ? (
          <span className="text-xs text-ink/50">Loading map data</span>
        ) : isDemo ? (
          <span className="rounded bg-grain/20 px-2 py-0.5 text-xs font-medium">Sample route</span>
        ) : null}
      </div>

      <div className="h-80 overflow-hidden rounded-md border border-line">
        <MapContainer center={[23.4, 90.7]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={path} pathOptions={{ color: "#0B5D46", weight: 3, dashArray: "6 6" }} />
          {nodes.map((n) => (
            <CircleMarker
              key={`${n.name}-${n.lat}`}
              center={[n.lat, n.lng]}
              radius={9}
              pathOptions={{ color: "#fff", weight: 2, fillColor: colorFor(n.role), fillOpacity: 1 }}
            >
              <Tooltip>{n.name} ({n.role})</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/70">
        {Object.entries(ROLE_COLORS).map(([role, color]) => (
          <li key={role} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
            <span className="capitalize">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
