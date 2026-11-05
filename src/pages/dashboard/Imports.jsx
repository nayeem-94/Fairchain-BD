
import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import { useProducts } from "../../hooks/useProducts";

export default function Imports() {
  const { options } = useProducts();

  return (
    <>
      <PageHeader title="Imports">
        Record each shipment that enters the country.
      </PageHeader>

      <ResourcePanel
        title="Import shipments"
        path="/api/products/import-shipments/"
        form={{
          label: "Add import",
          submitLabel: "Save import",
          fields: [
            {
              name: "product",
              label: "Product",
              type: "select",
              options,
              required: true,
            },
            {
              name: "batch_number",
              label: "Batch number",
              required: true,
            },
            {
              name: "quantity",
              label: "Quantity",
              type: "number",
              step: "0.01",
              required: true,
            },
            {
              name: "unit_price",
              label: "Unit price",
              type: "number",
              step: "0.01",
              required: true,
            },
            {
              name: "country_of_origin",
              label: "Country of origin",
              required: true,
            },
            {
              name: "port",
              label: "Port of entry",
              required: true,
            },
            {
              name: "import_date",
              label: "Import date",
              type: "date",
              required: true,
            },
          ],
        }}
      />
    </>
  );
}
