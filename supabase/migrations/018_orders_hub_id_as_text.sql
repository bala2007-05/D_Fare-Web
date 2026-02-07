alter table public.orders
  alter column hub_id type text using (hub_id::text);
