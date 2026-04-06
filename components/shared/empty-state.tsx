import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div
        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-5 border"
        style={{
          background:   'rgba(99,102,241,0.08)',
          borderColor:  'rgba(99,102,241,0.15)',
          boxShadow:    '0 0 24px rgba(99,102,241,0.08)',
        }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">{description}</p>
      {action}
    </div>
  )
}
