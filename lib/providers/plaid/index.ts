/**
 * Plaid provider — SERVER-SIDE ONLY
 *
 * SECURITY REQUIREMENTS:
 *  1. This module must only be imported in API routes or server actions.
 *     Never import it in 'use client' components or pages.
 *  2. The Plaid access_token must be stored encrypted (Supabase Vault or KMS).
 *     Retrieve and decrypt it server-side immediately before use; never cache it
 *     in memory across requests, and never log it.
 *  3. All Plaid API calls must go through this module — no raw fetch calls to
 *     Plaid endpoints from route handlers.
 *  4. Validate webhook signatures before processing any Plaid webhook payload.
 *
 * Integration status: SCAFFOLD — no Plaid SDK installed yet.
 * To activate: `npm install plaid`, set PLAID_CLIENT_ID + PLAID_SECRET env vars,
 * and replace the placeholder implementations below with real SDK calls.
 */

import type { TransactionProvider, ImportedTransaction } from '@/lib/providers'
import type {
  PlaidLinkTokenResponse,
  PlaidExchangeResponse,
  PlaidTransactionsSyncResponse,
} from './types'

// ── Config ───────────────────────────────────────────────────────────────────

const PLAID_ENV = process.env.PLAID_ENV ?? 'sandbox'   // 'sandbox' | 'development' | 'production'
const BASE_URL  = `https://${PLAID_ENV}.plaid.com`

function plaidHeaders() {
  const clientId = process.env.PLAID_CLIENT_ID
  const secret   = process.env.PLAID_SECRET

  if (!clientId || !secret) {
    throw new Error('[Plaid] PLAID_CLIENT_ID and PLAID_SECRET env vars are required')
  }

  return {
    'Content-Type':      'application/json',
    'PLAID-CLIENT-ID':   clientId,
    'PLAID-SECRET':      secret,
  }
}

// ── Link token ───────────────────────────────────────────────────────────────

/**
 * Create a Plaid Link token for a given user.
 * Call this from /api/bank-link/initiate — never from the client.
 */
export async function createLinkToken(userId: string): Promise<PlaidLinkTokenResponse> {
  const res = await fetch(`${BASE_URL}/link/token/create`, {
    method:  'POST',
    headers: plaidHeaders(),
    body: JSON.stringify({
      user:         { client_user_id: userId },
      client_name:  'BudgetMeUp',
      products:     ['transactions'],
      country_codes: ['US'],
      language:     'en',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`[Plaid] createLinkToken failed: ${err}`)
  }

  return res.json()
}

// ── Token exchange ───────────────────────────────────────────────────────────

/**
 * Exchange a public_token for an access_token.
 * Call this from /api/bank-link/exchange — never from the client.
 *
 * IMPORTANT: encrypt and store the returned access_token via Supabase Vault
 * or your KMS. Do NOT return it to the client or log it.
 */
export async function exchangePublicToken(publicToken: string): Promise<PlaidExchangeResponse> {
  const res = await fetch(`${BASE_URL}/item/public_token/exchange`, {
    method:  'POST',
    headers: plaidHeaders(),
    body: JSON.stringify({ public_token: publicToken }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`[Plaid] exchangePublicToken failed: ${err}`)
  }

  return res.json()
}

// ── Transaction sync ─────────────────────────────────────────────────────────

/**
 * Fetch new/updated/removed transactions using the /transactions/sync endpoint.
 * Handles pagination via cursor (store cursor in linked_accounts or a separate table).
 */
export async function syncTransactions(
  accessToken: string,
  cursor?: string,
): Promise<PlaidTransactionsSyncResponse> {
  const res = await fetch(`${BASE_URL}/transactions/sync`, {
    method:  'POST',
    headers: plaidHeaders(),
    body: JSON.stringify({
      access_token: accessToken,
      ...(cursor ? { cursor } : {}),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`[Plaid] syncTransactions failed: ${err}`)
  }

  return res.json()
}

// ── TransactionProvider implementation ──────────────────────────────────────

export const plaidProvider: TransactionProvider = {
  name: 'Plaid',

  async fetchTransactions(providerAccountId, _since): Promise<ImportedTransaction[]> {
    // TODO: Look up access_token for providerAccountId from encrypted storage,
    // call syncTransactions, map PlaidTransaction → ImportedTransaction.
    // For now, return empty array until the full integration is wired.
    console.warn('[Plaid] fetchTransactions not yet implemented — returning empty array')
    return []
  },
}
