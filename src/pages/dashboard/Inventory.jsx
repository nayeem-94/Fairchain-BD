import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";

export default function Inventory() {
  return (
    <>
      <PageHeader title="Inventory and batches">What you hold now, and the batches it came from.</PageHeader>
      <div className="space-y-6">
        <ResourcePanel title="Inventory" path="/api/products/inventory/" />
        <ResourcePanel title="Batches" path="/api/products/batches/" />
      </div>
    </>
  );
}
