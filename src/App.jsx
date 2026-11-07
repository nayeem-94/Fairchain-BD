import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Layout, { NAV } from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Imports from './pages/Imports.jsx'
import Productions from './pages/Productions.jsx'
import Batches from './pages/Batches.jsx'
import Inventory from './pages/Inventory.jsx'
import Transfers from './pages/Transfers.jsx'
import Prices from './pages/Prices.jsx'
import ReferencePrices from './pages/ReferencePrices.jsx'
import Reports from './pages/Reports.jsx'
import Expiry from './pages/Expiry.jsx'
import Profile from './pages/Profile.jsx' 

// Chart pages load on demand so the first screen stays small.
const PriceCheck = lazy(() => import('./pages/PriceCheck.jsx'))
const Analytics = lazy(() => import('./pages/Analytics.jsx'))

function Protected({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// Send people away from pages their role cannot use (the API would answer 403 anyway).
function Only({ path, children }) {
  const { user } = useAuth()
  const allowed = (NAV[user.user_type] || []).some((i) => i.to === path)
  return allowed ? <Suspense fallback={<p className="py-10 text-mute">Loading</p>}>{children}</Suspense> : <Navigate to="/app" replace />
}

const guard = (path, el) => <Only path={path}>{el}</Only>

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={guard('/app/products', <Products />)} />
        <Route path="imports" element={guard('/app/imports', <Imports />)} />
        <Route path="productions" element={guard('/app/productions', <Productions />)} />
        <Route path="batches" element={guard('/app/batches', <Batches />)} />
        <Route path="inventory" element={guard('/app/inventory', <Inventory />)} />
        <Route path="transfers" element={guard('/app/transfers', <Transfers />)} />
        <Route path="prices" element={guard('/app/prices', <Prices />)} />
        <Route path="price-check" element={guard('/app/price-check', <PriceCheck />)} />
        <Route path="reference-prices" element={guard('/app/reference-prices', <ReferencePrices />)} />
        <Route path="reports" element={guard('/app/reports', <Reports />)} />
        <Route path="expiry" element={guard('/app/expiry', <Expiry />)} />
        <Route path="analytics" element={guard('/app/analytics', <Analytics />)} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
