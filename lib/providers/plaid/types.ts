/**
 * Minimal Plaid-shaped types used by the BudgetMeUp scaffold.
 *
 * These mirror Plaid's official API responses but are kept minimal
 * so the app can integrate without installing the Plaid SDK in the
 * client bundle. All Plaid calls must go through server-side API routes.
 *
 * Reference: https://plaid.com/docs/api/
 */

export interface PlaidLinkTokenResponse {
  link_token:  string
  expiration:  string
  request_id:  string
}

export interface PlaidExchangeResponse {
  // IMPORTANT: access_token must NEVER be returned to the client.
  // It is stored encrypted server-side (e.g. Supabase Vault / KMS).
  access_token: string
  item_id:      string
  request_id:   string
}

export interface PlaidTransaction {
  transaction_id:   string
  account_id:       string
  amount:           number   // positive = debit (expense), negative = credit (income)
  date:             string   // ISO date "YYYY-MM-DD"
  name:             string   // merchant / description
  merchant_name:    string | null
  category:         string[] | null
  pending:          boolean
  iso_currency_code: string | null
}

export interface PlaidTransactionsSyncResponse {
  added:    PlaidTransaction[]
  modified: PlaidTransaction[]
  removed:  { transaction_id: string }[]
  next_cursor: string
  has_more:    boolean
  request_id:  string
}
