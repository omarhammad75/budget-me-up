#!/usr/bin/env node
// Run: node scripts/setup.mjs
// Checks your environment and helps you get started

import fs from 'fs'
import { execSync } from 'child_process'

const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

console.log(`\n${BOLD}${CYAN}BudgetMeUp Setup Check${RESET}\n`)

// Check .env.local
if (!fs.existsSync('.env.local')) {
  console.log(`${YELLOW}⚠ .env.local not found${RESET}`)
  fs.copyFileSync('.env.local.example', '.env.local')
  console.log(`  Created .env.local from example — fill in your values\n`)
} else {
  const env = fs.readFileSync('.env.local', 'utf-8')
  const missing = []
  if (!env.includes('NEXT_PUBLIC_SUPABASE_URL=https://')) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!env.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=ey')) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!env.includes('NEXT_PUBLIC_VAPID_PUBLIC_KEY=')) missing.push('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
  if (!env.includes('VAPID_PRIVATE_KEY=')) missing.push('VAPID_PRIVATE_KEY')

  if (missing.length > 0) {
    console.log(`${YELLOW}⚠ Missing env vars in .env.local:${RESET}`)
    missing.forEach(m => console.log(`  - ${m}`))
    console.log()
  } else {
    console.log(`${GREEN}✓ .env.local configured${RESET}`)
  }
}

// Check icons
const iconsExist = fs.existsSync('public/icons/icon-192.png')
if (!iconsExist) {
  console.log(`${YELLOW}⚠ PWA icons missing${RESET}`)
  console.log(`  Run: npm install canvas && node scripts/generate-icons.mjs\n`)
} else {
  console.log(`${GREEN}✓ PWA icons present${RESET}`)
}

// Print VAPID key gen command
console.log(`\n${BOLD}To generate VAPID keys:${RESET}`)
console.log(`  npx web-push generate-vapid-keys\n`)

console.log(`${BOLD}Next steps:${RESET}`)
console.log(`  1. Fill in .env.local with Supabase + VAPID credentials`)
console.log(`  2. Run the SQL in supabase/migrations/001_initial_schema.sql in Supabase SQL editor`)
console.log(`  3. npm run dev`)
console.log(`  4. Open http://localhost:3000\n`)
