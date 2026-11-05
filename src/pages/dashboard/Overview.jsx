import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { navFor, ROLE_LABELS } from "../../config/nav";
import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import { humanize } from "../../components/ui/DataTable";

function SummaryStats() {
  const { data, loading, error } = useApi("/admin-dashboard/summary/");
  if (loading) return <p className="text-sm text-ink/60">Loading summary. The free server can take up to 30 seconds to wake.</p>;
  if (error) return <p role="alert" className="text-sm text-signal">The summary could not be loaded.</p>;

  const stats = Object.entries(data ?? {}).filter(([, v]) => v !== null && typeof v !== "object");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(([k, v]) => (
        <div key={k} className="rounded-md border border-line bg-white p-4">
          <p className="font-display text-3xl font-bold text-jade">{String(v)}</p>
          <p className="mt-1 text-sm text-ink/70">{humanize(k)}</p>
        </div>
      ))}
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="space-y-6">
      <SummaryStats />
      <ResourcePanel title="Recent activity" path="/admin-dashboard/activity/" />
    </div>
  );
}

function ChainOverview({ role }) {
  const tools = navFor(role).filter((n) => !n.end && !n.to.endsWith("analytics"));
  return (
    <div className="space-y-6">
      {tools.length > 0 && (
        <section className="rounded-md border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Your tools</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t.to}><Link to={t.to} className="inline-block rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:border-jade hover:text-jade">{t.label}</Link></li>
            ))}
          </ul>
        </section>
      )}
      {role !== "citizen" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ResourcePanel title="Inventory summary" path="/api/products/analytics/inventory/" />
          <ResourcePanel title="Transfer summary" path="/api/products/analytics/transfer_summary/" />
        </div>
      )}
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title={`Welcome, ${user.username}`}>
        {user.role === "admin" ? "A snapshot of reports, transfers and prices across the platform." : `Your ${ROLE_LABELS[user.role] ?? user.role} dashboard.`}
      </PageHeader>
      {user.role === "admin" ? <AdminOverview /> : <ChainOverview role={user.role} />}
    </>
  );
}
