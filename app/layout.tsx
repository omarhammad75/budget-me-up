import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://budget-me-up.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'BudgetMeUp — Know exactly where your money goes',
    template: '%s · BudgetMeUp',
  },
  description:
    'Track spending, catch forgotten subscriptions, and stay in control of your finances. Free, installs on iPhone, takes 60 seconds to set up.',
  keywords: ['budget', 'personal finance', 'expense tracker', 'subscription tracker', 'money', 'savings'],
  applicationName: 'BudgetMeUp',

  // Open Graph
  openGraph: {
    type: 'website',
    url: APP_URL,
    siteName: 'BudgetMeUp',
    title: 'BudgetMeUp — Know exactly where your money goes',
    description:
      'Track spending, catch forgotten subscriptions, and stay in control of your finances.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BudgetMeUp — Personal Finance, Simplified',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'BudgetMeUp — Know exactly where your money goes',
    description:
      'Track spending, catch forgotten subscriptions, and stay in control of your finances.',
    images: ['/og-image.png'],
  },

  // Apple PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BudgetMeUp',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.webmanifest',

  // Favicon / icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#08080F',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background`}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
