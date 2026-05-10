import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { brandApi } from '../../lib/api'
import { orders as mockOrders, statusColors, statusLabels } from '../../lib/mockData'
import { formatCurrency, formatDate } from '../../lib/utils'
import PageHeader from '../../components/ui/PageHeader'

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function BrandOrders() {
  const [items, setItems] = useState<any[]>(mockOrders.filter(o => o.brand === 'Nike'))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    brandApi.getOrders()
      .then(d => { if (d.orders.length) setItems(d.orders) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(o => {
    const id = o._id || o.id || ''
    const customer = o.user?.name || o.customer || ''
    const matchSearch = id.includes(search) || customer.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  const updateStatus = async (id: string, status: string) => {
    try { await brandApi.updateOrderStatus(id, status) } catch {}
    setItems(prev => prev.map(o => (o._id === id || o.id === id) ? { ...o, status } : o))
  }

  const filters = [{ key: 'all', label: 'الكل' }, ...statusOptions.map(s => ({ key: s, label: statusLabels[s] }))]

  return (
    <div className="p-7 max-w-[1200px]">
      <PageHeader title="الطلبات" subtitle={loading ? 'جاري التحميل...' : `${items.length} طلب`} />

      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
            className="border border-gray-200 rounded-xl pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-60 bg-white" />
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === f.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['رقم الطلب', 'العميل', 'المبلغ', 'التاريخ', 'الحالة'].map(h => (
                <th key={h} className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => {
              const id = o._id || o.id
              const customer = o.user?.name || o.customer || '—'
              const amount = o.total || o.amount || 0
              const date = o.createdAt || o.date
              return (
                <tr key={id} className={`hover:bg-gray-50/50 transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{id}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{customer}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{formatCurrency(amount)}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{date ? formatDate(date) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <select value={o.status} onChange={e => updateStatus(id, e.target.value)}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-medium cursor-pointer border-0 outline-none ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-14 text-gray-300 text-sm">لا توجد طلبات</div>}
      </div>
    </div>
  )
}
