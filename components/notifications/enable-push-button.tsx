'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, BellRing, Loader2 } from 'lucide-react'
import { usePush } from '@/lib/hooks/use-push'
import { cn } from '@/lib/utils/cn'

interface EnablePushButtonProps {
  /** Render as a compact icon-only button (e.g. in a header) */
  compact?: boolean
  className?: string
}

export function EnablePushButton({ compact = false, className }: EnablePushButtonProps) {
  const { permission, isSupported, isSubscribed, loading, subscribe, unsubscribe } = usePush()
  const [mounted, setMounted] = useState(false)

  // Avoid SSR mismatch — Notification API is browser-only
  useEffect(() => { setMounted(true) }, [])
  if (!mounted || !isSupported) return null

  const handleClick = async () => {
    if (isSubscribed) {
      await unsubscribe()
    } else {
      await subscribe()
    }
  }

  if (permission === 'denied') {
    return (
      <div className={cn(
        'flex items-center gap-2 text-xs text-muted-foreground px-3 py-2 rounded-xl bg-muted',
        className
      )}>
        <BellOff className="w-3.5 h-3.5 flex-shrink-0" />
        {!compact && <span>Notifications blocked — enable in browser settings</span>}
      </div>
    )
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        title={isSubscribed ? 'Disable notifications' : 'Enable notifications'}
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
          isSubscribed
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : 'bg-muted text-muted-foreground hover:text-foreground',
          className
        )}
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : isSubscribed
          ? <BellRing className="w-4 h-4" />
          : <Bell className="w-4 h-4" />
        }
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-3 rounded-2xl border transition-all duration-200 text-left',
        isSubscribed
          ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
          : 'border-border bg-muted hover:bg-accent',
        className
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
        isSubscribed ? 'bg-primary/15 text-primary' : 'bg-background text-muted-foreground'
      )}>
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : isSubscribed
          ? <BellRing className="w-4 h-4" />
          : <Bell className="w-4 h-4" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {isSubscribed ? 'Notifications on' : 'Enable notifications'}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isSubscribed
            ? 'You\'ll get budget alerts and spending warnings'
            : 'Get alerts when you hit budget limits'}
        </p>
      </div>
      {/* Visual toggle dot */}
      <div className={cn(
        'w-10 h-6 rounded-full flex items-center transition-all duration-200 flex-shrink-0',
        isSubscribed ? 'bg-primary justify-end' : 'bg-muted-foreground/30 justify-start'
      )}>
        <div className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5" />
      </div>
    </button>
  )
}
