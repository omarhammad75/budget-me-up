/**
 * POST /api/bank-link/exchange
 *
 * Exchanges a Plaid public_token for an access_token and stores a
 * linked_accounts record. The access_token is NEVER returned to the client.
 *
 * Request body: { public_token: string, institution_name?: string, institution_id?: string,
 *                 account_name?: string, account_mask?: string, account_type?: string }
 *
 * SECURITY REQUIREMENTS:
 *  1. The access_token from Plaid must be encrypted before storage.
 *     TODO: Replace the console.warn below with Supabase Vault / KMS encryption.
 *  2. This route must be authenticated — never call exchangePublicToken without
 *     verifying the user first.
 *  3. Do NOT log the access_token at any point.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exchangePublicToken } from '@/lib/providers/plaid'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.public_token) {
    return NextResponse.json({ error: 'public_token is required' }, { status: 400 })
  }

  try {
    const exchanged = await exchangePublicToken(body.public_token)

    // TODO: Encrypt exchanged.access_token via Supabase Vault before storing.
    // For now, we store the item_id only (no access_token) until encryption is wired.
    console.warn('[bank-link/exchange] access_token NOT stored — encrypt it first before saving')

    const { data: account, error: insertError } = await supabase
      .from('linked_accounts')
      .insert({
        user_id:          user.id,
        provider:         'plaid',
        provider_item_id: exchanged.item_id,
        institution_name: body.institution_name ?? null,
        institution_id:   body.institution_id   ?? null,
        account_name:     body.account_name     ?? null,
        account_mask:     body.account_mask     ?? null,
        account_type:     body.account_type     ?? null,
        is_active:        true,
      })
      .select('id, institution_name, account_name, account_mask')
      .single()

    if (insertError) {
      console.error('[bank-link/exchange] insert error:', insertError.message)
      return NextResponse.json({ error: 'Failed to save account' }, { status: 500 })
    }

    return NextResponse.json({ account })
  } catch (err) {
    console.error('[bank-link/exchange]', err)
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 })
  }
}
