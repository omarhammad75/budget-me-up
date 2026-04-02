import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? 'mailto:admin@budgetmeup.app',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '',
    process.env.VAPID_PRIVATE_KEY ?? ''
  )

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, body, icon, url } = await request.json()

  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', user.id)

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0 })
  }

  const payload = JSON.stringify({
    title: title ?? 'BudgetMeUp',
    body: body ?? '',
    icon: icon ?? '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    url: url ?? '/dashboard',
  })

  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  )

  // Remove expired subscriptions
  const expired = results
    .map((r, i) => r.status === 'rejected' ? subscriptions[i].endpoint : null)
    .filter(Boolean)

  if (expired.length > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .in('endpoint', expired as string[])
  }

  const sent = results.filter(r => r.status === 'fulfilled').length
  return NextResponse.json({ sent })
}
