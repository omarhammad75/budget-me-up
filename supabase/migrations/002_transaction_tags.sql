-- Migration: 002_transaction_tags
-- Run this in your Supabase SQL editor or via the Supabase CLI.
-- All new columns are nullable — fully backward-compatible with existing rows.

-- ── Tag classification fields ────────────────────────────────────────────────
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS tag_type            text        CHECK (tag_type IN ('recurring', 'subscription', 'payment_plan')),
  ADD COLUMN IF NOT EXISTS tag_frequency       text        CHECK (tag_frequency IN ('weekly', 'biweekly', 'monthly')),
  ADD COLUMN IF NOT EXISTS tag_label           text,        -- subscription name or custom label
  ADD COLUMN IF NOT EXISTS tag_total_payments  integer,
  ADD COLUMN IF NOT EXISTS tag_remaining_payments integer,
  ADD COLUMN IF NOT EXISTS tag_next_date       date;

-- ── Source tracking (Plaid-ready) ───────────────────────────────────────────
-- source_type distinguishes manually entered vs. future bank-imported rows.
-- external_id stores the provider transaction ID for deduplication.
-- provider_account_id links to a future linked_accounts table.
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS source_type          text  NOT NULL DEFAULT 'manual'
                                                      CHECK (source_type IN ('manual', 'imported')),
  ADD COLUMN IF NOT EXISTS external_id          text,          -- e.g. Plaid transaction_id
  ADD COLUMN IF NOT EXISTS provider_account_id  uuid;          -- FK → linked_accounts (future table)

-- Prevent duplicate imported transactions by (account, external_id)
CREATE UNIQUE INDEX IF NOT EXISTS transactions_external_id_unique
  ON transactions (provider_account_id, external_id)
  WHERE external_id IS NOT NULL;

-- ── Linked accounts table (scaffold for future Plaid integration) ─────────────
-- This table is intentionally minimal. It stores NO bank credentials.
-- Plaid access tokens must be stored encrypted; this is a placeholder.
-- See: lib/providers/plaid/index.ts for the integration design notes.
CREATE TABLE IF NOT EXISTS linked_accounts (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider          text        NOT NULL DEFAULT 'plaid',          -- 'plaid' | 'manual'
  provider_item_id  text,                                          -- Plaid item_id
  -- SECURITY: Do NOT store access_token here in plaintext.
  -- Store it encrypted via Supabase Vault or your KMS.
  -- access_token_enc text,                                        -- encrypted; decrypt server-side only
  institution_name  text,
  institution_id    text,
  account_name      text,
  account_mask      text,                                          -- last 4 digits only
  account_type      text        CHECK (account_type IN ('checking', 'savings', 'credit', 'investment', 'other')),
  is_active         boolean     NOT NULL DEFAULT true,
  last_synced_at    timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider_item_id)
);

ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own linked accounts"
  ON linked_accounts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
