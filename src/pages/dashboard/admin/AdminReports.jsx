import PageHeader from "../../../components/ui/PageHeader";
import ResourcePanel from "../../../components/ResourcePanel";
import ActionButton from "../../../components/ui/ActionButton";
import { api } from "../../../api/client";

// Status values are a guess. Match them to your report status choices.
const STATUSES = ["pending", "reviewing", "resolved", "rejected"];

export default function AdminReports() {
  return (
    <>
      <PageHeader title="Citizen reports">Review reports and set their status. Citizens see the change under My reports.</PageHeader>
      <ResourcePanel
        title="All citizen reports"
        path="/admin-dashboard/reports/"
        actions={(row, reload) => (
          <span className="flex flex-wrap gap-2">
            {STATUSES.filter((s) => s !== String(row.status).toLowerCase()).map((s) => (
              <ActionButton
                key={s}
                tone={s === "resolved" ? "good" : s === "rejected" ? "bad" : "default"}
                onClick={async () => {
                  await api(`/admin-dashboard/reports/${row.id}/`, { method: "PATCH", body: { status: s } });
                  reload();
                }}
              >
                Mark {s}
              </ActionButton>
            ))}
          </span>
        )}
      />
    </>
  );
}
