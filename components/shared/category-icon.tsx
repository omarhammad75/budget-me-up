import { cn } from '@/lib/utils/cn'
import type { Category } from '@/lib/types'

interface CategoryIconProps {
  category?: Category | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'w-6 h-6 text-xs rounded-lg',
  sm: 'w-7 h-7 text-sm rounded-xl',
  md: 'w-8 h-8 text-base rounded-xl',
  lg: 'w-11 h-11 text-lg rounded-2xl',
}

export function CategoryIcon({ category, size = 'md', className }: CategoryIconProps) {
  if (!category) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-muted text-muted-foreground',
        sizeMap[size],
        className
      )}>
        <span>?</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center flex-shrink-0',
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: `${category.color}18`, border: `1px solid ${category.color}22` }}
    >
      <span role="img" aria-label={category.name}>{category.icon}</span>
    </div>
  )
}
