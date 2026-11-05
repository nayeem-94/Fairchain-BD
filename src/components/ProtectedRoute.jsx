
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const dashboards = {
      citizen: "/dashboard/my-reports",
      importer: "/dashboard/imports",
      manufacturer: "/dashboard/production",
      distributor: "/dashboard/inventory",
      wholesaler: "/dashboard/inventory",
      retailer: "/dashboard/inventory",
      admin: "/dashboard/admin/monitor",
    };

    return <Navigate to={dashboards[user.role] || "/dashboard"} replace />;
  }

  return <Outlet />;
}
