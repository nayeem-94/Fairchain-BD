
import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";

const UNITS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "ton", label: "Ton" },
  { value: "liter", label: "Liter" },
  { value: "piece", label: "Piece" },
  { value: "bag", label: "Bag" },
  { value: "carton", label: "Carton" },
];

const CATEGORIES = [
  { value: "rice", label: "Rice" },
  { value: "oil", label: "Oil" },
  { value: "sugar", label: "Sugar" },
  { value: "onion", label: "Onion" },
  { value: "dal", label: "Dal" },
  { value: "vegetable", label: "Vegetable" },
  { value: "fruit", label: "Fruit" },
  { value: "other", label: "Other" },
];

export default function Products() {
  return (
    <>
      <PageHeader title="Products">
        The essential goods tracked on FairChain.
      </PageHeader>

      <ResourcePanel
        title="Product list"
        path="/api/products/products/"
        form={{
          label: "Add product",
          submitLabel: "Add product",
          fields: [
            {
              name: "name",
              label: "Product name",
              required: true,
            },
            {
              name: "unit",
              label: "Unit",
              type: "select",
              options: UNITS,
              required: true,
            },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: CATEGORIES,
              required: true,
            },
          ],
        }}
      />
    </>
  );
}
