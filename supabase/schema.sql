-- Motiveva cloud sync schema
-- Run this once in the Supabase SQL Editor for project hoorwidwqscrsxtsipxf.
-- It creates one private JSONB snapshot per user. RLS makes the row readable
-- and writable only by its owner.

create table if not exists public.motiveva_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{"habits":[],"logs":{}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.motiveva_data enable row level security;

drop policy if exists "Users can read their own Motiveva data" on public.motiveva_data;
create policy "Users can read their own Motiveva data"
  on public.motiveva_data
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own Motiveva data" on public.motiveva_data;
create policy "Users can insert their own Motiveva data"
  on public.motiveva_data
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own Motiveva data" on public.motiveva_data;
create policy "Users can update their own Motiveva data"
  on public.motiveva_data
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own Motiveva data" on public.motiveva_data;
create policy "Users can delete their own Motiveva data"
  on public.motiveva_data
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_motiveva_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists motiveva_data_updated_at on public.motiveva_data;
create trigger motiveva_data_updated_at
  before update on public.motiveva_data
  for each row
  execute function public.set_motiveva_updated_at();
