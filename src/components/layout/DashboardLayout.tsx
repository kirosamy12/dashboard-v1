import { useState } from 'react'
import { Outlet, Navigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

interface Props { requiredRole?: 'brand' | 'superadmin' }

export default function DashboardLayout({ requiredRole }: Props) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'superadmin' ? '/admin' : '/brand'} replace />
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, shown as drawer when open */}
      <div className={`
        fixed inset-y-0 right-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <div className="text-base font-bold text-gray-900" style={{ fontFamily: 'system-ui' }}>
            SHOP.CO
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition"
          >
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
