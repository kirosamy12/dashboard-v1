import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/Login'

// Brand pages
import BrandOverview from './pages/brand/Overview'
import BrandProducts from './pages/brand/Products'
import BrandOrders from './pages/brand/Orders'
import BrandAnalytics from './pages/brand/Analytics'
import BrandSettings from './pages/brand/Settings'

// Admin pages
import AdminOverview from './pages/admin/Overview'
import AdminBrands from './pages/admin/Brands'
import AdminUsers from './pages/admin/Users'
import AdminOrders from './pages/admin/Orders'
import AdminCategories from './pages/admin/Categories'
import AdminCoupons from './pages/admin/Coupons'
import AdminAnalytics from './pages/admin/Analytics'
import AdminCMS from './pages/admin/CMS'
import AdminSettings from './pages/admin/Settings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Brand Dashboard */}
          <Route element={<DashboardLayout requiredRole="brand" />}>
            <Route path="/brand" element={<BrandOverview />} />
            <Route path="/brand/products" element={<BrandProducts />} />
            <Route path="/brand/orders" element={<BrandOrders />} />
            <Route path="/brand/analytics" element={<BrandAnalytics />} />
            <Route path="/brand/settings" element={<BrandSettings />} />
          </Route>

          {/* Super Admin Dashboard */}
          <Route element={<DashboardLayout requiredRole="superadmin" />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/brands" element={<AdminBrands />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/cms" element={<AdminCMS />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
