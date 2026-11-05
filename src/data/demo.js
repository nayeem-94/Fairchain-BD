
// ==========================================
// DEMO PRODUCTS
// ==========================================

export const DEMO_PRODUCTS = [
  { id: 1, name: "Rice (Miniket)", unit: "kg" },
  { id: 2, name: "Soybean Oil", unit: "litre" },
  { id: 3, name: "Onion", unit: "kg" },
  { id: 4, name: "Egg", unit: "dozen" },
  { id: 5, name: "Lentil (Masoor Dal)", unit: "kg" },
  { id: 6, name: "Sugar", unit: "kg" },
  { id: 7, name: "Potato", unit: "kg" },
  { id: 8, name: "Garlic", unit: "kg" },
  { id: 9, name: "Ginger", unit: "kg" },
  { id: 10, name: "Wheat Flour", unit: "kg" },
  { id: 11, name: "Green Chili", unit: "kg" },
  { id: 12, name: "Tomato", unit: "kg" },
  { id: 13, name: "Chicken", unit: "kg" },
  { id: 14, name: "Milk", unit: "litre" },
  { id: 15, name: "Mustard Oil", unit: "litre" },
];

// ==========================================
// BASE MARKET PRICES (BDT)
// ==========================================

const BASE = {
  1: 75,
  2: 178,
  3: 85,
  4: 135,
  5: 125,
  6: 130,
  7: 35,
  8: 180,
  9: 220,
  10: 65,
  11: 120,
  12: 80,
  13: 220,
  14: 90,
  15: 280,
};

const base = (id) => BASE[id] ?? 80;

// ==========================================
// DATE GENERATOR
// ==========================================

const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

// ==========================================
// DEMO PRICE TREND (12 WEEKS)
// ==========================================

export const demoTrend = (id) =>
  Array.from({ length: 12 }, (_, i) => {
    const initial = base(id);

    const variation =
      1 +
      0.012 * i +
      0.03 * Math.sin(i / 1.5) +
      0.015 * Math.cos(i / 2.3);

    return {
      date: day((i - 11) * 7),
      price: Math.round(initial * variation * 10) / 10,
    };
  });

// ==========================================
// MARKET VS FAIR PRICE COMPARISON
// ==========================================

export const demoComparison = (id) => {
  const market = demoTrend(id).at(-1).price;

  const fair = Math.round(base(id) * 1.06 * 10) / 10;

  return {
    market,
    fair,
    difference: Math.round((market - fair) * 10) / 10,
    percentage: Math.round(((market - fair) / fair) * 1000) / 10,
  };
};

// ==========================================
// PRICE FORECAST (NEXT 14 DAYS)
// ==========================================

export const demoForecast = (id) => {
  const start = demoTrend(id).at(-1).price;

  return Array.from({ length: 14 }, (_, i) => {
    const price = Math.round(
      (start + i * 0.35 + Math.sin(i / 2) * 0.8) * 10
    ) / 10;

    const uncertainty = 1.5 + i * 0.25;

    return {
      date: day(i + 1),
      price,
      low: Math.round((price - uncertainty) * 10) / 10,
      high: Math.round((price + uncertainty) * 10) / 10,
    };
  });
};

// ==========================================
// SUPPLY CHAIN NODES
// ==========================================

export const DEMO_NODES = [
  {
    name: "Chattogram Port",
    role: "Importer",
    lat: 22.33,
    lng: 91.80,
  },
  {
    name: "Mongla Port",
    role: "Importer",
    lat: 22.49,
    lng: 89.59,
  },
  {
    name: "Narayanganj",
    role: "Manufacturer",
    lat: 23.62,
    lng: 90.50,
  },
  {
    name: "Gazipur",
    role: "Manufacturer",
    lat: 23.99,
    lng: 90.42,
  },
  {
    name: "Bogura",
    role: "Distributor",
    lat: 24.85,
    lng: 89.37,
  },
  {
    name: "Rajshahi",
    role: "Distributor",
    lat: 24.37,
    lng: 88.60,
  },
  {
    name: "Kawran Bazar, Dhaka",
    role: "Wholesaler",
    lat: 23.75,
    lng: 90.39,
  },
  {
    name: "Khatunganj, Chattogram",
    role: "Wholesaler",
    lat: 22.33,
    lng: 91.83,
  },
  {
    name: "Mirpur, Dhaka",
    role: "Retailer",
    lat: 23.81,
    lng: 90.36,
  },
  {
    name: "Uttara, Dhaka",
    role: "Retailer",
    lat: 23.87,
    lng: 90.40,
  },
  {
    name: "Khulna City",
    role: "Retailer",
    lat: 22.82,
    lng: 89.55,
  },
  {
    name: "Sylhet City",
    role: "Retailer",
    lat: 24.89,
    lng: 91.87,
  },
  {
    name: "Cumilla",
    role: "Distributor",
    lat: 23.46,
    lng: 91.18,
  },
  {
    name: "Rangpur",
    role: "Wholesaler",
    lat: 25.74,
    lng: 89.28,
  },
  {
    name: "Mymensingh",
    role: "Retailer",
    lat: 24.75,
    lng: 90.40,
  },
];
