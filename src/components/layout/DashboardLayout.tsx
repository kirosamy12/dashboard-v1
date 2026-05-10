import { Outlet, Navigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'

interface Props { requiredRole?: 'brand' | 'superadmin' }

export default function DashboardLayout({ requiredRole }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'superadmin' ? '/admin' : '/brand'} replace />
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
