import { cn } from '@/lib/utils/cn'
import type { Category } from '@/lib/types'

interface CategoryIconProps {
  category?: Category | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-8 h-8 text-base rounded-xl',
  md: 'w-10 h-10 text-xl rounded-2xl',
  lg: 'w-14 h-14 text-2xl rounded-2xl',
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
      style={{ backgroundColor: `${category.color}22`, border: `1px solid ${category.color}33` }}
    >
      <span role="img" aria-label={category.name}>{category.icon}</span>
    </div>
  )
}
