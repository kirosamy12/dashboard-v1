import { useState, useEffect } from 'react'
import { Search, UserX, UserCheck } from 'lucide-react'
import { adminApi } from '../../lib/api'
import { users as mockUsers, statusColors, statusLabels } from '../../lib/mockData'
import { formatCurrency, formatDate } from '../../lib/utils'
import PageHeader from '../../components/ui/PageHeader'

export default function AdminUsers() {
  const [items, setItems] = useState<any[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getUsers()
      .then(d => { if (d.users.length) setItems(d.users) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = async (id: string, current: boolean | string) => {
    const isActive = typeof current === 'boolean' ? !current : current !== 'active'
    try { await adminApi.updateUserStatus(id, isActive) } catch {}
    setItems(prev => prev.map(u => (u._id === id || u.id === id)
      ? { ...u, isActive, status: isActive ? 'active' : 'inactive' }
      : u
    ))
  }

  return (
    <div className="p-7 max-w-[1200px]">
      <PageHeader title="المستخدمون" subtitle={loading ? 'جاري التحميل...' : `${items.length} مستخدم`} />

      <div className="relative max-w-xs mb-5">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد..."
          className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['المستخدم', 'الطلبات', 'إجمالي الإنفاق', 'تاريخ التسجيل', 'الحالة', ''].map(h => (
                <th key={h} className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const id = u._id || u.id
              const isActive = u.isActive !== undefined ? u.isActive : u.status === 'active'
              const status = isActive ? 'active' : 'inactive'
              return (
                <tr key={id} className={`hover:bg-gray-50/50 transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-500">{u.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{u.name}</p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{u.orders ?? '—'}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{u.spent ? formatCurrency(u.spent) : '—'}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{u.createdAt || u.joinDate ? formatDate(u.createdAt || u.joinDate) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusColors[status]}`}>
                      {statusLabels[status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleStatus(id, isActive)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition">
                      {isActive ? <UserX size={14} className="text-red-400" /> : <UserCheck size={14} className="text-green-400" />}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
