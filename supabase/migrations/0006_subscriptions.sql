-- BIM-001 · 0006_subscriptions — Stripe state mirror, ACCOUNT-scoped.
-- StarkReads separate-table pattern (TRIANGULATION §3.5) with ruling R-2's
-- override: subscription attaches to the ACCOUNT, not the store —
-- account_id FK, deliberately NO business_id column (spec AC5).
-- Field set = the subscription-state fields lifted out of FRANK_API's
-- businesses embedding (models.py:13-183): status vocabulary as documented.
-- Phase 7 is the consumer; this module ships structure only.

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id),
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_checkout_session_id text,
  status text check (status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  promotion_code text,               -- audit trail of promo applied (catalog)
  trial_end_date timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_account_id on public.subscriptions (account_id);

alter table public.subscriptions enable row level security;

create trigger set_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at();
