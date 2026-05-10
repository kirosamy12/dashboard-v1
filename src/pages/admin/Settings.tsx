import { useState } from 'react'

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    platformName: 'SHOP.CO',
    currency: 'USD',
    commission: '10',
    supportEmail: 'support@shop.co',
    freeShippingMin: '200',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-gray-900">إعدادات المنصة</h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">الإعدادات العامة</h3>
          {[
            { label: 'اسم المنصة', key: 'platformName' },
            { label: 'بريد الدعم', key: 'supportEmail', type: 'email' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">العملة</label>
              <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
                <option value="USD">USD - دولار أمريكي</option>
                <option value="EGP">EGP - جنيه مصري</option>
                <option value="SAR">SAR - ريال سعودي</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">نسبة العمولة %</label>
              <input type="number" value={form.commission} onChange={e => setForm(p => ({ ...p, commission: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
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
