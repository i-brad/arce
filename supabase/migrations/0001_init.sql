-- Acre: initial schema for Supabase
-- Run this in the Supabase SQL editor (or apply via migrations).

-- Companies: one row per authenticated user -----------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  address text,
  phone text,
  email text,
  whatsapp text,
  website text,
  instagram text,
  facebook text,
  twitter text,
  tiktok text,
  linkedin text,
  reg_no text,
  default_template text not null default 'estate',
  signatory_role text,
  signatory_name text,
  logo text,
  signature text,
  pattern_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companies enable row level security;

create policy "users manage own company"
  on public.companies for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Clients ---------------------------------------------------------------------
create table if not exists public.clients (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  address text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "users manage own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Documents -------------------------------------------------------------------
create table if not exists public.documents (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text references public.clients (id) on delete set null,
  type text not null,
  number text not null default '',
  date date not null,
  template text not null default 'estate',
  font text not null default 'carlito',
  show_pattern boolean not null default false,
  show_total boolean not null default true,
  status text not null default 'draft',
  title text,
  salutation text,
  body text,
  breakdown_heading text,
  closing text,
  thanks text,
  signatory_role text,
  sections jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "users manage own documents"
  on public.documents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists documents_client_id_idx on public.documents (client_id);
create index if not exists documents_user_id_idx on public.documents (user_id);
create index if not exists clients_user_id_idx on public.clients (user_id);
