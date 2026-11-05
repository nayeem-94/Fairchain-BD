import PageHeader from "../../../components/ui/PageHeader";
import ResourcePanel from "../../../components/ResourcePanel";
import ActionButton from "../../../components/ui/ActionButton";
import { api } from "../../../api/client";
import { useProducts } from "../../../hooks/useProducts";

export default function AdminReferencePrices() {
  const { options } = useProducts();
  return (
    <>
      <PageHeader title="Reference prices">The fair prices every market price is compared against.</PageHeader>
      <ResourcePanel
        title="Reference prices"
        path="/admin-dashboard/reference-prices/"
        form={{
          label: "Add reference price",
          submitLabel: "Save reference price",
          // Field names are a guess. Match them to your ReferencePrice serializer.
          fields: [
            { name: "product", label: "Product", type: "select", options },
            { name: "fair_price", label: "Fair price (৳)", type: "number", step: "0.01" },
          ],
        }}
        actions={(row, reload) => (
          <ActionButton
            tone={row.is_active === false ? "good" : "bad"}
            onClick={async () => {
              await api(`/admin-dashboard/reference-prices/${row.id}/`, { method: "PATCH", body: { is_active: row.is_active === false } });
              reload();
            }}
          >
            {row.is_active === false ? "Activate" : "Deactivate"}
          </ActionButton>
        )}
      />
    </>
  );
}
