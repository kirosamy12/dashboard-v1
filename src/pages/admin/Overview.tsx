import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Store, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { adminApi, type AdminOverview, type MonthlyRevenue } from '../../lib/api'
import { salesData, orders as mockOrders, brands as mockBrands, statusColors, statusLabels } from '../../lib/mockData'
import { formatCurrency } from '../../lib/utils'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'

export default function AdminOverview() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, rev] = await Promise.all([adminApi.overview(), adminApi.revenue()])
        setOverview(ov)
        setMonthly(rev.monthly)
      } catch { /* use mock */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const chartData = monthly.length > 0
    ? monthly.map(m => ({
        month: new Date(2026, m._id.month - 1).toLocaleString('ar', { month: 'short' }),
        revenue: m.revenue,
        orders: m.orders,
      }))
    : salesData.map(d => ({ ...d, revenue: d.revenue * 4.2, orders: d.orders * 3.8 }))

  const recentOrders = (overview?.recentOrders || mockOrders.slice(0, 6)) as typeof mockOrders

  return (
    <div className="p-4 md:p-7 space-y-4 md:space-y-6 max-w-[1200px]">
      <PageHeader title="لوحة التحكم" subtitle="نظرة عامة على أداء المنصة" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="إجمالي الإيرادات" value={formatCurrency(overview?.totalRevenue ?? 375100)} icon={<DollarSign size={15} />} sub="↑ 18% هذا الشهر" />
        <StatCard label="البراندات النشطة" value={String(overview?.totalBrands ?? 3)} icon={<Store size={15} />} />
        <StatCard label="المستخدمين" value={String(overview?.totalUsers ?? 1247)} icon={<Users size={15} />} sub="↑ 34 هذا الأسبوع" />
        <StatCard label="إجمالي الطلبات" value={String(overview?.totalOrders ?? 3218)} icon={<ShoppingCart size={15} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-800">إيرادات المنصة</p>
            <p className="text-xs text-gray-400 mt-0.5">آخر 6 أشهر {loading && '(جاري التحميل...)'}</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #f0f0f0', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), 'الإيرادات']} />
              <Line type="monotone" dataKey="revenue" stroke="#111" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Brands performance */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-800 mb-5">أداء البراندات</p>
          <div className="space-y-4">
            {mockBrands.filter(b => b.status === 'active').map(b => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">{b.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700">{b.name}</p>
                  <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-800 rounded-full" style={{ width: `${(b.revenue / 145000) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600 shrink-0">{formatCurrency(b.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Orders chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-800 mb-5">الطلبات الشهرية</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #f0f0f0', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="orders" fill="#111" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-800 mb-4">آخر الطلبات</p>
          <div className="space-y-3">
            {recentOrders.map(o => (
              <div key={o.id || (o as any)._id} className="flex items-center justify-between py-0.5">
                <div>
                  <p className="text-xs font-medium text-gray-700">{o.id || (o as any)._id}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{o.customer} · {o.brand}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[o.status]}`}>
                    {statusLabels[o.status]}
                  </span>
                  <span className="text-xs font-semibold text-gray-700">{formatCurrency(o.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
