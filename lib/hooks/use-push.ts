'use client'

import { useState, useCallback, useEffect } from 'react'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

export function usePush() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window

  // Sync real subscription state from PushManager on mount
  useEffect(() => {
    if (!isSupported) return

    setPermission(Notification.permission)

    navigator.serviceWorker.ready
      .then(reg => reg.pushManager.getSubscription())
      .then(sub => setIsSubscribed(!!sub))
      .catch(() => setIsSubscribed(false))
  }, [isSupported])

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false
    setLoading(true)

    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') {
        setLoading(false)
        return false
      }

      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set')

      // Unsubscribe any stale subscription first
      const existing = await reg.pushManager.getSubscription()
      if (existing) await existing.unsubscribe()

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: new Uint8Array(urlBase64ToUint8Array(vapidKey)),
      })

      const json = sub.toJSON()
      const keys = json.keys as Record<string, string>

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
        }),
      })

      if (!res.ok) throw new Error('Failed to save subscription')

      setIsSubscribed(true)
      setLoading(false)
      return true
    } catch (err) {
      console.error('[push] subscribe error:', err)
      setIsSubscribed(false)
      setLoading(false)
      return false
    }
  }, [isSupported])

  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!isSupported) return
    setLoading(true)

    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()

      if (sub) {
        const endpoint = sub.endpoint
        await sub.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        })
      }

      setIsSubscribed(false)
    } catch (err) {
      console.error('[push] unsubscribe error:', err)
    } finally {
      setLoading(false)
    }
  }, [isSupported])

  return { permission, isSupported, isSubscribed, loading, subscribe, unsubscribe }
}
