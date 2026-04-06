import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BudgetMeUp',
    short_name: 'BudgetMeUp',
    description: 'Track spending, catch subscriptions, and stay in control of your finances.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0B0F14',
    theme_color: '#0B0F14',
    orientation: 'portrait',
    categories: ['finance', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [],
    prefer_related_applications: false,
  }
}
