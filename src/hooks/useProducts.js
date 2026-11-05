import { useApi } from "./useApi";
import { normProducts } from "../api/normalize";

export function useProducts() {
  const { data } = useApi("/api/products/products/");
  const products = normProducts(data);
  const options = products.map((p) => ({ value: p.id, label: p.unit ? `${p.name} (${p.unit})` : p.name }));
  return { products, options };
}
