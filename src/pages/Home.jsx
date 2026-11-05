import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MarketInsights from "../components/MarketInsights";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { useMarketData } from "../hooks/useMarketData";

export default function Home() {
  const [productId, setProductId] = useState(1);
  const { products, trend, comparison, forecast } = useMarketData(productId);

  // If the chosen id isn't in the loaded list, fall back to the first product.
  useEffect(() => {
    const list = products.data;
    if (list.length && !list.some((p) => String(p.id) === String(productId))) setProductId(list[0].id);
  }, [products.data, productId]);

  const product = products.data.find((p) => String(p.id) === String(productId)) ?? products.data[0];

  return (
    <>
      <Navbar />
      <main>
        <Hero product={product} comparison={comparison} />
        <MarketInsights
          products={products.data}
          productId={productId}
          onProductChange={setProductId}
          product={product}
          trend={trend}
          comparison={comparison}
          forecast={forecast}
        />
        <HowItWorks />
        <Features products={products.data} />
      </main>
      <Footer />
    </>
  );
}
