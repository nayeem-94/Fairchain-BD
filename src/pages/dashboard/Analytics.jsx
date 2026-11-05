import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import PriceTrendChart from "../../components/PriceTrendChart";
import FairPriceComparison from "../../components/FairPriceComparison";
import ForecastChart from "../../components/ForecastChart";
import SupplyChainMap from "../../components/SupplyChainMap";
import { useMarketData } from "../../hooks/useMarketData";
import { FIELD } from "../../components/ui/styles";

export default function Analytics() {
  const [productId, setProductId] = useState(1);
  const { products, trend, comparison, forecast } = useMarketData(productId);

  useEffect(() => {
    const list = products.data;
    if (list.length && !list.some((p) => String(p.id) === String(productId))) setProductId(list[0].id);
  }, [products.data, productId]);

  const product = products.data.find((p) => String(p.id) === String(productId)) ?? products.data[0];

  return (
    <>
      <PageHeader title="Analytics">Price movement, fairness and forecasts, plus stock and transfer statistics.</PageHeader>

      <label className="mb-5 block text-sm font-medium">
        Product
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className={`${FIELD} mt-1 max-w-xs`}>
          {products.data.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      <div className="grid gap-5 lg:grid-cols-3">
        <PriceTrendChart trend={trend} unit={product?.unit} />
        <FairPriceComparison comparison={comparison} unit={product?.unit} />
        <ForecastChart forecast={forecast} unit={product?.unit} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ResourcePanel title="Inventory analytics" path="/api/products/analytics/inventory/" />
        <ResourcePanel title="Transfer statistics" path="/api/products/analytics/transfer_summary/" />
      </div>
      <div className="mt-6"><SupplyChainMap /></div>
    </>
  );
}
