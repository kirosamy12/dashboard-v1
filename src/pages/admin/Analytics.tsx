import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { salesData, brands } from '../../lib/mockData'
import { formatCurrency } from '../../lib/utils'

const adminData = salesData.map(d => ({ ...d, revenue: d.revenue * 4.2, orders: d.orders * 3.8, users: Math.floor(d.orders * 1.2) }))

export default function AdminAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">التقارير والتحليلات</h2>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإيرادات', value: formatCurrency(375100) },
          { label: 'إجمالي الطلبات', value: '3,218' },
          { label: 'المستخدمين النشطين', value: '1,247' },
          { label: 'متوسط قيمة الطلب', value: formatCurrency(116) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">نمو الإيرادات والطلبات</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={adminData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number, name: string) => [name === 'revenue' ? formatCurrency(v) : v, name === 'revenue' ? 'الإيرادات' : 'الطلبات']} />
            <Area type="monotone" dataKey="revenue" stroke="#000" fill="url(#colorRev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">أداء البراندات</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={brands.filter(b => b.status === 'active')}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Bar dataKey="revenue" fill="#000" radius={[4, 4, 0, 0]} name="الإيرادات" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
