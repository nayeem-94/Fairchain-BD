import PageHeader from "../../../components/ui/PageHeader";
import ResourcePanel from "../../../components/ResourcePanel";
import ActionButton from "../../../components/ui/ActionButton";
import { api } from "../../../api/client";

export default function AdminAlerts() {
  return (
    <>
      <PageHeader title="All expiry alerts">Alerts raised across every account.</PageHeader>
      <ResourcePanel
        title="Expiry alerts"
        path="/admin-dashboard/expiry-alerts/"
        actions={(row, reload) => (
          <ActionButton
            onClick={async () => {
              // "is_read" is a guess. Match it to your alert serializer.
              await api(`/admin-dashboard/expiry-alerts/${row.id}/`, { method: "PATCH", body: { is_read: !row.is_read } });
              reload();
            }}
          >
            {row.is_read ? "Mark unread" : "Mark read"}
          </ActionButton>
        )}
      />
    </>
  );
}
