import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import ActionButton from "../../components/ui/ActionButton";
import { api } from "../../api/client";

export default function ExpiryAlerts() {
  return (
    <>
      <PageHeader title="Expiry alerts">Batches in your stock that are close to expiring.</PageHeader>
      <ResourcePanel
        title="My expiry alerts"
        path="/expiry-alerts/"
        empty="No alerts. Select Generate alerts to check your current stock."
        toolbar={(reload) => (
          <ActionButton onClick={async () => { await api("/expiry-alerts/generate/", { method: "POST" }); reload(); }}>
            Generate alerts
          </ActionButton>
        )}
      />
    </>
  );
}
