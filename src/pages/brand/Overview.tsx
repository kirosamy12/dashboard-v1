import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { ShoppingCart, Package, DollarSign, TrendingUp } from 'lucide-react'
import { brandApi } from '../../lib/api'
import { salesData, products as mockProducts, orders as mockOrders, statusColors, statusLabels } from '../../lib/mockData'
import { formatCurrency } from '../../lib/utils'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'

export default function BrandOverview() {
  const [products, setProducts] = useState(mockProducts)
  const [orders, setOrders] = useState(mockOrders.filter(o => o.brand === 'Nike'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o] = await Promise.all([
          brandApi.getProducts({ limit: '5' }),
          brandApi.getOrders({ limit: '5' }),
        ])
        if (p.products.length) setProducts(p.products as typeof mockProducts)
        if (o.orders.length) setOrders(o.orders as typeof mockOrders)
      } catch { /* use mock */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const topProducts = [...products].sort((a, b) => (b.sold ?? b.sales ?? 0) - (a.sold ?? a.sales ?? 0)).slice(0, 5)
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="p-7 space-y-6 max-w-[1200px]">
      <PageHeader title="الرئيسية" subtitle="مرحباً، إليك ملخص أداء متجرك اليوم" />

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="إجمالي الإيرادات" value={formatCurrency(28400)} icon={<DollarSign size={15} />} sub="↑ 12% مقارنة بالشهر الماضي" />
        <StatCard label="الطلبات الجديدة" value={String(orders.length)} icon={<ShoppingCart size={15} />} />
        <StatCard label="المنتجات النشطة" value={String(products.filter(p => p.status === 'active').length || 45)} icon={<Package size={15} />} />
        <StatCard label="معدل التحويل" value="3.2%" icon={<TrendingUp size={15} />} sub="↑ 0.4% هذا الأسبوع" />
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-800">الإيرادات الشهرية</p>
            <p className="text-xs text-gray-400 mt-0.5">آخر 6 أشهر {loading && '...'}</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #f0f0f0', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), 'الإيرادات']} />
              <Line type="monotone" dataKey="revenue" stroke="#111" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-800 mb-5">أكثر المنتجات مبيعاً</p>
          <div className="space-y-3.5">
            {topProducts.map((p, i) => (
              <div key={p.id || p._id} className="flex items-center gap-3">
                <span className="text-xs text-gray-300 w-4 font-mono">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                  <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-800 rounded-full" style={{ width: `${((p.sold ?? p.sales ?? 0) / 312) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600 shrink-0">{p.sold ?? p.sales ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-800 mb-5">الطلبات الشهرية</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={salesData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #f0f0f0', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="orders" fill="#111" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-medium text-gray-800 mb-4">آخر الطلبات</p>
          <div className="space-y-3">
            {recentOrders.map(o => (
              <div key={o.id || (o as { _id?: string })._id} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-medium text-gray-700">{o.id || (o as { _id?: string })._id}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{o.customer}</p>
                </div>
                <div className="flex items-center gap-3">
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
