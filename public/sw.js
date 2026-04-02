const CACHE_NAME = 'budgetmeup-v1'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.webmanifest',
]

// ── Install ──────────────────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
  )
})

// ── Activate ─────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// ── Fetch (network-first, cache fallback for pages) ──────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, API routes, and cross-origin
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.origin !== self.location.origin
  ) return

  // For navigation requests: network-first, fall back to cached /dashboard
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/dashboard') ?? caches.match('/')
      )
    )
    return
  }

  // Static assets: cache-first
  if (url.pathname.match(/\.(js|css|png|jpg|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }
})

// ── Push notifications ────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'BudgetMeUp', body: event.data.text() }
  }

  const options = {
    body: data.body,
    icon: data.icon ?? '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url ?? '/dashboard' },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: 'budgetmeup-notification',
    renotify: true,
  }

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'BudgetMeUp', options)
  )
})

// ── Subscription change (browser rotated keys) ───────────────────
// Re-subscribes automatically and syncs the new endpoint to the server
self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then(sub => {
        const json = sub.toJSON()
        const keys = json.keys ?? {}
        return fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: json.endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
          }),
        })
      })
      .catch(() => {
        // Silently fail — user will be prompted to re-enable next visit
      })
  )
})

// ── Notification click ────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const url = event.notification.data?.url ?? '/dashboard'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(c => c.url.includes(self.location.origin))
      if (existing) {
        existing.focus()
        existing.navigate(url)
      } else {
        self.clients.openWindow(url)
      }
    })
  )
})
