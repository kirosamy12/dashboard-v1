import { useState, useEffect, useRef } from 'react'
import { Plus, Search, CheckCircle, XCircle, X, Upload } from 'lucide-react'
import { adminApi, type Brand } from '../../lib/api'
import { uploadBrandLogo } from '../../lib/upload'
import { brands as mockBrands, statusColors, statusLabels } from '../../lib/mockData'
import { formatCurrency, formatDate } from '../../lib/utils'
import PageHeader from '../../components/ui/PageHeader'

const emptyForm = { name: '', email: '', password: '', description: '', phone: '', website: '' }

export default function AdminBrands() {
  const [items, setItems] = useState<any[]>(mockBrands)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    adminApi.getBrands()
      .then(d => { if (d.brands.length) setItems(d.brands) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'active' ? 'inactive' : 'active'
    try { await adminApi.updateBrand(id, { status: newStatus as Brand['status'] }) } catch {}
    setItems(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, status: newStatus } : b))
  }

  const approve = async (id: string) => {
    try { await adminApi.updateBrand(id, { status: 'active' }) } catch {}
    setItems(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, status: 'active' } : b))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.name || !form.email || !form.password) {
      setFormError('الاسم والبريد وكلمة المرور مطلوبة')
      return
    }
    setSaving(true)
    try {
      // Upload logo first if selected
      let logoUrl = ''
      if (logoFile) {
        try {
          logoUrl = await uploadBrandLogo(logoFile)
        } catch {
          // continue without logo if upload fails
        }
      }

      const brandData = { ...form, status: 'active', ...(logoUrl ? { logo: logoUrl } : {}) }
      const d = await adminApi.createBrand(brandData as any)
      setItems(prev => [{ ...d.brand, logo: logoUrl || d.brand.logo }, ...prev])
    } catch {
      setItems(prev => [{
        _id: String(Date.now()), ...form,
        logo: logoPreview || '',
        status: 'active', products: 0, orders: 0, revenue: 0,
        createdAt: new Date().toISOString()
      }, ...prev])
    }
    setForm(emptyForm)
    setLogoFile(null)
    setLogoPreview('')
    setShowModal(false)
    setSaving(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setForm(emptyForm)
    setLogoFile(null)
    setLogoPreview('')
    setFormError('')
  }

  return (
    <div className="p-7 max-w-[1200px]">
      <PageHeader
        title="البراندات"
        subtitle={loading ? 'جاري التحميل...' : `${items.length} براند`}
        action={
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition">
            <Plus size={15} /> إضافة براند
          </button>
        }
      />

      {/* Add Brand Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">إضافة براند جديد</h3>
              <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">لوجو البراند</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 transition"
                >
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="logo preview" className="w-20 h-20 object-contain rounded-xl" />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setLogoFile(null); setLogoPreview('') }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-300" />
                      <p className="text-xs text-gray-400">اضغط لرفع الصورة</p>
                      <p className="text-[10px] text-gray-300">PNG, JPG, SVG — حتى 5MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>

              {/* Text fields */}
              {[
                { label: 'اسم البراند *', key: 'name', placeholder: 'Nike' },
                { label: 'البريد الإلكتروني *', key: 'email', placeholder: 'nike@shop.co', type: 'email' },
                { label: 'كلمة المرور *', key: 'password', placeholder: '••••••••', type: 'password' },
                { label: 'رقم الهاتف', key: 'phone', placeholder: '+20 100 000 0000' },
                { label: 'الموقع الإلكتروني', key: 'website', placeholder: 'https://nike.com' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">وصف البراند</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="وصف مختصر..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 resize-none"
                />
              </div>

              {formError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-black transition disabled:opacity-50">
                  {saving ? 'جاري الإضافة...' : 'إضافة البراند'}
                </button>
                <button type="button" onClick={closeModal}
                  className="px-4 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative max-w-xs mb-5">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في البراندات..."
          className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['البراند', 'المنتجات', 'الطلبات', 'الإيرادات', 'تاريخ الانضمام', 'الحالة', ''].map(h => (
                <th key={h} className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const id = b._id || b.id
              return (
                <tr key={id} className={`hover:bg-gray-50/50 transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="w-8 h-8 rounded-xl object-contain bg-gray-50" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500">{b.name[0]}</div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{b.name}</p>
                        <p className="text-[11px] text-gray-400">{b.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{b.products ?? '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{b.orders ?? '—'}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{b.revenue ? formatCurrency(b.revenue) : '—'}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{b.createdAt || b.joinDate ? formatDate(b.createdAt || b.joinDate) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      {b.status === 'pending' && (
                        <button onClick={() => approve(id)} title="موافقة"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-50 text-gray-300 hover:text-green-500 transition">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button onClick={() => toggleStatus(id, b.status)} title="تفعيل/تعطيل"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition">
                        {b.status === 'active' ? <XCircle size={14} className="text-red-400" /> : <CheckCircle size={14} className="text-green-400" />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-14 text-gray-300 text-sm">لا توجد براندات</div>}
      </div>
    </div>
  )
}
