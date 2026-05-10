import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (!result.ok) { setError(result.error || 'خطأ'); return }
    const saved = localStorage.getItem('dashboard_user')
    const user = saved ? JSON.parse(saved) : null
    navigate(user?.role === 'superadmin' ? '/admin' : '/brand')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex" dir="rtl">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#111] p-10 text-white">
        <div>
          <div className="text-2xl font-bold tracking-tight">SHOP.CO</div>
          <div className="text-xs text-white/40 mt-1">لوحة التحكم</div>
        </div>
        <div className="space-y-6">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">📊</div>
          <p className="text-2xl font-semibold leading-snug">إدارة متجرك<br />بكل سهولة</p>
          <p className="text-sm text-white/50 leading-relaxed">
            تحكم في منتجاتك، طلباتك، وتقاريرك من مكان واحد.
          </p>
        </div>
        <div className="text-xs text-white/20">© 2026 SHOP.CO</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">تسجيل الدخول</h1>
            <p className="text-sm text-gray-400 mt-1">أدخل بياناتك للوصول للوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder:text-gray-300"
                placeholder="example@shop.co"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder:text-gray-300"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-medium hover:bg-black transition disabled:opacity-40 mt-2"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400 space-y-1.5">
            <p className="font-medium text-gray-500 mb-2">بيانات تجريبية</p>
            <div className="flex justify-between">
              <span>سوبر أدمن</span>
              <span className="font-mono">admin@shop.co / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>براند</span>
              <span className="font-mono">nike@shop.co / brand123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
