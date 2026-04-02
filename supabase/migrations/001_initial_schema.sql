-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  monthly_income numeric(12,2) default 0,
  currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  icon text not null,
  color text not null,
  type text check (type in ('expense', 'income')) default 'expense',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Transactions
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric(12,2) not null,
  type text check (type in ('expense', 'income')) not null,
  category_id uuid references public.categories(id) on delete set null,
  description text not null,
  notes text,
  date date not null default current_date,
  is_recurring boolean default false,
  recurring_interval text check (recurring_interval in ('daily', 'weekly', 'monthly', 'yearly')),
  created_at timestamptz default now()
);

-- Budgets
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  amount numeric(12,2) not null,
  month integer check (month between 1 and 12) not null,
  year integer not null,
  created_at timestamptz default now(),
  unique(user_id, category_id, month, year)
);

-- Savings goals
create table public.savings_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  deadline date,
  icon text default '🎯',
  color text default '#7C3AED',
  created_at timestamptz default now()
);

-- Push subscriptions
create table public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);

-- ── RLS policies ───────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;
alter table public.push_subscriptions enable row level security;

-- Profiles
create policy "Users own their profile"
  on public.profiles for all using (auth.uid() = id);

-- Categories
create policy "Users own their categories"
  on public.categories for all using (auth.uid() = user_id);

-- Transactions
create policy "Users own their transactions"
  on public.transactions for all using (auth.uid() = user_id);

-- Budgets
create policy "Users own their budgets"
  on public.budgets for all using (auth.uid() = user_id);

-- Savings goals
create policy "Users own their savings goals"
  on public.savings_goals for all using (auth.uid() = user_id);

-- Push subscriptions
create policy "Users own their push subscriptions"
  on public.push_subscriptions for all using (auth.uid() = user_id);

-- ── Auto-create profile on signup ──────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Auto-seed default categories for new user ──────────────────
create or replace function public.seed_default_categories(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.categories (user_id, name, icon, color, type, is_default) values
    (p_user_id, 'Food & Dining', '🍔', '#F59E0B', 'expense', true),
    (p_user_id, 'Transport', '🚗', '#3B82F6', 'expense', true),
    (p_user_id, 'Shopping', '🛍️', '#EC4899', 'expense', true),
    (p_user_id, 'Entertainment', '🎮', '#8B5CF6', 'expense', true),
    (p_user_id, 'Health', '💊', '#10B981', 'expense', true),
    (p_user_id, 'Utilities', '⚡', '#F97316', 'expense', true),
    (p_user_id, 'Housing', '🏠', '#6366F1', 'expense', true),
    (p_user_id, 'Travel', '✈️', '#06B6D4', 'expense', true),
    (p_user_id, 'Education', '📚', '#84CC16', 'expense', true),
    (p_user_id, 'Personal Care', '💆', '#F43F5E', 'expense', true),
    (p_user_id, 'Subscriptions', '📱', '#A78BFA', 'expense', true),
    (p_user_id, 'Other', '💰', '#64748B', 'expense', true),
    (p_user_id, 'Salary', '💼', '#10B981', 'income', true),
    (p_user_id, 'Freelance', '💻', '#3B82F6', 'income', true),
    (p_user_id, 'Investment', '📈', '#F59E0B', 'income', true),
    (p_user_id, 'Other Income', '💸', '#64748B', 'income', true);
end;
$$;
