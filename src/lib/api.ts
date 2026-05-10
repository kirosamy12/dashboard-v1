const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'

// ─── Token helpers ───────────────────────────────────────────
export const getToken = () => localStorage.getItem('dashboard_token')
export const setToken = (t: string) => localStorage.setItem('dashboard_token', t)
export const removeToken = () => localStorage.removeItem('dashboard_token')

// ─── Core fetch ──────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

const get = <T>(path: string) => request<T>(path)
const post = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) })
const put = <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' })

// ─── Admin API ───────────────────────────────────────────────
export const adminApi = {
  login: (email: string, password: string) =>
    post<{ token: string; user: { email: string; role: string; name: string } }>('/admin/auth/login', { email, password }),

  overview: () => get<AdminOverview>('/admin/analytics/overview'),
  revenue: () => get<{ monthly: MonthlyRevenue[] }>('/admin/analytics/revenue'),

  getBrands: () => get<{ brands: Brand[] }>('/admin/brands'),
  createBrand: (body: Partial<Brand>) => post<{ brand: Brand }>('/admin/brands', body),
  updateBrand: (id: string, body: Partial<Brand>) => put<{ brand: Brand }>(`/admin/brands/${id}`, body),
  deleteBrand: (id: string) => del(`/admin/brands/${id}`),

  getUsers: (page = 1, search = '') =>
    get<{ users: User[]; total: number }>(`/admin/users?page=${page}&search=${search}`),
  updateUserStatus: (id: string, isActive: boolean) =>
    put(`/admin/users/${id}/status`, { isActive }),

  getOrders: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return get<{ orders: Order[]; total: number }>(`/admin/orders${qs}`)
  },

  getCoupons: () => get<{ coupons: Coupon[] }>('/admin/coupons'),
  createCoupon: (body: Partial<Coupon>) => post<{ coupon: Coupon }>('/admin/coupons', body),
  updateCoupon: (id: string, body: Partial<Coupon>) => put<{ coupon: Coupon }>(`/admin/coupons/${id}`, body),
  deleteCoupon: (id: string) => del(`/admin/coupons/${id}`),

  getCategories: () => get<{ categories: Category[] }>('/admin/categories'),
  createCategory: (name: string) => post<{ category: Category }>('/admin/categories', { name }),
  deleteCategory: (id: string) => del(`/admin/categories/${id}`),
}

// ─── Brand API ───────────────────────────────────────────────
export const brandApi = {
  login: (email: string, password: string) =>
    post<{ token: string; brand: Brand }>('/brand/auth/login', { email, password }),

  me: () => get<{ brand: Brand }>('/brand/auth/me'),

  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return get<{ products: Product[]; total: number }>(`/brand/products${qs}`)
  },

  updateProduct: (id: string, body: Partial<Product>) =>
    put<{ product: Product }>(`/products/${id}`, body),

  deleteProduct: (id: string) => del(`/products/${id}`),

  createProduct: (body: Record<string, any>) =>
    post<{ product: Product }>('/products', body),

  getOrders: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return get<{ orders: Order[]; total: number }>(`/brand/orders${qs}`)
  },
  updateOrderStatus: (id: string, status: string) =>
    put(`/brand/orders/${id}/status`, { status }),
}

// ─── Types ───────────────────────────────────────────────────
export interface Brand {
  _id: string
  name: string
  email: string
  logo: string
  description: string
  status: 'pending' | 'active' | 'inactive'
  shippingFee: number
  freeShippingMin: number
  createdAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  isActive: boolean
  createdAt: string
}

export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  sold: number
  status: string
  category: { name: string }
  images: string[]
}

export interface Order {
  _id: string
  user?: { name: string; email: string }
  items: { name: string; quantity: number; price: number; brand: string }[]
  total: number
  status: string
  createdAt: string
}

export interface Coupon {
  _id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  usedCount: number
  maxUses: number
  isActive: boolean
  expiresAt: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  isActive: boolean
}

export interface AdminOverview {
  totalUsers: number
  totalBrands: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Order[]
}

export interface MonthlyRevenue {
  _id: { year: number; month: number }
  revenue: number
  orders: number
}
