import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import { useProducts } from "../../hooks/useProducts";

export default function Production() {
  const { options } = useProducts();
  return (
    <>
      <PageHeader title="Production">Log each production run so its batch can be tracked.</PageHeader>
      <ResourcePanel
        title="Production runs"
        path="/api/products/productions/"
        form={{
          label: "Add production",
          submitLabel: "Save production",
          // Field names are a guess. Match them to your Production serializer.
          fields: [
            { name: "product", label: "Product", type: "select", options },
            { name: "quantity", label: "Quantity produced", type: "number", step: "0.01" },
            { name: "production_date", label: "Production date", type: "date" },
            { name: "expiry_date", label: "Expiry date", type: "date", required: false },
          ],
        }}
      />
    </>
  );
}
