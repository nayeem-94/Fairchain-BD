import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { CHAIN } from "./config/nav";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Analytics from "./pages/dashboard/Analytics";
import Products from "./pages/dashboard/Products";
import Imports from "./pages/dashboard/Imports";
import Production from "./pages/dashboard/Production";
import Inventory from "./pages/dashboard/Inventory";
import Transfers from "./pages/dashboard/Transfers";
import Prices from "./pages/dashboard/Prices";
import ExpiryAlerts from "./pages/dashboard/ExpiryAlerts";
import MyReports from "./pages/dashboard/MyReports";
import AdminReports from "./pages/dashboard/admin/AdminReports";
import AdminAlerts from "./pages/dashboard/admin/AdminAlerts";
import AdminMonitor from "./pages/dashboard/admin/AdminMonitor";
import AdminReferencePrices from "./pages/dashboard/admin/AdminReferencePrices";
// import RoleBasedRedirect from "./components/RoleBasedRedirect";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />

              <Route element={<ProtectedRoute roles={["importer", "manufacturer", "admin"]} />}>
                <Route path="products" element={<Products />} />
              </Route>
              <Route element={<ProtectedRoute roles={["importer"]} />}>
                <Route path="imports" element={<Imports />} />
              </Route>
              <Route element={<ProtectedRoute roles={["manufacturer"]} />}>
                <Route path="production" element={<Production />} />
              </Route>
              <Route element={<ProtectedRoute roles={CHAIN} />}>
                <Route path="inventory" element={<Inventory />} />
                <Route path="transfers" element={<Transfers />} />
                <Route path="prices" element={<Prices />} />
                <Route path="expiry-alerts" element={<ExpiryAlerts />} />
              </Route>
              <Route element={<ProtectedRoute roles={["citizen"]} />}>
                <Route path="my-reports" element={<MyReports />} />
              </Route>
              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route path="admin/reports" element={<AdminReports />} />
                <Route path="admin/expiry-alerts" element={<AdminAlerts />} />
                <Route path="admin/monitor" element={<AdminMonitor />} />
                <Route path="admin/reference-prices" element={<AdminReferencePrices />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
