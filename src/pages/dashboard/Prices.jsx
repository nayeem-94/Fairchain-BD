import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import { useProducts } from "../../hooks/useProducts";

export default function Prices() {
  const { options } = useProducts();
  return (
    <>
      <PageHeader title="Prices">Record the price you charge and compare it with the fair reference price.</PageHeader>
      <div className="space-y-6">
        <ResourcePanel
          title="Price records"
          path="/api/products/prices/"
          form={{
            label: "Add price",
            submitLabel: "Save price",
            // Field names are a guess. Match them to your Price serializer.
            fields: [
              { name: "product", label: "Product", type: "select", options },
              { name: "price", label: "Price (৳)", type: "number", step: "0.01" },
              { name: "market_name", label: "Market or shop", required: false },
            ],
          }}
        />
        <ResourcePanel title="Reference prices" note="Set by admins. Read only." path="/api/products/reference-prices/" />
      </div>
    </>
  );
}
