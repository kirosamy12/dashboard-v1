import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { salesData, products } from '../../lib/mockData'
import { formatCurrency } from '../../lib/utils'

const COLORS = ['#000', '#333', '#666', '#999', '#ccc']

export default function BrandAnalytics() {
  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5)
  const pieData = topProducts.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), value: p.sales }))

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">التقارير والتحليلات</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(116500)}</p>
          <p className="text-sm text-gray-500 mt-1">إجمالي الإيرادات</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">845</p>
          <p className="text-sm text-gray-500 mt-1">إجمالي الطلبات</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(138)}</p>
          <p className="text-sm text-gray-500 mt-1">متوسط قيمة الطلب</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">نمو الإيرادات</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Area type="monotone" dataKey="revenue" stroke="#000" fill="url(#colorRevenue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">المبيعات حسب المنتج</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
              <Tooltip />
              <Bar dataKey="sales" fill="#000" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">توزيع المبيعات</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }) => name}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
