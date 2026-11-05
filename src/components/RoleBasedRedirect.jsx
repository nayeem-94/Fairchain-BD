
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleBasedRedirect() {
    const { user } = useAuth();

    const dashboards = {
        citizen: "/dashboard/my-reports",
        importer: "/dashboard/imports",
        manufacturer: "/dashboard/production",
        distributor: "/dashboard/inventory",
        wholesaler: "/dashboard/inventory",
        retailer: "/dashboard/inventory",
        admin: "/dashboard/admin/monitor",
    };

    return (
        <Navigate
            to={dashboards[user?.role] || "/"}
            replace
        />
    );
}
