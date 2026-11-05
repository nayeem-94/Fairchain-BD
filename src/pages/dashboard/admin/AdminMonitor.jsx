import PageHeader from "../../../components/ui/PageHeader";
import ResourcePanel from "../../../components/ResourcePanel";

export default function AdminMonitor() {
  return (
    <>
      <PageHeader title="Transfers and prices">Every transfer and price record on the platform.</PageHeader>
      <div className="space-y-6">
        <ResourcePanel title="All transfers" path="/admin-dashboard/transfers/" />
        <ResourcePanel title="All price records" path="/admin-dashboard/prices/" />
      </div>
    </>
  );
}
