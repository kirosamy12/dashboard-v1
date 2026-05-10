import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { adminApi, brandApi, getToken, setToken, removeToken, type Brand } from '../lib/api'

export type UserRole = 'brand' | 'superadmin'

interface AuthUser {
  id?: string
  name: string
  email: string
  role: UserRole
  brandName?: string
  brand?: Brand
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('dashboard_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    try {
      // Try super admin first
      if (email === import.meta.env.VITE_ADMIN_EMAIL || email.includes('admin')) {
        try {
          const data = await adminApi.login(email, password)
          setToken(data.token)
          const authUser: AuthUser = { name: data.user.name, email: data.user.email, role: 'superadmin' }
          setUser(authUser)
          localStorage.setItem('dashboard_user', JSON.stringify(authUser))
          return { ok: true }
        } catch { /* fall through to brand login */ }
      }

      // Try brand login
      const data = await brandApi.login(email, password)
      setToken(data.token)
      const authUser: AuthUser = {
        id: data.brand._id,
        name: data.brand.name,
        email: data.brand.email,
        role: 'brand',
        brandName: data.brand.name,
        brand: data.brand,
      }
      setUser(authUser)
      localStorage.setItem('dashboard_user', JSON.stringify(authUser))
      return { ok: true }
    } catch (err: unknown) {
      // Fallback to mock for demo (when backend is offline)
      const MOCK: Record<string, AuthUser & { password: string }> = {
        'admin@shop.co': { name: 'Super Admin', email: 'admin@shop.co', role: 'superadmin', password: 'admin123' },
        'nike@shop.co': { name: 'Nike Brand', email: 'nike@shop.co', role: 'brand', brandName: 'Nike', password: 'brand123' },
        'zara@shop.co': { name: 'Zara Brand', email: 'zara@shop.co', role: 'brand', brandName: 'Zara', password: 'brand123' },
      }
      const mock = MOCK[email]
      if (mock && mock.password === password) {
        const { password: _, ...authUser } = mock
        setUser(authUser)
        localStorage.setItem('dashboard_user', JSON.stringify(authUser))
        // Set mock token so API calls include Authorization header
        setToken('mock-token-' + authUser.role)
        return { ok: true }
      }
      return { ok: false, error: err instanceof Error ? err.message : 'Invalid credentials' }
    }
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem('dashboard_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
