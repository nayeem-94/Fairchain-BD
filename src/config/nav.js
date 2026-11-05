// Role names are a guess. Make them match the values your backend returns.
export const CHAIN = ["importer", "manufacturer", "wholesaler", "retailer"];

export const ROLE_LABELS = {
  citizen: "Citizen",
  retailer: "Retailer",
  wholesaler: "Wholesaler",
  manufacturer: "Manufacturer",
  importer: "Importer",
  admin: "Admin",
};

export const REGISTER_ROLES = ["citizen", "retailer", "wholesaler", "manufacturer", "importer"];

export const NAV = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/imports", label: "Imports", roles: ["importer"] },
  { to: "/dashboard/production", label: "Production", roles: ["manufacturer"] },
  { to: "/dashboard/products", label: "Products", roles: ["importer", "manufacturer", "admin"] },
  { to: "/dashboard/inventory", label: "Inventory and batches", roles: CHAIN },
  { to: "/dashboard/transfers", label: "Transfers", roles: CHAIN },
  { to: "/dashboard/prices", label: "Prices", roles: CHAIN },
  { to: "/dashboard/expiry-alerts", label: "Expiry alerts", roles: CHAIN },
  { to: "/dashboard/my-reports", label: "My reports", roles: ["citizen"] },
  { to: "/dashboard/analytics", label: "Analytics" },
  { to: "/dashboard/admin/reports", label: "Citizen reports", roles: ["admin"] },
  { to: "/dashboard/admin/expiry-alerts", label: "All expiry alerts", roles: ["admin"] },
  { to: "/dashboard/admin/monitor", label: "Transfers and prices", roles: ["admin"] },
  { to: "/dashboard/admin/reference-prices", label: "Reference prices", roles: ["admin"] },
];

export const navFor = (role) => NAV.filter((n) => !n.roles || n.roles.includes(role));
