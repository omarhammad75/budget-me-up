/**
 * POST /api/bank-link/initiate
 *
 * Creates a Plaid Link token for the authenticated user.
 * The link_token is safe to return to the client — it is short-lived,
 * single-use, and cannot be exchanged for an access_token directly.
 *
 * SECURITY: This route requires authentication. The access_token is
 * never involved at this stage.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLinkToken } from '@/lib/providers/plaid'

export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tokenResponse = await createLinkToken(user.id)
    // Only return the link_token — never the full response object
    return NextResponse.json({ link_token: tokenResponse.link_token })
  } catch (err) {
    console.error('[bank-link/initiate]', err)
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 })
  }
}
