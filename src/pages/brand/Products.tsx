import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Edit2, Trash2, X, Upload } from 'lucide-react'
import { brandApi, type Product } from '../../lib/api'
import { uploadProductImages } from '../../lib/upload'
import { products as mockProducts, statusColors, statusLabels } from '../../lib/mockData'
import { formatCurrency } from '../../lib/utils'
import PageHeader from '../../components/ui/PageHeader'

const emptyForm = {
  name: '', description: '', price: '', originalPrice: '',
  stock: '', category: '', sizes: '', colors: '', tags: '',
}

const defaultCategories = ['T-Shirts', 'Jeans', 'Shirts', 'Shorts', 'Dresses', 'Casual', 'Formal', 'Party']
export default function BrandProducts() {
  const [items, setItems] = useState<any[]>(mockProducts)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Try brand-specific endpoint first, fallback to public products
    const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'

    brandApi.getProducts()
      .then(d => { if (d.products.length) setItems(d.products) })
      .catch(() => {
        // Fallback: fetch all products from public endpoint
        fetch(`${API}/products?limit=50`)
          .then(r => r.json())
          .then(d => { if (d.products?.length) setItems(d.products) })
          .catch(() => {})
      })
      .finally(() => setLoading(false))

    // Fetch categories
    fetch(`${API}/public/categories`)
      .then(r => r.json())
      .then(d => { if (d.categories?.length) setCategories(d.categories.map((c: any) => c.name)) })
      .catch(() => {})
  }, [])

  const filtered = items.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const newFiles = [...imageFiles, ...files].slice(0, 5)
    setImageFiles(newFiles)
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (idx: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx)
    setImageFiles(newFiles)
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)))
  }

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'active' ? 'inactive' : 'active'
    try { await brandApi.updateProduct(id, { status: newStatus as Product['status'] }) } catch {}
    setItems(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, status: newStatus } : p))
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    try { await brandApi.deleteProduct(id) } catch {}
    setItems(prev => prev.filter(p => p._id !== id && p.id !== id))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.name || !form.price || !form.stock) {
      setFormError('الاسم والسعر والمخزون مطلوبة')
      return
    }
    setSaving(true)
    try {
      // Upload images first
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        try { imageUrls = await uploadProductImages(imageFiles) } catch {}
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        category: form.category,
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: imageUrls,
        status: 'active',
      }

      try {
        const d = await brandApi.createProduct(productData)
        setItems(prev => [d.product, ...prev])
      } catch {
        // Fallback: add locally
        setItems(prev => [{
          _id: String(Date.now()),
          ...productData,
          images: imagePreviews,
          sold: 0, rating: 0,
          category: { name: form.category },
        }, ...prev])
      }

      setForm(emptyForm)
      setImageFiles([])
      setImagePreviews([])
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setForm(emptyForm)
    setImageFiles([])
    setImagePreviews([])
    setFormError('')
  }

  const filters = [
    { key: 'all', label: 'الكل' },
    { key: 'active', label: 'نشط' },
    { key: 'low_stock', label: 'مخزون منخفض' },
    { key: 'out_of_stock', label: 'نفد' },
  ]

  return (
    <div className="p-7 max-w-[1200px]">
      <PageHeader
        title="المنتجات"
        subtitle={loading ? 'جاري التحميل...' : `${items.length} منتج`}
        action={
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition">
            <Plus size={15} /> إضافة منتج
          </button>
        }
      />

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-gray-900">إضافة منتج جديد</h3>
              <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">صور المنتج (حتى 5 صور)</label>
                <div className="flex gap-3 flex-wrap">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20">
                      <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gray-400 transition"
                    >
                      <Upload size={16} className="text-gray-300" />
                      <span className="text-[10px] text-gray-300">إضافة</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">اسم المنتج *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="T-Shirt with Tape Details"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">الوصف</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="وصف المنتج..." rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">السعر ($) *</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="120"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">السعر الأصلي ($)</label>
                  <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))}
                    placeholder="150 (اختياري)"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">المخزون *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                    placeholder="50"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">الفئة</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50">
                    <option value="">اختر فئة</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">المقاسات</label>
                  <input value={form.sizes} onChange={e => setForm(p => ({ ...p, sizes: e.target.value }))}
                    placeholder="S, M, L, XL"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                  <p className="text-[10px] text-gray-400 mt-1">مفصولة بفاصلة</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">الألوان</label>
                  <input value={form.colors} onChange={e => setForm(p => ({ ...p, colors: e.target.value }))}
                    placeholder="Black, White, Red"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50" />
                  <p className="text-[10px] text-gray-400 mt-1">مفصولة بفاصلة</p>
                </div>
              </div>

              {formError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-black transition disabled:opacity-50">
                  {saving ? 'جاري الإضافة...' : 'إضافة المنتج'}
                </button>
                <button type="button" onClick={closeModal}
                  className="px-5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
            className="border border-gray-200 rounded-xl pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-52 bg-white" />
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['المنتج', 'الفئة', 'السعر', 'المخزون', 'المبيعات', 'الحالة', ''].map(h => (
                <th key={h} className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p._id || p.id} className={`hover:bg-gray-50/50 transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {(p.images?.[0] || p.image) ? (
                      <img src={p.images?.[0] || p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">📦</div>
                    )}
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{p.category?.name || p.category}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{formatCurrency(p.price)}</td>
                <td className="px-5 py-3.5 text-sm">
                  <span className={p.stock === 0 ? 'text-red-500 font-medium' : p.stock < 10 ? 'text-amber-500 font-medium' : 'text-gray-600'}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{p.sold ?? p.sales ?? 0}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[p.status] || p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => toggleStatus(p._id || p.id, p.status)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition text-[10px] font-medium">
                      {p.status === 'active' ? 'إيقاف' : 'تفعيل'}
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => deleteProduct(p._id || p.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-14 text-gray-300 text-sm">لا توجد منتجات</div>}
      </div>
    </div>
  )
}
