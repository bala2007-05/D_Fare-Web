create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  order_id text not null,
  customer_name text,
  customer_phone text,
  delivery_address text,
  latitude numeric,
  longitude numeric,
  status text not null default 'pending',
  time_window_start timestamptz,
  time_window_end timestamptz,
  package_weight numeric default 0,
  volumetric_weight numeric default 0,
  service_type text default 'standard',
  skill_requirement text,
  cod_amount numeric default 0,
  delivery_cost numeric default 0,
  driver_payout numeric default 0,
  hub_id text,
  assigned_driver text,
  assigned_route text,
  priority text default 'normal',
  attempts int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(order_id)
);

create index if not exists idx_orders_order_id on public.orders(order_id);
create index if not exists idx_orders_assigned_driver on public.orders(assigned_driver);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_organization on public.orders(organization_id);

alter table public.orders enable row level security;

create policy "Users can read orders"
  on public.orders for select
  using (auth.role() = 'authenticated');

create policy "Users can insert orders"
  on public.orders for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update orders"
  on public.orders for update
  using (auth.role() = 'authenticated');
