import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  // 1. Verify the caller is authenticated
  const sessionClient = await createClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Parse body
  const { title, body, icon, url, userId } = await request.json()

  // 3. Resolve which user's subscriptions to target:
  //    - If `userId` is provided and matches the session user, allow it.
  //    - Otherwise default to the session user (self-send).
  //    Using the admin client here lets us fetch subscriptions reliably
  //    even if RLS is tightened in future, and enables server-triggered sends.
  const targetUserId: string = userId ?? user.id
  if (targetUserId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()
  const { data: subscriptions, error: fetchError } = await admin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', targetUserId)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }
  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0, message: 'No subscriptions found' })
  }

  // 4. Configure VAPID — done inside the handler so the module loads cleanly at build time
  const vapidSubject = process.env.VAPID_SUBJECT
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  if (!vapidSubject || !vapidPublic || !vapidPrivate) {
    return NextResponse.json(
      { error: 'Push not configured — set VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, and VAPID_PRIVATE_KEY' },
      { status: 503 }
    )
  }
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate)

  const payload = JSON.stringify({
    title: title ?? 'BudgetMeUp',
    body: body ?? '',
    icon: icon ?? '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    url: url ?? '/dashboard',
  })

  // 5. Fan-out to all devices
  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  )

  // 6. Clean up expired/invalid subscriptions (410 Gone)
  const expiredEndpoints = results
    .flatMap((r, i) => {
      if (r.status === 'rejected') {
        const status = (r.reason as { statusCode?: number })?.statusCode
        if (status === 410 || status === 404) return [subscriptions[i].endpoint]
      }
      return []
    })

  if (expiredEndpoints.length > 0) {
    await admin
      .from('push_subscriptions')
      .delete()
      .eq('user_id', targetUserId)
      .in('endpoint', expiredEndpoints)
  }

  const sent = results.filter(r => r.status === 'fulfilled').length
  return NextResponse.json({ sent, total: subscriptions.length })
}
