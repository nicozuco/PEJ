create extension if not exists pgcrypto;

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  user_agent text,
  active boolean not null default true,
  last_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now())
);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);
create index if not exists push_subscriptions_active_idx on public.push_subscriptions(active);

create table if not exists public.calendar_push_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid not null references public.push_subscriptions(id) on delete cascade,
  occurrence_key text not null,
  occurrence_at timestamptz not null,
  event_title text,
  delivered_at timestamptz not null default timezone('utc', now()),
  unique(subscription_id, occurrence_key)
);

create index if not exists calendar_push_deliveries_user_id_idx on public.calendar_push_deliveries(user_id);
create index if not exists calendar_push_deliveries_occurrence_at_idx on public.calendar_push_deliveries(occurrence_at desc);

alter table public.push_subscriptions enable row level security;
alter table public.calendar_push_deliveries enable row level security;

drop policy if exists "push_subscriptions_no_direct_access" on public.push_subscriptions;
create policy "push_subscriptions_no_direct_access"
on public.push_subscriptions
for all
using (false)
with check (false);

drop policy if exists "calendar_push_deliveries_no_direct_access" on public.calendar_push_deliveries;
create policy "calendar_push_deliveries_no_direct_access"
on public.calendar_push_deliveries
for all
using (false)
with check (false);

create or replace function public.set_updated_at_push_subscriptions()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_push_subscriptions_updated_at on public.push_subscriptions;
create trigger trg_push_subscriptions_updated_at
before update on public.push_subscriptions
for each row
execute function public.set_updated_at_push_subscriptions();
