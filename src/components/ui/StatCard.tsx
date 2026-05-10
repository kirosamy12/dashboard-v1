import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  label: string
  value: string
  icon?: ReactNode
  sub?: string
  subPositive?: boolean
  className?: string
}

export default function StatCard({ label, value, icon, sub, subPositive = true, className }: Props) {
  return (
    <div className={cn('bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors', className)}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        {icon && (
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
      {sub && (
        <p className={cn('text-xs mt-1.5', subPositive ? 'text-emerald-600' : 'text-red-500')}>
          {sub}
        </p>
      )}
    </div>
  )
}
