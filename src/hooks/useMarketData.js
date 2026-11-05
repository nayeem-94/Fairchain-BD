import { useApi } from "./useApi";
import { normProducts, normTrend, normComparison, normForecast } from "../api/normalize";
import { DEMO_PRODUCTS, demoTrend, demoComparison, demoForecast } from "../data/demo";

function resolve(state, normalize, demo) {
  const live = normalize(state.data);
  const ok = Array.isArray(live) ? live.length > 0 : Boolean(live);
  return {
    data: ok ? live : demo,
    isDemo: !ok && !state.loading,
    loading: state.loading,
    error: state.error,
  };
}

export function useMarketData(productId) {
  const products = useApi("/api/products/products/");
  const trend = useApi(`/api/products/analytics/price_trend/?product_id=${productId}`);
  const comparison = useApi(`/api/products/analytics/price_comparison/?product_id=${productId}`);
  const forecast = useApi(`/api/ml/forecast/price/?product_id=${productId}`);

  return {
    products: resolve(products, normProducts, DEMO_PRODUCTS),
    trend: resolve(trend, normTrend, demoTrend(productId)),
    comparison: resolve(comparison, normComparison, demoComparison(productId)),
    forecast: resolve(forecast, normForecast, demoForecast(productId)),
  };
}
