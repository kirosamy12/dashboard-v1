import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, Package, ShoppingCart, BarChart2,
  Settings, LogOut, Users, Tag, Percent, Store, FileText, ChevronRight
} from 'lucide-react'

interface NavItem { label: string; to: string; icon: React.ReactNode }

const brandNav: NavItem[] = [
  { label: 'الرئيسية', to: '/brand', icon: <LayoutDashboard size={16} /> },
  { label: 'المنتجات', to: '/brand/products', icon: <Package size={16} /> },
  { label: 'الطلبات', to: '/brand/orders', icon: <ShoppingCart size={16} /> },
  { label: 'التقارير', to: '/brand/analytics', icon: <BarChart2 size={16} /> },
  { label: 'الإعدادات', to: '/brand/settings', icon: <Settings size={16} /> },
]

const adminNav: NavItem[] = [
  { label: 'الرئيسية', to: '/admin', icon: <LayoutDashboard size={16} /> },
  { label: 'البراندات', to: '/admin/brands', icon: <Store size={16} /> },
  { label: 'المستخدمين', to: '/admin/users', icon: <Users size={16} /> },
  { label: 'الطلبات', to: '/admin/orders', icon: <ShoppingCart size={16} /> },
  { label: 'الفئات', to: '/admin/categories', icon: <Tag size={16} /> },
  { label: 'الكوبونات', to: '/admin/coupons', icon: <Percent size={16} /> },
  { label: 'التقارير', to: '/admin/analytics', icon: <BarChart2 size={16} /> },
  { label: 'المحتوى', to: '/admin/cms', icon: <FileText size={16} /> },
  { label: 'الإعدادات', to: '/admin/settings', icon: <Settings size={16} /> },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = user?.role === 'superadmin' ? adminNav : brandNav
  const isSuperAdmin = user?.role === 'superadmin'

  return (
    <aside className="w-56 bg-white border-l border-gray-100 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">SHOP.CO</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
              {isSuperAdmin ? 'Super Admin' : user?.brandName}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 mx-5" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-2">
          {isSuperAdmin ? 'الإدارة' : 'القائمة'}
        </p>
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/brand' || item.to === '/admin'}
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all group',
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            )}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-40 transition -rotate-180" />
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="h-px bg-gray-100 mx-5" />
      <div className="px-3 py-3">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-1">
          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
            {user?.name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 w-full transition-colors"
        >
          <LogOut size={14} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
