import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function BrandSettings() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    brandName: user?.brandName || '',
    email: user?.email || '',
    description: 'نحن براند عالمي متخصص في الملابس الرياضية والكاجوال.',
    phone: '+20 100 000 0000',
    website: 'https://nike.com',
    shippingFee: '15',
    freeShippingMin: '200',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-gray-900">إعدادات البراند</h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">معلومات البراند</h3>
          {[
            { label: 'اسم البراند', key: 'brandName' },
            { label: 'البريد الإلكتروني', key: 'email', type: 'email' },
            { label: 'رقم الهاتف', key: 'phone' },
            { label: 'الموقع الإلكتروني', key: 'website' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">وصف البراند</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">إعدادات الشحن</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">رسوم الشحن ($)</label>
              <input
                type="number"
                value={form.shippingFee}
                onChange={e => setForm(prev => ({ ...prev, shippingFee: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">شحن مجاني من ($)</label>
              <input
                type="number"
                value={form.freeShippingMin}
                onChange={e => setForm(prev => ({ ...prev, freeShippingMin: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            حفظ التغييرات
          </button>
          {saved && <span className="text-green-600 text-sm">✓ تم الحفظ بنجاح</span>}
        </div>
      </form>
    </div>
  )
}
