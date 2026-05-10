export const salesData = [
  { month: 'يناير', revenue: 12400, orders: 89 },
  { month: 'فبراير', revenue: 18200, orders: 134 },
  { month: 'مارس', revenue: 15800, orders: 112 },
  { month: 'أبريل', revenue: 22100, orders: 167 },
  { month: 'مايو', revenue: 19600, orders: 145 },
  { month: 'يونيو', revenue: 28400, orders: 198 },
]

export const products = [
  { id: '1', name: 'T-Shirt with Tape Details', category: 'T-Shirts', price: 120, stock: 45, status: 'active', sales: 234 },
  { id: '2', name: 'Skinny Fit Jeans', category: 'Jeans', price: 240, stock: 12, status: 'active', sales: 189 },
  { id: '3', name: 'Checkered Shirt', category: 'Shirts', price: 180, stock: 0, status: 'out_of_stock', sales: 156 },
  { id: '4', name: 'Sleeve Striped T-Shirt', category: 'T-Shirts', price: 130, stock: 67, status: 'active', sales: 312 },
  { id: '5', name: 'Vertical Striped Shirt', category: 'Shirts', price: 212, stock: 8, status: 'low_stock', sales: 98 },
  { id: '6', name: 'Courage Graphic T-Shirt', category: 'T-Shirts', price: 145, stock: 34, status: 'active', sales: 267 },
]

export const orders = [
  { id: '#ORD-001', customer: 'Ahmed Mohamed', product: 'T-Shirt with Tape Details', amount: 120, status: 'delivered', date: '2026-04-28', brand: 'Nike' },
  { id: '#ORD-002', customer: 'Sara Ali', product: 'Skinny Fit Jeans', amount: 240, status: 'shipped', date: '2026-04-27', brand: 'Zara' },
  { id: '#ORD-003', customer: 'Mohamed Hassan', product: 'Checkered Shirt', amount: 180, status: 'processing', date: '2026-04-26', brand: 'Nike' },
  { id: '#ORD-004', customer: 'Fatma Ibrahim', product: 'Sleeve Striped T-Shirt', amount: 130, status: 'pending', date: '2026-04-25', brand: 'Zara' },
  { id: '#ORD-005', customer: 'Omar Khaled', product: 'Vertical Striped Shirt', amount: 212, status: 'delivered', date: '2026-04-24', brand: 'Nike' },
  { id: '#ORD-006', customer: 'Nour Ahmed', product: 'Courage Graphic T-Shirt', amount: 145, status: 'cancelled', date: '2026-04-23', brand: 'Zara' },
]

export const brands = [
  { id: '1', name: 'Nike', email: 'nike@shop.co', products: 45, orders: 234, revenue: 28400, status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'Zara', email: 'zara@shop.co', products: 89, orders: 456, revenue: 52100, status: 'active', joinDate: '2024-02-20' },
  { id: '3', name: 'Gucci', email: 'gucci@shop.co', products: 23, orders: 89, revenue: 145000, status: 'active', joinDate: '2024-03-10' },
  { id: '4', name: 'Prada', email: 'prada@shop.co', products: 18, orders: 45, revenue: 98000, status: 'pending', joinDate: '2026-04-01' },
]

export const users = [
  { id: '1', name: 'Ahmed Mohamed', email: 'ahmed@gmail.com', orders: 12, spent: 1450, status: 'active', joinDate: '2024-06-15' },
  { id: '2', name: 'Sara Ali', email: 'sara@gmail.com', orders: 8, spent: 890, status: 'active', joinDate: '2024-07-20' },
  { id: '3', name: 'Mohamed Hassan', email: 'mhasan@gmail.com', orders: 3, spent: 340, status: 'active', joinDate: '2025-01-10' },
  { id: '4', name: 'Fatma Ibrahim', email: 'fatma@gmail.com', orders: 21, spent: 2780, status: 'active', joinDate: '2024-05-05' },
  { id: '5', name: 'Omar Khaled', email: 'omar@gmail.com', orders: 0, spent: 0, status: 'inactive', joinDate: '2026-03-01' },
]

export const coupons = [
  { id: '1', code: 'SAVE20', type: 'percentage', value: 20, uses: 145, maxUses: 500, status: 'active', expiry: '2026-12-31' },
  { id: '2', code: 'FLAT50', type: 'fixed', value: 50, uses: 89, maxUses: 200, status: 'active', expiry: '2026-06-30' },
  { id: '3', code: 'SUMMER30', type: 'percentage', value: 30, uses: 200, maxUses: 200, status: 'expired', expiry: '2025-09-01' },
]

export const categories = [
  { id: '1', name: 'T-Shirts', products: 45, status: 'active' },
  { id: '2', name: 'Jeans', products: 23, status: 'active' },
  { id: '3', name: 'Shirts', products: 34, status: 'active' },
  { id: '4', name: 'Shorts', products: 12, status: 'active' },
  { id: '5', name: 'Dresses', products: 28, status: 'active' },
]

export const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  out_of_stock: 'bg-red-100 text-red-700',
  low_stock: 'bg-orange-100 text-orange-700',
  expired: 'bg-gray-100 text-gray-600',
}

export const statusLabels: Record<string, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  pending: 'قيد الانتظار',
  delivered: 'تم التسليم',
  shipped: 'تم الشحن',
  processing: 'قيد المعالجة',
  cancelled: 'ملغي',
  out_of_stock: 'نفد المخزون',
  low_stock: 'مخزون منخفض',
  expired: 'منتهي',
}
