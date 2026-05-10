import { useState, useEffect } from 'react'
import { Plus, Trash2, Tag } from 'lucide-react'
import { adminApi } from '../../lib/api'
import { categories as mockCategories } from '../../lib/mockData'
import PageHeader from '../../components/ui/PageHeader'

export default function AdminCategories() {
  const [items, setItems] = useState<any[]>(mockCategories)
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    adminApi.getCategories()
      .then(d => { if (d.categories.length) setItems(d.categories) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    try {
      const d = await adminApi.createCategory(newName.trim())
      setItems(prev => [...prev, d.category])
    } catch {
      setItems(prev => [...prev, {
        _id: String(Date.now()),
        name: newName.trim(),
        slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
        products: 0,
        status: 'active',
      }])
    } finally {
      setAdding(false)
    }
    setSuccess(`تمت إضافة "${newName.trim()}" بنجاح`)
    setNewName('')
    setTimeout(() => setSuccess(''), 3000)
  }

  const deleteItem = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف فئة "${name}"؟`)) return
    try { await adminApi.deleteCategory(id) } catch {}
    setItems(prev => prev.filter(c => c._id !== id && c.id !== id))
  }

  return (
    <div className="p-7 max-w-[800px]">
      <PageHeader
        title="الفئات والتصنيفات"
        subtitle={loading ? 'جاري التحميل...' : `${items.length} فئة`}
      />

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <p className="text-sm font-medium text-gray-700 mb-3">إضافة فئة جديدة</p>
        <form onSubmit={addCategory} className="flex gap-3">
          <div className="relative flex-1">
            <Tag size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="مثال: T-Shirts, Jeans, Dresses..."
              className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newName.trim()}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Plus size={15} />
            {adding ? 'جاري الإضافة...' : 'إضافة فئة'}
          </button>
        </form>
        {success && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg mt-3 flex items-center gap-2">
            <span>✓</span> {success}
          </p>
        )}
      </div>

      {/* Categories list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">الفئات الموجودة</span>
          <span className="text-xs text-gray-400">{items.length} فئة</span>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-14 text-gray-300 text-sm">لا توجد فئات — أضف فئة جديدة أعلاه</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map(c => {
              const id = c._id || c.id
              return (
                <div key={id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Tag size={12} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.name}</p>
                      {c.slug && <p className="text-[11px] text-gray-400">{c.slug}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{c.products ?? 0} منتج</span>
                    <button
                      onClick={() => deleteItem(id, c.name)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
