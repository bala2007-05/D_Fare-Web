create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  driver_id text not null,
  name text not null,
  home_address text,
  license_number text,
  license_expiry date,
  employment_type text,
  shift text,
  assigned_hub text,
  vehicle_type text,
  status text default 'idle',
  photo_url text,
  cod_limit numeric default 500,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(driver_id)
);

create index if not exists idx_drivers_driver_id on public.drivers(driver_id);
create index if not exists idx_drivers_organization on public.drivers(organization_id);
create index if not exists idx_drivers_status on public.drivers(status);

alter table public.drivers enable row level security;

create policy "Users can read drivers"
  on public.drivers for select
  using (auth.role() = 'authenticated');

create policy "Users can insert drivers"
  on public.drivers for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update drivers"
  on public.drivers for update
  using (auth.role() = 'authenticated');
