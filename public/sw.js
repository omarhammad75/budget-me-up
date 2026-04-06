// ─── Cache version ────────────────────────────────────────────────────────────
// Bump this string any time you want to force all clients to drop their cache.
// Do NOT leave it stale across deploys that change JS bundles.
const CACHE_NAME = 'budgetmeup-v2'

// Only pre-cache lightweight shell pages — NOT JS chunks.
// Next.js /_next/static/ chunks are content-hashed and handled separately.
const PRECACHE_URLS = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/apple-touch-icon.png',
]

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  // Take control immediately — don't wait for old SW to go away
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(PRECACHE_URLS).catch(() => {
        // Non-fatal: pre-cache is best-effort
      })
    )
  )
})

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    // Delete ALL caches that don't match the current version.
    // This evicts stale JS chunks from any previous build.
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ignore: non-GET, cross-origin, API routes
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/')
  ) return

  // ── Navigation (HTML pages): always network-first ─────────────────────────
  // Never serve a cached HTML shell for navigation — it could reference
  // outdated chunk URLs and trigger the exact "stale module" error we're fixing.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/dashboard').then(r => r ?? caches.match('/'))
      )
    )
    return
  }

  // ── Next.js static chunks: cache-first (they are content-hashed/immutable) ─
  // /_next/static/chunks/abc123def.js will never change — safe to cache forever.
  if (url.pathname.startsWith('/_next/static/')) {
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

  // ── PWA icons / manifest: cache-first ────────────────────────────────────
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/favicon.svg'
  ) {
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

  // ── Everything else: network-first, no caching ───────────────────────────
  // This prevents locking in stale responses for app JS that isn't content-hashed.
})

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'BudgetMeUp', body: event.data.text() }
  }

  const options = {
    body:      data.body,
    icon:      data.icon ?? '/icons/icon-192.png',
    badge:     '/icons/icon-192.png',
    vibrate:   [100, 50, 100],
    data:      { url: data.url ?? '/dashboard' },
    actions: [
      { action: 'open',    title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss'  },
    ],
    tag:       'budgetmeup-notification',
    renotify:  true,
  }

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'BudgetMeUp', options)
  )
})

// ── Push subscription change (browser rotated VAPID keys) ────────────────────
self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then(sub => {
        const json = sub.toJSON()
        const keys = json.keys ?? {}
        return fetch('/api/push/subscribe', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            endpoint: json.endpoint,
            p256dh:   keys.p256dh,
            auth:     keys.auth,
          }),
        })
      })
      .catch(() => {
        // Silently fail — user will be re-prompted to enable notifications
      })
  )
})

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close()
  if (event.action === 'dismiss') return

  const url = event.notification.data?.url ?? '/dashboard'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
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
