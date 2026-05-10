import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { adminApi, type Coupon } from '../../lib/api'
import { coupons as mockCoupons, statusColors, statusLabels } from '../../lib/mockData'
import { formatDate } from '../../lib/utils'
import PageHeader from '../../components/ui/PageHeader'

const emptyForm = { code: '', type: 'percentage', value: '', maxUses: '', expiry: '' }

export default function AdminCoupons() {
  const [items, setItems] = useState<any[]>(mockCoupons)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    adminApi.getCoupons()
      .then(d => { if (d.coupons.length) setItems(d.coupons) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (id: string, current: boolean | string) => {
    const isActive = typeof current === 'boolean' ? !current : current !== 'active'
    try { await adminApi.updateCoupon(id, { isActive }) } catch {}
    setItems(prev => prev.map(c => (c._id === id || c.id === id)
      ? { ...c, isActive, status: isActive ? 'active' : 'inactive' } : c
    ))
  }

  const deleteItem = async (id: string) => {
    try { await adminApi.deleteCoupon(id) } catch {}
    setItems(prev => prev.filter(c => c._id !== id && c.id !== id))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const body: Partial<Coupon> = {
      code: form.code.toUpperCase() as any,
      type: form.type as 'percentage' | 'fixed',
      value: Number(form.value),
      maxUses: Number(form.maxUses) || 0,
      expiresAt: form.expiry,
      isActive: true,
    }
    try {
      const d = await adminApi.createCoupon(body)
      setItems(prev => [d.coupon, ...prev])
    } catch {
      setItems(prev => [{ ...body, _id: String(Date.now()), usedCount: 0, status: 'active' }, ...prev])
    }
    setForm(emptyForm)
    setShowModal(false)
    setSaving(false)
  }

  return (
    <div className="p-7 max-w-[1200px]">
      <PageHeader
        title="الكوبونات والخصومات"
        subtitle={loading ? 'جاري التحميل...' : `${items.length} كوبون`}
        action={
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition">
            <Plus size={15} /> كوبون جديد
          </button>
        }
      />

      {/* Add Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">إضافة كوبون جديد</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">كود الكوبون *</label>
                <input required value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="SAVE20" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">النوع</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50">
                    <option value="percentage">نسبة مئوية %</option>
                    <option value="fixed">مبلغ ثابت $</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">القيمة *</label>
                  <input required type="number" min="1" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                    placeholder={form.type === 'percentage' ? '20' : '50'}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">الحد الأقصى للاستخدام</label>
                  <input type="number" min="0" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                    placeholder="0 = غير محدود"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">تاريخ الانتهاء *</label>
                  <input required type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-black transition disabled:opacity-50">
                  {saving ? 'جاري الإضافة...' : 'إضافة الكوبون'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['الكود', 'النوع', 'القيمة', 'الاستخدام', 'الانتهاء', 'الحالة', ''].map(h => (
                <th key={h} className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((c, i) => {
              const id = c._id || c.id
              const isActive = c.isActive !== undefined ? c.isActive : c.status === 'active'
              const status = isActive ? 'active' : 'inactive'
              return (
                <tr key={id} className={`hover:bg-gray-50/50 transition-colors ${i !== items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <td className="px-5 py-3.5 font-mono font-bold text-gray-800 text-sm">{c.code}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{c.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{c.usedCount ?? c.uses ?? 0} / {c.maxUses || '∞'}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{c.expiresAt || c.expiry ? formatDate(c.expiresAt || c.expiry) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusColors[status]}`}>
                      {statusLabels[status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleStatus(id, isActive)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                        {isActive ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => deleteItem(id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {items.length === 0 && <div className="text-center py-14 text-gray-300 text-sm">لا توجد كوبونات</div>}
      </div>
    </div>
  )
}
